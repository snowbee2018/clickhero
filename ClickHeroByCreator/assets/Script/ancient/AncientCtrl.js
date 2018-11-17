

cc.Class({
    extends: cc.Component,

    properties: {
        sv : cc.ScrollView,
        itemPrefab: cc.Prefab,
        dialogPrefab : cc.Prefab,
        body : cc.Node,
    },

    start () {
        Events.on(Events.ON_UPGRADE_ANCIENT,function(id) {
            console.log("ancient.id:" + id);
        },this);
    },

    onClickSummon () {
        // 显示出 ChooseAncientDialog
        let dialog = cc.instantiate(this.dialogPrefab);
        dialog.getComponent("ChooseAncientDialog").setCallback(this.addItem.bind(this));
        dialog.parent = cc.director.getScene();
        dialog.x = cc.winSize.width / 2;
        dialog.y = cc.winSize.height / 2;
    },

    onClickDisband() {
        // 进贡
    },

    addItem(ancient) {
        var node = cc.instantiate(this.itemPrefab);
        node.parent = this.body;
        node.getComponent("AncientItem").bind(ancient);
    },

    onHeroActive (heroID) {
        if (heroID != 0) {
            var hero = HeroDatas.getHero(heroID);
            if (hero.isActive) {
                if (!this._heroItemMap[heroID]) {
                    this.addItem(heroID);
                }
            }
        }
        
        
    },
    // update (dt) {},
});
