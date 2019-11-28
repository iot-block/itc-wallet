import Vue from 'vue'
import VueI18n from 'vue-i18n'
import vuetify from './plugins/vuetify'
import history from './plugins/history'
import router from './router/router'
import App from './App'
import storage from '../common/storage'
import storagePlugin from './plugins/storage'

Vue.config.productionTip = false

Vue.use(history)
Vue.use(VueI18n)
Vue.use(storagePlugin)

const i18n = new VueI18n({
  locale: storage.get('language'),
  messages: {
      'zh': require('./i18n/zh'),
      'en': require('./i18n/en'),
  }
})

/* eslint-disable no-new */
var vue = new Vue({
  vuetify,
  router,
  i18n,
  components: { App },
  template: '<App/>',
}).$mount('#app')

export default vue