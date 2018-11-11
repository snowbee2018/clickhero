
cc.Class({
    extends: cc.Component,

    properties: {
        lbName : cc.Label,
        lbDesc : cc.Label,
        sp : cc.Sprite,
        lbLv : cc.Label,
        lbSoul : cc.Label,
        btn : cc.Button,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        Events.on(Events.ON_SOUL_CHANGE,this.onSoulChange,this);
    },

    onDestroy(){
        Events.off(Events.ON_SOUL_CHANGE,this.onSoulChange,this);
    },

    onSoulChange(){
        let result = DataCenter.isSoulEnough(this.data.soul);
        this.btn.interactable = result;
    },

    bind(data){
        data = data?data:this.data;
        this.data = data;
        this.lbName.string = data.name;
        this.lbLv.string = "等级"+data.level;
        this.lbSoul.string = "soul"+data.soul;
        // 这个要根据不同的 id和等级 写描述
        this.lbDesc.string = data.level + "temp";
        this.onSoulChange();
    },

    onUpgradeClick(){
        let result = this.data.upgrade();
        if (result) {
            this.bind();
        }
    },
});
