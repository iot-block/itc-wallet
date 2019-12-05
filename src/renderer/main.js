import Vue from 'vue'
import './assets/common.css'
import VueI18n from 'vue-i18n'
import vuetify from './plugins/vuetify'
import router from './router/router'
import App from './App'
import storage from '../common/storage'
import plugins from './plugins'
import VueQrcode from '@chenfengyuan/vue-qrcode';

Vue.config.productionTip = false
Vue.component(VueQrcode.name, VueQrcode);
Vue.use(VueI18n)
Vue.use(plugins)

const i18n = new VueI18n({
  locale: storage.get('config.language'),
  messages: {
      'zh': require('./i18n/zh'),
      'en': require('./i18n/en'),
  }
})

var vue = new Vue({
  vuetify,
  router,
  i18n,
  components: { App },
  template: '<App/>',
}).$mount('#app')

export default vue