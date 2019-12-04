import AppAlert from '../components/common/AppAlert'

const Alert = {
  install(Vue, options){
    this.EventBus = new Vue()
    Vue.component('a-alert', AppAlert)
    Vue.prototype.$alert = {
      show(params) {
        Alert.EventBus.$emit('show', params)
      },
      hide(){
        Alert.EventBus.$emit('hide')
      }
    }
  }
}

export default Alert