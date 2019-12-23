<template>
  <v-container>
    <v-text-field class="my-1 text-center title" label="1、连接至您的钱包" disabled :loading="step==0"></v-text-field>
    <v-text-field class="my-2 text-center title" v-if="step>0" label="2、在Ledger中打开iot chain应用" disabled :loading="step==1"></v-text-field>
    <v-text-field class="my-3 text-center title" v-if="step>1" label="3、正在同步Ledger钱包信息" disabled :loading="step==2"></v-text-field>
    <v-text-field class="my-4 text-center title" v-if="step>2" v-model="namelabel" :messages="errorMessage" label="4、输入设备的名字" ></v-text-field>
    <v-btn @click="saveDevice"  v-if="step>2">添加钱包</v-btn>
  </v-container>
</template>

<script>

import Base from './Base'
export default {
  extends:Base,
    data(){
      return {
        namelabel:'Ledger',
        errorMessage:'',
        step:this.$ledger.queryLedgerStatus(),
      }
    },
    methods:{
      saveDevice(){

        if(this.namelabel.length == 0 || this.namelabel.length > 50){
          this.errorMessage = '请输入长度为1-50的设备名字'
          return
        }

        this.$ledger.saveLedgerName(this.namelabel)        
        this.$router.go(-1)
      },
      queryLedgerStatus(){

        let status = this.$ledger.queryLedgerStatus()
        
        if(this.step != status){

          this.step = status

          if(status == 4){
            this.namelabel = this.$ledger.queryLedgerInfo().deviceName
          }
        }
      }
    },
    destroyed(){
      // console.log('销毁查询')
      clearInterval(this.query)
    },
    mounted(){
      this.query = setInterval(this.queryLedgerStatus,1*1000)

      this.$ledger.startConnectLedger()
    },
}
</script>