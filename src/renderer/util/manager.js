
let singleton;

import LedgerDevice from '../../common/ledger/ledger'
import web3util from 'web3-utils'

class LedgerManager{
    
    constructor(){
        this.ledgerDevice = null
    }

    currentLedger(){
        if(!this.ledgerDevice){
            this.ledgerDevice = new LedgerDevice()
        }
        return this.ledgerDevice
    }

    queryLedgerInfo(){

        let ledger = this.currentLedger()
        return {
            deviceName:ledger.deviceName,
            deviceSign:ledger.deviceSign,
            wallets:ledger.wallets
        }
    }

    queryLedgerStatus(){
        let ledger = this.currentLedger()
        
        //需要查询地址列表
        if(ledger.status == 2 && ledger.originalAddressInfo.length == 0){
            return 2
        }
        //已读取设备的地址列表，但未存储设备名称
        else if(ledger.status == 2 && ledger.originalAddressInfo.length != 0 && ledger.deviceName.length == 0){
            return 3
        }
        //已读取设备的地址列表，并且存储了设备名称
        else if(ledger.status == 2 && ledger.originalAddressInfo.length != 0 && ledger.deviceName.length != 0){
            return 4
        }

        return ledger.status
    }
    
    serializeSignedTx(tx){

        return {
          nonce: web3util.hexToNumberString(tx.nonce),
          gasPrice: web3util.hexToNumberString(tx.gasPrice),
          gasLimit: web3util.hexToNumberString(tx.gasLimit),
          receivingAddress: tx.to,
          value: web3util.hexToNumberString(tx.value),
          payload: tx.data?tx.data.substr(2):'',
          v:tx.v,
          r:web3util.hexToNumberString('0x'+tx.r),
          s:web3util.hexToNumberString('0x'+tx.s)
        }
    }

    async confirmITCTx(addressIdx,tx){

        let ledger = this.currentLedger()

        return await ledger.sendITC(addressIdx,tx).then(signedTx=>{

            return  Promise.resolve(this.serializeSignedTx(signedTx))
        }).catch(err=>{
            return Promise.reject('发送ITC错误'+err)
        })
    }

    async confirmITGTx(addressIdx,tx){

        let ledger = this.currentLedger()

        return await ledger.sendITG(addressIdx,tx).then(signedTx=>{

            return  Promise.resolve(this.serializeSignedTx(signedTx))
        }).catch(err=>{
            return Promise.reject('确认ITG错误'+err)
        })
    }

    saveLedgerName(ledgerName){

        let ledger = this.currentLedger()
        ledger.saveDevice(ledgerName)
    }

    startConnectLedger(){
        let ledger = this.currentLedger()

        if(!ledger.startConnect){

            ledger.connectLedger()
        }
        
        ledger.startConnect = true
    }

    static defaultManager(){

        if(!singleton){
            singleton = new LedgerManager();
        }
        return singleton;
    }
}

export default LedgerManager