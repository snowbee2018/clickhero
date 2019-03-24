
cc.Class({
    extends: cc.Component,

    properties: {
        lbName : cc.Label,
        lbDesc : cc.Label,
        lbState : cc.Label,
        btn:cc.Node,
        lbBtn : cc.Label,
        lbBought : cc.Node,
    },

    start () {
        Events.on(Events.ON_BUY_GOODS,this.onBuy,this)
        Events.on(Events.ON_MAXLEVEL_UPDATE, this.onMaxFloor, this)
        Events.on(Events.ON_LEVEL_PASSED, this.onFloor, this)
    },

    onMaxFloor(){
        var maxfloor = DataCenter.getDataByKey(DataCenter.KeyMap.maxPassLavel) + 1
        if (this.data.unlockLv == maxfloor) {
            this.bind()
        }
    },

    onFloor(){
        console.log("onFloor");
        var floor = DataCenter.getDataByKey(DataCenter.KeyMap.passLavel) + 1
        if (this.data.id == 0 || this.data.id == 6) {
            // 买金币 和 英魂 每关都刷新下
            this.data.init()
            this.bind()
        }
    },

    bind(goods){
        var maxfloor = DataCenter.getDataByKey(DataCenter.KeyMap.maxPassLavel) + 1

        this.data = goods||this.data
        this.lbName.string = this.data.name
        this.lbDesc.string = this.data.desc
        this.lbState.string = this.data.state
        this.lbBtn.string = "蟠桃:" + this.data.ruby

        // console.log(maxfloor + "," + this.data.unlockLv);
        
        if (maxfloor < this.data.unlockLv) {
            this.lbBought.active = true
            this.btn.active = false
            this.lbBought.getComponent(cc.Label).string = this.data.unlockLv+"关解锁"
        } else {
            var bc = GoodsDatas.getBuyCount(this.data.id)
            if (bc>0&& this.data.only) {
                this.lbBought.active = true
                this.btn.active = false
            } else {
                this.lbBought.active = false
                this.btn.active = true
            }
            
            if (this.data.id == 1) {
                var dateStr = cc.sys.localStorage.getItem("buyGoods1Date")
                console.log(dateStr);
                console.log(this.getDateStr());
                
                if (dateStr == this.getDateStr()) {
                    this.lbBought.active = true
                    this.lbBought.getComponent(cc.Label).string = "明天再来"
                    this.btn.active = false
                }else {
                    this.lbBought.active = false
                    this.btn.active = true
                }
            }
        }
    },

    onBuy(id){
        if (id != this.data.id) {
            return
        }
        this.bind()
    },

    getDateStr(){
        var d = new Date()
        return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate()
    },

    click(){
        AudioMgr.playBtn();
        var result = this.data.buy()
        if (result) {
            console.log("购买成功")
            if (this.data.id == 1) {
                cc.sys.localStorage.setItem("buyGoods1Date",this.getDateStr())
                this.bind()
            }else if(this.data.id == 6){
                this.dur = 60;
                if (!this.callback) {
                    this.callback = function() {
                        this.dur--
                        if (this.dur <= 0) {
                            this.lbState.string = "没了"
                            this.unschedule(this.callback);
                            this.callback = undefined
                            return
                        }
                        this.lbState.string = "剩余:"+this.dur+"秒"
                    }
                    this.schedule(this.callback, 1);
                    this.lbState.string = "剩余:"+this.dur+"秒"
                }
            }
        }
    },
});
// 还有很多事啊