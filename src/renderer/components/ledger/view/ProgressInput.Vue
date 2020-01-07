<template>
    <v-container>
        <v-row>
            <span 
                class="sequence-label"
            >
                {{sequence}}
            </span>
            <p/>
            <p/>
            <span class="title-label">
                {{text}}
            </span>
        </v-row>
        <v-col class="text-input">
            <v-text-field 
                color="#5EA3FE"
                v-model="lgname"
                :messages="errMessage"
                rounded
                outlined
                filled
                dense
                :label="text"
                style="max-width:500px;border-color:#5EA3FE;"
            />
        </v-col>
    </v-container>
</template>

<script>

export default {
    props: {
        'sequence':{
            type:String,
            required: true
        },
        'text':{
            type:String,
        },
        'ledgername':{
            type:String
        },
        'errorMessage':{
            type:String
        },
    },
    data() {
        return {
            lgname:this.ledgername,
            errMessage:this.errorMessage
        }
    },
    methods: {
        
    },
    watch:{
      //监听外部对props属性errorMessage的变更
      errorMessage(val){
          this.errMessage = val
      },
      //组件内对myResult变更后向外部发送事件通知
      lgname(val){
        console.log(this.lgname)
        this.$emit("LEDGER_NAME_CHANGED",val);
      }
    },
}
</script>

<style scoped>

.sequence-label{
    background-color:#5EA3FE;height:20px;width:20px;line-height:20px;border-radius:10px;text-align:center;color:white;font-size:15px
}

.title-label{
    margin-left:10px;height:20px;line-height:20px;color:'black';
}

.text-input{
    margin-top:3px;margin-left:-20px
}

</style>