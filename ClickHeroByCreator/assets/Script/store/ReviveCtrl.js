

cc.Class({
    extends: cc.Component,

    properties: {
        sv : cc.ScrollView,
        itemPrefab: cc.Prefab,
        lbRuby : cc.Label,
    },

    onLoad(){
        console.log("ReviveCtrl:ctor");
        this.items = new Array();
        this.fullViews();
        Events.on(Events.ON_RESETGAME, this.resetGame, this)
        // Events.on(Events.ON_LEVEL_PASSED, this.onlvPassed, this);
    },

    onDestroy (){
        Events.off(Events.ON_RESETGAME, this.resetGame, this)
    },

    fullViews(){
        try {
            let list = GoodsDatas.ASDatas;
            list.forEach(e => {
                this.addItem(e);
            });
        } catch (error) {
            console.error(error);
        }
    },

    addItem(goods) {
        var node = cc.instantiate(this.itemPrefab);
        node.parent = this.sv.content;
        node.getComponent("ASGoodsItem").bind(goods);
        this.items.push(node)
    },

    resetGame(){
        this.items.forEach(node => {
            node.removeFromParent()
        });
        this.fullViews()
    },
});