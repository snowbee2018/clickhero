

cc.Class({
    extends: cc.Component,

    properties: {
        sv : cc.ScrollView,
        itemPrefab: cc.Prefab,
        lbAS : cc.Label,
        lbRebAs : cc.Label,
        lbTotalSoul : cc.Label,
        lbNextSoul : cc.Label,
    },

    onLoad(){
        console.log("ReviveCtrl:ctor");
        this.items = new Array();
        this.fullViews();
        Events.on(Events.ON_RESETGAME, this.resetGame, this)
        Events.on(Events.ON_SOUL_CHANGE, this.onSoulChange, this);
        Events.on(Events.ON_AS_CHANGE, this.onASChange, this);
        this.onSoulChange()
        this.onASChange()
    },

    onDestroy (){
        Events.off(Events.ON_RESETGAME, this.resetGame, this)
        Events.off(Events.ON_SOUL_CHANGE, this.onSoulChange, this);
        Events.off(Events.ON_AS_CHANGE, this.onASChange, this);
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

    clickRevive(){
        // DataCenter.addSoul(newBigNumber(1))
        const km = DataCenter.KeyMap
        let soul = DataCenter.getDataByKey(km.totalSoul)
        let AS = Formulas.calASBySoul(soul)
        let totalAS = DataCenter.getDataByKey(km.totalAS)
        PublicFunc.revive(AS - totalAS)
        this.totalSoul = null
    },

    onSoulChange(){
        const km = DataCenter.KeyMap
        let soul = DataCenter.getDataByKey(km.totalSoul)
        if (soul != this.totalSoul) {
            this.totalSoul = soul
            this.lbTotalSoul.string = "当前累计："+Formulas.formatBigNumber(soul) + "仙丹"
            let totalAS = DataCenter.getDataByKey(km.totalAS)
            let AS = Formulas.calASBySoul(soul)
            let nextSoul = Formulas.calSoulByAS(AS + 1)
            this.lbNextSoul.string = "下一魂魄：" + Formulas.formatBigNumber(nextSoul) + "仙丹"
            this.lbRebAs.string = "可获得魂魄：" + (AS - totalAS)
        }
    },

    onASChange(){
        let AS = DataCenter.getDataByKey(DataCenter.KeyMap.AS)
        this.lbAS.string = String(AS)
    },

    resetGame(){
        this.items.forEach(node => {
            node.removeFromParent()
        });
        this.fullViews()
    },
});