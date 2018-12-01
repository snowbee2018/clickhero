

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

//next
// 连击哥相关
// 单位升级古神
// 古神说明

/////////////////////
// 钻石的获得：
// 1.每天首次登陆获得50钻（看广告奖励翻倍）
// 2.每次转发获得25钻
// 3.每成功邀请一个好友得50钻
// 4.每成功邀请好友人数达到5的倍数，另外给钻石 100，200，400，800，1500，后面没邀请五个给1500
// 5.每次看广告得到随机20-30钻（前期没有广告）

// 钻石消耗：
// 1.金币永久翻倍500钻
// 2.伤害永久翻倍700钻
// 3.+1自动轻击（+10次点击/秒，消耗为500*（n+1））
// 4.加一点金身消耗30钻
// 5.快速转身（不重置关卡，但是获得括号内的英魂），消耗300钻
// 6.200钻相当于一点超越之力，具体消耗参考超越系统
// 7.30钻，60秒10倍伤害