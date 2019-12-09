<template>
  <v-container>
    <v-card :elevation="2" class="pa-3">
      <v-card-title>{{wallet.name}}</v-card-title>
      <v-text-field
        v-model="password"
        label="password"
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="show1 = !show1"
        :type="show1 ? 'text' : 'password'"
        rounded
        outlined
        filled
        :error="error1"
        :error-messages="errorMessage1"
        dense
        required>
      </v-text-field>
      <v-text-field
        v-model="newPassword"
        label="new password"
        :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="show2 = !show2"
        :type="show2 ? 'text' : 'password'"
        rounded
        outlined
        filled
        :error="error2"
        :error-messages="errorMessage2"
        dense
        required>
      </v-text-field>
      <v-text-field
        v-model="newPasswordRepeat"
        label="new password repeat"
        :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="show3 = !show3"
        :type="show3 ? 'text' : 'password'"
        rounded
        outlined
        filled
        dense
        required>
      </v-text-field>

      <div class="mt-3">
        <v-btn
          text
          depressed
          @click="$router.go(-1)"
          color="success">
          Cancel
        </v-btn>
        <v-btn
          class="ml-4"
          depressed
          :disabled="!password || !newPassword || newPassword!=newPasswordRepeat"
          color="primary"
          :loading="loading"
          @click="confirm">
          Confirm
        </v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data(){
    return {
      show1: false,
      password: '',
      error1: false,
      errorMessage1: '',
      show2: false,
      newPassword: '',
      error2: false,
      errorMessage2: '',
      show3: false,
      newPasswordRepeat: '',
      walletId: this.$route.query.walletId,
      wallet: {},
      loading: false
    }
  },
  mounted(){
    this.wallet = this.$storage.getWalletById(this.$route.query.walletId)
  },
  watch:{
    password(val){
      this.error1 = false
      this.errorMessage1 = ''
    },
    newPassword(val){
      this.error2 = false
      this.errorMessage2 = ''
    }
  },
  methods:{
    confirm(){
      var privateKey = ''
      try {
        privateKey = this.$iotchain.util.recoverFromKeystore(this.wallet.keystore,this.password)
      } catch (error) {
        this.error1 = true
        this.errorMessage1 = "密码错误"
        return
      }

      if(this.password === this.newPassword){
        this.error2 = true
        this.errorMessage2 = "新密码与旧密码相同"
        return
      }

      this.loading = true
      setTimeout(() => {
        this.$iotchain.util.dumpKeystore(privateKey,this.newPassword)
          .then(keyObject => {
            this.$storage.addWallet(keyObject,this.wallet.name)
            this.$storage.deleteWallet(this.wallet.keystore.id)
            this.$router.replace({
              name: 'wallet'
            })
            this.$alert.show({
              message: '修改成功',
              timeout: 1000
            })
          }).finally(()=>{
            this.loading = false
          })
      }, 0);
    }
  }
}
</script>