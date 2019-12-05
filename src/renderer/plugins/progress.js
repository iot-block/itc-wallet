const Progress = {
  install(Vue, options){
    this.EventBus = new Vue()
    Vue.prototype.$progress = {
      show(params) {
        Progress.EventBus.$emit('progress.show', params)
      },
      hide(){
        Progress.EventBus.$emit('progress.hide')
      }
    }
  }
}

export default Progress