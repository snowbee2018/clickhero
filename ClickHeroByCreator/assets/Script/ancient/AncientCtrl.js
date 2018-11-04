

cc.Class({
    extends: cc.Component,

    properties: {
        sv : cc.ScrollView,
        itemPrefab: cc.Prefab,
        dialogPrefab : cc.Prefab,
        body : cc.Node,
    },

    start () {

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
        console.log(ancient);
        console.log(HeroDatas.myAncients);
        console.log(HeroDatas.selAncients);
        console.log(HeroDatas.otherAncients);
        
        var listItemNode = cc.instantiate(this.itemPrefab);
        listItemNode.parent = this.body;
        // listItemNode.getComponent("AncientItem").setItem(id);
        // this._heroItemMap[id] = true;
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
