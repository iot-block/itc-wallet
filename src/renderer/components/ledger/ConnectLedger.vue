<template>
  <v-container>
    <v-text-field class="my-1 text-center title" label="1、连接至您的钱包" disabled :loading="step==0"></v-text-field>
    <v-text-field class="my-2 text-center title" v-if="step>0" label="2、在Ledger中打开iot chain应用" disabled :loading="step==1"></v-text-field>
    <v-text-field class="my-3 text-center title" v-if="step>1" label="3、正在同步Ledger钱包信息" disabled :loading="step==2"></v-text-field>
    <v-text-field class="my-4 text-center title" v-if="step>2 && newDevice" v-model="namelabel" :messages="errorMessage" label="4、输入新设备的名字" ></v-text-field>
    <v-btn @click="saveDevice"  v-if="step==3">添加钱包</v-btn>
  </v-container>
</template>

<script>

import ledger from '../../../common/ledger/ledger.js'
import DataManager from '../../util/manager'
import eventBus, {RELOAD_LEADER_WALLET_LIST} from '../../util/eventbus'

export default {
    data(){
      return {
        namelabel:'',
        errorMessage:'',
        step:this.$ledger.queryCurrentStatus(),
        newDevice:false,
        deviceSign:'',
        addresses:[]
      }
    },
    methods:{
      saveDevice(){

        if(this.newDevice){

          //存储新设备
          console.log(this.namelabel)

          if(this.namelabel.length == 0 || this.namelabel.length > 50){
            this.errorMessage = '请输入长度为1-50的设备名字'
            return
          }

          let wallets = []
          this.addresses.forEach((element,idx) => {
  
            wallets.push({
              keystore:{
                address:element.address.substr(2),
                id:element.idx
              },
              name:this.namelabel + '-' + (idx+1)
            })
          });

          this.$storage.addLedgerWallet(this.deviceSign,{
            name:this.namelabel,
            wallets:wallets
          })
        }

        let manager = DataManager.defaultManager()
        manager.ledgerDevices.push({
          sign:this.deviceSign,
          name:this.namelabel
        })

        eventBus.$emit(RELOAD_LEADER_WALLET_LIST,this.deviceSign);
        this.$router.go(-1)
      }
    },
    beforeMount(){

      const that = this 

      //开始连接
      ledger.registLedgerStatus(({status,device})=>{

        console.log('Ledger设备状态变化->'+status)
        if(status == 2){
          that.step = 1
        }
        else if (status == 3){
          that.step = 2

          console.log('开始从本地读取硬件钱包信息')

          that.deviceSign = device.id+device.productIdMM

          let walletInfo = that.$storage.getLedgerWallet(that.deviceSign)

          if(Object.keys(walletInfo).length == 0){

            console.log('新的钱包，查询硬件钱包地址列表')

            ledger.queryIotChainAddressList(10).then(({addresses})=>{

              that.step = 3
              that.newDevice = true

              console.log('地址列表->'+addresses)
              this.addresses = addresses
            }).catch(err=>{

            })
          }
          else{
            that.step = 3
            console.log('查询到该设备在本地存储的地址列表，刷新钱包界面')
          }
        }
        else{
          that.step = 0
        }
      })
      ledger.startConnect()
    }
}
</script>