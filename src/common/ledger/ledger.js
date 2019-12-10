import "babel-polyfill"

import TransportNodeHid from "@ledgerhq/hw-transport-node-hid"
import AppEth from "@ledgerhq/hw-app-eth"
import Transaction from "ethereumjs-tx"
import { app } from "electron"

var ledgerTransport = null
var lastStatus = 0
let ledgerStatusCalls = []

/**
 * 状态回调
 * @param {*} status 1-尝试连接  2-连接设备成功 3-连接上 iot chain-app 4-断开连接，再次尝试连接
 */
const statusCall = (status)=>{

    if(lastStatus == status){
        return
    }

    lastStatus = status
    ledgerStatusCalls.forEach(element => {
        element({
            device: ledgerTransport ? ledgerTransport.deviceModel : {},
            status:status
        })
    });
}


/**
 * 开始连接
 */
var connectSign = 0
const startConnect = async ()=>{

    if(!connectSign){
    
        connectSign = 1

        statusCall(1)
        connectLedger()      
    }
}

//1、连接设备。2、打开iotchain app
const connectLedger = async ()=>{

    if(!ledgerTransport){

        await TransportNodeHid.open("").then(async newTransport => {
            
            console.log(JSON.stringify(newTransport,null,2))

            statusCall(2)
            ledgerTransport = newTransport
        }).catch(err=>{
    
            if(ledgerTransport){
                statusCall(4)
                ledgerTransport = null
            }
            console.log('设备连接错误，1秒后再次尝试'+err)
        })  
    }

    if(ledgerTransport){

        await connectIotChainApp().then(appinfo=>{

            // console.log('itc app info->'+JSON.stringify(appinfo,null,2))
            statusCall(3)
        }).catch(err=>{
            console.log('读取iotcain app信息错误->'+err)

            if(err.toString().indexOf('DisconnectedDevice') != -1){

                ledgerTransport = null
                console.log('设备连接错误，1秒后再次尝试')
            }
            
            if(err.toString().indexOf('TransportStatusError') != -1){
                statusCall(2)
                console.log('未打开iotchain应用')
            }
        })
    }

    let watchTime = 1
    if(ledgerTransport){
        watchTime = 5
    }

    //监听Ledger变化
    setTimeout(()=>{
        connectLedger()
    }, watchTime * 1000)
}

const connectIotChainApp = async ()=>{

    let transport = await getInstancedTransport()
    if(!transport){
        return Promise.reject('connect device error')
    }

    const appEth = new AppEth(transport);

    return appEth.getAppConfiguration()
}


const registLedgerStatus = (call)=>{
    
    if(typeof(call).toString().indexOf('function') != -1){
        ledgerStatusCalls.push(call)
    }
}

const getInstancedTransport = async ()=>{

    return ledgerTransport
}

const getAddressPath = (pathIdx)=>{

    return `44'/30315'/0'/0/${pathIdx}`
}

const queryDestinationAddress =  async (appEth,pathIdx)=>{

    let path = getAddressPath(pathIdx)
    return appEth.getAddress(path)
}

const queryIotChainAddressList = async (amount)=>{

    let transport = await getInstancedTransport()
    if(!transport){
        return Promise.reject('device did not connect') 
    }
    const appEth = new AppEth(transport);

    let addressInfos = []

    for (let index = 0; index < amount; index++) {

        await queryDestinationAddress(appEth,index).then(addressInfo=>{

            addressInfos.push({
                address:addressInfo.address,
                idx:index
            })
        }).catch(err=>{
            console.log('path为'+index+'的地址信息查询错误')
        })
    }

    console.log(JSON.stringify(addressInfos,null,2))
    return {
        addresses:addressInfos,
        device:transport.deviceModel
    };
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
const sendITG = async (addressIdx,t)=>{

    let tx = serializeTx(t)
    return await signTransaction(addressIdx,tx).then(vsr=>{

        return {
            ...t,
            ...vsr
        }
    })
}

/**
  * 发送ITG
  * @param {*} addressIdx 地址序号
  * @param {*} t.nonce 
  * @param {*} t.gasPrice  
  * @param {*} t.gasLimit  
  * @param {*} t.to 
  * @param {*} t.value
  * @param {*} t.data
  * @param {*} t.chainId 
  */
 const sendITC = async (addressIdx,t)=>{

    let tx = serializeErc20Tx(t)
    return await signTransaction(addressIdx,tx).then(vsr=>{

        return {
            ...t,
            ...vsr
        }
    })
}

const signTransaction = async (addressIdx,tx)=>{

    let path = getAddressPath(addressIdx)

    let transport = await getInstancedTransport()
    if(!transport){
        return Promise.reject('connect device error')
    }
    const appEth = new AppEth(transport);

    return appEth.signTransaction(path, tx).then(result => {
        result.v = getRecoveryId(10,parseInt(result.v))
        return result

    }).catch(err=>{

        console.log('交易拒绝'+err)
        return Promise.reject('交易错误，请检查连接或者确认交易'+err)
    }) 
}

const getRecoveryId = (chainId,v)=>{

    return chainId + v;

    // const NEGATIVE_POINT_SIGN = 27;
    // const POSITIVE_POINT_SIGN = 28;
    // const NEW_NEGATIVE_POINT_SIGN = 27;
    // const NEW_POSITIVE_POINT_SIGN = 28;
    
    // if (v == NEGATIVE_POINT_SIGN){
    //     return chainId * 2 + NEW_NEGATIVE_POINT_SIGN;
    // }else if (v == POSITIVE_POINT_SIGN){
    //     return chainId * 2 + NEW_POSITIVE_POINT_SIGN;
    // }else return null;
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
    console.log('对应的raw  -> '+serializedTx.toString('hex'))
  
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

const queryCurrentStatus= ()=>{

    console.log('查询状态'+lastStatus)

    if(lastStatus == 2){
        return 1
    }
    else if (lastStatus == 3){
        return 2
    }
    else{
        return 0
    }
}

export default {
    startConnect,
    registLedgerStatus,
    queryIotChainAddressList,
    sendITG,
    sendITC,
    queryCurrentStatus
}
