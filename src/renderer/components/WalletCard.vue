<template>
  <v-hover v-slot:default="{ hover }">
    <v-card elevation="2" @click="goDetail" class="pa-5">
      <v-responsive :aspect-ratio="16/9" class="">
        <div style="width:100%;height:100%" class="d-flex flex-column">
          <div class="d-flex flex-row align-center">
            <v-card-subtitle class="flex-grow-1 font-weight-bold link-text text-truncate">
              {{wallet.name}}
            </v-card-subtitle>
            <v-icon class="mr-1 link-text">chevron_right</v-icon>
          </div>
          <div class="px-4 pr-2 content-color d-flex flex-row">
            <span class="flex-grow-1 text-truncate">{{wallet.keystore.address | address}}</span>
            <v-icon class="mr-1" small @click.stop="copyAddress" color="blue">content_copy</v-icon>
          </div>
          <v-spacer />
          <!-- <v-divider class="mx-4"/> -->
          <v-row class="flex-grow-0 d-flex flex-row px-4 py-2 black--text mx-0 mb-3">
            <v-col cols="6" class="pa-0  ">
              <span class="link-text">{{itc | unit(2)}}</span><span class="content-color"> ITC</span>
            </v-col>
            <!-- <v-divider vertical/> -->
            <v-col cols="6" class="pa-0 ">
              <span class="link-text">{{itg | unit(2)}}</span><span class="content-color"> ITG</span>
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
        name:this.wallet.keystore.crypto?'walletDetail':'ledgerWalletDetail',
        query:{
          wallet:this.wallet.keystore.crypto ? null :JSON.stringify(this.wallet),
          walletId:this.wallet.keystore.id
        }
      })
    },
    copyAddress(){
      this.$clipboard.writeText('ITC' + this.wallet.keystore.address)
      this.$alert.show({
        message: this.$t('setting.copy'),
        timeout: 1000,
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