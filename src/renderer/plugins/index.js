import axios from 'axios'
import VueAxios from 'vue-axios'
import alert from './alert'
import progress from './progress'
import api from './api'
import clipboard from './clipboard'
import history from './history'
import iotchain from './iotchain'
import setting from './setting'
import storage from './storage'
import filters from './filters'
import ledger from './ledger'

const plugins = [
  alert,
  progress,
  api,
  clipboard,
  history,
  iotchain,
  setting,
  storage,
  filters,
  ledger
]

export default {
  install(Vue, options){
    plugins.forEach(plugin => {
      Vue.use(plugin);
    });

    Vue.use(VueAxios, axios)
  }
}