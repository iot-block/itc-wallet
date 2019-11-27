// import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'


Vue.use(Vuetify)

const opts = {
  icons: {
    // see https://materialdesignicons.com/
    // https://jossef.github.io/material-design-icons-iconfont/ 
    iconfont: 'md',   
  },
}

export default new Vuetify(opts)