<template>
  <v-container fluid class="pa-0">
    <v-progress-linear
      v-if="loading"
      class="mb-4"
      indeterminate>
    </v-progress-linear>
    <div v-if="nodata" class="d-flex flex-column justify-center align-center">
      <!-- <v-icon size="80" color="blue">mdi-emoticon-frown-outline</v-icon> -->
      <v-img :src="require('../assets/images/nodata.png')" size="80" />
      <span class="subtitle-2 font-weight-bold grey--text text--darken-1">no data</span>
    </div>
    <template v-else>
  
      <v-row v-for="(tx,index) in txs" :key="index" 
        class="pa-2 " 
        :class="index%2==0?'grey lighten-3 grey--text text--darken-2':''"
        dense>
        <v-col cols="10" class="py-0 text-truncate link-text pointer">
          <router-link :to="{name: isLedger?'ledgerTxDetail':'transation',query:{hash:tx.hash}}" class="grey--text">
            <div>
                {{tx.hash | hash}}
            </div>
            <div>
                {{tx.unixTimestamp | datetime}}
            </div>
          </router-link>
        </v-col>
        <v-col cols="1" class="py-0 text-truncate text-right blue--text">
          {{tx.value | unit(2)}} ITC
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
  props: ['address','isLedger'],
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
      nodata: false,
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
    },
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