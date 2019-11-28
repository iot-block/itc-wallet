import storage from '../../common/storage'

const HistoryStorage = {
  routes: [],
  init(){
    this.routes = storage.get('routes',[])
  },
  push(route){
    this.routes.push({
      name: route.name,
      fullPath: route.fullPath,
      meta: route.meta,
      path: route.path
    })
    this._save()
  },
  _save(){
    storage.set('routes',this.routes)
  },
  pop(){
    this.routes.pop()
    this._save()
  },
  clear(){
    this.routes = []
    this._save()
  }
}

const History = {
  install(Vue, options){
    HistoryStorage.init()
    Vue.prototype.$history = HistoryStorage
  }
}

export default History