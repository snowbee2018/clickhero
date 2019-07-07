

cc.Class({
    extends: cc.Component,

    properties: {
        sv : cc.ScrollView,
        itemPrefab: cc.Prefab,
        dialogPrefab : cc.Prefab,
        disbandDialogPrefab : cc.Prefab,
        body : cc.Node,
        btnAll : cc.Node,
    },

    start () {
        Events.on(Events.ON_UPGRADE_ANCIENT,function(id) {
            console.log("ancient.id:" + id);
        },this);
        Events.on(Events.ON_IDLE_STATE,this.onIdleState,this);
        Events.on(Events.ON_SOUL_CHANGE,this.showBtns,this);
        this.fullViews();
    },

    onDestroy(){
        Events.off(Events.ON_IDLE_STATE,this.onIdleState,this);
        Events.off(Events.ON_SOUL_CHANGE,this.showBtns,this);
    },

    fullViews(){
        let list = HeroDatas.myAncients;
        list.forEach(e => {
            this.addItem(e);
        });
        this.showBtns()
    },

    showBtns(){
        // 召唤所有
        if (HeroDatas.selAncients.length == 0) {
            this.btnAll.parent.active = false
            console.log("showBtns 1");
            return
        }
        console.log("showBtns 2");
        this.btnAll.parent.active = true
        let tsoul = DataCenter.getDataByKey(DataCenter.KeyMap.totalSoul)
        let soul = DataCenter.getDataByKey(DataCenter.KeyMap.curSoul)
        if (tsoul.gt(150000)) {
            console.log("showBtns 3");
            this.btnAll.active = true
            this.btnAll.parent.x = -110
            let hasCount = HeroDatas.myAncients.length
            let summonSoul = 0
            for (let i = hasCount; i < HeroDatas.buyAncientSouls.length; i++) {
                summonSoul += HeroDatas.buyAncientSouls[i][0]
            }
            this.btnAll.interactable = soul.gte(summonSoul)
        }
    },

    onClickAll () {
        let hasCount = HeroDatas.myAncients.length
        let summonSoul = 0
        let moreCount = HeroDatas.otherAncients.length+HeroDatas.selAncients.length
        for (let i = hasCount; i < hasCount + moreCount; i++) {
            console.log(i);
            
            summonSoul += HeroDatas.buyAncientSouls[i][0]
        }
        let soul = DataCenter.getDataByKey(DataCenter.KeyMap.curSoul)
        if (soul.gte(summonSoul)) {
            const self = this
            PublicFunc.popDialog({
                contentStr: "共花费"+summonSoul+"仙丹召唤剩余的"
                    +moreCount+"个神器，你确定吗？",
                btnStrs: {
                    left: '是 的',
                    right: '不，谢谢'
                },
                onTap: function (dialog, bSure) {
                    if (bSure&&summonSoul) {
                        self.summonAll(summonSoul)
                    }
                }
            });
        }
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
            if (e.level > 1) {
                soul = soul.plus(Formulas.getAncientSoul(e.id,e.level));
            }
        });
        for (let i = 0; i < HeroDatas.myAncients.length; i++) {
            soul = soul.plus(HeroDatas.buyAncientSouls[i][0]);
        }
        soul = soul.times(0.75*GameData.gdAncientSale).integerValue(3)
        dialog.getComponent("Dialog").setCallback(function(result) {
            if (result) {
                HeroDatas.myAncients.forEach(e => {
                    e.level = 0;
                    e.refresh();
                });
                this.body.removeAllChildren();
                this.body.height = 0;
                HeroDatas.initAncient(false);
                DataCenter.addSoul(soul);
                // GameData.refresh();
            }
        }.bind(this));
        dialog.parent = cc.director.getScene();
        dialog.x = cc.winSize.width / 2;
        dialog.y = cc.winSize.height / 2;
        dialog.getComponent("Dialog").setBtnText({left: '是 的',right: '不，谢谢'})                      
        dialog.getComponent("Dialog").setDesc("确定要摧毁这些古神吗？你会由此获得"+Formulas.formatBigNumber(soul)+"仙丹");
    },

    summonAll(summonSoul){
        console.log("summonAll" + summonSoul);
        for (let i = 0; i < HeroDatas.selAncients.length; i++) {
            let item = HeroDatas.selAncients.splice(0,1)[0];
            i--
            HeroDatas.myAncients.push(item)
            this.addItem(item)
        }
        for (let i = 0; i < HeroDatas.otherAncients.length; i++) {
            let item = HeroDatas.otherAncients.splice(0,1)[0];
            i--
            HeroDatas.myAncients.push(item)
            this.addItem(item)
        }
        DataCenter.consumeSoul(new BigNumber(summonSoul))
    },

    addItem(ancient) {
        if (ancient) {
            var node = cc.instantiate(this.itemPrefab);
            node.parent = this.body;
            node.getComponent("AncientItem").bind(ancient);
        }
    },

    onIdleState(isIdle){
        console.log("isIdle:" + String(isIdle));
        GameData.playerStatus = isIdle?1:0;
        GameData.refresh();
        // 更新主面板
    },

    resetGame () {
        HeroDatas.myAncients.forEach(e => {
            e.level = 0;
            e.refresh()
        });
        this.body.removeAllChildren()
        this.body.height = 0
        HeroDatas.initAncient(false)
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