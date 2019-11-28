import storage from '../../common/storage'

export default {
  install(Vue, options){
    Vue.prototype.$storage = storage
  }
}