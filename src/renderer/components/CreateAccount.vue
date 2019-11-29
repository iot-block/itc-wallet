<template>
  <v-container>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1">创建钱包</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step > 2" step="2">备份助记词</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3">确认助记词</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-text-field
            v-model="walletName"
            label="walletName"
            class="mt-2"
            required>
          </v-text-field>
          <v-text-field
            v-model="password"
            type="password"
            label="password"
            required>
          </v-text-field>
          <v-text-field
            class="mb-3"
            v-model="passwordRepeat"
            type="password"
            label="password repeat"
            required>
          </v-text-field>
          <v-btn
            :to="{name:'wallet'}"
            replace
            depressed
            color="success">
            取消
          </v-btn>
          <v-btn
            class="ml-4"
            depressed
            color="primary"
            @click="step = 2">
            Next
          </v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <span class="warning--text">
            Mnemonic words are very important to restore your wallet. Please back it up carefully and keep it in a safe place.
          </span>
          <v-card 
            class="mt-3 mb-10"
            color="grey lighten-2"
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
          
          <v-btn
            color="primary"
            @click="step = 1">
            Prev
          </v-btn>
          <v-btn
            color="primary"
            @click="step = 3">
            Next
          </v-btn>
        </v-stepper-content>

        <v-stepper-content step="3">
          <span class="warning--text">
            To ensure that mnemonic words are backed up correctly, please arrange the following mnemonic words in order.
          </span>
          <v-card 
            class="mt-3 mb-3"
            color="grey lighten-2"
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
          <v-container class="mb-5">
            <v-chip 
              text-color="white" 
              color="green" 
              v-for="(word,index) in mnemonics" 
              :key="index" 
              class="ma-2">
              {{word}}
            </v-chip>
          </v-container>
          
          <v-btn
            color="primary"
            @click="step = 2">
            Prev
          </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>
<script>
export default {
  data(){
    return {
      mnemonics: ['word1','word2','word3','word4','word5','word6','word7','word8','word9','word10','word11','word12'],
      walletName:'',
      password: '',
      passwordRepeat: '',
      step: 1
    }
  }
}
</script>

<style scoped>
.border-right{
  border-right: 1px solid #FAFAFA;
}
.border-bottom{
  border-bottom: 1px solid #FAFAFA;
}
</style>