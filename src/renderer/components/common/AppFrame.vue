<template>
  <div>
    <LeftMenu :show="true" :temporary="false" :items="items"/>
    <v-content>
      <v-breadcrumbs 
        :items="paths" 
        large
        class="px-3 pt-4 pb-0">
        <template v-slot:divider>
          <v-icon>chevron_right</v-icon>
        </template>
      </v-breadcrumbs>
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
  mounted(){
    this.loadHistory()
  },
  beforeRouteUpdate(to,from,next){
    if(to.fullPath!=from.fullPath){
      next()
      this.loadHistory()
    }
  },
  data(){
    return {
      paths: [],
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
    loadHistory(){
      this.paths = this.$history.routes.map(r => {
        return {
          disabled: false,
          exact: true,
          text: r.meta.name,
          to: {name: r.name}
        }
      })
    }
  }
}
</script>