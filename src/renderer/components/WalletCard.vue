<template>
  <v-hover v-slot:default="{ hover }">
    <v-card :elevation="hover ? 12 : 2" @click="goDetail">
      <v-responsive :aspect-ratio="16/9" class="">
        <div style="width:100%;height:100%" class="d-flex flex-column">
          <div class="d-flex flex-row align-center">
            <v-card-subtitle class="flex-grow-1 font-weight-bold black--text text-truncate">
              {{wallet.name}}
            </v-card-subtitle>
            <v-icon class="mr-1">chevron_right</v-icon>
          </div>
          <div class="px-4 pr-2 grey--text d-flex flex-row">
            <span class="flex-grow-1 text-truncate">{{wallet.keystore.address | hash}}</span>
            <v-icon class="mr-1" small @click.stop="copyAddress">content_copy</v-icon>
          </div>
          <v-spacer />
          <v-divider class="mx-4"/>
          <v-row class="flex-grow-0 d-flex flex-row px-4 py-2 black--text mx-0">
            <v-col cols="6" class="pa-0 text-center border-right">
              <span>{{itc | unit(2)}} ITC</span>
            </v-col>
            <!-- <v-divider vertical/> -->
            <v-col cols="6" class="pa-0 text-center">
              <span>{{itg | unit(2)}} ITG</span>
            </v-col>
          </v-row>
        </div>
      </v-responsive>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  props: ['wallet'],
  data(){
    return {
      itc: 0,
      itg: 0
    }
  },
  mounted(){
    this.$iotchain.account.getBalance(this.wallet.keystore.address)
      .then((balance) => {
        this.itg = balance
      })
    this.$iotchain.account.getItcBalance(this.wallet.keystore.address)
      .then((balance) => {
        this.itc = balance
      })
  },
  methods:{
    goDetail(){
      this.$router.push({
        name:'walletDetail',
        query:{walletId:this.wallet.keystore.id}
      })
    },
    copyAddress(){
      this.$clipboard.writeText(this.wallet.keystore.address)
      this.$alert.show({
        message: "复制成功",
        time: 1000,
      })
    }
  }
}
</script>

<style scoped>
.border-right{
  border-right: 1px solid rgba(0, 0, 0, 0.12)
}
</style>