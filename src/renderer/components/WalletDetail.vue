<template>
  <v-container>
    <v-card :elevation="2" class="mb-3">
      <v-card-title class="black--text font-weight-bold">{{account.name}}</v-card-title>
      <div class="px-4 pb-4 pr-2 grey--text d-flex flex-row">
        <span class="flex-grow-1 text-truncate">{{account.address}}</span>
        <v-icon class="mr-2 pointer" small>mdi-qrcode</v-icon>
        <v-icon class="mr-1 pointer" small>content_copy</v-icon>
      </div>
      <v-divider class="mx-4"/>
      <div class=" d-flex flex-row px-4 py-2 black--text">
        <span class="flex-grow-1 text-center pointer">Keystore</span>
        <v-divider vertical/>
        <span class="flex-grow-1 text-center pointer">Change password</span>
        <v-divider vertical/>
        <span class="flex-grow-1 text-center pointer">Delete</span>
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
            <span class="flex-grow-1 text-right">{{account.itc}}</span>
          </div>
          <div class="px-4 d-flex flex-row grey--text">
            <span class="pr-4">ITG</span>
            <span class="flex-grow-1 text-right">{{account.itg}}</span>
          </div>
          <v-divider class="mx-4 mt-4"/>
          <div class="py-2 px-4 d-flex flex-row black--text">
            <router-link :to="{name:'transfer'}" class="flex-grow-1 text-center pointer">Transfer</router-link>
            <v-divider vertical/>
            <router-link :to="{name:'receive'}" class="flex-grow-1 text-center pointer">
              Receive
            </router-link>
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
          <div class="pb-4 d-flex flex-column" v-for="i in 10" :key="i">
            <div class="d-flex flex-row">
              <span class="pr-4 flex-grow-1 text-truncate">0xe537cf83b28c0b130b35811ddf32e70d2d8772de</span>
              <span class="text-right">+1.08ITC</span>
            </div>
            <span class="grey--text caption">29/11/2019</span>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data(){
    return {
      account: {
        name: 'My Btc Wallet',
        address: '0xe537cf83b28c0b130b35811ddf32e70d2d8772de',
        itc: 10000,
        itg: 100
      }
    }
  }
}
</script>