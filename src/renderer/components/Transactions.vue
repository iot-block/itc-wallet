<template>
  <v-container fluid class="pa-0">
    <v-progress-linear
      v-if="loading"
      class="mb-4"
      indeterminate>
    </v-progress-linear>
    <div v-if="nodata" class="d-flex flex-column justify-center align-center">
      <v-icon size="80">mdi-emoticon-frown-outline</v-icon>
      <span class="subtitle-2 font-weight-bold grey--text text--darken-1">no data</span>
    </div>
    <template v-else>
      <div class="d-flex flex-column" v-for="(tx,index) in txs" :key="index">
        <v-row class="pa-2 my-2 grey lighten-3 grey--text text--darken-2" dense>
          <v-col cols="2" class="py-0">
            <span>txhash</span>
          </v-col>
          <v-col cols="10" class="py-0 text-right">
            <span class="text-truncate">{{tx.hash | hash}}</span>
          </v-col>

          <v-col cols="2" class="py-0">
            <span>{{tx.senderAddress===address?'to':'from'}}</span>
          </v-col>
          <v-col cols="10" class="py-0 text-right">
            <span class="text-truncate">{{tx.senderAddress===address?tx.receivingAddress:tx.senderAddress}}</span>
          </v-col>

          <v-col cols="2" class="py-0">
            <span>value</span>
          </v-col>
          <v-col cols="10" class="py-0 text-right">
            <span class="text-truncate">{{tx.senderAddress===address?'-':'+'}}{{tx.value | unit(3)}} ITC</span>
          </v-col>

          <v-col cols="2" class="py-0">
            <span>time</span>
          </v-col>
          <v-col cols="10" class="py-0 text-right">
            <span class="text-truncate">{{tx.unixTimestamp | datetime}}</span>
          </v-col>
        </v-row>
      </div>
      <v-pagination
        v-model="page"
        total-visible="6"
        :length="pageTotal">
      </v-pagination>
    </template>
    
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
      loading: false,
      nodata: false
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
        this.loading = true
        this.$explorer.holderItcTxList(this.address,page,this.pageSize)
          .then(response => {
            this.txs = response.data.trx
            this.total = response.data.amount
            this.pageTotal = Math.floor(this.total/this.pageSize) + (this.total%this.pageSize==0?0:1)
            this.loading = false
            if(!this.total){
              this.nodata = true
            }
          });
      }
    }
  }
}
</script>