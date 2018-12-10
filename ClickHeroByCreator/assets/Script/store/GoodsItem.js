
cc.Class({
    extends: cc.Component,

    properties: {
        lbName : cc.Label,
        lbDesc : cc.Label,
        lbDesc2 : cc.Label,
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
        this.lbDesc2.string = "desc"+this.data.id
        this.lbBtn.string = "ruby:" + this.data.ruby

        var bc = GoodsDatas.getBuyCount(this.data.id)
        if (bc>0&& this.data.only) {
            this.lbBought.active = true
            this.btn.active = false
        } else {
            this.lbBought.active = false
            this.btn.active = true
        }
    },

    onBuy(id){
        if (id != this.data.id) {
            return
        }
        this.bind()
    },

    click(){
        var result = this.data.buy()
        if (result) {
            console.log("购买成功");
        }
    },
});
// 还有很多事啊