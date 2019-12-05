<template>
  <v-container>
    <v-row justify="start">
      <v-col
        cols="12"
        sm="6"
        md="4"
        lg="4"
        xl="3">
        <v-hover v-slot:default="{ hover }">
          <v-card :elevation="2">
            <v-responsive :aspect-ratio="16/9">
              <v-expand-x-transition v-if="!hover">
                <div class="d-flex justify-center align-center flex-column" style="width:100%;height:100%;position:absolute;top:0;left:0;">
                  <v-icon large>add</v-icon>
                </div>
              </v-expand-x-transition>
              <v-expand-x-transition v-else>
                <div class="d-flex justify-center align-center flex-column" style="width:100%;height:100%;position:absolute;top:0;left:0;">
                  <v-btn outlined dense color="primary" width="150" style="text-decoration:none;" :to="{name:'importWallet'}">Import</v-btn>
                  <v-btn outlined dense color="primary" width="150" class="mt-2" style="text-decoration:none;" :to="{name:'createWallet'}">Create New</v-btn>
                </div>
              </v-expand-x-transition>
            </v-responsive>
          </v-card>
        </v-hover>
      </v-col>
      <template v-if="accounts && accounts.length>0">
        <v-col
          v-for="(account,index) in accounts"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          lg="4"
          xl="3">
          <WalletCard :wallet="account"/>
        </v-col>
      </template>
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