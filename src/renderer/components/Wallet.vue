<template>
  <v-container>
    <v-row justify="start">

      <template v-if="accounts && accounts.length>0">
        <v-col
          v-for="(account,index) in accounts"
          :key="index"
          cols="12"
          sm="6"
          md="6"
          lg="6"
          xl="4">
          <WalletCard :wallet="account"/>
        </v-col>
      </template>
        <v-col
        cols="12"
        sm="6"
        md="6"
        lg="6"
        xl="4">
        <v-hover v-slot:default="{ hover }">
          <v-card :elevation="2" class="pa-5">
            <v-responsive :aspect-ratio="16/9">
              <v-expand-x-transition v-if="!hover">
                <div class="d-flex justify-center align-center flex-column" style="width:100%;height:100%;position:absolute;top:0;left:0;">
                  <v-icon large>add</v-icon>
                </div>
              </v-expand-x-transition>
              <v-expand-x-transition v-else>
                <div class="d-flex justify-center align-center flex-column" style="width:100%;height:100%;position:absolute;top:0;left:0;">
                  <v-btn outlined dense width="150" class="border-dash link-text" style="text-decoration:none;" :to="{name:'importWallet'}">{{ $t("wallet.import") }}</v-btn>
                  <v-btn outlined dense width="150" class="mt-2 border-dash link-text" style="text-decoration:none;" :to="{name:'createWallet'}">{{ $t("wallet.create") }}</v-btn>
                </div>
              </v-expand-x-transition>
            </v-responsive>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import storage from '../../common/storage'
import WalletCard from './WalletCard'

export default {
  components:{
    WalletCard
  },
  data(){
    return {
      fab: false,
      accounts: this.$storage.listWallet()
    }
  },
  mounted(){
    
  }
}
</script>