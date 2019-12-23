import "babel-polyfill"

import TransportNodeHid from "@ledgerhq/hw-transport-node-hid"
import AppEth from "@ledgerhq/hw-app-eth"
import {Transaction} from "ethereumjs-tx"

const getRecoveryId = (chainId,v)=>{

    return '' + (chainId + v);
}

const serializeErc20Tx = (t)=>{

    const tx = new Transaction({
      nonce: t.nonce,
      gasPrice: t.gasPrice,
      gasLimit: t.gasLimit,
      to: t.to,
      value: t.value,
      data:t.data,
      chainId:t.chainId,
    })
    tx.raw[6] = Buffer.from([t.chainId]) // v
    tx.raw[7] = Buffer.from([]) // r
    tx.raw[8] = Buffer.from([]) // s
  
    const serializedTx = tx.serialize()
    // console.log('交易序列化结果-> '+serializedTx.toString('hex'))
  
    return serializedTx.toString('hex')
}


const serializeTx = (t)=>{

    const tx = new Transaction({
      nonce: t.nonce,
      gasPrice: t.gasPrice,
      gasLimit: t.gasLimit,
      to: t.to,
      value: t.value,
      chainId:t.chainId,
    })

    tx.raw[6] = Buffer.from([t.chainId]) // v
    tx.raw[7] = Buffer.from([]) // r
    tx.raw[8] = Buffer.from([]) // s
  
    const serializedTx = tx.serialize()
    // console.log('对应的raw  -> '+serializedTx.toString('hex'))
  
    return serializedTx.toString('hex')
}


export default class LedgerDevice {

    constructor(){
        this.deviceName = ''
        this.deviceSign = ''
        this.transport = null
        this.wallets = []
        this.originalAddressInfo = []
        this.startConnect = false
        this.status = 0 //0-未连接设备 、1-连接设备未打开app、2-已打开app
    }

    static getAddressPath(pathIdx){
        return `44'/30315'/0'/0/${pathIdx}`
    }

    /**
     * 保存设备名字
     * @param {*} ledgerName 
     */
    saveDevice(ledgerName){
        
        this.deviceName = ledgerName
        let wallets = []
        this.originalAddressInfo.forEach((element,idx)=>{

            wallets.push({
                keystore:{
                  address:element.address.substr(2),
                  id:element.idx
                },
                name:ledgerName + '-' + (idx+1)
            })
        })
        this.wallets = wallets
    }

    //1、连接设备。2、打开iotchain app
    async connectLedger(){

        if(!this.transport){


            let that = this

            await TransportNodeHid.open("").then(async newTransport => {
                
                // console.log(JSON.stringify(newTransport,null,2))

                that.status = 1
                that.transport = newTransport
            }).catch(err=>{
        
                if(that.transport){
                    that.transport = null
                }
                // console.log('设备连接错误，1秒后再次尝试'+err)
            })  
        }

        if(this.transport){

            let that = this

            await this.connectIotChainApp().then(appinfo=>{
                // console.log('itc app info->'+JSON.stringify(appinfo,null,2))
                that.status = 2

            }).catch(err=>{
                // console.log('读取iotcain app信息错误->'+err)

                if(err.toString().indexOf('DisconnectedDevice') != -1){

                    that.transport = null
                    that.status = 0
                    // console.log('设备连接错误，1秒后再次尝试')
                }
                
                if(err.toString().indexOf('TransportStatusError') != -1){
                    
                    that.status = 1
                    // console.log('未打开iotchain应用')
                }
            })
        }

        if(this.originalAddressInfo.length == 0){

            let that = this
            await this.queryIotChainAddressList(10).then(result=>{
                
                // console.log('获取地址信息成功->'+result)
            }).catch(err=>{
                
                if(err.toString().indexOf('DisconnectedDevice') != -1){

                    that.transport = null
                    that.status = 0
                    // console.log('设备连接错误，1秒后再次尝试')
                }
                
                if(err.toString().indexOf('TransportStatusError') != -1){
                    
                    that.status = 1
                    // console.log('未打开iotchain应用')
                }
            })
        }

        let watchTime = 1
        if(this.transport){
            watchTime = 5
        }

        //监听Ledger变化
        setTimeout(()=>{
            this.connectLedger()
        }, watchTime * 1000)
    }

    /**
     * 查询某个地址信息
     * @param {*} appEth 
     * @param {*} pathIdx 地址序号 
     */
    queryDestinationAddress(pathIdx){

        if(!this.transport){
            return Promise.reject('device did not connect') 
        }
        const appEth = new AppEth(this.transport);
        let path = LedgerDevice.getAddressPath(pathIdx)

        return appEth.getAddress(path)
    }

    /**
     * 查询iot-chain app信息
     */
    async connectIotChainApp(){

        if(!this.transport){
            return Promise.reject('connect device error')
        }
    
        const appEth = new AppEth(this.transport);
        return appEth.getAppConfiguration()
    }

    /**
     * 查询硬件钱包地址列表
     * @param {*} amount 数量
     */
    async queryIotChainAddressList(amount){

        if(!this.transport){
            return Promise.reject('device did not connect') 
        }

        let addressInfos = []

        for (let index = 0; index < amount; index++) {
                        
            await this.queryDestinationAddress(index).then(addressInfo=>{

                addressInfos.push({
                    address:addressInfo.address,
                    idx:index
                })
            }).catch(err=>{

                // console.log('path为'+index+'的地址信息查询错误:'+err)
                return Promise.reject('path为'+index+'的地址信息查询错误:'+err)
            })
        }

        this.originalAddressInfo = addressInfos
        return Promise.resolve(addressInfos)
    }    

    /**
     * 发送ITG
     * @param {*} addressIdx 地址序号
     * @param {*} t.nonce 
     * @param {*} t.gasPrice  
     * @param {*} t.gasLimit  
     * @param {*} t.to 
     * @param {*} t.value
     * @param {*} t.chainId 
     */
    async sendITG(addressIdx,t){

        // console.log('地址序号为'+addressIdx)
        // console.log('ITG交易内容为'+JSON.stringify(t,null,2))

        let tx = serializeTx(t)
        return await this.signTransaction(addressIdx,tx).then(vsr=>{

            return {
                ...t,
                ...vsr
            }
        })
    }

    /**
     * 发送ITC
     * @param {*} addressIdx 地址序号
     * @param {*} t.nonce 
     * @param {*} t.gasPrice  
     * @param {*} t.gasLimit  
     * @param {*} t.to 
     * @param {*} t.value
     * @param {*} t.data
     * @param {*} t.chainId 
     */
    async sendITC(addressIdx,t){

        // console.log('地址序号为'+addressIdx)
        // console.log('ITC交易内容为'+JSON.stringify(t,null,2))

        let tx = serializeErc20Tx(t)
        return await this.signTransaction(addressIdx,tx).then(vsr=>{

            return {
                ...t,
                ...vsr
            }
        })
    }

    async signTransaction(addressIdx,tx){

        let path = LedgerDevice.getAddressPath(addressIdx)

        if(!this.transport){
            return Promise.reject('connect device error')
        }
        const appEth = new AppEth(this.transport);

        return appEth.signTransaction(path, tx).then(result => {

            result.v = getRecoveryId(10,parseInt(result.v))
            return result
        }).catch(err=>{

            // console.log('交易拒绝'+err)
            return Promise.reject('交易错误，请检查连接或者确认交易'+err)
        }) 
    }
}

