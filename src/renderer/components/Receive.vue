<template>
  <v-container class="d-flex justify-center align-center">
    <v-card elevation="2" class="d-flex flex-column justify-center align-centermt-6 mt-6">
      <div fluid class="d-flex flex-row justify-center align-center px-12 py-10" style="background:#5da0f8;color:#ffffff;position:relative;">
        <img src="../assets/images/logo_half.png" style="position:absolute;bottom:0;right:20px;width:100px;"/>
        <v-img width="32" :src="require('../assets/images/wallet.png')"/>
        <div class="ml-4">
          <span class="subtitle-2 font-weight-medium">ITC Wallet</span>
          <div class="d-flex flex-row justify-center align-center">
            <span class="caption white--text text--darken-1">
              {{address | address}}
            </span>
            <v-icon class="ml-1" dark small @click.stop="copyAddress">content_copy</v-icon>
          </div>
        </div>
      </div>
      <div class="d-flex flex-column justify-center align-center px-4 py-12">
        <qrcode 
          :value="address" 
          :options="{ width: 150, margin: 0 }" 
          class=""
          tag="img">
        </qrcode>
        <span class="caption font-weight-bold mt-3" style="color:#5da0f8;">请转入ITC/ITG</span>
      </div>
      
    </v-card>
  </v-container>
</template>

<script>
export default {
  data(){
    return {
      address: this.$route.query.address
    }
  },
  methods:{
    copyAddress(){
      this.$clipboard.writeText(this.address)
      this.$alert.show({
        message: "复制成功",
        timeout: 1000,
      })
    }
  }
}
</script>