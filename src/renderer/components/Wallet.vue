<template>
  <v-container fluid>
    <v-row justify="start">
      <v-col
        height="100%"
        cols="6"
        sm="6"
        md="4"
        lg="3"
        xl="3">
        <v-hover v-slot:default="{ hover }">
          <v-card :elevation="hover ? 12 : 2">
            <router-link :to="{name:'create'}" style="text-decoration:none;">
              <v-responsive :aspect-ratio="16/9">
                <div icon class="d-flex justify-center align-center" style="width:100%;height:100%;">
                  <v-icon large>add</v-icon>
                </div>
              </v-responsive>
            </router-link>
          </v-card>
        </v-hover>
      </v-col>
      <template v-if="accounts && accounts.length>0">
        <v-col
          v-for="i in accounts"
          :key="i"
          cols="6"
          sm="6"
          md="4"
          lg="3"
          xl="3">
          <v-card>
            <router-link :to="{name:'create'}">
              <v-responsive :aspect-ratio="16/9">
              </v-responsive>
            </router-link>
          </v-card>
        </v-col>
      </template>
    </v-row>
    <!-- <v-speed-dial
      v-model="fab"
      fixed
      right
      bottom
      direction="top"
      class="mb-0 mr-0 mb-sm-2 mr-sm-2 mb-md-3 mr-md-3 mb-lg-4 mr-lg-4 mb-xl-4 mr-xl-4"
      transition="slide-y-reverse-transition">
      <template v-slot:activator>
        <v-btn
          v-model="fab"
          color="#007aff"
          dark
          fab>
          <v-icon v-if="fab">close</v-icon>
          <v-icon v-else>add</v-icon>
        </v-btn>
      </template>
      <div class="d-flex flex-row justify-end align-center align-self-end" style="width:200px;">
        <v-btn rounded depressed text height="30" min-width="0" color="green" class="mr-2 px-0 font-weight-bold">导入</v-btn>
        <v-btn
          class="mx-0"
          fab
          dark
          color="green">
          <v-icon>import_export</v-icon>
        </v-btn>
      </div>
      
      <v-btn
        fab
        dark
        color="indigo">
        <v-icon>account_balance_wallet</v-icon>
      </v-btn>
    </v-speed-dial> -->
  </v-container>
</template>

<script>
import storage from '../../common/storage'
export default {
  data(){
    return {
      fab: false,
      accounts: []
    }
  }
}
</script>