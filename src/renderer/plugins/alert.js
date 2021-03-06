import AppAlert from '../components/common/AppAlert'

const Alert = {
  install(Vue, options){
    this.EventBus = new Vue()
    Vue.component('i-alert', AppAlert)
    Vue.prototype.$alert = {
      show(params) {
        Alert.EventBus.$emit('alert.show', params)
      },
      hide(){
        Alert.EventBus.$emit('alert.hide')
      }
    }
  }
}

export default Alert