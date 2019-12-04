import Vue from 'vue'
import './assets/common.css'
import VueI18n from 'vue-i18n'
import vuetify from './plugins/vuetify'
import history from './plugins/history'
import router from './router/router'
import App from './App'
import storage from '../common/storage'
import storagePlugin from './plugins/storage'
import iotchain from './plugins/iotchain'
import setting from './plugins/setting'
import alert from './plugins/alert'
import clipboard from './plugins/clipboard'
import api from './plugins/api'
import web3util from 'web3-utils'
import BigNumber from 'bignumber.js';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import axios from 'axios'
import VueAxios from 'vue-axios'
import {formatDate} from './util/util'

Vue.config.productionTip = false
Vue.component(VueQrcode.name, VueQrcode);
Vue.use(VueAxios, axios)
Vue.use(history)
Vue.use(api)
Vue.use(VueI18n)
Vue.use(storagePlugin)
Vue.use(iotchain)
Vue.use(setting)
Vue.use(alert)
Vue.use(clipboard)

const filters = {
  datetime(time) {
    if(!time){
      return ''
    }
    if(typeof(time)=='string'){
      if(time.length==14){
        return time.substr(0,4)+'/'+time.substr(4,2)+'/'+time.substr(6,2)+' '+time.substr(8,2)+':'+time.substr(10,2)+':'+time.substr(12,2)
      }
    }
    time = time * 1
    let date = new Date(time)
    return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
  },
  fixed(value,f){
    if(!value){
      return 0
    }
    var bn = new BigNumber(value)
    return bn.toFixed(f)
  },
  unit(value,fixed){
    if(!value){
      return 0
    }
    let bn = web3util.toBN(value+'')
    let unit = web3util.fromWei(bn,'ether')
  
    return new BigNumber(unit).toFixed(fixed)
  },
  hash(value){
    if(!value){
      return value
    }
    if(value.startsWith('0x')){
      return value
    }else{
      return '0x'+value
    }
  }
}

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const i18n = new VueI18n({
  locale: storage.get('config.language'),
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