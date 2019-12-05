const iotchainSdk = require("iotchain-js-sdk");
import storage from '../storage'

async function listenTrx(hash,interval,timeout,callback){
    var currentNode = storage.getWorkaround("config.node.current")
    const iotchainApi = new iotchainSdk(currentNode.server,currentNode.chainId);
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