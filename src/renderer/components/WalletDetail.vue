<template>
  <v-container>
    <v-row class="flex-wrap">
      <v-col 
        cols="12"
        sm="8"
        md="8"
        lg="8"
        xl="8">
        <v-card :elevation="2" class="fill-height d-flex flex-column">
          <v-card-title class="black--text font-weight-bold">{{wallet.name}}</v-card-title>
          <div class="px-4 pb-4 pr-2 grey--text d-flex flex-row">
            <span class="flex-grow-1 text-truncate">{{this.address | address}}</span>
            <v-icon class="mr-2 pointer" small @click="goReceive" color="blue">mdi-qrcode</v-icon>
            <v-icon class="mr-1 pointer" small @click="copyAddress" color="blue">content_copy</v-icon>
          </div>
          <v-spacer />
         
          <div v-if="!isLederAddress" class=" d-flex flex-row px-4 py-2 black--text">
            <v-btn class="flex-grow-1 justify-center align-center d-flex mr-5" color="#e4f0ff" elevation="0" @click="openKeystore">
                <span  class=" text-center pointer link-text" style="text-transform: capitalize"> Keystore</span>
            </v-btn>  
            <v-btn class="flex-grow-1 justify-center align-center d-flex mr-5" color="#e4f0ff" elevation="0" @click="changePassword">
                <span  class=" text-center pointer link-text" style="text-transform: capitalize">{{ $t("wallet.changepassword") }}</span>
            </v-btn>  
            <v-btn class="flex-grow-1 justify-center align-center d-flex " color="#e4f0ff" elevation="0" @click="deleteWallet">
                <span  class=" text-center pointer link-text" style="text-transform: capitalize">{{ $t("wallet.delect") }}</span>
            </v-btn>  
          </div>
        </v-card>
      </v-col>
      <v-col 
        cols="12"
        sm="4"
        md="4"
        lg="4"
        xl="4">
        <v-card :elevation="2" class="fill-height d-flex flex-column">
          <div class="pa-4 subtitle-2 grey--text text--darken-3 font-weight-bold">Balance</div>
          <div class="px-4 d-flex flex-row grey--text">
            <span class="pr-4">ITC</span>
            <span class="flex-grow-1 text-right blue--text">{{itc | unit(4)}}</span>
          </div>
          <div class="px-4 d-flex flex-row grey--text">
            <span class="pr-4">ITG</span>
            <span class="flex-grow-1 text-right blue--text">{{itg | unit(4)}}</span>
          </div>
          <v-spacer />
          <v-divider class="mx-4 mt-4"/>
          <div class="py-2 px-4 d-flex flex-row black--text">

            <v-btn class="flex-grow-1 justify-center align-center d-flex mr-2" color="#e4f0ff" elevation="0" :to="{name:isLederAddress?'ledgerTransfer':'transfer', query:{
                wallet:isLederAddress?JSON.stringify(wallet):null,
                walletId:wallet.keystore.id
            }}">
                <span  class=" text-center pointer link-text" style="text-transform: capitalize"> {{ $t("wallet.transfer") }}</span>
            </v-btn>    
            <v-btn class="flex-grow-1 justify-center align-center d-flex " color="#e4f0ff" elevation="0" @click="goReceive">
                <span  class=" text-center pointer link-text" style="text-transform: capitalize"> {{ $t("wallet.receive") }}</span>
            </v-btn>    
          </div>
        </v-card>
      </v-col>
      <v-col
        cols="12">
        <v-card :elevation="2" class="pa-4">
          <div class="checkout-container">
            <v-btn text class="checkout-recoder-btn justify-center align-center d-flex" @click="checkoutITCRecoder">
              <span  :class="recoderType?'':'link-text'">{{$t("wallet.transaction_record")}}</span>
            </v-btn>  
            <v-btn text class="checkout-recoder-btn justify-center align-center d-flex" @click="checkoutITGRecoder">
              <span  :class="!recoderType?'':'link-text'" style="capitalize">{{$t("wallet.transaction_itg_record")}}</span>
            </v-btn>  
          </div>
          <Transactions :address="address" :isLedger="isLederAddress" :recoderType="recoderType"/>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="dialogKeystore"
      width="800">
      <v-card elevation="0">
        <v-card-title
          class="primary lighten-2 white--text"
          primary-title>
          Keystore
        </v-card-title>

        <pre class="pa-4" style="max-height:400px;overflow:scroll;">{{wallet.keystore}}</pre>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="px-8"
            color="#76aaf8"
            dark
            depressed
            @click="copyKeystore">
              {{ $t("wallet.wallet_copy") }}
          </v-btn>
          <v-btn
            class="px-8 ml-4"
            color="#76aaf8"
            dark
            depressed
            @click="dialogKeystore=false">
               {{ $t("wallet.alert_close") }}
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
         {{ $t("wallet.delete_wallet") }}
        </v-card-title>

        <v-card-text class="mt-4">
           {{ $t("wallet.confirm_delete") }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="confirmDelete">
             {{ $t("wallet.delect") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>

import Transactions from './Transactions'
import Base from './ledger/Base'
export default {
  extends:Base,
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
      isLederAddress:false,
      recoderType:0
    }
  },
  mounted(){

    // console.log('地址详情界面出现,参数'+JSON.stringify(this.$route.query.wallet,null,2))

    if(this.$route.query.wallet){
      this.wallet = JSON.parse(this.$route.query.wallet)
      this.isLederAddress = true
    }
    else{
      this.wallet = this.$storage.getWalletById(this.$route.query.walletId)
    }    
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
    checkoutITGRecoder(){
      this.recoderType = 1
    },
    checkoutITCRecoder(){
      this.recoderType = 0
    },
    goReceive(){
      this.$router.push({
        name:this.isLederAddress?'ledgerReceive':'receive',
        query: {address:this.address}
      })
    },
    changePassword(){
      this.$router.push({
        name: 'changepswd',
        query: {walletId:this.wallet.keystore.id}
      })
    },
    openKeystore(){
      this.dialogKeystore = true
    },
    copyAddress(){
      let address = this.address.indexOf('ITC') == 0 ? this.address : 'ITC' + this.address.substr(2)
      this.$clipboard.writeText(address)
      this.$alert.show({
        message:  this.$t('setting.copy'),
        timeout: 1000,
      })
    },
    copyKeystore(){
      this.$clipboard.writeText(JSON.stringify(this.wallet.keystore,null,2))
      this.$alert.show({
        message:  this.$t('setting.copy'),
        timeout: 1000,
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
        timeout: 1000,
      })
      this.$router.go(-1)
    }
  }
}
</script>


<style scoped>
.checkout-recoder-btn{
  margin-bottom: 20px;
  margin-left: -20px;
}
.checkout-container{
  display: flex;
  flex-direction: row;
}
</style>