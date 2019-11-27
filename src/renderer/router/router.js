import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../components/Index'
import Wallet from '../components/Wallet'
import Setting from '../components/Setting'
import AppFrame from '../components/common/AppFrame'

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
          redirect: {
            name: 'wallet'
          }
        },
        {
          path: 'wallet',
          name: 'wallet',
          component: Wallet
        },
        {
          path: 'setting',
          name: 'setting',
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

export default router