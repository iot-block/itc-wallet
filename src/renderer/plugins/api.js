import API from '../util/request'

export default {
  install(Vue, options){
    Vue.prototype.$explorer = API
  }
}