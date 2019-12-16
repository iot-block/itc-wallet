<template>
  <v-container>
    <v-card class="pa-4">
      <span class="subtitle-1 font-weight-bold">Transaction Information</span>
      <div class="block-info mt-3">
        <v-row class="mx-0">
          <v-col cols="2" class="row-title">
            TxHash
          </v-col>
          <v-col cols="10" class="content-color">
            {{tx.txhash | hash}}
          </v-col>
        </v-row>
        <v-divider />
        <v-row class="mx-0">
          <v-col cols="2" class="row-title">
            Status
          </v-col>
          <v-col cols="10" class="content-color">
            Success
          </v-col>
        </v-row>
        <v-divider />
        <v-row class="mx-0">
          <v-col cols="2" class="row-title">
            BlockHeight
          </v-col>
          <v-col cols="10" class="content-color">
            1069866
          </v-col>
        </v-row>
        <v-divider />
        <v-row class="mx-0">
          <v-col cols="2" class="row-title">
            TimeStamp
          </v-col>
          <v-col cols="10" class="content-color">
            2019-12-16 09:51:00
          </v-col>
        </v-row>
        <v-divider />
        <v-row class="mx-0">
          <v-col cols="2" class="row-title">
            From
          </v-col>
          <v-col cols="10" class="content-color">
            {{tx.txhash | hash}}
          </v-col>
        </v-row>
        <v-divider />
        <v-row class="mx-0">
          <v-col cols="2" class="row-title">
            To
          </v-col>
          <v-col cols="10" class="content-color">
            {{tx.txhash | hash}}
          </v-col>
        </v-row>
        <v-divider />
        <v-row class="mx-0">
          <v-col cols="2" class="row-title">
            Value
          </v-col>
          <v-col cols="10" class="content-color">
            0 ITG
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data(){
    return {
      tx: {
        txhash: '0x91b7af42b66f10f5c813bc80cb961c2686e62f042a18c0c7df3103a47c231827'
      }
    }
  }
}
</script>

<style scoped>
.row-title{
  background: #f4f9fe;
  color: #3a3939;
}
.block-info{
  border: 1px solid #ededed;
}
</style>