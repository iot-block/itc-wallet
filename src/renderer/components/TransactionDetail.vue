<template>
  <v-container>
    <v-card class="pa-4">
      <span class="subtitle-1 font-weight-bold">Transaction Information</span>
      <div class="block-info mt-3">
        <v-row class="mx-0">
          <v-col cols="2" class="row-title">
            TxHash
          </v-col>
          <v-col cols="10" class="content-color">
            {{transaction.trx.hash | hash}}
          </v-col>
        </v-row>
        <v-divider />
        <v-row class="mx-0">
          <v-col cols="2" class="row-title">
            Status
          </v-col>
          <v-col cols="10" class="content-color">
            {{transaction.trx.status==1?'success':'fail'}}
          </v-col>
        </v-row>
        <v-divider />
        <v-row class="mx-0">
          <v-col cols="2" class="row-title">
            BlockHeight
          </v-col>
          <v-col cols="10" class="content-color">
            {{transaction.trx.blockNumber}}
          </v-col>
        </v-row>
        <v-divider />
        <v-row class="mx-0">
          <v-col cols="2" class="row-title">
            TimeStamp
          </v-col>
          <v-col cols="10" class="content-color">
            {{transaction.trx.unixTimestamp | datetime}}
          </v-col>
        </v-row>
        <v-divider />
        <v-row class="mx-0">
          <v-col cols="2" class="row-title">
            From
          </v-col>
          <v-col cols="10" class="content-color">
            {{transaction.trx.senderAddress | address}}
          </v-col>
        </v-row>
        <v-divider />
        <v-row class="mx-0">
          <v-col cols="2" class="row-title">
            To
          </v-col>
          <v-col cols="10" class="content-color">
            {{transaction.trx.receivingAddress | address}}
          </v-col>
        </v-row>
        <v-divider />
        <v-row v-if="transaction.itcTokens&&transaction.itcTokens.length!=0" class="mx-0">          
          <v-col cols="2" class="row-title token">
            Tokens
          </v-col>
          <v-col 
            cols="10"
            class="tx-container"
          >
          <div v-for="(itcTx,idx) in transaction.itcTokens" :key="idx" class="tx-detail-container">
            <span class="tx-info-label">From </span>
            <span class="content-color address-label">{{itcTx.senderAddress}}</span>
            <span class="tx-info-label">To</span>
            <span class="content-color address-label">{{itcTx.receivingAddress}}</span>
            <span class="tx-info-label">{{itcTx.value | unit(4)}}</span>
            <span class="content-color tx-info-label">itc</span>
            <v-divider v-if="idx!=transaction.itcTokens.length-1"/>
         </div>
          </v-col>
        </v-row>
        <v-divider v-if="transaction.itcTokens&&transaction.itcTokens.length!=0"/>
        <v-row v-if="transaction.internalItgTxs&&transaction.internalItgTxs.length!=0" class="mx-0">          
          <v-col cols="2" class="row-title token">
            Internal TX
          </v-col>
          <v-col 
            cols="10"
            class="tx-container"
          >
          <div v-for="(itcTx,idx) in transaction.internalItgTxs" :key="idx" class="tx-detail-container">
            <span class="tx-info-label">From </span>
            <span class="content-color address-label">{{itcTx.senderAddress}}</span>
            <span class="tx-info-label">To</span>
            <span class="content-color address-label">{{itcTx.receivingAddress}}</span>
            <span class="tx-info-label">{{itcTx.value | unit(4)}}</span>
            <span class="content-color tx-info-label">itg</span>
            <v-divider v-if="idx!=transaction.internalItgTxs.length-1"/>
         </div>
          </v-col>
        </v-row>
        <v-divider v-if="transaction.internalItgTxs&&transaction.internalItgTxs.length!=0"/>
        <v-row class="mx-0">
          <v-col cols="2" class="row-title">
            Value
          </v-col>
          <v-col cols="10" class="content-color">
            {{transaction.trx.value}}
          </v-col>
        </v-row>
        
      </div>
    </v-card>
  </v-container>
</template>

<script>
import Base from './ledger/Base'
export default {
  extends:Base,
  data(){
    return {
      txhash: '',
      loading: false,
      transaction: {
        trx: {},
        itcTokens:[],
        internalItgTxs:[]
      }
    }
  },
  mounted(){
    this.txhash = this.$route.query.hash
    this.loadData()
  },
  methods:{
    loadData(){
      if(this.txhash){
        this.loading = true
        this.$explorer.txInfo(this.txhash)
        // this.$explorer.txInfo('0xa9d2f829945eaca84dd9ff2e82d9c58145483120731505e8fc32cd8d43de0c99')
          .then(response => {
            this.transaction = response.data
            this.isLoading = false
          });
      }
    }
  }
}
</script>

<style scoped>
.row-title{
  background: #f4f9fe;
  color: #3a3939;
}
.block-info{
  border: 1px solid #ededed;
}
.address-label{
  display:inline-block;
  max-width: 500px;
  width: 35%;
  overflow:hidden;  
  text-overflow:ellipsis;  
  margin-top: 8px;
}
.tx-info-label{
  display:inline-block;
  overflow:hidden;  
  text-overflow:ellipsis;  
  margin-top: 8px;
}
.tx-detail-container{
  width: 100%;
  height: 40px;
  white-space: nowrap;  
  display: inline-block;
}
.tx-container{
  max-height:300px;
  overflow:auto;
}
.token{
  display: flex;
  align-items: center;
}
</style>