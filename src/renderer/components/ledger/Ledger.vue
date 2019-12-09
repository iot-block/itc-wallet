<template>
  <v-layout class="sssssss" row wrap  align-center justify-center  :style="'height:'+fullHeight+'px;'" >
    <v-container id="inspire">
    <v-row
      justify="start"
    >
      <v-col cols="12">
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
    </v-row>
  </v-container>
  </v-layout>
  
</template>

<script>

export default {
    data () {
        return {
            fullHeight: document.documentElement.clientHeight
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
            
        }
    },
    mounted () {
        this.get_bodyHeight()
    },
    methods :{
        get_bodyHeight () {//动态获取浏览器高度
            const that = this
            window.onresize = () => {
                return (() => {
                    window.fullHeight = document.documentElement.clientHeight
                    that.fullHeight = window.fullHeight
                })()
            }
        }
    }
}
</script>