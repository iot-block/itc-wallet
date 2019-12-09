const ledger = require('./ledger')
var deviceStatu = 0
ledger.registLedgerStatus(status=>{
  deviceStatu = status
})
//开始连接
ledger.startConnect()

handleLedgerFunc()

async function handleLedgerFunc(verify) {

  return new Promise(s => setTimeout(s, 1 * 1000)).then(async () =>{

    if(deviceStatu == 2){
      console.log('设备已连接')

        try{
          //获取10条地址信息
          // let addresses = await ledger.queryIotChainAddressList(10) 
          // return addresses

          //发起一条ITG交易
          // let signedITGTransaction = await ledger.sendITG(0,{
          //   nonce: '0x00',
          //   gasPrice: '0x09184e72a000', //10000000000000  wei
          //   gasLimit: '0x2710',         //10000
          //   to: '0x7F19B26272c375126e64b0D323Ec4c0d7d65307C',
          //   value:'0xab407c9eb0520000', //12.34 itg
          //   chainId:10
          // })
          // return JSON.stringify(signedITGTransaction,null,2)

          let signedITCTransaction = await ledger.sendITC(0,{ 
            nonce: "0x00",
            gasPrice: "0x09184e72a000",
            gasLimit: "0x2710",
            to: "0x5e6b6d9abad9093fdc861ea1600eba1b355cd940",
            value: "0x00",
            data: "0xa9059cbb000000000000000000000000cecede5a20645eac6ca2032eeeb1063572d63c290000000000000000000000000000000000000000000000006f05b59d3b200000",
            chainId:10
          })
          return JSON.stringify(signedITCTransaction,null,2)
        }
        catch(err){

          return err
        }
    }
    else if (deviceStatu == 3){
        console.log('设备断开连接')
    }
  });
}
