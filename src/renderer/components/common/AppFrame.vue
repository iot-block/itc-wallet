<template>
  <div>
    <LeftMenu :show="true" :drawerUpdate="drawerUpdate" :temporary="false" :items="items"/>
    <v-content>
      <router-view></router-view>
    </v-content>
  </div>
</template>

<script>
import LeftMenu from './LeftMenu'
export default {
  components: {
    LeftMenu
  },
  computed: {
    // showDrawer(){
    //   if(this.show == null) return this.$vuetify.breakpoint.lgAndUp
    //   else return this.show
    // }
  },
  data(){
    return {
      show: null,
      items: [
        {
          icon: 'account_balance_wallet',
          text: '钱包',
          route: {
            name: 'wallet'
          },
        },
        {
          icon: 'settings',
          text: '设置',
          route: {
            name: 'setting'
          }
        }
      ] 
    }
  },
  methods: {
    drawerClick(){
      this.show = !this.show
    },
    drawerUpdate(show){
      this.show = show
    }
  }
}
</script>