

cc.Class({
    extends: cc.Component,

    properties: {
        sv : cc.ScrollView,
        itemPrefab: cc.Prefab,
        dialogPrefab : cc.Prefab,
        disbandDialogPrefab : cc.Prefab,
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

    // 进贡
    onClickDisband() {
        if (HeroDatas.myAncients.length==0) {
            return;
        }
        let dialog = cc.instantiate(this.disbandDialogPrefab);
        var soul = new BigNumber(0);
        HeroDatas.myAncients.forEach(e => {
            soul = soul.plus(Formulas.getAncientSoul(e.id,e.level));
        });
        for (let i = 0; i < HeroDatas.myAncients.length; i++) {
            soul = soul.plus(HeroDatas.buyAncientSouls[i][0]);
        }
        soul = soul.times(0.75).integerValue()
        dialog.getComponent("DisbandDialog").setCallback(function(result) {
            if (result) {
                HeroDatas.myAncients.forEach(e => {
                    e.level = 0;
                    e.refresh();
                });
                this.body.removeAllChildren();
                this.body.height = 0;
                DataCenter.addSoul(soul);
                HeroDatas.initAncient(false);
                GameData.refresh();
            }
        }.bind(this));
        dialog.parent = cc.director.getScene();
        dialog.x = cc.winSize.width / 2;
        dialog.y = cc.winSize.height / 2;
        dialog.getComponent("DisbandDialog").setDesc("确定要摧毁这些古神吗？你会由此获得"+Formulas.formatBigNumber(soul)+"英魂");
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
