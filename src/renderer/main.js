import Vue from 'vue'
import vuetify from './plugins/vuetify'
import history from './plugins/history'
import router from './router/router'
import App from './App'

Vue.config.productionTip = false

Vue.use(history)

/* eslint-disable no-new */
var vue = new Vue({
  vuetify,
  router,
  components: { App },
  template: '<App/>',
}).$mount('#app')

export default vue