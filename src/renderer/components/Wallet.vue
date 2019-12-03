<template>
  <v-container fluid>
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
          <v-hover v-slot:default="{ hover }">
            <v-card :elevation="hover ? 12 : 2">
              <router-link :to="{name:'walletDetail'}" style="text-decoration:none;">
                <v-responsive :aspect-ratio="16/9" class="">
                  <div style="width:100%;height:100%" class="d-flex flex-column">
                    <div class="d-flex flex-row align-center">
                      <v-card-subtitle class="flex-grow-1 font-weight-bold black--text text-truncate">
                        {{account.name}}
                      </v-card-subtitle>
                      <v-icon class="mr-1">chevron_right</v-icon>
                    </div>
                    <div class="px-4 pr-2 grey--text d-flex flex-row">
                      <span class="flex-grow-1 text-truncate">{{account.address}}</span>
                      <v-icon class="mr-1" small>content_copy</v-icon>
                    </div>
                    <v-spacer />
                    <v-divider class="mx-4"/>
                    <div class=" d-flex flex-row px-4 py-2 black--text">
                      <span class="flex-grow-1 text-center">{{account.itc}} ITC</span>
                      <v-divider vertical/>
                      <span class="flex-grow-1 text-center">{{account.itg}} ITG</span>
                    </div>
                  </div>
                </v-responsive>
              </router-link>
            </v-card>
          </v-hover>
        </v-col>
      </template>
    </v-row>
    <!-- <v-speed-dial
      v-model="fab"
      fixed
      right
      bottom
      direction="top"
      class="mb-0 mr-0 mb-sm-2 mr-sm-2 mb-md-3 mr-md-3 mb-lg-4 mr-lg-4 mb-xl-4 mr-xl-4"
      transition="slide-y-reverse-transition">
      <template v-slot:activator>
        <v-btn
          v-model="fab"
          color="#007aff"
          dark
          fab>
          <v-icon v-if="fab">close</v-icon>
          <v-icon v-else>add</v-icon>
        </v-btn>
      </template>
      <div class="d-flex flex-row justify-end align-center align-self-end" style="width:200px;">
        <v-btn rounded depressed text height="30" min-width="0" color="green" class="mr-2 px-0 font-weight-bold">导入</v-btn>
        <v-btn
          class="mx-0"
          fab
          dark
          color="green">
          <v-icon>import_export</v-icon>
        </v-btn>
      </div>
      
      <v-btn
        fab
        dark
        color="indigo">
        <v-icon>account_balance_wallet</v-icon>
      </v-btn>
    </v-speed-dial> -->
  </v-container>
</template>

<script>
import storage from '../../common/storage'
export default {
  data(){
    return {
      fab: false,
      accounts: [
        {
          name: 'My Btc Wallet',
          address: '0xe537cf83b28c0b130b35811ddf32e70d2d8772de',
          itc: 10000,
          itg: 100
        },
        {
          name: 'My Btc Wallet',
          address: '0xe537cf83b28c0b130b35811ddf32e70d2d8772de',
          itc: 10000,
          itg: 100
        },
        {
          name: 'My Btc Wallet',
          address: '0xe537cf83b28c0b130b35811ddf32e70d2d8772de',
          itc: 10000,
          itg: 100
        },
        {
          name: 'My Btc Wallet',
          address: '0xe537cf83b28c0b130b35811ddf32e70d2d8772de',
          itc: 10000,
          itg: 100
        },
        {
          name: 'My Btc Wallet',
          address: '0xe537cf83b28c0b130b35811ddf32e70d2d8772de',
          itc: 10000,
          itg: 100
        }
      ]
    }
  },
  mounted(){
    this.$iotchain.getBalance('0xf5545fbc52b21d213800a0c0e5b2ee4664d9b44c')
      .then((balance) => {
        console.log(balance)
      })
  }
}
</script>