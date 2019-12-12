import storage from '../../common/storage'

export default {
  install(Vue, options){
    Vue.prototype.$storage = {
      ...storage,
      listWallet(){
        return storage.get("wallet.list",[])
      },
      getWalletById(id){
        return this.listWallet().find(wallet => wallet.keystore.id===id)
      },
      addWallet(keystore,name){
        let keystores = this.listWallet()
        keystores.unshift({
          keystore,
          name
        })
        storage.set("wallet.list",keystores)
      },
      deleteWallet(id){
        let keystores = this.listWallet().filter(wallet => wallet.keystore.id!=id)
        storage.set("wallet.list",keystores)
      },
      addLedgerWallet(deviceSign,walletInfo){
        storage.set("ledger.wallet"+deviceSign,walletInfo)
      },
      motifyLedgerWallet(deviceSign,{name}){
        let dic = this.getLedgerWallet(deviceSign)
        let newWallets = []
        dic.wallets.forEach((element,idx) => {
          
          newWallets.push({
            ...element,
            name:name+'-'+(idx+1)
          })
        });
        let newWalletInfo = {
          wallets:newWallets,
          name:name
        }
        // console.log('修改的钱包信息'+JSON.stringify(newWalletInfo,null,2))
        this.addLedgerWallet(deviceSign,newWalletInfo)
      },
      getLedgerWallet(deviceSign){
        return storage.get("ledger.wallet"+deviceSign,{})  
      }
    }
  }
}