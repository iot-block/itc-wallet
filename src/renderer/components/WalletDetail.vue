<template>
  <v-container>
    <v-card :elevation="2" class="mb-3">
      <v-card-title class="black--text font-weight-bold">{{wallet.name}}</v-card-title>
      <div class="px-4 pb-4 pr-2 grey--text d-flex flex-row">
        <span class="flex-grow-1 text-truncate">{{this.address | hash}}</span>
        <v-icon class="mr-2 pointer" small @click="goReceive">mdi-qrcode</v-icon>
        <v-icon class="mr-1 pointer" small @click="copyAddress">content_copy</v-icon>
      </div>
      <v-divider class="mx-4"/>
      <div class=" d-flex flex-row px-4 py-2 black--text">
        <span class="flex-grow-1 text-center pointer link-text" @click="openKeystore">Keystore</span>
        <v-divider vertical/>
        <span class="flex-grow-1 text-center pointer link-text">Change password</span>
        <v-divider vertical/>
        <span class="flex-grow-1 text-center pointer link-text" @click="deleteWallet">Delete</span>
      </div>
    </v-card>

    <v-row no-gutters>
      <v-col 
        :class="$vuetify.breakpoint.smAndUp?'pr-2':''"
        class="pb-3"
        cols="12"
        sm="6"
        md="6"
        lg="6"
        xl="6">
        <v-card :elevation="2" >
          <div class="pa-4 subtitle-2 grey--text text--darken-3 font-weight-bold">Balance</div>
          <div class="px-4 d-flex flex-row grey--text">
            <span class="pr-4">ITC</span>
            <span class="flex-grow-1 text-right">{{itc | unit(5)}}</span>
          </div>
          <div class="px-4 d-flex flex-row grey--text">
            <span class="pr-4">ITG</span>
            <span class="flex-grow-1 text-right">{{itg | unit(5)}}</span>
          </div>
          <v-divider class="mx-4 mt-4"/>
          <div class="py-2 px-4 d-flex flex-row black--text">
            <router-link :to="{name:'transfer'}" class="flex-grow-1 text-center pointer">Transfer</router-link>
            <v-divider vertical/>
            <span @click="goReceive" class="flex-grow-1 text-center pointer link-text">
              Receive
            </span>
          </div>
        </v-card>
      </v-col>
      <v-col
        :class="$vuetify.breakpoint.smAndUp?'pl-2':''"
        class="pb-3"
        cols="12"
        sm="6"
        md="6"
        lg="6"
        xl="6">
        <v-card :elevation="2" class="pa-4">
          <div class="pb-4 subtitle-2 grey--text text--darken-3 font-weight-bold">Transactions Records</div>
          <Transactions :address="`0xab86e2b07d1241b26528dfc39e1251f1fec7b913`"/>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="dialogKeystore"
      width="500">
      <v-card elevation="0">
        <v-card-title
          class="primary lighten-2 white--text"
          primary-title>
          Keystore
        </v-card-title>

        <v-card-text class="mt-4">
          {{wallet.keystore}}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="copyKeystore">
            Copy
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="dialogKeystore=false">
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogDelete"
      width="500">
      <v-card elevation="0">
        <v-card-title
          class="primary lighten-2 white--text"
          primary-title>
          Confirm Delete Wallet
        </v-card-title>

        <v-card-text class="mt-4">
          确认删除该钱包？
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="confirmDelete">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>

import Transactions from './Transactions'
export default {
  components: {
    Transactions
  },
  data(){
    return {
      dialogKeystore: false,
      dialogDelete: false,
      dialogQrcode: false,
      wallet: {
        keystore: {},
        name: ''
      },
      address: '',
      itc: 0,
      itg: 0,
    }
  },
  mounted(){
    this.wallet = this.$storage.getWalletById(this.$route.query.walletId)
    this.address = '0x'+this.wallet.keystore.address
    this.$iotchain.account.getBalance(this.address)
      .then((balance) => {
        this.itg = balance
      })
    this.$iotchain.account.getItcBalance(this.address)
      .then((balance) => {
        this.itc = balance
      })
  },
  methods: {
    goReceive(){
      this.$router.push({
        name: 'receive',
        query: {address:this.address}
      })
    },
    openKeystore(){
      this.dialogKeystore = true
    },
    copyAddress(){
      this.$clipboard.writeText(this.address)
      this.$alert.show({
        message: "复制成功",
        time: 1000,
      })
    },
    copyKeystore(){
      this.$clipboard.writeText(JSON.stringify(this.wallet.keystore))
      this.$alert.show({
        message: "复制成功",
        time: 1000,
      })
    },
    deleteWallet(){
      this.dialogDelete = true
    },
    confirmDelete(){
      this.$storage.deleteWallet(this.wallet.keystore.id)
      this.dialogDelete = false
      this.$alert.show({
        message: "删除成功",
        time: 1000,
      })
      this.$router.go(-1)
    }
  }
}
</script>