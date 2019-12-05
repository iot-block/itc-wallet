import web3util from 'web3-utils'
import BigNumber from 'bignumber.js';
import {formatDate} from '../util/util'

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

export default {
  install(Vue, options){
    Object.keys(filters).forEach(key => {
      Vue.filter(key, filters[key])
    })
  }
}