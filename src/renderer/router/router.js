import Vue from 'vue'
import context from '../main'
import VueRouter from 'vue-router'
import Index from '../components/Index'
import Wallet from '../components/Wallet'
import Setting from '../components/Setting'
import CreateAccount from '../components/CreateAccount'
import ImportWallet from '../components/ImportWallet'
import WalletDetail from '../components/WalletDetail'
import Transfer from '../components/Transfer'
import Receive from '../components/Receive'
import AppFrame from '../components/common/AppFrame'
import ChangePassword from '../components/ChangePassword'

//ledger
import Ledger from '../components/Ledger/Ledger'
import ConnectLedger from '../components/Ledger/ConnectLedger'

Vue.use(VueRouter)

const router = new VueRouter({
  // mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  routes: [
    {
      path: '/',
      component: AppFrame,
      children: [
        {
          path: '',
          name: 'index',
          meta: {
            root: true,
            name: '首页',
          },
          redirect: {
            name: 'wallet',
          }
        },
        {
          path: 'wallet',
          component: {
            template: `
              <router-view></router-view>
            `
          },
          children: [
            {
              path: '',
              name: 'wallet',
              meta: {
                root: true,
                name: 'wallet.title',
              },
              component: Wallet,
            },
            {
              path: 'create',
              name: 'createWallet',
              meta: {
                name: 'wallet.create',
              },
              component: CreateAccount
            },
            {
              path: 'import',
              name: 'importWallet',
              meta: {
                name: 'wallet.import',
              },
              component: ImportWallet
            },
            {
              path: 'walletDetail',
              name: 'walletDetail',
              meta: {
                name: 'wallet.detail',
              },
              component: WalletDetail
            },
            {
              path: 'transfer',
              name: 'transfer',
              meta: {
                name: 'wallet.transfer',
              },
              component: Transfer
            },
            {
              path: 'receive',
              name: 'receive',
              meta: {
                name: 'wallet.receive',
              },
              component: Receive
            },
            {
              path: 'changepswd',
              name: 'changepswd',
              meta: {
                name: 'wallet.changepswd',
              },
              component: ChangePassword
            },
          ]
        },
        {
          path: 'ledger',
          component: {
            template: `
              <router-view></router-view>
            `
          },
          children:[
            {
              path:'',
              name: 'ledger',
              meta: {
                root: true,
                name: 'ledger.title',
              },
              component: Ledger
            },
            {
              path: 'connectledger',
              name: 'connectledger',
              meta: {
                name: 'ledger.connect',
              },
              component: ConnectLedger
            },
          ]
        },
        {
          path: 'setting',
          name: 'setting',
          meta: {
            root: true,
            name: 'setting.title',
          },
          component: Setting
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to,from,next) => {
  if(context){
    if(to.meta && to.meta.root){
      context.$history.clear()
    }
    if(context.$history.contains(to)){
      while(context.$history.nonEmpty()){
        var poped = context.$history.pop()
        if(poped.name==to.name){
          break;
        }
      }
    }
    context.$history.push(to)
  }
  next()
})

export default router