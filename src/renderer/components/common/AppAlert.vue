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
      let {message, time} = params
      this.message = message
      this.showAlert = true
      if(time && time>0){
        setTimeout(() => {
          this.showAlert = false
        }, time);
      }
    },
    hide(){
      this.message = ''
      this.showAlert = false
    }
  },
  beforeMount() {
    Alert.EventBus.$on('show', (params) => {
      this.show(params)
    })
    Alert.EventBus.$on('hide', () => {
      this.hide()
    })
  },
}
</script>