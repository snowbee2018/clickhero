
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
    },

    bind(goods){
        this.data = goods||this.data
        this.lbName.string = this.data.name
        this.lbDesc.string = this.data.desc
        this.lbState.string = this.data.state
        this.lbBtn.string = "ruby:" + this.data.ruby

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
                console.log("两个一样");
                this.lbBought.active = true
                this.lbBought.getComponent(cc.Label).string = "明天再来"
                this.btn.active = false
            }else {
                console.log("不一样");
                this.lbBought.active = false
                this.btn.active = true
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
        var result = this.data.buy()
        if (result) {
            console.log("购买成功")
            if (this.data.id == 1) {
                cc.sys.localStorage.setItem("buyGoods1Date",this.getDateStr())
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
                }
            }
        }
    },
});
// 还有很多事啊