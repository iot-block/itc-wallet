<template>
  <v-container>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1">Transfer</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step > 2" step="2">Confirm</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step == 3" step="3">Finish</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card-title class="px-0 pt-0 black--text font-weight-bold">Transfer</v-card-title>
          <v-text-field
            v-model="address"
            label="address"
            hide-details
            rounded
            outlined
            filled
            dense
            required>
          </v-text-field>
          <v-radio-group v-model="transferType" mandatory row hide-details>
            <v-radio
              label="ITC"
              value="itc">
            </v-radio>
            <v-radio
              label="ITG"
              value="itg">
            </v-radio>
          </v-radio-group>
          <v-text-field
            class="mt-4"
            v-model="amount"
            label="amount"
            hide-details
            type="number"
            rounded
            outlined
            filled
            dense
            required>
          </v-text-field>
          <v-slider
            class="mt-10 align-center"
            hide-details
            :thumb-size="24"
            step="1"
            thumb-label="always"
            min="1"
            max="100"
            v-model="gasFee"
            label="Gas Fee">
            <template v-slot:thumb-label="props">
              <span>{{props.value>66?'高':props.value>33?'中':'低'}}</span>
            </template>
            <template v-slot:append>
              <v-text-field
                v-model="gasFee"
                class="mt-0 pt-0 align-center"
                append-icon="mdi-bitcoin"
                hide-details
                single-line
                outlined
                dense
                type="number"
                style="width: 100px">
              </v-text-field>
            </template>
          </v-slider>
          <div class="mt-4">
            <v-btn
              class="ml-0"
              depressed
              color="primary"
              @click="step=2">
              Next
            </v-btn>
          </div>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-row>
            <v-col 
              :cols="$vuetify.breakpoint.mdAndUp?5:12">
              <v-card color="#f2f2f2" :elevation="0" class="pa-4 d-flex flex-column justify-center align-center">
                <v-avatar color="teal" size="48" style="border-radius:50%!important;">
                  <span class="white--text headline">48</span>
                </v-avatar>
                <div class="mt-2 text-truncate text-center" style="width:100%;">0xe537cf83b28c0b130b35811ddf32e70d2d8772de</div>
              </v-card>
            </v-col>
            <v-col 
              :cols="$vuetify.breakpoint.mdAndUp?2:12" 
              class="px-0 d-flex justify-center align-center"
              :class="$vuetify.breakpoint.mdAndUp?'flex-column':'flex-row'">
              <span class="subtitle-2 font-weight-bold">1000000 ITC</span>
              <v-icon class="mx-2">{{$vuetify.breakpoint.mdAndUp?'mdi-transfer-right':'mdi-transfer-down'}}</v-icon>
              <span class="caption">Gas: 0.2ITG</span>
            </v-col>
            <v-col
              :cols="$vuetify.breakpoint.mdAndUp?5:12">
              <v-card color="#f2f2f2" :elevation="0" class="pa-4 d-flex flex-column justify-center align-center">
                <v-avatar color="teal" size="48" style="border-radius:50%!important;">
                  <span class="white--text headline">48</span>
                </v-avatar>
                <div class="mt-2 text-truncate text-center" style="width:100%;">0xe537cf83b28c0b130b35811ddf32e70d2d8772de</div>
              </v-card>
            </v-col>
          </v-row>
          <v-text-field
            class="mt-4"
            v-model="password"
            label="password"
            hide-details
            type="password"
            rounded
            outlined
            filled
            dense
            required>
          </v-text-field>
          <div class="mt-5">
            <v-btn
              dark
              icon
              color="orange darken-2"
              @click="step = 1">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-btn
              class="ml-4"
              depressed
              color="primary"
              @click="step=3">
              Transfer
            </v-btn>
          </div>
        </v-stepper-content>
        <v-stepper-content step="3">
          <div class="d-flex flex-column justify-center align-center">
            <v-icon color="#2c7cf7" size="60">mdi-checkbox-marked-circle</v-icon>
            <span style="color:#2c7cf7;">Success</span>
          </div>
          <div class="mt-4 text-center">
            <v-btn
              depressed
              replace
              color="primary"
              @click="$router.go(-1)">
              Done
            </v-btn>
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    
  </v-container>
</template>

<script>
export default {
  data(){
    return {
      step: 1,
      password: '',
      transferType: 'itc',
      address: '',
      amount: '',
      gasFee: 0,
    }
  },
  methods:{
    
  }
}
</script>