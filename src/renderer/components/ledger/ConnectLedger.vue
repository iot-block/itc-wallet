<template>
  <v-container class="contentbox">
    <Progress sequence='1' :text="$t('ledger.connect')" :status="step>0" />
    <Progress sequence='2' :text="$t('ledger.step_open')" :status="step>1" :style="`opacity:${step>0?1:0}`"/>
    <Progress sequence='3' :text="$t('ledger.step_sync')" :status="step>2" :style="`opacity:${step>1?1:0}`"/>
    <ProgressInput sequence='4' :text="$t('ledger.step_name')" :ledgername="namelabel" :errorMessage="errorMessage" @LEDGER_NAME_CHANGED="ledgerNameChanged" :style="`opacity:${step>2?1:0}`"/>
    <v-btn color="#5EA3FE" @click="saveDevice" :style="`opacity:${step>2?1:0};color:white`">{{$t('ledger.step_add')}}</v-btn>
  </v-container>
</template>

<script>
/*
    <v-text-field class="my-1 text-center title" label="1、连接至您的钱包" disabled :loading="step==0"></v-text-field>
    <v-text-field class="my-2 text-center title" v-if="step>0" label="2、在Ledger中打开iot chain应用" disabled :loading="step==1"></v-text-field>
    <v-text-field class="my-3 text-center title" v-if="step>1" label="3、正在同步Ledger钱包信息" disabled :loading="step==2"></v-text-field>
    <v-text-field class="my-4 text-center title" v-if="step>2" v-model="namelabel" :messages="errorMessage" label="4、输入设备的名字" ></v-text-field>
*/
import Base from './Base'
import Progress from './view/Progress'
import ProgressInput from './view/ProgressInput'
import '../../assets/common.scss'

export default {
  extends:Base,
    data(){
      return {
        namelabel:'Ledger',
        errorMessage:'',
        step:this.$ledger.queryLedgerStatus(),
      }
    },
    components:{
      Progress,
      ProgressInput
    },
    watch:{
      namelabel(val){
        console.log(val)
      }
    },
    methods:{
      ledgerNameChanged(name){
        this.namelabel = name
      },
      saveDevice(){
        console.log('namelabel->'+this.namelabel)

        if(this.namelabel.length == 0 || this.namelabel.length > 50){
          this.errorMessage = this.$t("ledger.input_device_name_err")
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

<style scoped>
.contentbox{
  background-color:white;
  margin-left:2%;
  width:96%;
  margin-top:10px;
  box-shadow: 0 7px 8px -4px rgba(33,127,231,.1),0 12px 17px 2px rgba(33,127,231,.1),0 5px 22px 4px rgba(33,127,231,.1);
}
</style>>