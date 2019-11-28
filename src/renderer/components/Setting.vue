<template>
  <v-container>
    <span class="subtitle-1 font-weight-bold">{{$t("setting.node")}}</span>
    <v-select
      v-model="currentNode"
      class="mt-1 mb-3"
      :items="nodes"
      :label="$t('setting.node')"
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
      nodes: this.$storage.get("node.list"),
      currentNode: this.$storage.get("node.current"),
      languages: [
        {text:'中文',value:'zh'},
        {text:'English',value:'en'},
      ],
      currentLang: this.$storage.get("language")
    }
  },
  watch: {
    currentNode: function(val){
      this.$storage.set('node.current',this.currentNode)
    },
    currentLang: function(val){
      this.$root.$i18n.locale = this.currentLang;
      this.$storage.set('language',this.currentLang)
    }
  }
}
</script>