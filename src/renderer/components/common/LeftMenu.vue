<template>
  <v-navigation-drawer
    color="#007aff"
    width="200"
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
        class="px-5" 
        :to="group.route" 
        :key="index"
        replace>
        <v-list-item-action v-if="group.icon || group.img" class="mr-0">
          <v-icon v-if="group.icon" :large="!$vuetify.breakpoint.mdAndUp">{{ group.icon }}</v-icon>
          <v-avatar tile v-else-if="group.img" size="24px">
            <v-img :src="group.img" contain></v-img>
          </v-avatar>
        </v-list-item-action>
        <div :key="index" class="title ml-3 font-weight-regular">{{ group.text }}</div>
      </v-list-item>
      <v-list-item>
        <Footer style="width:100%;"></Footer>
      </v-list-item>
      
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import Footer from '@/components/common/Footer'

// items: [
//   {
//     header: '分组标题',
//     items: [
//       {
//         icon: 'icon名字',
//         text:'栏目名',
//         img:'如果没有icon的话，可以填写img作为栏目名前的图标',
//         model: 'true表示展开，false收起',
//         children: [
//           {icon:'图标',text:'子栏目名'}
//         ]
//       }
//     ]
//   }
// ],

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
</style>