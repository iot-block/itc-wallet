<template >
  <v-container >
    <v-stepper v-model="step" class="elevation-0" style="background:#f9f9f9;">
      <v-stepper-header class="elevation-0" style="background:#ffffff;">
        <v-stepper-step :complete="step > 1" step="1"><span :class="(step >= 1)?'blue--text':''">Transfer</span></v-stepper-step>
       <v-divider :class="(step > 1)?'blue':''" ></v-divider>
        <v-stepper-step :complete="step > 2" step="2">Confirm</v-stepper-step>
       <v-divider :class="(step > 2)?'blue':''" ></v-divider>
        <v-stepper-step :complete="step == 3" step="3">Finish</v-stepper-step>
      </v-stepper-header>
    
      <v-stepper-items style="border-radius:5px" class="mt-5">
        <v-stepper-content step="1" class="px-0 py-0 ">
        
          <v-card-title class="blue--text font-weight-bold pl-10" style="background:#e4f0ff;">Trasfer [{{sender | address}}]</v-card-title>
          <v-card color="px-5 py-5">
          <div></div>
            
          <v-text-field
            v-model="receiver"
            label="Receiver Address"
            rounded
            outlined
            :error="error1"
            :error-messages="errorMessage1"
            filled
            dense
            required
            class="mt-5">
          </v-text-field>
          <v-radio-group class="mt-0" v-model="transferType" mandatory row hide-details>
            <v-radio
              label="ITC"
              value="itc">
            </v-radio>
            <v-radio
              label="ITG"
              value="itg">
            </v-radio>
            <v-spacer />
            <div class="ml-0 grey--text">
              <span class="caption">{{transferType=='itc'?itcBalance:itgBalance | unit(2)}}{{transferType=='itc'?'ITC':'ITG'}}</span>
            </div>
          </v-radio-group>
          <v-text-field
            class="mt-4"
            v-model="amount"
            label="amount"
            hide-details
            type="number"
            rounded
            outlined
            filled
            dense
            required>
          </v-text-field>
          <v-slider
            class="mt-10 align-end"
            hide-details
            :thumb-size="24"
            step="1"
            thumb-label="always"
            min="1"
            max="100"
            track-color="grey lighten-2"
            v-model="gasPrice">
            <template v-slot:thumb-label="props">
              <span>{{props.value>66?'高':props.value>33?'中':'低'}}</span>
            </template>
            <template v-slot:prepend>
              <v-text-field
                v-model="gasPrice"
                class="mt-0 pt-0 align-center"
                hide-details
                type="number"
                rounded
                outlined
                filled
                dense
                required
                label="Gas price"
                style="width: 100px">
              </v-text-field>
            </template>
          </v-slider>
          <div class="mt-4">
            <v-btn
              class="ml-0"
              depressed
              :disabled="!receiver || !transferType || !amount || amount<=0 || gasPrice<=0 || !validateReceiver()"
              color="primary"
              @click="goConfirm">
              Next
            </v-btn>
          </div>
          </v-card>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-row>
            <v-col cols="2">
              <span>from</span>
            </v-col>
            <v-col cols="10">
              <span class="grey--text">{{sender | address}}</span>
            </v-col>
            <v-col cols="2">
              <span>to</span>
            </v-col>
            <v-col cols="10">
              <span class="grey--text">{{receiver | address}}</span>
            </v-col>
            <v-col cols="2">
              <span>value</span>
            </v-col>
            <v-col cols="10">
              <span class="grey--text">{{amount}} {{transferType=='itc'?'ITC':'ITG'}}</span>
            </v-col>
            <v-col cols="2">
              <span>Gas</span>
            </v-col>
            <v-col cols="10">
              <span class="grey--text">{{estimatedGas | tounit('szabo') | unit}} ITG</span>
            </v-col>
            <v-col v-if="isLedgerAddress" cols="10">
              <span class="red--text">Please confirm the transaction in your ledger.</span>
            </v-col>
          </v-row>
          <v-text-field
            v-if="!isLedgerAddress"
            class="mt-4"
            v-model="password"
            label="password"
            type="password"
            :error="error2"
            :error-messages="errorMessage2"
            rounded
            outlined
            filled
            dense
            required>
          </v-text-field>
          <div class="mt-3">
              <v-btn
              @click="step = 1"
              replace
              depressed
              outlined
              light
              color="blue darken-3">
              取消
            </v-btn>

      
            <v-btn
              v-if="!isLedgerAddress"
              class="ml-4"
              depressed
              color="primary"
              :disabled="!password"
              @click="confirm">
              Transfer
            </v-btn>
            <v-btn
              v-if="isLedgerAddress"
              class="ml-5"
              depressed
              color="primary"
              :disabled="signedTx.length == 0"
              :loading="isSendTx"
              @click="sendSignedTransaction">
              Transfer
            </v-btn>
          </div>
        </v-stepper-content>
        <v-stepper-content step="3">
          <div class="d-flex flex-column justify-center align-center">
            <!-- <v-icon color="#2c7cf7" size="60">mdi-checkbox-marked-circle</v-icon> -->
            <v-progress-circular
              :rotate="-90"
              :size="100"
              :width="10"
              :value="progressValue"
              color="#2c7cf7">
              {{txStatus}}
            </v-progress-circular>
          </div>
          <div class="mt-4 text-center">
            <v-btn
              depressed
              replace
              color="primary"
              @click="$router.go(-1)">
              Done
            </v-btn>
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    
  </v-container>
</template>

<script>

var web3account = require('web3-eth-accounts')
import web3util from 'web3-utils'
import Base from './ledger/Base'

export default {
  extends:Base,
  data(){
    return {
      sender: '',
      itgBalance: 0,
      itcBalance: 0,
      wallet: {},
      step: 1,
      error1: false,
      errorMessage1: '',
      password: '',
      error2: false,
      errorMessage2: '',
      transferType: 'itc',
      receiver: '',
      amount: '',
      gasPrice: 0,
      timer: null,
      txStatus: 'Pending',
      progressValue: 0,
      isLedgerAddress:false,
      signedTx:'',
      isSendTx:false
    }
  },
  computed:{
    estimatedGas(){
      return this.gasPrice * (this.transferType=='itc'?150000:42000)
    }
  },
  watch:{
    receiver(){
      this.error1 = false
      this.errorMessage1 = ''
    },
    password(){
      this.error2 = false
      this.errorMessage2 = ''
    }
  },
  mounted(){

    if(this.$route.query.wallet){
      this.wallet = JSON.parse(this.$route.query.wallet)
      this.isLedgerAddress = true
    }
    else{
      this.wallet = this.$storage.getWalletById(this.$route.query.walletId)
    }
    this.sender = this.wallet.keystore.address
    this.$iotchain.account.getBalance(this.sender)
      .then((balance) => {
        this.itgBalance = balance
      })
    this.$iotchain.account.getItcBalance(this.sender)
      .then((balance) => {
        this.itcBalance = balance
      })
  },
  methods:{
    validateReceiver(){
      if(!this.receiver || !this.sender){
        return false
      }
      return this.receiver.toLowerCase().replace(/0x|itc/g,'') != this.sender.toLowerCase().replace(/0x|itc/g,'')
    },
    async confirmTxByLedger(){

      let account = await this.$iotchain.account.getAccount(this.wallet.keystore.address)
      let nonce = account.nonce
      let gasPrice = this.$iotchain.util.toWei(this.gasPrice,'szabo')
      let value = this.$iotchain.util.toWei(this.amount,'ether')

      // console.log('基本交易参数,nonce：'+nonce+' gasPrice:'+gasPrice+' value:'+value)

      if(this.transferType == 'itg'){
      
        let gas = web3util.toHex('42000')

        this.$ledger.confirmITGTx(this.wallet.keystore.id,{
            nonce: web3util.toHex(nonce),
            gasPrice: web3util.toHex(gasPrice),
            gasLimit: gas,
            to: this.receiver,
            value:web3util.toHex(value),
            chainId:'0x0a'
        }).then(result=>{

            // console.log('ledger签名的ITG交易：'+JSON.stringify(result,null,2))
            this.signedTx = result
        }).catch(err=>{

          // console.log('出现错误，待处理，可能是断开连接，可能是用户拒绝'+err)

           this.$alert.show({
                message: '交易确认失败，请重新尝试.'+err,
                timeout: 2000
          })
        })
      }
      else{
        
          let gas = web3util.toHex('150000')
          let data = this.$iotchain.transaction.generalITCTransferData(this.receiver,value+'')

          this.$ledger.confirmITCTx(this.wallet.keystore.id,{
              nonce: web3util.toHex(nonce),
              gasPrice: web3util.toHex(gasPrice),
              gasLimit: gas,
              to: this.$iotchain.transaction.itcContractAddress(),
              value:'0x00',
              data:'0x'+data,
              chainId:'0x0a'
          }).then(result=>{
              // console.log('ledger签名的ITC交易：'+JSON.stringify(result,null,2))
              this.signedTx = result
          }).catch(err=>{

            // console.log('出现错误，待处理，可能是断开连接，可能是用户拒绝'+err)

            this.$alert.show({
                message: '交易确认失败，请重新尝试.'+err,
                timeout: 2000
            })
          })
      }
      
    },
   
    sendSignedTransaction(){

        this.isSendTx = true
        
        //发送
        this.$iotchain.transaction.sendSignedTransaction(this.signedTx).then(response=>{

          this.isSendTx = false
          this.handleTxResponse(response)

        }).catch(err=>{

          // console.log('交易发送失败'+err)

          this.isSendTx = false

          this.$alert.show({
                message: '交易广播失败'+err,
                timeout: 2000
          })
        })
    },
    goConfirm(){
      if(!this.$iotchain.util.isAddress(this.receiver)){
        this.error1 = true
        this.errorMessage1 = "invalid address"
        return
      }
      if(this.receiver == this.sender){
        this.error1 = true
        this.errorMessage1 = "send to self is not allowed"
        return
      }
      this.step = 2

      if(this.isLedgerAddress){
        this.confirmTxByLedger()
      }
    },
    handleTxResponse(response){

      this.$alert.show({
        message: '交易广播成功',
        timeout: 2000
      })
      this.$progress.show({
        type: 'tx',
        hash: response
      })
      this.step = 3

      this.timer = setInterval(() => {
        this.progressValue += 1
      }, 210);

      this.$iotchain.trxListen.listenTrx(response,3000,1000*20,(hash,receipt)=>{
        this.progressValue = 100
        if(this.timer){
          clearInterval(this.timer);
        }
        if(receipt && receipt.status){
          this.txStatus = 'Success'
        }else{
          this.txStatus = 'Fail'
        }
      })
    },
    confirm(){
      try {
        var privateKey = this.$iotchain.util.recoverFromKeystore(this.wallet.keystore,this.password)
        this.txStatus = 'Pending'
        this.progressValue = 0
        if(this.transferType == 'itg'){
          setTimeout(() => {
            let amount = this.$iotchain.util.toWei(this.amount)
            this.$iotchain.transaction.transferITG(privateKey,this.receiver,amount+"",{
                gas:'42000',
                gasPrice:this.$iotchain.util.toWei(this.gasPrice,'szabo')+""
            }).then((response) => {
             
                this.handleTxResponse(response)
            }).catch((error) => {
              this.$alert.show({
                message: '交易广播失败'+error,
                timeout: 2000
              })
            })
          }, 0);
        }else{
          setTimeout(() => {
            let amount = this.$iotchain.util.toWei(this.amount)
            this.$iotchain.transaction.transferITC(privateKey,this.receiver,amount+"",{
                gas:'150000',
                gasPrice:this.$iotchain.util.toWei(this.gasPrice,'szabo')+""
            }).then((response) => {

              this.handleTxResponse(response)
            }).catch((error) => {
              this.$alert.show({
                message: '交易广播失败'+error,
                timeout: 2000
              })
            })
          }, 0);
        }
      } catch (error) {
        this.error2 = true
        this.errorMessage2 = "密码错误"
      }
    }
  },
  beforeDestroy(){
    if(this.timer){
      clearInterval(this.timer);
    }
  },
}
</script>