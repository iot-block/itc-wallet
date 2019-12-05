const iotchainSdk = require("iotchain-js-sdk");
const {node,chainId} = require('./config')
const iotchainApi = new iotchainSdk(node,chainId);


async function listenTrx(hash,interval,timeout,callback){
    let recepit = await iotchainApi.transaction.getReceipt(hash)
    if(recepit){
        callback(hash,recepit)
    }else{
        if(timeout<=0){
            callback(hash,null)
        }else{
            setTimeout(() => {
                listenTrx(hash,interval,timeout-interval,callback)
            }, interval);
        }
    }
}

export default {
    listenTrx
};