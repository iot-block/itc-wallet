<template>
  <v-navigation-drawer
    color="#1a2a3c"
    width="230"
    mini-variant-width="80"
    permanent
    :mini-variant="!$vuetify.breakpoint.mdAndUp"
    app
    dark
    floating
    :temporary="temporary"
    :value="show"
    @input="drawerUpdate">
    <v-list dense class="mt-4">
      <v-list-item v-for="(group,index) in items" 
        active-class="drawer-active"
        class="px-5" 
        :to="group.route" 
        :key="index"
        replace>
        <v-list-item-action v-if="group.icon || group.img" class="mr-0">
          <v-icon v-if="group.icon"  :small="$vuetify.breakpoint.mdAndUp">{{ group.icon }}</v-icon>
          <v-avatar tile v-else-if="group.img" :size="$vuetify.breakpoint.mdAndUp?16:24">
            <v-img :src="group.img" contain></v-img>
          </v-avatar>
        </v-list-item-action>
        <div :key="index" class="subtitle-1 ml-3 font-weight-regular">{{ group.text }}</div>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <Footer style="width:100%;"></Footer>
    </template>
  </v-navigation-drawer>
</template>

<script>
import Footer from '@/components/common/Footer'

export default {
  components:{
    Footer
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    temporary: {
      type: Boolean,
      default: null
    },
    drawerUpdate: {
      type: Function,
      default: (show) => {}
    },
    items: {
      type: Array,
      default: function(){
        return []
      }
    }
  },
  data: () => ({
  }),
}
</script>

<style scoped>
.drawer-active{
  background: #4ba1ff;
}
</style>