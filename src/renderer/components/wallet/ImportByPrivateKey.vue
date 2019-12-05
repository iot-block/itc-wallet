<template>
  <v-container>
    <v-textarea 
      v-model="privateKey" 
      no-resize 
      flat 
      outlined 
      :error="error"
      :error-messages="errorMessage"
      filled
      label="Private key">
    </v-textarea>
    <v-text-field
      v-model="walletName"
      label="walletName"
      rounded
      outlined
      filled
      dense
      required>
    </v-text-field>
    <v-text-field
      v-model="password"
      type="password"
      label="password"
      rounded
      outlined
      filled
      dense
      :error="error2"
      :error-messages="errorMessage2"
      required>
    </v-text-field>
    <v-text-field
      v-model="passwordRepeat"
      rounded
      outlined
      filled
      dense
      type="password"
      label="password repeat"
      :error="error2"
      :error-messages="errorMessage2"
      required>
    </v-text-field>

    <div class="mt-3">
      <v-btn
        :to="{name:'wallet'}"
        replace
        text
        depressed
        color="success">
        取消
      </v-btn>
      <v-btn
        class="ml-4"
        depressed
        @click="doImport"
        :disabled="!privateKey || !walletName || !password || password!=passwordRepeat"
        :loading="loading"
        color="primary">
        Import
      </v-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  data(){
    return {
      error: false,
      errorMessage: '',
      error2: false,
      errorMessage2: '',
      loading: false,
      walletName: '',
      password: '',
      passwordRepeat: '',
      privateKey: '',
    }
  },
  watch: {
    privateKey(){
      this.error = false
      this.errorMessage = ''
    },
    password(){
      if(this.password !=this.passwordRepeat){
        this.error2 = true
        this.errorMessage2 = "密码不一致"
      }else{
        this.error2 = false
        this.errorMessage2 = ""
      }
    },
    passwordRepeat(){
      if(this.password !=this.passwordRepeat){
        this.error2 = true
        this.errorMessage2 = "密码不一致"
      }else{
        this.error2 = false
        this.errorMessage2 = ""
      }
    }
  },
  methods:{
    doImport(){
      try {
        this.loading = true
        setTimeout(() => {
          this.$iotchain.util.dumpKeystore(this.privateKey,this.password)
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
        this.errorMessage = "私钥错误，请检查私钥"
      }
    }
  }
}
</script>