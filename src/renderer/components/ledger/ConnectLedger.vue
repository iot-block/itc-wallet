<template>
  <v-container>
    <v-text-field class="my-1 text-center title" v-model="label" label="1、连接至您的钱包" disabled :loading="step==0"></v-text-field>
    <v-text-field class="my-1 text-center title" v-if="step>0" v-model="label" label="2、在Ledger中打开iot chain应用" disabled :loading="step==1"></v-text-field>
    <v-text-field class="my-1 text-center title" v-if="step>1" v-model="label" label="3、正在同步Ledger钱包信息" disabled :loading="step==2"></v-text-field>
  </v-container>
</template>

<script>

// import ledger from '../../../common/ledger/ledger.js'
// ledger.registLedgerStatus(status=>{
//   console.log('Ledger设备状态变化->'+status)
// })

export default {
    data: () => ({
      label: '',
      step:2
    }),
    methods: {
      
    },
}
</script>