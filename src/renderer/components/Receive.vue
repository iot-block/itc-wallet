<template>
  <v-container class="d-flex justify-center align-center">
    <v-card elevation="2" class="d-flex flex-column justify-center align-centermt-6 mt-6">
      <div fluid class="d-flex flex-column justify-center align-center px-4 pb-4 pt-0" style="background:#2c7cf7;color:#ffffff;">
        <v-avatar color="teal" size="48" class="mt-n6">
          <v-icon size="30" dark>mdi-bitcoin</v-icon>
        </v-avatar>
        <span class="subtitle-1 font-weight-medium mt-1">ITC Wallet</span>
        <div class="d-flex flex-row justify-center align-center">
          <span class="caption white--text text--darken-1">
            {{address | hash}}
          </span>
          <v-icon class="ml-1" dark small @click.stop="copyAddress">content_copy</v-icon>
        </div>
      </div>
      <div class="d-flex flex-column justify-center align-center px-4 pt-8 pb-12">
        <span class="body-2">请转入ITC/ITG</span>
        <qrcode 
          :value="address" 
          :options="{ width: 150, margin: 0 }" 
          class="mt-3"
          tag="img">
        </qrcode>
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
        time: 1000,
      })
    }
  }
}
</script>