
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
    },

    onDestroy (){
        Events.off(Events.ON_BUY_GOODS,this.onBuy,this)
    },

    bind(goods){
        this.data = goods||this.data
        this.data.init() // 刷新下
        this.lbName.string = this.data.name
        this.lbDesc.string = this.data.desc
        this.lbState.string = this.data.state
        this.lbBtn.string = this.data.AS+" 魂魄"
        this.lbBought.active = false
        this.btn.active = true
    },

    onBuy(id){
        if (id != this.data.id) {
            return
        }
        console.log("xxxxj id" + id);
        
        this.bind()
    },

    click(){
        const self = this
        AudioMgr.playBtn();
        var result = this.data.buy()
        if (result) {
            console.log("购买成功")
        }
    },
});