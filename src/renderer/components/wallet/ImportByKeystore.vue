<template>
  <v-container>
    <v-textarea 
      v-model="keystore" 
      no-resize 
      flat 
      outlined 
      filled
      label="keystore">
    </v-textarea>
    <v-text-field
      v-model="walletName"
      :label="$t('wallet.wallet_name')"
      rounded
      outlined
      filled
      dense
      required>
    </v-text-field>
    <v-text-field
      v-model="password"
      type="password"
      :label="$t('wallet.wallet_password')"
      rounded
      outlined
      filled
      dense
      :error="error"
      :error-messages="errorMessage"
      required>
    </v-text-field>

    <div class="mt-3">
      <v-btn
        :to="{name:'wallet'}"
        replace
        text
        depressed
        color="blue darken-3">
         {{ $t("wallet.cancel") }}
      </v-btn>
      <v-btn
        class="ml-4"
        :disabled="!keystore || !walletName || !password"
        depressed
        @click="doImport"
        :loading="loading"
        color="primary">
        {{ $t("wallet.import") }}
      </v-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  data(){
    return {
      keystore: '',
      error: false,
      errorMessage: '',
      walletName: '',
      loading: false,
      password: '',
    }
  },
  watch: {
    keystore(){
      this.error = false
      this.errorMessage = ''
    },
    password(){
      this.error = false
      this.errorMessage = ''
    }
  },
  methods:{
    doImport(){
      try {
        this.loading = true
        var pk = this.$iotchain.util.recoverFromKeystore(JSON.parse(this.keystore),this.password)
        setTimeout(() => {
          this.$iotchain.util.dumpKeystore(pk,this.password)
            .then(keyObject => {
              this.address = '0x'+keyObject.address
              this.$storage.addWallet(keyObject,this.walletName)
              this.$router.replace({
                name: 'wallet'
              })
              this.$alert.show({
                message: '导入成功',
                timeout: 1000
              })
            }).finally(()=>{
              this.loading = false
            })
        }, 0);
      } catch (error) {
        this.error = true
        this.loading = false
        this.errorMessage = "密码错误，请检查密码以及keystore"
      }
    }
  }
}
</script>