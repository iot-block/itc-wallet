<template>
</template>
<script>

export default {

    data(){
        return {
            listenLedger:0
        }
    },
    created(){
        let path = this.$route.path
        if(path.indexOf('/ledger/') != -1){

            this.listenLedger = setInterval(()=>{

                let status = this.$ledger.queryLedgerStatus() 
                if(status<2 && path!= '/ledger' && path!= '/ledger/' && path != '/ledger/connectledger'){

                    this.$router.replace('/ledger')
                    this.$alert.show({
                        message: this.$t("ledger.dis-connect"),
                        timeout: 3 * 1000,
                    })
                }
            },1 * 1000)
        }
    },
    beforeDestroy(){
        if(this.listenLedger){
            clearInterval(this.listenLedger)
        }
    }
}
</script>>