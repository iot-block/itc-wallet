import "babel-polyfill"
import LedgerManager from '../util/manager'

const ledger = LedgerManager.defaultManager()

export default {
  install(Vue, options){
    Vue.prototype.$ledger = ledger
  }
}