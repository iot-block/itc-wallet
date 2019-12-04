import storage from '../../common/storage'

const namespace = "config"

const Setting = {
  _key(key){
    return namespace+"."+key
  },
  get(key){
    return storage.get(this._key(key))
  },
  set(key,value){
    storage.set(this._key(key),value)
  }
}

export default {
  install(Vue, options){
    Vue.prototype.$setting = Setting
  }
}