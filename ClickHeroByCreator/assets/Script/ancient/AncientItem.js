
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
    },

    onDestroy(){
        Events.off(Events.ON_SOUL_CHANGE,this.onSoulChange,this);
        Events.off(Events.ON_ANCIENT_LVUNIT_CHANGE, this.bind, this);
    },

    onSoulChange(){
        let result = DataCenter.isSoulEnough(this.data.getSoul());
        this.btn.interactable = result;
    },

    bind(data){
        data = data?data:this.data;
        this.data = data;
        this.sp.spriteFrame = this.imgs.getSpriteFrame("ancient_" + data.id)
        this.lbName.string = data.name;
        this.lbLv.string = "等级"+data.level;
        this.lbSoul.string = "soul"+Formulas.formatBigNumber(data.getSoul())
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
