<template>
  <v-container>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1">创建钱包</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step > 2" step="2">备份助记词</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step > 3" step="3">确认助记词</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step ==4" step="4">完成</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-text-field
            v-model="walletName"
            label="walletName"
            rounded
            outlined
            filled
            dense
            class="mt-2"
            required>
          </v-text-field>
          <v-text-field
            v-model="password"
            label="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show1 = !show1"
            :type="show1 ? 'text' : 'password'"
            rounded
            outlined
            filled
            dense
            required>
          </v-text-field>
          <v-text-field
            v-model="passwordRepeat"
            label="password repeat"
            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show2 = !show2"
            :type="show2 ? 'text' : 'password'"
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
              :disabled="!walletName || !password || !passwordRepeat || password!=passwordRepeat"
              color="primary"
              @click="step = 2">
              Next
            </v-btn>
          </div>
          
        </v-stepper-content>

        <v-stepper-content step="2">
          <span class="warning--text">
            Mnemonic words are very important to restore your wallet. Please back it up carefully and keep it in a safe place.
          </span>
          <v-card 
            class="mt-3 mb-10"
            color="#f2f2f2"
            elevation="0">
            <v-row class="ma-0">
              <v-col 
                v-for="(word,index) in mnemonics"
                :key="index"
                class="text-center"
                :class="[index%4!=3?'border-right':'',index/4<2?'border-bottom':'']"
                cols="3">
                <span class="body-2">{{word}}</span>
              </v-col>
            </v-row>
          </v-card>
          
          <div>
            <v-btn
              dark
              icon
              color="orange darken-2"
              @click="step = 1">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-btn
              class="ml-4"
              color="primary"
              @click="step = 3">
              Next
            </v-btn>
          </div>
          
        </v-stepper-content>

        <v-stepper-content step="3">
          <span class="warning--text">
            To ensure that mnemonic words are backed up correctly, please arrange the following mnemonic words in order.
          </span>
          <v-card 
            class="mt-3 mb-3"
            color="#f2f2f2"
            elevation="0">
            <v-row class="ma-0">
              <v-col 
                v-for="(word,index) in selectedWords"
                @click="unselectWord(word,index)"
                :key="index"
                :style="word?'cursor:pointer;':''"
                class="text-center"
                :class="[index%4!=3?'border-right':'',index/4<2?'border-bottom':'']"
                cols="3">
                <span class="body-2">{{word?word:'&nbsp;'}}</span>
              </v-col>
            </v-row>
          </v-card>
          <v-container class="mb-5">
            <v-chip 
              style="cursor:pointer;"
              text-color="white" 
              color="green" 
              v-for="(word,index) in unselectedWords" 
              @click="selectWord(word,index)"
              :key="index" 
              class="ma-2">
              {{word}}
            </v-chip>
          </v-container>
          
          <div>
            <v-btn
              dark
              icon
              color="orange darken-2"
              @click="step = 2">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-btn
              class="ml-4"
              color="primary"
              :loading="loading"
              @click="checkMnemonics">
              Next
            </v-btn>
          </div>
          
        </v-stepper-content>

        <v-stepper-content step="4">
          <v-row justify="center">
            <v-col
              cols="12"
              sm="11"
              md="8"
              lg="7"
              xl="6">
              <v-card color="#f2f2f2" elevation="0" class="pa-3 d-flex justify-center align-center">
                <v-icon large class="">account_balance_wallet</v-icon>
                <div class="pa-0 ml-3 flex-grow-1" style="width:0!important;">
                  <div class="subtitle-1 font-weight-bold">ITC Wallet</div>
                  <div class="text-truncate">{{this.address}}</div>
                </div>
              </v-card>
              <div class="title font-weight-bold text-center mt-4">Your new wallet is ready</div>
              <v-btn color="primary" depressed class="mx-auto d-block mt-2" @click="$router.go(-1)">Done</v-btn>
            </v-col>
            
          </v-row>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>
<script>
import web3util from 'web3-utils'

function arrayEqual(l,r){
  if(!l && r){
    return false
  }
  if(l.length !== r.length){
    return false
  }
  for (let i = 0; i < l.length; i++) {
      const litem = l[i];
      const ritem = r[i];
      if (litem !== ritem) {
        return false
      }
  }
  return true
}

function shuffle(arr) {
  for (let i=arr.length-1; i>=0; i--) {
      let rIndex = Math.floor(Math.random()*(i+1));
      let temp = arr[rIndex];
      arr[rIndex] = arr[i];
      arr[i] = temp;
  }
  return arr;
}

export default {
  data(){
    return {
      loading: false,
      show1: false,
      show2: false,
      selectedWords: Array.from({length:12}, (v,k) => ''),
      unselectedWords: [],
      mnemonics: [],
      walletName:'',
      password: '',
      passwordRepeat: '',
      step: 1,
      address: ''
    }
  },
  mounted(){
    const mnemonics = this.$iotchain.bip39.generateMnemonic().split(' ')
    this.mnemonics = [...mnemonics]
    this.unselectedWords = [...mnemonics]
    // this.unselectedWords = shuffle([...mnemonics])
  },
  methods:{
    selectWord(word,index){
      var wIndex = this.selectedWords.indexOf('')
      this.selectedWords[wIndex] = word
      this.unselectedWords.splice(index,1)
    },
    unselectWord(word,index){
      if(word && word!=''){
        this.unselectedWords.push(word)
        this.selectedWords[index] = ''
      }
    },
    checkMnemonics(){
      if(arrayEqual(this.mnemonics,this.selectedWords)){
        this.loading = true
        var privateKey = this.$iotchain.util.mnemonicToPrivate(this.mnemonics.join(' '),this.password)
        setTimeout(() => {
          this.$iotchain.util.dumpKeystore(privateKey,this.password)
            .then(keyObject => {
              this.step = 4
              this.address = '0x'+keyObject.address
              this.$storage.addWallet(keyObject,this.walletName)
            }).finally(()=>{
              this.loading = false
            })
        }, 0);
      }else{

      }
    }
  }
}
</script>

<style scoped>
.border-right{
  border-right: 1px solid #ffffff;
}
.border-bottom{
  border-bottom: 1px solid #ffffff;
}
</style>