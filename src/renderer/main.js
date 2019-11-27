import Vue from 'vue'
import vuetify from './plugins/vuetify'
import router from './router/router'
import App from './App'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  vuetify,
  router,
  components: { App },
  template: '<App/>',
  // created(){
  //   this.$router.push('/')
  // }
}).$mount('#app')
