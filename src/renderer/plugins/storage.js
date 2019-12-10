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
      getLedgerWallet(deviceSign){
        return storage.get("ledger.wallet"+deviceSign,{})  
      }
    }
  }
}