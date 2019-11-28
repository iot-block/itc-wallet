import Vue from 'vue'
import context from '../main'
import VueRouter from 'vue-router'
import Index from '../components/Index'
import Wallet from '../components/Wallet'
import Setting from '../components/Setting'
import CreateAccount from '../components/CreateAccount'
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
                name: '钱包',
              },
              component: Wallet,
            },
            {
              path: 'create',
              name: 'create',
              meta: {
                name: '创建',
              },
              component: CreateAccount
            },
          ]
        },
        {
          path: 'setting',
          name: 'setting',
          meta: {
            root: true,
            name: '设置',
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
    context.$history.push(to)
  }
  next()
})

export default router