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
        // console.log('当前页面路由'+this.$route.path)

        let path = this.$route.path
        if(path.indexOf('/ledger/') != -1){

            this.listenLedger = setInterval(()=>{

                let status = this.$ledger.queryLedgerStatus() 

                //未开启app状态
                if(status<2 && path!= '/ledger' && path!= '/ledger/' && path != '/ledger/connectledger'){

                    // console.log('监听到ledger未打开itc app，退回到跟路由')
                    this.$router.replace('/ledger')

                    this.$alert.show({
                        message: "设备断开连接",
                        timeout: 3 * 1000,
                    })
                }
            },5 * 1000)
            // console.log('建立监听'+this.listenLedger)
        }
    },
    beforeDestroy(){

        if(this.listenLedger){
            // console.log('销毁监听：'+this.listenLedger)
            clearInterval(this.listenLedger)
        }
    }
}
</script>>