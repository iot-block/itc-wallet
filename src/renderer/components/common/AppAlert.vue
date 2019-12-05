<template>
  <v-bottom-sheet dark v-model="showAlert" inset hide-overlay>
    <v-sheet class="text-center">
      <div class="pa-4">{{message}}</div>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import Alert from '../../plugins/alert'
export default {
  data(){
    return {
      showAlert: false,
      message: ''
    }
  },
  methods: {
    show(params){
      let {message, timeout} = params
      this.message = message
      this.showAlert = true
      if(timeout && timeout>0){
        setTimeout(() => {
          this.showAlert = false
        }, timeout);
      }
    },
    hide(){
      this.message = ''
      this.showAlert = false
    }
  },
  beforeMount() {
    Alert.EventBus.$on('alert.show', (params) => {
      this.show(params)
    })
    Alert.EventBus.$on('alert.hide', () => {
      this.hide()
    })
  },
}
</script>