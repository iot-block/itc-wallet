<template>
  <v-layout class="container" row wrap  align-center justify-center  :style="'height:'+fullHeight+'px;'" >
     <v-container v-if="accounts && accounts.length>0" align-center justify-center style="width:200px;height:80px;">
      <v-select
            v-model="ledgerselect"
            :items="ledgers"
            append-outer-icon="style"
            menu-props="auto"
            hide-details
            label="Select"
            single-line
      ></v-select>
    </v-container> 
    <v-container id="inspire">
    <v-row justify="start">
      <v-col v-if="!accounts || accounts.length==0" cols="12">
        <v-hover v-slot:default="{ hover }">
          <v-card
            :elevation="hover ? 12 : 2"
            class="mx-auto"
            max-width="350"
          >
          <v-responsive :aspect-ratio="16/9">
              <v-expand-x-transition v-if="!hover">
                <v-col 
                align="center"
                justify="center"
                >
                  <v-icon style="margin-top:20px;margin-bottom:-10px" x-large>add</v-icon>
                  <v-card-text class="my-4 text-center title" style="height:50px;">{{$t("ledger.no-ledger")}}</v-card-text>
                </v-col>
              </v-expand-x-transition>
              <v-expand-x-transition v-else>
                <div class="d-flex justify-center align-center flex-column" style="width:100%;height:100%;position:absolute;top:0;left:0;">
                  <v-btn outlined dense color="primary" width="80%" style="text-decoration:none;" :to="{name:'connectledger'}" >{{$t("ledger.connect")}}</v-btn>
                </div>
              </v-expand-x-transition>
            </v-responsive>
          </v-card>
        </v-hover>
      </v-col>
      <template v-if="accounts && accounts.length>0" style="margin-top:50px">
        <v-col
          v-for="(account,index) in accounts"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          lg="4"
          xl="3">
          <WalletCard :wallet="account"/>
        </v-col>
      </template>
    </v-row>
    </v-container>
  </v-layout>
</template>

<script>

import WalletCard from '../WalletCard'
import storage from '../../../common/storage'
import DataManager from '../../util/manager'
import eventBus, {RELOAD_LEADER_WALLET_LIST}  from '../../util/eventbus'

export default {
    components:{
      WalletCard
    },
    data (){
      return {
        fullHeight: document.documentElement.clientHeight,
        accounts:[],
        ledgerName:'',
        ledgerselect: '',
        ledgers: [],
      }
    },
    watch: {
        fullHeight (val) {//监控浏览器高度变化
            if(!this.timer) {
                this.fullHeight = val
                this.timer = true
                let that = this
                setTimeout(function (){
                    that.timer = false
                },400)
            }
        },
        '$route': function (to, from) {
　　　　    console.log('路由跳转'+to+from)
    　　}
    },
    mounted () {
        this.getBodyHeight()

        this.refreshLedgerList()

        //根据key名获取传递回来的参数，data就是map
        // eventBus.$on(RELOAD_LEADER_WALLET_LIST, function(data){
        //   console.log('收到刷新页面通知，开始刷新界面')
        //   this.refreshLedgerList()
        // }.bind(this));
    },
    methods :{
        getBodyHeight () {//动态获取浏览器高度
            const that = this
            window.onresize = () => {
                return (() => {
                    window.fullHeight = document.documentElement.clientHeight
                    that.fullHeight = window.fullHeight
                })()
            }
        },
        refreshLedgerList(){
          let manager = DataManager.defaultManager()

          this.ledgers = manager.getTotalLedgerDeviceName()          
          let selDevice = manager.getCurrentSelectLedger()

          if(!selDevice){
            return
          }

          this.ledgerselect = selDevice.name
          let info = this.$storage.getLedgerWallet(selDevice.sign)
          console.log('本地存储硬件钱包信息为：'+JSON.stringify(info,null,2))
          //
          if(Object.keys(info).length>0){
            this.ledgerName = info.name
            this.accounts = info.wallets
          }

        },
        getPath(){
          console.log('路由变化'+this.$route.path);
        },
    }
}
</script>