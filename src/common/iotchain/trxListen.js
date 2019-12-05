const iotchainSdk = require("iotchain-js-sdk");
const {node,chainId} = require('./config')
const iotchainApi = new iotchainSdk(node,chainId);

/**
 * 监听的数组
 * @param {*} hashId 
 * @param {*} callFunc
 */
let listenTrxs = []

//------------------------------ function --------------------------

async function startTrxListen(){

    try{
        for(let idx=0;idx<listenTrxs.length;idx++){

            let {hashId,callFunc,sureTime} = listenTrxs[idx]

            let recepit = await iotchainApi.transaction.getReceipt(hashId)
            if(recepit){
                if(sureTime >= 6){
                    if(callFunc){
                        callFunc(hashId,recepit)
                    }

                    listenTrxs.splice(idx, 1); 
                    idx--;
                }
                else{
                    listenTrxs[idx].sureTime = sureTime+1
                }
            }
        }
    }
    catch(err){
        let errStr = err + ''
    }

    if(listenTrxs.length > 0){
        setTimeout(() => {
            startTrxListen()
        }, 5*1000);
    }
}

async function listenTrx(hashId,callFunc){

    listenTrxs.push({
        hashId,
        callFunc,
        sureTime:0
    })

    if(listenTrxs.length == 1){
        startTrxListen()
    }
}

module.exports = {
    listenTrx
};