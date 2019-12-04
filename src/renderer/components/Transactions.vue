<template>
  <v-container fluid class="pa-0">
    <div class="pb-4 d-flex flex-column" v-for="(tx,index) in txs" :key="index">
      <div class="d-flex flex-row">
        <span class="pr-4 flex-grow-1 text-truncate">{{tx.senderAddress===address?tx.receivingAddress:tx.senderAddress}}</span>
        <span class="text-right">+{{tx.value | unit(2)}}</span>
      </div>
      <span class="grey--text caption">{{tx.unixTimestamp | datetime}}</span>
    </div>
    <v-pagination
      v-model="page"
      total-visible="6"
      :length="pageTotal">
    </v-pagination>
  </v-container>
</template>

<script>
export default {
  props: ['address'],
  data(){
    return {
      page: 1,
      pageSize: 10,
      pageTotal: 1,
      itc: 0,
      itg: 0,
      txs: [],
      total: 0,
      isLoadingTxs: false
    }
  },
  mounted(){
    this.loadData(1)
  },
  watch: {
    address(val){
      this.loadData(1)
    },
    page(val){
      this.loadData(this.page)
    }
  },
  methods: {
    loadData(page){
      if(this.address){
        this.$explorer.holderAllTxList(this.address,page,this.pageSize)
          .then(response => {
            this.txs = response.data.trx
            this.total = response.data.amount
            this.pageTotal = Math.floor(this.total/this.pageSize) + (this.total%this.pageSize==0?0:1)
            this.isLoadingTxs = false
          });
      }
    }
  }
}
</script>