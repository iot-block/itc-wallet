const { clipboard } = require('electron')

export default {
  install(Vue, options){
    Vue.prototype.$clipboard = clipboard
  }
}