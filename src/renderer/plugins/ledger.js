import "babel-polyfill"
import ledger from '../../common/ledger/ledger'

export default {
  install(Vue, options){
    Vue.prototype.$ledger = ledger
  }
}