

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
        Events.on(Events.ON_IDLE_STATE,this.onIdleState,this);
        this.fullViews();
    },

    fullViews(){
        let list = HeroDatas.myAncients;
        list.forEach(e => {
            this.addItem(e);
        });
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
        // 遍历 调 Formulas.getAncientSoul 获得soul总和
        // for  += buyAncientSouls[i][1]
        // 乘以0.75 加到 我的soul里
        // reInit HeroDatas ancients
        // roll selAncients

        var soul = new BigNumber();
        HeroDatas.myAncients.forEach(e => {
            soul = soul.plus(Formulas.getAncientSoul(e.id,e.level));
        });
        for (let i = 0; i < HeroDatas.myAncients.length; i++) {
            soul = soul.plus(HeroDatas.buyAncientSouls[i][1]);
        }
    },

    addItem(ancient) {
        var node = cc.instantiate(this.itemPrefab);
        node.parent = this.body;
        node.getComponent("AncientItem").bind(ancient);
    },

    onIdleState(isIdle){
        console.log("isIdle:" + String(isIdle));
        GameData.playerStatus = isIdle?1:0;
        GameData.refresh();
        // 更新主面板
    },
});
