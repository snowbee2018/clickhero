
cc.Class({
    extends: cc.Component,

    properties: {
        lbName : cc.Label,
        lbDesc : cc.Label,
        sp : cc.Sprite,
        lbLv : cc.Label,
        lbSoul : cc.Label,
        btn : cc.Button,
        imgs : cc.SpriteAtlas,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        Events.on(Events.ON_SOUL_CHANGE,this.onSoulChange,this);
        Events.on(Events.ON_ANCIENT_LVUNIT_CHANGE, this.bind, this);
        Events.on(Events.ON_BUY_GOODS, this.onBuyGoods, this);
    },

    onBuyGoods(event){
        if (event == 11 && this.data.id == 2) { // 购买了自动点击
            this.bind()
        }else if (event == 12 && this.data.id == 7){
            this.bind()
        }else if (event == 13 && this.data.id == 19){
            this.bind()
        }else if (event == 8){
            this.bind()
        }else if (event == 7 && (this.data.id == 24||this.data.id == 17)){
            this.bind()
        }else if((event == 4 || event == 7) && this.data.id == 21){
            this.data.refresh()
            this.bind()
        }
    },

    onDestroy(){
        Events.off(Events.ON_SOUL_CHANGE,this.onSoulChange,this);
        Events.off(Events.ON_ANCIENT_LVUNIT_CHANGE, this.bind, this);
        Events.off(Events.ON_BUY_GOODS, this.onBuyGoods, this);
    },

    onSoulChange(){
        let result = DataCenter.isSoulEnough(this.data.getSoul());
        this.btn.interactable = result;
    },

    bind(data){
        console.log("bind ancient");
        
        data = data?data:this.data;
        console.log(data);
        this.data = data;
        this.sp.spriteFrame = this.imgs.getSpriteFrame("ancient_" + data.id)
        this.lbName.string = data.name;
        this.lbLv.string = "等级"+data.level;
        this.lbSoul.string = ""+Formulas.formatBigNumber(data.getSoul())
        // 这个要根据不同的 id和等级 写描述
        this.lbDesc.string = data.getDesc();
        this.onSoulChange();
    },

    onUpgradeClick(){
        let result = this.data.upgrade();
        if (result) {
            this.bind();
        }
        AudioMgr.playBtn();
    },
});
