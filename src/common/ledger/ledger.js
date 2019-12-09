const TransportNodeHid = require("@ledgerhq/hw-transport-node-hid").default;
const AppEth = require("@ledgerhq/hw-app-eth").default;
const EthereumTx = require('ethereumjs-tx').Transaction

var ledgerTransport = null
let ledgerStatusCalls = []

/**
 * 状态回调
 * @param {*} status 1-尝试连接  2-连接成功 3-断开连接，再次尝试连接
 */
const statusCall = (status)=>{

    ledgerStatusCalls.forEach(element => {
        element(status)
    });
}


/**
 * 开始连接
 */
const startConnect = ()=>{

    statusCall(1)
    connectLedger()
}

const connectLedger = ()=>{

    TransportNodeHid.open("").then(async newTransport => {

        statusCall(2)
        ledgerTransport = newTransport
    }).catch(err=>{

        if(ledgerTransport){
            statusCall(3)
            ledgerTransport = null
        }

        console.log('设备未连接，5秒后再次尝试'+err)

        return new Promise(s => setTimeout(s, 5 * 1000)).then(() =>
            connectLedger()
        );
    })  
}



const registLedgerStatus = (call)=>{
    
    if(typeof(call).toString().indexOf('function') != -1){
        ledgerStatusCalls.push(call)
    }
}

const getInstancedTransport = async ()=>{

    if(!ledgerTransport){

        return Promise.reject('device did not connect') 
    }

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
    return addressInfos;
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

    const tx = new EthereumTx({
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

    const tx = new EthereumTx({
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

module.exports = {
    startConnect,
    registLedgerStatus,
    queryIotChainAddressList,
    sendITG,
    sendITC
}