import iotchain from '../../common/iotchain'

export default {
  install(Vue, options){
    Vue.prototype.$iotchain = iotchain
  }
}