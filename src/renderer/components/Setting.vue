<template>
  <v-container>
    <span class="subtitle-1 font-weight-bold">{{$t("setting.node")}}</span>
    <v-select
      v-model="currentNode"
      class="mt-1 mb-3"
      :items="nodes"
      item-text="name"
      item-value="server"
      :label="$t('setting.node')"
      filled
      dense
      outlined
      solo
      hide-details
      :menu-props="{offsetY:true}"
      flat>
    </v-select>

    <span class="subtitle-1 font-weight-bold">{{$t("setting.language")}}</span>
    <v-select
      v-model="currentLang"
      class="mt-1"
      :items="languages"
      :label="$t('setting.language')"
      filled
      dense
      outlined
      solo
      hide-details
      :menu-props="{offsetY:true}"
      flat>
    </v-select>
  </v-container>
</template>

<script>
export default {
  data(){
    return {
      nodes: this.$setting.get("node.list"),
      currentNode: this.$setting.get("node.current").server,
      languages: [
        {text:'中文',value:'zh'},
        {text:'English',value:'en'},
      ],
      currentLang: this.$setting.get("language")
    }
  },
  watch: {
    currentNode: function(val){
      this.$setting.set('node.current',this.nodes.find(n => n.server==this.currentNode))
    },
    currentLang: function(val){
      this.$root.$i18n.locale = this.currentLang;
      this.$setting.set('language',this.currentLang)
    }
  }
}
</script>