import storage from '../../common/storage'

const HistoryStorage = {
  routes: [],
  init(){
    this.routes = storage.get('routes',[])
  },
  _save(){
    storage.set('routes',this.routes)
  },
  nonEmpty(){
    return this.routes && this.routes.length>0
  },
  contains(route){
    return this.routes.find(r => r.name==route.name)
  },
  push(route){
    this.routes.push({
      name: route.name,
      fullPath: route.fullPath,
      meta: route.meta,
      path: route.path,
      query: route.query
    })
    this._save()
  },
  pop(){
    var poped = this.routes.pop()
    this._save()
    return poped
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