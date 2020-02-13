<template>
  <v-container>
    <v-card elevation="2" class="ma-3">
      <v-tabs :show-arrows="true">
        <v-tab>Keystore</v-tab>
        <v-tab>{{ $t("wallet.mnemonic_phrase") }}</v-tab>
        <v-tab>{{ $t("wallet.private_key") }}</v-tab>
        <v-tab-item>
          <ImportByKeystore />
        </v-tab-item>
        <v-tab-item>
          <ImportByMnemonic />
        </v-tab-item>
        <v-tab-item>
          <ImportByPrivateKey />
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-container>
</template>

<script>
import ImportByKeystore from './wallet/ImportByKeystore'
import ImportByMnemonic from './wallet/ImportByMnemonic'
import ImportByPrivateKey from './wallet/ImportByPrivateKey'
export default {
  components: {
    ImportByKeystore,
    ImportByMnemonic,
    ImportByPrivateKey
  },
}
</script>