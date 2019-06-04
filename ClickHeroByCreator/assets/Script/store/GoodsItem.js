
cc.Class({
    extends: cc.Component,

    properties: {
        lbName : cc.Label,
        lbDesc : cc.Label,
        lbState : cc.Label,
        btn:cc.Node,
        btnTitle:cc.Label,
        lbBtn : cc.Label,
        lbBought : cc.Node,
    },

    start () {
        Events.on(Events.ON_BUY_GOODS,this.onBuy,this)
        Events.on(Events.ON_MAXLEVEL_UPDATE, this.onMaxFloor, this)
        Events.on(Events.ON_LEVEL_PASSED, this.onFloor, this)
    },

    onDestroy (){
        Events.off(Events.ON_BUY_GOODS,this.onBuy,this)
        Events.off(Events.ON_MAXLEVEL_UPDATE, this.onMaxFloor, this)
        Events.off(Events.ON_LEVEL_PASSED, this.onFloor, this)
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
        if (this.data.id == 0 || this.data.id == 5) {
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
        this.lbBtn.string = "仙桃:" + this.data.ruby

        // console.log(maxfloor + "," + this.data.unlockLv);
        
        if (maxfloor < this.data.unlockLv) {
            this.lbBought.active = true
            this.btn.active = false
            this.lbBought.getComponent(cc.Label).string = this.data.unlockLv+"关解锁"
            this.node.color = new cc.Color(0xCF,0xCB,0xBA)
        } else {
            this.node.color = new cc.Color(0xEC,0xE0,0xB0)
            
            var bc = GoodsDatas.getBuyCount(this.data.id)
            if (bc>0&& this.data.only) {
                this.lbBought.active = true
                this.btn.active = false
                this.lbBought.getComponent(cc.Label).string = "已拥有"
            } else {
                this.lbBought.active = false
                this.btn.active = true
            }
            
            if (this.data.id == 1 || this.data.id == 14) {
                // var dateStr = cc.sys.localStorage.getItem(this.data.id == 1 ?"buyGoods1Date":"buyGoods14Date")
                // console.log(dateStr);
                // console.log(this.getDateStr());
                if (GoodsDatas.todayHasBuy(this.data.id)) {
                // if (dateStr == this.getDateStr()) {
                    this.lbBought.active = true
                    this.lbBought.getComponent(cc.Label).string = "明天再来"
                    this.btn.active = false
                }else {
                    this.lbBought.active = false
                    this.btn.active = true
                }
            } else if (this.data.id == 16) {
                this.lbBtn.node.active = false
                this.btnTitle.string = "去邀请"
                this.btnTitle.node.y = 0
            }
        }
    },

    onBuy(id){
        if (id == 15 && this.data.id == 5) {
            this.data.init()
            this.bind()
        }
        if (id != this.data.id) {
            return
        }
        console.log("GoodsItem onBuy" + id);
        if (id == 16) {
            GoodsDatas.refresh()
            GameData.refresh()
            this.data.init()
        }
        this.bind()
    },

    getDateStr(){
        var d = new Date()
        return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate()
    },

    click(){
        const self = this
        AudioMgr.playBtn();
        if (this.data.id == 16) {
            WeChatUtil.shareAppMessage();
            return
        }
        var result = this.data.buy()
        if (result) {
            console.log("购买成功")
            if (this.data.id == 1||this.data.id == 14) {
                // cc.sys.localStorage.setItem(this.data.id == 1 ?"buyGoods1Date":"buyGoods14Date"
                //     ,this.getDateStr())
                this.bind()
            }else if(this.data.id == 6){
                this.dur = 60;
                if (!this.callback) {
                    this.callback = function() {
                        self.dur--
                        if (self.dur <= 0) {
                            self.lbState.string = "用完了"
                            PublicFunc.unschedule(self.callback);
                            self.callback = undefined
                            return
                        }
                        self.lbState.string = "剩余:"+self.dur+"秒"
                    }
                    PublicFunc.schedule(this.callback, 1);
                    this.lbState.string = "剩余:"+this.dur+"秒"
                }
            }
        }
    },
});
// 还有很多事啊