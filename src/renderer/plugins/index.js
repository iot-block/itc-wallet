import axios from 'axios'
import VueAxios from 'vue-axios'
import alert from './alert'
import api from './api'
import clipboard from './clipboard'
import history from './history'
import iotchain from './iotchain'
import setting from './setting'
import storage from './storage'
import filters from './filters'

const plugins = [
  alert,
  api,
  clipboard,
  history,
  iotchain,
  setting,
  storage,
  filters
]

export default {
  install(Vue, options){
    plugins.forEach(plugin => {
      Vue.use(plugin);
    });

    Vue.use(VueAxios, axios)
  }
}