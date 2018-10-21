
var ClickEnable = true;
var ClickDt = 0;
cc.Class({
    extends: cc.Component,

    properties: {
        // openDataNode : cc.Node,

        headSprite : cc.Sprite,
        location : cc.Label,
        nickaName : cc.Label,
        gender : cc.Label,

        totalCostLab: cc.Label,
        lvLab: cc.Label,
        hpLab: cc.Label,
        costLab: cc.Label,

        pageNode: cc.Node,
    },
    
    // use this for initialization
    onLoad: function () {
        const self = this;
        // self.openDataNode.active = true;
        // self.openDataNode.x = 0;
        // self.openDataNode.y = 1000;
        // self.wXSubContextView = self.openDataNode.getComponent("WXSubContextView");
        // self._show = cc.moveTo(0.2, 0, 0);
        // self._hide = cc.moveTo(0.2, 0, 1000);

        self.monsterController = self.getComponent("MonsterController");
        self.heroListControl = self.getComponent("HeroListControl");
        self.userSkillController = self.getComponent("UserSkillController");
        // self.clickDamage = new BigNumber(1);
    },

    // called every frame
    update (dt) {
        const self = this;
        // console.log("dt = " + dt);
        self.applyDPS(dt);
        if (ClickEnable == false) {
            ClickDt += dt;
            if (ClickDt >= 0.05) {
                ClickDt = 0;
                ClickEnable = true;
            }
        }
    },

    start () {
        const self = this;
        
    },

    onEnable() {
        const self = this;
        
    },

    onDisable() {
        const self = this;
        Events.off(Events.ON_GOLD_CHANGE, self.onGoldChange, self);
    },

    onGameStart () {
        const self = this;
        // console.log(HeroDatas);
        
        DataCenter.init();
        HeroDatas.init();
        
        GameData.refresh();
        self.heroListControl.setHeroList();
        self.monsterController.init();
        self.userSkillController.initUserSkills();

        self.node.on(cc.Node.EventType.TOUCH_START, self.onTouchStart.bind(self));
        self._totalClickCount = new BigNumber(0);
        
        Events.on(Events.ON_GOLD_CHANGE, self.onGoldChange, self);
        
        self.totalCostLab.string = DataCenter.getGoldStr();
    },

    formatLocalGameData () {
        const self = this;
        var map = DataCenter.KeyMap;
        var monsterInfo = self.monsterController.getCurMonsterInfo();
        var curGold = self.getDataByKey(map.curGold);

        var obj = {}
        obj[map.lastTime] = Date.now().toString();
        obj[map.monsterInfo] = self.monsterController.formatMonsterInfo();
        // obj[map.curDiamond] = 
        obj[map.curGold] = curGold.toExponential(4);
        // obj[map.curSoul] = 
        // obj[map.additionalSoul] = 
        obj[map.heroList] = HeroDatas.formatHeroList();
        // obj[map.skillList] = 
        // obj[map.achievementList] = 
        // obj[map.equipmentList] = 
        // obj[map.shopList] = 
        // obj[map.lansquenetList] = 
        // obj[map.curSetting] = 
        WeChatUtil.setLocalStorage(JSON.stringify(obj));
    },

    onGoldChange () {
        const self = this;
        self.totalCostLab.string = DataCenter.getGoldStr();
    },

    updataMonsterInfoDisplay () {
        const self = this;
        let info = self.monsterController.getCurMonsterInfo();
        self.lvLab.string = info.lv;
        
        self.hpLab.string = Formulas.formatBigNumber(info.hp);
        self.costLab.string = Formulas.formatBigNumber(info.gold);
    },

    onTouchStart (event) {
        const self = this;
        if (ClickEnable == true) {
            let pos = event.getLocation();
            self.clickHit();
            ClickEnable = false;
        }
        
    },

    clickHit () {
        const self = this;
        self._totalClickCount = self._totalClickCount.plus(1);
        // console.log("hit : count = " + self._totalClickCount.toExponential(3));
        
        self.monsterController.hit(GameData.clickDamage, false);
    },

    applyDPS(dt) {
        const self = this;
        self.monsterController.hit(GameData.dpsDamage.times(dt), true);
    },

    onMonsterGold (gold) {
        const self = this;
        DataCenter.addGold(gold.times(GameData.globalGoldTimes));
    },

    setWeChatUser () {
        const self = this;
        let DataMap = DataCenter.DataMap;
        let weChatUserInfo = DataCenter.getDataByKey(DataMap.WXUserInfo);
        console.log("weChatUserInfo.avatarUrl = " + weChatUserInfo.avatarUrl);
        
        cc.loader.load({ url: weChatUserInfo.avatarUrl, type: "png"}, function (err, texture) {
            if (texture) {
                // 不知道为什么远程图片显示不出来，以后来看一下
                self.headSprite.spriteFrame = new cc.SpriteFrame(texture);
            }
        });
        let str = weChatUserInfo.country;
        str += " " + weChatUserInfo.province;
        str += " " + weChatUserInfo.city;
        self.location.string = str;
        switch (weChatUserInfo.gender) {
            case 1: self.gender.string = "男"; break;
            case 2: self.gender.string = "女"; break;
            default: self.gender.string = "未知"; break;
        }
        self.nickaName.string = weChatUserInfo.nickName;
    },

    showOpenDataView () {
        const self = this;
        self._isShow = !self._isShow;
        // self.openDataNode.stopAllActions();
        // if (self._isShow) {
        //     self.openDataNode.runAction(self._show);
        // } else {
        //     self.openDataNode.runAction(self._hide);
        // }
    },

    onHeroBtnClick () {
        const self = this;
        var pageView = self.pageNode.getComponent(cc.PageView);
        if (self.pageNode.active) {
            var curPageIndex = pageView.getCurrentPageIndex();
            if (curPageIndex == 0) { // 当前正在英雄列表界面
                self.pageNode.active = false;
            } else {
                pageView.scrollToPage(0);
            }
        } else {
            self.pageNode.active = true;
            pageView.scrollToPage(0);
        }
    },

    onUserSkillBtnClick () {
        const self = this;
        var pageView = self.pageNode.getComponent(cc.PageView);
        if (self.pageNode.active) {
            var curPageIndex = pageView.getCurrentPageIndex();
            if (curPageIndex == 1) { // 当前正在技能列表界面
                self.pageNode.active = false;
            } else {
                pageView.scrollToPage(1);
            }
        } else {
            self.pageNode.active = true;
            pageView.scrollToPage(1);
        }
    },

    onLeftBtnClick () {
        const self = this;
        // WeChatUtil.authorize(WeChatUtil.scope.userLocation, function (result) {
        //     console.log("FFFFFFF, result = " + result);
            
        // });
        self.showOpenDataView();
        WeChatUtil.showModal({
            title: "分享给好友",
            content: "点一下，玩一年，把快乐分享给好友吧",
            callBack: function (res) {
                console.log("模态对话框用户操作返回");
                console.log(res);
                if (res.confirm) {
                    console.log("点击了确定");
                    WeChatUtil.shareAppMessage();
                    self.showOpenDataView();
                } else if (res.cancel) {
                    console.log("点击了取消");
                    self.showOpenDataView();
                    WeChatUtil.showToast("取消了分享");
                }
            }
        });
        WeChatUtil.postMsgToOpenDataView("你好，开放数据域。这是来自主域的问候！");
    },

    onRightBtnClick () {
        const self = this;
        // WeChatUtil.postMsgToOpenDataView("你好，开放数据域。这是来自主域的问候！");
        // let obj = {
        //     helloMsg: "你好，开放数据域。这是主域托管的数据！"
        // }
        // WeChatUtil.setCloudStorage("test_cloud_storage", obj);

        // obj.helloMsg = "你好，微信小游戏。这是保存到微信小游戏文件系统的数据！";
        // WeChatUtil.setLocalStorage(JSON.stringify(obj));
        // WeChatUtil.getLocalStorage(function (bSuccess, jsonStr) {
        //     if (bSuccess) {
        //         console.log("jsonStr = " + jsonStr);
        //         WeChatUtil.showModal({
        //             title: "测试模态对话框",
        //             content: "本地数据获取成功：" + jsonStr,
        //             callBack: function (res) {
        //                 console.log("模态对话框用户操作返回");
        //                 console.log(res);
        //                 if (res.confirm) {
        //                     console.log("点击了确定");
        //                     WeChatUtil.showToast("点击了确定");
        //                 } else if (res.cancel) {
        //                     console.log("点击了取消");
        //                     WeChatUtil.showToast("点击了取消");
        //                 }
        //             }
        //         });
        //     }
        // });

        WeChatUtil.showModal({
            title: "温馨提示",
            content: "点击确定将增加100点击伤害",
            callBack: function (res) {
                console.log("模态对话框用户操作返回");
                console.log(res);
                if (res.confirm) {
                    console.log("点击了确定");
                    WeChatUtil.showToast("点击伤害+100");
                    self.clickDamage = self.clickDamage.plus(100);
                } else if (res.cancel) {
                    console.log("点击了取消");
                    // WeChatUtil.showToast("点击了取消");
                }
            }
        });

        
    },
});
