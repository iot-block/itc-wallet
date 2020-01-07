<template>
  <div>
    <LeftMenu :show="true" :temporary="false" :items="items"/>
    <v-content class="mt-3">
      <v-progress-linear
        :active="progress.show"
        :style="$vuetify.breakpoint.mdAndUp?'left:200px':'left:80px'"
        style="right:0;width:auto;"
        fixed
        top
        :value="progress.value"
        height="15"
        background-color="grey darken-2"
        background-opacity="0.5"
        color="light-blue">
        <template v-slot="{ value }">
          <span class="caption white--text">{{ progressInfo(value) }}</span>
        </template>
      </v-progress-linear>
      <v-breadcrumbs 
        v-if="paths && paths.length>1"
        :items="paths" 
        large
        class="px-3 pt-4 pb-0">
        <template v-slot:divider>
          <v-icon>chevron_right</v-icon>
        </template>
      </v-breadcrumbs>
      <router-view class=""></router-view>
      <i-alert />
    </v-content>
  </div>
</template>

<script>
import LeftMenu from './LeftMenu'
import Progress from '../../plugins/progress'
export default {
  components: {
    LeftMenu
  },
  data(){
    return {
      progress: {
        show: false,
        type: '',
        value: 0
      },
      paths: [],
      timer: null
    }
  },
  beforeMount() {
    Progress.EventBus.$on('progress.show', (params) => {
      let {type} = params
      if(type=='tx'){
        this.progress.value = 0
        this.progress.show = true
        this.progress.type = type
        let {hash} = params
        this.progress.hash = hash
        this.timer = setInterval(() => {
          this.progress.value += 1
        }, 210);

        this.$iotchain.trxListen.listenTrx(hash,3000,1000*20,(hash,receipt)=>{
          this.progress.value = 100
          if(this.timer){
            clearInterval(this.timer);
          }
          this.progress.show = false
          if(receipt && receipt.status){
            this.$alert.show({
              message: '交易成功',
              timeout: 5000
            })
          }else{
            this.$alert.show({
              message: '交易失败',
              timeout: 5000
            })
          }
        })
      }
    })
    Progress.EventBus.$on('progress.hide', () => {
      this.progress.show = false
    })
  },
  beforeDestroy(){
    if(this.timer){
      clearInterval(this.timer);
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
          img: require('../../assets/images/itc_wallet.png'),
          text: this.$t('wallet.title'),
          route: {
            name: 'wallet'
          },
        },
        {
          img: require('../../assets/images/ledger_wallet.png'),
          text: this.$t('ledger.title'),
          route: {
            name: 'ledger'
          }
        },
        {
          img: require('../../assets/images/setting.png'),
          text: this.$t('setting.title'),
          route: {
            name: 'setting'
          }
        }
      ]
    }
  },
  methods: {
    progressInfo(value){
      if(this.progress.type=='tx'){
        return '[pending] '+(this.progress.hash.startsWith('0x')?'':'0x') + this.progress.hash
      }

      return ''
    },
    loadHistory(){
      return this.$history.routes.map(r => {
        return {
          disabled: false,
          exact: true,
          text: this.$t(r.meta.name),
          to: {name: r.name, query:r.query}
        }
      })
    }
  }
}
</script>