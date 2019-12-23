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
            {{transaction.trx.senderAddress | hash}}
          </v-col>
        </v-row>
        <v-divider />
        <v-row class="mx-0">
          <v-col cols="2" class="row-title">
            To
          </v-col>
          <v-col cols="10" class="content-color">
            {{transaction.trx.receivingAddress | hash}}
          </v-col>
        </v-row>
        <v-divider />
        <v-row class="mx-0">
          <v-col cols="2" class="row-title">
            Value
          </v-col>
          <v-col cols="10" class="content-color">
            0 ITG
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
        trx: {}
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
</style>