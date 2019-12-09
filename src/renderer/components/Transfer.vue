<template>
  <v-container>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1">Transfer</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step > 2" step="2">Confirm</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step == 3" step="3">Finish</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card-title class="px-0 pt-0 black--text font-weight-bold">Trasfer [{{sender | hash}}]</v-card-title>
          <v-text-field
            v-model="receiver"
            label="receiver address"
            rounded
            outlined
            :error="error1"
            :error-messages="errorMessage1"
            filled
            dense
            required>
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
            class="mt-10 align-center"
            hide-details
            :thumb-size="24"
            step="1"
            thumb-label="always"
            min="1"
            max="100"
            v-model="gasPrice"
            label="Gas price">
            <template v-slot:thumb-label="props">
              <span>{{props.value>66?'高':props.value>33?'中':'低'}}</span>
            </template>
            <template v-slot:append>
              <v-text-field
                v-model="gasPrice"
                class="mt-0 pt-0 align-center"
                append-icon="mdi-bitcoin"
                hide-details
                single-line
                outlined
                dense
                type="number"
                style="width: 100px">
              </v-text-field>
            </template>
          </v-slider>
          <div class="mt-4">
            <v-btn
              class="ml-0"
              depressed
              :disabled="!receiver || !transferType || !amount || amount<=0 || gasPrice<=0"
              color="primary"
              @click="goConfirm">
              Next
            </v-btn>
          </div>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-row>
            <v-col cols="2">
              <span>from</span>
            </v-col>
            <v-col cols="10">
              <span class="grey--text">{{sender | hash}}</span>
            </v-col>
            <v-col cols="2">
              <span>to</span>
            </v-col>
            <v-col cols="10">
              <span class="grey--text">{{receiver | hash}}</span>
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
          </v-row>
          <v-text-field
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
              dark
              icon
              color="orange darken-2"
              @click="step = 1">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-btn
              class="ml-4"
              depressed
              color="primary"
              :disabled="!password"
              @click="confirm">
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
export default {
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
      progressValue: 0
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
    this.wallet = this.$storage.getWalletById(this.$route.query.walletId)
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