
let singleton;

class DataManager{
    
    constructor(){
        // this.ledgerDevices = [{  
        //     sign:'nanoS16',
        //     name:'噼噼啪啪'
        // },{
        //     sign:'nanoS16',
        //     name:'嗷嗷嗷'
        // }]
        this.ledgerDevices = []
        this.selectLedgerIdx = 0
    }

    getTotalLedgerDeviceName(){

        let names = []
        this.ledgerDevices.forEach((item)=>{
            names.push(item.name)
        })
        return names
    }

    getCurrentSelectLedger(){
        
        if(this.ledgerDevices.length == 0){
            return null
        }
        return this.ledgerDevices[this.selectLedgerIdx]
    }

    static defaultManager(){

        if(!singleton){
            singleton = new DataManager();
        }
        return singleton;
    }
}

export default DataManager