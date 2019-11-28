<template>
  <v-container fluid>
    <v-row>
      <v-col
        v-for="i in 10"
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
    </v-row>
  </v-container>
</template>

<script>
import storage from '../../common/storage'
export default {
  mounted(){
  }
}
</script>