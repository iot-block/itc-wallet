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
                console.log('监听到交易：'+hashId)
                if(sureTime >= 6){

                    console.log('6次交易确认，回调')
                    if(callFunc){
                        callFunc(hashId,recepit)
                    }

                    //删除需要监听的
                    listenTrxs.splice(idx, 1); 
                    idx--;
                }
                else{
                    console.log('交易确认次数不足，继续监听该交易')
                    listenTrxs[idx].sureTime = sureTime+1
                }
            }
        }
    }
    catch(err){
        let errStr = err + ''
        console.log('监听交易出现错误'+errStr)
    }

    //如果需要监听交易数量不为0则继续监听
    if(listenTrxs.length > 0){

        console.log('未确认的交易数量：'+listenTrxs.length)

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

    //开始监听
    if(listenTrxs.length == 1){
        startTrxListen()
    }

    console.log('需监听的交易->'+JSON.stringify(listenTrxs,null,2))
}

module.exports = {
    listenTrx
};