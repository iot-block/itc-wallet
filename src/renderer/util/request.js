import axios from 'axios'
import storage from '../../common/storage'

const API_SERVER = {
  mainnet: 'https://explorer.iotchain.io/v0',
  abel: 'https://abel.iotchain.io/v0'
}

axios.interceptors.response.use(
  response => {
    if (response.status === 200 && response.data.code===200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  error => {
    return Promise.reject(error.response);
  }
);
function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url,{params: params})
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

function explorerGet(path,params){
  var currentNode = storage.getWorkaround("config.node.current")
  return get(`${currentNode.testnet?API_SERVER.abel:API_SERVER.mainnet}${path}`,params)
}
function blockList(page,size){
  return explorerGet(`/block/queryall`,{page:page,size:size})
}
function blockInfo(blockNumberOrHash){
  var params = {}
  if((blockNumberOrHash+'').length<20){
    params['blockNumber'] = blockNumberOrHash
  }else{
    if(blockNumberOrHash.startsWith('0x')){
      params['blockHash'] = blockNumberOrHash
    }else{
      params['blockHash'] = `0x${blockNumberOrHash}`
    }
  }
  return explorerGet(`/block/query`,params)
}
function itcTxList(page,size){
  return explorerGet(`/transaction/itc/queryall`,{page:page,size:size})
}
function txList(page,size){
  return explorerGet(`/transaction/queryall`,{page:page,size:size})
}
function holderItcTxList(address,page,size){
  return explorerGet(`/transaction/itc/holder`,{page:page,size:size,address:address})
}
function holderAllTxList(address,page,size){
  return explorerGet(`/transaction/holder`,{page:page,size:size,address:address})
}
function txInfo(hash){
  return explorerGet(`/transaction/detail`,{hash:hash})
}

const API = {
  blockList,
  blockInfo,
  itcTxList,
  txList,
  holderItcTxList,
  holderAllTxList,
  txInfo,
}
export default API