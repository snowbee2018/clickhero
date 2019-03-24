
var ClickEnable = true;
var ClickDt = 0;
cc.Class({
    extends: cc.Component,

    properties: {
        // openDataNode : cc.Node,

        headSprite : cc.Sprite,

        totalCostLab: cc.Label,
        totalSoulLab: cc.Label,
        clickDamageLab: cc.Label,
        dpsDamageLab: cc.Label,
        comboTypeLab: cc.Label,
        comboCount: cc.Label,

        pageNode: cc.Node,

        upgrageSelectBtn: cc.Node,
        upgrageSelectBtnLab: cc.Label,
        dialogPrefab : cc.Prefab,
        SigninDialog : cc.Prefab,
        ShareDialog : cc.Prefab,
    },
    
    // use this for initialization
    onLoad: function () {
        const self = this;
        self.damageArr = [];

        self.monsterController = self.getComponent("MonsterController");
        self.heroListControl = self.getComponent("HeroListControl");
        self.userSkillController = self.getComponent("UserSkillController");

        self.setPageNodeActive(false);

        WeChatUtil.setCloudDataFormat(self.formatCloudGameData.bind(self));
    },

    setPageNodeActive (bActive) {
        const self = this;
        self.pageNode.active = bActive;
        if (bActive) {
            self.monsterController.moveUp();
        } else {
            self.monsterController.moveDown();
        }
    },

    // called every frame
    lateUpdate (dt) {
        const self = this;
        if (self.isGameStart == true) {
            var totalDamage = new BigNumber(0);
            if (self.damageArr && self.damageArr.length > 0) {
                for (let i = 0; i < self.damageArr.length; i++) {
                    totalDamage = totalDamage.plus(self.damageArr[i]);
                }
                self.damageArr = [];
            }
            totalDamage = totalDamage.plus(GameData.dpsDamage.times(dt));
            if (!totalDamage.isZero()) {
                self.monsterController.bleed(totalDamage);
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
        Events.off(Events.ON_SOUL_CHANGE, self.onSoulChange, self);
        Events.off(Events.ON_CLICK_DAMAGE_CHANGE, self.onClickDamageChange, self);
        Events.off(Events.ON_DPS_DAMAGE_CHANGE, self.onDPSChange, self);
    },

    onGameStart () {
        const self = this;
        console.log("onGameStart");
        try {
            var lv = DataCenter.getCloudDataByKey(DataCenter.KeyMap.maxPassLavel);
            if (lv >= 300) {
                BigNumber.config({
                    DECIMAL_PLACES: 4,
                    POW_PRECISION: 4,
                });
            } else {
                BigNumber.config({
                    DECIMAL_PLACES: 5,
                    POW_PRECISION: 5,
                });
            }
            self.isIdle = true; // 是否为闲置状态
            self.combo = 0; // 当前连击数
            DataCenter.init();
            HeroDatas.init();
            GoodsDatas.init();
            self.getComponent("AutoClick").init();
            self.heroListControl.setHeroList();
            self.monsterController.init();
            GameData.refresh();
            self.userSkillController.initUserSkills();
            self.node.on(cc.Node.EventType.TOUCH_START, self.onTouchStart.bind(self));
            self._totalClickCount = new BigNumber(0);
            Events.on(Events.ON_GOLD_CHANGE, self.onGoldChange, self);
            Events.on(Events.ON_SOUL_CHANGE, self.onSoulChange, self);
            Events.on(Events.ON_CLICK_DAMAGE_CHANGE, self.onClickDamageChange, self);
            Events.on(Events.ON_DPS_DAMAGE_CHANGE, self.onDPSChange, self);
            Events.on(Events.ON_IDLE_STATE, self.onIdleState, self);
            Events.on(Events.ON_COMBO_CHANGE, self.onComboChange, self);

            self.totalCostLab.string = DataCenter.getGoldStr();
            self.totalSoulLab.string = DataCenter.getSoulStr();
            self.clickDamageLab.string = Formulas.formatBigNumber(GameData.clickDamage);
            self.dpsDamageLab.string = Formulas.formatBigNumber(GameData.dpsDamage);


            self.upgrageSelectBtnLab.string = "×" + GameData.heroLvUnit;


            self.scheduleOnce(self.handleIdle, 60);
            Events.emit(Events.ON_GAME_START);
            self.isGameStart = true;

            self.pageNode.getComponent("HideOtherPage").handler();

            
        } catch (error) {
            console.error(error)
        }
        

    },

    formatCloudGameData() { // 格式化存档数据，用于存储到云端和从云端恢复数据
        const self = this;
        var map = DataCenter.KeyMap;
        // 获取存档数据，并存储到云端
        var curGold = DataCenter.getDataByKey(map.curGold);
        var historyTotalGold = DataCenter.getDataByKey(map.historyTotalGold);
        var curSoul = DataCenter.getDataByKey(map.curSoul);
        var rebirthSoul = DataCenter.getDataByKey(map.rebirthSoul);
        var obj = {}
        // 所有的bignumber都务必要 num.curGold.toExponential(4) 再存起来
        obj[map.bAutoClickOpen] = self.getComponent("AutoClick").bAutoClickOpen; // 商店购买的自动点击是否开启
        obj[map.lastTime] = Date.now().toString(); // 上次存档的时间
        obj[map.maxCombo] = DataCenter.getDataByKey(map.maxCombo); // 历史最大连击数
        obj[map.totalClick] = DataCenter.getDataByKey(map.totalClick); // 历史总点击数
        obj[map.monsterInfo] = self.monsterController.formatMonsterInfo(); // 怪物模块需要存档的数据
        obj[map.passLavel] = DataCenter.getDataByKey(map.passLavel); // 当前世界已通过的最高关卡
        obj[map.maxPassLavel] = DataCenter.getDataByKey(map.maxPassLavel); // 历史最高通过关卡
        // obj[map.curDiamond] = 
        obj[map.curGold] = curGold.toExponential(4); // 当前金币总数
        obj[map.historyTotalGold] = historyTotalGold.toExponential(4); // 历史获得的所有金币
        obj[map.curSoul] = curSoul.toExponential(4); // 当前可用英魂总数
        obj[map.ruby] = DataCenter.getDataByKey(map.ruby);
        obj[map.rebirthSoul] = rebirthSoul.toExponential(4); // 转生英魂
        obj[map.rebirthCount] = DataCenter.getDataByKey(map.rebirthCount); // 已转生次数
        // obj[map.additionalSoul] = 
        obj[map.heroList] = HeroDatas.formatHeroList(); // 用户所有英雄的状态
        obj[map.ancientList] = HeroDatas.formatAncientList(); // 用户所拥有的古神
        obj[map.goodsList] = GoodsDatas.buyCounts; // 用户所拥有的商品
        // obj[map.skillList] = 
        obj[map.skillList] = self.userSkillController.formatUserSkillsInfo(); // 所有主动技能的状态
        // obj[map.achievementList] = 
        // obj[map.equipmentList] = 
        // obj[map.shopList] = 
        // obj[map.lansquenetList] = 
        // obj[map.curSetting] = 
        obj[map.signinData] = DataCenter.getDataByKey(map.signinData); // 签到数据
        obj[map.shareReceiveData] = DataCenter.getDataByKey(map.shareReceiveData); // 分享任务 领取信息
        console.log("obj[map.shareReceiveData]:" + obj[map.shareReceiveData]);
        
        console.log(obj);
        
        return obj;
    },

    onGoldChange () {
        const self = this;
        self.totalCostLab.string = DataCenter.getGoldStr();
    },

    onSoulChange(){
        const self = this;
        var str = DataCenter.getSoulStr();
        var rebirthSoul = DataCenter.getDataByKey(DataCenter.KeyMap.rebirthSoul);
        if (rebirthSoul && !rebirthSoul.isZero()) {
            str += "(" + Formulas.formatBigNumber(rebirthSoul) + ")";
        }
        self.totalSoulLab.string = str;
    },

    onClickDamageChange () {
        const self = this;
        self.clickDamageLab.string = Formulas.formatBigNumber(GameData.clickDamage);
    },

    onDPSChange () {
        const self = this;
        self.dpsDamageLab.string = Formulas.formatBigNumber(GameData.dpsDamage);
    },

    onIdleState (event) {
        const self = this;
        var isIdle = !!event;
        self.comboCount.node.active = !isIdle;
        self.comboTypeLab.string = isIdle ? "(闲置)" : "(combo)";
        if (!isIdle) {
            self.comboCount.string = self.combo;
        }
    },

    onComboChange (event) {
        const self = this;
        self.comboCount.string = self.combo;
    },

    updataMonsterInfoDisplay () {
        // const self = this;
        // let info = self.monsterController.getCurMonsterInfo();
        // self.lvLab.string = info.lv;
        
        // self.hpLab.string = Formulas.formatBigNumber(info.hp);
        // self.costLab.string = Formulas.formatBigNumber(info.gold);
    },

    onTouchStart (event) {
        const self = this;
        // if (ClickEnable == true) {
        //     // let pos = event.getLocation();
        //     ClickEnable = false;
        // }
        self.clickHit();
        var map = DataCenter.KeyMap;
        DataCenter.setDataByKey(map.totalClick, DataCenter.getDataByKey(map.totalClick) + 1);
    },

    clickHit () {
        const self = this;
        self._totalClickCount = self._totalClickCount.plus(1);
        // console.log("hit : count = " + self._totalClickCount.toExponential(3));
        var bCrit = Formulas.isHitRandom(GameData.critOdds * 100); // 是否是暴击
        if (bCrit) {
            self.monsterController.hit(GameData.clickDamage.times(GameData.critTimes), false, true);
            self.damageArr.push(GameData.clickDamage.times(GameData.critTimes));
        } else {
            self.monsterController.hit(GameData.clickDamage, false, false);
            self.damageArr.push(GameData.clickDamage);
        }

        self.combo++;
        Events.emit(Events.ON_COMBO_CHANGE, self.combo);
        if (self.combo > DataCenter.getDataByKey(DataCenter.KeyMap.maxCombo)) {
            DataCenter.setDataByKey(DataCenter.KeyMap.maxCombo, self.combo);
        }
        
        if (self.isIdle === true) {
            self.isIdle = false;
            // 转为非闲置状态
            console.log("转为非闲置状态");
            Events.emit(Events.ON_IDLE_STATE, self.isIdle);
        }
        self.unschedule(self.handleIdle);
        self.scheduleOnce(self.handleIdle, 60);
    },

    handleIdle () {
        const self = this;
        self.isIdle = true;
        // 转为闲置状态
        console.log("转为闲置状态");
        self.combo = 0;
        Events.emit(Events.ON_IDLE_STATE, self.isIdle);
        Events.emit(Events.ON_COMBO_CHANGE, self.combo);
    },

    onShareBtnClick () {
        const self = this;
        WeChatUtil.shareAppMessage();
        Events.emit(Events.ON_SHARE_CLICK);
        this.showShareDialog()
        // WeChatUtil.showModal({
        //     title: "分享给好友",
        //     content: "点一下，玩一年，把快乐分享给好友吧",
        //     callBack: function (res) {
        //         console.log("模态对话框用户操作返回");
        //         console.log(res);
        //         if (res.confirm) {
        //             console.log("点击了确定");
        //             WeChatUtil.shareAppMessage();
        //             // self.showOpenDataView();
        //         } else if (res.cancel) {
        //             console.log("点击了取消");
        //             // self.showOpenDataView();
        //             WeChatUtil.showToast("取消了分享");
        //         }
        //     }
        // });
    },

    onMonsterGold (gold) {
        const self = this;
        var realGold = gold.times(GameData.globalGoldTimes);
        DataCenter.addGold(realGold);
        self.monsterController.playGoldAnim(Formulas.formatBigNumber(realGold));
    },

    onMonsterSoul (soul) {
        self = this;
        // DataCenter.addSoul(soul);
        DataCenter.addRebirthSoul(soul);
    },

    setWeChatUser () {
        const self = this;
        var DataMap = DataCenter.DataMap;
        var weChatUserInfo = DataCenter.getDataByKey(DataMap.WXUserInfo);
        console.log("weChatUserInfo.avatarUrl = " + weChatUserInfo.avatarUrl);
        
        cc.loader.load({ url: weChatUserInfo.avatarUrl, type: "png"}, function (err, texture) {
            if (!err && texture) {
                self.headSprite.spriteFrame = new cc.SpriteFrame(texture);
            }
        });
        // var str = weChatUserInfo.country;
        // str += " " + weChatUserInfo.province;
        // str += " " + weChatUserInfo.city;
        // self.location.string = str;
        // switch (weChatUserInfo.gender) {
        //     case 1: self.gender.string = "男"; break;
        //     case 2: self.gender.string = "女"; break;
        //     default: self.gender.string = "未知"; break;
        // }
        // self.nickaName.string = weChatUserInfo.nickName;
    },

    // showOpenDataView () {
    //     const self = this;
    //     self._isShow = !self._isShow;
    //     // self.openDataNode.stopAllActions();
    //     // if (self._isShow) {
    //     //     self.openDataNode.runAction(self._show);
    //     // } else {
    //     //     self.openDataNode.runAction(self._hide);
    //     // }
    // },

    onHeroBtnClick () {
        const self = this;
        var pageView = self.pageNode.getComponent(cc.PageView);
        if (self.pageNode.active) {
            var curPageIndex = pageView.getCurrentPageIndex();
            if (curPageIndex == 0) { // 当前正在英雄列表界面
                self.setPageNodeActive(false);
            } else {
                pageView.scrollToPage(0);
            }
        } else {
            self.setPageNodeActive(true);
            pageView.scrollToPage(0);
        }
        self.upgrageSelectBtn.active = true;
        self.upgrageSelectBtnLab.string = "×" + GameData.heroLvUnit;
    },

    onUserSkillBtnClick () {
        const self = this;
        var pageView = self.pageNode.getComponent(cc.PageView);
        if (self.pageNode.active) {
            var curPageIndex = pageView.getCurrentPageIndex();
            if (curPageIndex == 1) { // 当前正在技能列表界面
                self.setPageNodeActive(false);
            } else {
                pageView.scrollToPage(1);
            }
        } else {
            self.setPageNodeActive(true);
            pageView.scrollToPage(1);
        }
        self.upgrageSelectBtn.active = false;
    },

    onAncientBtnClick() {
        const self = this;
        var pageView = self.pageNode.getComponent(cc.PageView);
        if (self.pageNode.active) {
            var curPageIndex = pageView.getCurrentPageIndex();
            if (curPageIndex == 2) { // 当前正在古神列表界面
                self.setPageNodeActive(false);
            } else {
                pageView.scrollToPage(2);
            }
        } else {
            self.setPageNodeActive(true);
            pageView.scrollToPage(2);
        }
        self.upgrageSelectBtn.active = true;
        self.upgrageSelectBtnLab.string = "×" + GameData.ancientLvUnit;
    },

    onStoreBtnClick() {
        const self = this;
        var pageView = self.pageNode.getComponent(cc.PageView);
        if (self.pageNode.active) {
            var curPageIndex = pageView.getCurrentPageIndex();
            if (curPageIndex == 3) { // 当前正在技能列表界面
                self.setPageNodeActive(false);
            } else {
                pageView.scrollToPage(3);
            }
        } else {
            self.setPageNodeActive(true);
            pageView.scrollToPage(3);
        }
        self.upgrageSelectBtn.active = false;
    },

    onTaskBtnClick() {
        const self = this;
        var pageView = self.pageNode.getComponent(cc.PageView);
        if (self.pageNode.active) {
            var curPageIndex = pageView.getCurrentPageIndex();
            if (curPageIndex == 4) { // 当前正在任务列表界面
                self.setPageNodeActive(false);
            } else {
                pageView.scrollToPage(4);
            }
        } else {
            self.setPageNodeActive(true);
            pageView.scrollToPage(4);
        }
        self.upgrageSelectBtn.active = false;
    },

    onUpgradeSelectClick() { // 1 10 25 100 1000 10000
        const self = this;
        var pageView = self.pageNode.getComponent(cc.PageView);
        if (self.pageNode.active) {
            var curPageIndex = pageView.getCurrentPageIndex();
            if (curPageIndex == 0) {
                var unit = GameData.heroLvUnit;
                switch (GameData.heroLvUnit) {
                    case 1:
                        unit = 10;
                        break;
                    case 10:
                        unit = 25;
                        break;
                    case 25:
                        unit = 100;
                        break;
                    case 100:
                        unit = 1000;
                        break;
                    case 1000:
                        unit = 10000;
                        break;
                    case 10000:
                        unit = 1;
                        break;
                    default:
                        break;
                }
                HeroDatas.setHeroLvUnit(unit);
                self.upgrageSelectBtnLab.string = "×" + GameData.heroLvUnit;
                Events.emit(Events.ON_HEROLVUNIT_CHANGE);
            } else if(curPageIndex == 2){
                var unit = GameData.ancientLvUnit;
                switch (GameData.ancientLvUnit) {
                    case 1:
                        unit = 10;
                        break;
                    case 10:
                        unit = 25;
                        break;
                    case 25:
                        unit = 100;
                        break;
                    case 100:
                        unit = 1000;
                        break;
                    case 1000:
                        unit = 10000;
                        break;
                    case 10000:
                        unit = 1;
                        break;
                    default:
                        break;
                }
                HeroDatas.setAncientLvUnit(unit);//
                self.upgrageSelectBtnLab.string = "×" + GameData.ancientLvUnit;
                Events.emit(Events.ON_ANCIENT_LVUNIT_CHANGE);//
            }
        }
    },

    showSigninDialog(){
        let dialog = cc.instantiate(this.SigninDialog)
        dialog.parent = cc.director.getScene();
        dialog.x = cc.winSize.width / 2;
        dialog.y = cc.winSize.height / 2;
    },

    showShareDialog () {
        console.log("showShareDialog");
        let dialog = cc.instantiate(this.ShareDialog)
        dialog.parent = cc.director.getScene();
        dialog.x = cc.winSize.width / 2;
        dialog.y = cc.winSize.height / 2;
    },

    // onLeftBtnClick () {
    //     const self = this;
    //     // WeChatUtil.authorize(WeChatUtil.scope.userLocation, function (result) {
    //     //     console.log("FFFFFFF, result = " + result);
            
    //     // });
    //     self.showOpenDataView();
    //     WeChatUtil.showModal({
    //         title: "分享给好友",
    //         content: "点一下，玩一年，把快乐分享给好友吧",
    //         callBack: function (res) {
    //             console.log("模态对话框用户操作返回");
    //             console.log(res);
    //             if (res.confirm) {
    //                 console.log("点击了确定");
    //                 WeChatUtil.shareAppMessage();
    //                 self.showOpenDataView();
    //             } else if (res.cancel) {
    //                 console.log("点击了取消");
    //                 self.showOpenDataView();
    //                 WeChatUtil.showToast("取消了分享");
    //             }
    //         }
    //     });
    //     WeChatUtil.postMsgToOpenDataView("你好，开放数据域。这是来自主域的问候！");
    // },

    // onRightBtnClick () {
    //     const self = this;
    //     // WeChatUtil.postMsgToOpenDataView("你好，开放数据域。这是来自主域的问候！");
    //     // let obj = {
    //     //     helloMsg: "你好，开放数据域。这是主域托管的数据！"
    //     // }
    //     // WeChatUtil.setCloudStorage("test_cloud_storage", obj);

    //     // obj.helloMsg = "你好，微信小游戏。这是保存到微信小游戏文件系统的数据！";
    //     // WeChatUtil.setLocalStorage(JSON.stringify(obj));
    //     // WeChatUtil.getLocalStorage(function (bSuccess, jsonStr) {
    //     //     if (bSuccess) {
    //     //         console.log("jsonStr = " + jsonStr);
    //     //         WeChatUtil.showModal({
    //     //             title: "测试模态对话框",
    //     //             content: "本地数据获取成功：" + jsonStr,
    //     //             callBack: function (res) {
    //     //                 console.log("模态对话框用户操作返回");
    //     //                 console.log(res);
    //     //                 if (res.confirm) {
    //     //                     console.log("点击了确定");
    //     //                     WeChatUtil.showToast("点击了确定");
    //     //                 } else if (res.cancel) {
    //     //                     console.log("点击了取消");
    //     //                     WeChatUtil.showToast("点击了取消");
    //     //                 }
    //     //             }
    //     //         });
    //     //     }
    //     // });

    //     // WeChatUtil.showModal({
    //     //     title: "温馨提示",
    //     //     content: "点击确定将增加100点击伤害",
    //     //     callBack: function (res) {
    //     //         console.log("模态对话框用户操作返回");
    //     //         console.log(res);
    //     //         if (res.confirm) {
    //     //             console.log("点击了确定");
    //     //             WeChatUtil.showToast("点击伤害+100");
    //     //             self.clickDamage = self.clickDamage.plus(100);
    //     //         } else if (res.cancel) {
    //     //             console.log("点击了取消");
    //     //             // WeChatUtil.showToast("点击了取消");
    //     //         }
    //     //     }
    //     // });

        
    // },
});
