<template>
  <v-container>
    <v-card elevation="2" class="ma-3">
      <v-tabs :show-arrows="true">
        <v-tab>Keystore</v-tab>
        <v-tab>Mnemonic phrase</v-tab>
        <v-tab>Private Key</v-tab>
        <v-tab-item>
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
                :disabled="!keystore || !walletName || !password"
                depressed
                @click="importByKeystore"
                color="primary">
                Import
              </v-btn>
            </div>
            
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <v-container>
            <v-textarea 
              v-model="mnemonics" 
              no-resize 
              flat 
              outlined 
              filled
              label="Mnemonic phrase">
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
              required>
            </v-text-field>
            <v-text-field
              v-model="passwordRepeat"
              type="password"
              label="password repeat"
              rounded
              outlined
              filled
              dense
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
                color="primary">
                Import
              </v-btn>
            </div>
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <v-container>
            <v-textarea 
              v-model="privateKey" 
              no-resize 
              flat 
              outlined 
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
                color="primary">
                Import
              </v-btn>
            </div>
          </v-container>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data(){
    return {
      keystore: '',
      walletName: '',
      password: '',
      passwordRepeat: '',
      mnemonics: '',
      privateKey: '',
    }
  },
  methods:{
    importByKeystore(){
      var pk = this.$iotchain.util.recover(JSON.parse(this.keystore),this.password)
      console.log(pk)
    }
  }
}
</script>