<template>
    <v-container>
        <v-row>
            <span 
                :class="['sequence-label',status?'complete-sequence':'progress-sequence']"
            >
                {{status?'✔':sequence}}
            </span>
            <p/>
            <p/>
            <span :class="['title-label',status?'grey-color':'black-color']">
                {{text}}
            </span>
        </v-row>
        <v-col class="progress-bar">
            <v-progress-linear
                color="#5EA3FE"
                background-color="grey lighten-1"
                rounded
                :indeterminate="!status"
                height="8"
                :value="status?'100%':'0'"
                style="max-width:500px"
            >
            </v-progress-linear>
        </v-col>
    </v-container>
</template>

<script>
export default {
    props: ['status','sequence','text'],

}
</script>

<style scoped>

.sequence-label{
    height:20px;
    width:20px; 
    line-height:20px;
    border-radius:10px;
    text-align:center;
    color:white;
}

.complete-sequence{
    background-color:#00E676;
    font-size:10px
}

.progress-sequence{
    background-color:#5EA3FE;
    font-size:15px
}

.title-label{
    margin-left:10px;
    height:20px;
    line-height:20px;
}

.grey-color{
    color: grey
}

.black-color{
    color: black
}

.progress-bar{
    margin-top:3px;
    margin-left:-20px
}

</style>