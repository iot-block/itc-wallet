<template>
  <v-container fluid class="pa-0">
    <v-progress-linear
      v-if="loading"
      class="mb-4"
      indeterminate>
    </v-progress-linear>
    <div v-if="nodata" class="d-flex flex-column justify-center align-center">
      <v-icon size="80" color="blue">mdi-emoticon-frown-outline</v-icon>
      <span class="subtitle-2 font-weight-bold grey--text text--darken-1">no data</span>
    </div>
    <template >
      <v-row class="pa-2 mt-2 white--text" style="background:#3896ff;" dense>
        <v-col cols="3" class="py-0">
          <span>TxHash</span>
        </v-col>
        <v-col cols="3" class="py-0">
          <span>From</span>
        </v-col>
        <v-col cols="3" class="py-0">
          <span>To</span>
        </v-col>
        <v-col cols="1" class="py-0 text-right">
          <span>Value</span>
        </v-col>
        <v-col cols="2" class="py-0 text-right">
          <span>Time</span>
        </v-col>
      </v-row>
      <v-row v-for="(tx,index) in txs" :key="index" 
        class="pa-2 " 
        :class="index%2==1?'grey lighten-3 grey--text text--darken-2':''"
        dense>
        <v-col cols="3" class="py-0 text-truncate link-text pointer">
          <router-link :to="{name:'transation',query:{hash:tx.hash}}">
            {{tx.hash | hash}}
          </router-link>
        </v-col>
        <v-col cols="3" class="py-0 text-truncate">
          {{tx.senderAddress | hash}}
        </v-col>
        <v-col class="py-0 text-truncate">
          {{tx.receivingAddress | hash}}
        </v-col>
        <v-col cols="1" class="py-0 text-truncate text-right">
          {{tx.value | unit(2)}}
        </v-col>
        <v-col cols="2" class="py-0 text-truncate text-right" style="width:">
          {{tx.unixTimestamp | datetime}}
        </v-col>
      </v-row>
      <v-pagination
        class="mt-3"
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