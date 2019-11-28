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
  data(){
    return {
      paths: []
    }
  },
  mounted(){
    this.paths = this.loadHistory()
  },
  watch: {
    '$i18n.locale': function(val){
      this.paths = this.loadHistory()
    }
  },
  beforeRouteUpdate(to,from,next){
    if(to.fullPath!=from.fullPath){
      next()
      this.paths = this.loadHistory()
    }
  },
  computed:{
    items(){
      return [
        {
          icon: 'account_balance_wallet',
          text: this.$t('wallet.title'),
          route: {
            name: 'wallet'
          },
        },
        {
          icon: 'settings',
          text: this.$t('setting.title'),
          route: {
            name: 'setting'
          }
        }
      ]
    }
  },
  methods: {
    loadHistory(){
      return this.$history.routes.map(r => {
        return {
          disabled: false,
          exact: true,
          text: this.$t(r.meta.name),
          to: {name: r.name}
        }
      })
    }
  }
}
</script>