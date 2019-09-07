
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
        nodeBoard: cc.Node,

        upgrageSelectBtn: cc.Node,
        upgrageSelectBtnLab: cc.Label,
        dialogPrefab : cc.Prefab,
        SigninDialog : cc.Prefab,
        ShareDialog : cc.Prefab,
        RankDialog : cc.Prefab,
        preClub : cc.Prefab,
        offlineDialog : cc.Prefab,
        settingDialog : cc.Prefab,

        tabs : [cc.Node],
        pages : [cc.Node],
        shareBtn : cc.Node,
        btnSignin : cc.Node,
        btnClub : cc.Node,

        sFinger : cc.SpriteFrame,
        sTips : cc.SpriteFrame,
        spSetting : cc.Node,

        clickLight : cc.Prefab,
        nodeClickRuby : cc.Node,

        btnGolden : cc.Node,
    },
    
    // use this for initialization
    onLoad: function () {
        const self = this;
        self.damageArr = [];
        this.goldArr = []
        self.monsterController = self.getComponent("MonsterController");
        self.heroListControl = self.getComponent("HeroListControl");
        self.userSkillController = self.getComponent("UserSkillController");

        // self.setPageNodeActive(false);
        // self.pageNode.active = false
        // self.pageNode.isVisible = false

        WeChatUtil.setCloudDataFormat(self.cacheGameData.bind(self));

        this.autoCacheTime = Date.now()
    },

    initGuide(){
        // 这些是判断隐藏一些没达到关卡 需要隐藏的元素
        let curSoul = DataCenter.getDataByKey(DataCenter.KeyMap.curSoul);
        let maxPassLavel = DataCenter.getDataByKey(DataCenter.KeyMap.maxPassLavel);
        let v0 = BigNumber.isBigNumber(curSoul)&&curSoul.gt(0)&&this.tabs[2].active==false
        if (Boolean(maxPassLavel && maxPassLavel >= 90)) {
            this.tabs[2].active = true
        }else{
            this.tabs[2].active = v0
        }
        let v1 = Boolean(maxPassLavel && maxPassLavel >= 5)
        this.tabs[3].active = v1
        this.tabs[4].active = v1
        this.shareBtn.active = v1
        this.btnSignin.active = v1
        this.btnClub.active = Boolean(maxPassLavel && maxPassLavel >= 100)

        if(!Boolean(maxPassLavel)){
            console.log("加个点击手引导");
            this.createClickGuide()
        } 
    },

    showSettingAnim(){
        let isUsed = cc.sys.localStorage.getItem("usedSetting")
        if (!isUsed) {
            this.spSetting.active = true
            this.spSetting.opacity = 0
            this.spSetting.runAction(
                cc.repeatForever(
                    cc.sequence(cc.delayTime(5),cc.fadeIn(1),cc.fadeOut(1))
                )
            )
        }else  {
            this.spSetting.active = false
        }
    },

    openSetting(){
        console.log("打开设置界面");
        let dialog = cc.instantiate(this.settingDialog)
        dialog.parent = cc.director.getScene();
        dialog.x = cc.winSize.width / 2;
        dialog.y = cc.winSize.height / 2;
        if (this.spSetting.active) {
            cc.sys.localStorage.setItem("usedSetting",true)
            this.spSetting.stopAllActions()
            this.spSetting.active = false
        }
        // var datas = {registerTime:1.558077800538e+12,_openid:"zhwwxc",WeChatUserInfo:{gender:1.0,language:"zh_CN",city:"长春",province:"吉林",country:"中国",nickName:"东军"},gamedata:{}}
        // PublicFunc.httpRequest({
        //     url : "https://www.magicfun.xyz/add",
        //                 handler : function (event, response) {
        //         console.info("http请求返回");
        //         console.info(event);
        //         console.info(response);
        //         if (event == "success") {
                    
        //         } else if (event == "error") {
        //             // 
        //         } else if (event == "timeout") {
        //             // 
        //         }
        //     }.bind(this),
        //     method : "POST",
        //     uploadData : JSON.stringify({doc:"UserGameData",data:datas}),
        // });

    },

    setPageNodeActive (bActive) {
        // if (!this.pageNode.active) {
        //     this.pageNode.active = true
        // }
        // const self = this;
        // self.pageNode.isVisible = bActive
        // self.pageNode.opacity = bActive ? 255:0
        // self.pageNode.scale = bActive ? 1:0
        this.pageNode.active = bActive;
        if (bActive) {
            WeChatUtil.hideBtnClub()
            this.monsterController.moveUp();
        } else {
            WeChatUtil.showBtnClub()
            this.monsterController.moveDown();
        }
    },

    // called every frame
    lateUpdate (dt) {
        this.dt = this.dt || 0
        const curtime = Date.now();
        this.lastCheckTime = this.lastCheckTime || 0
        if (curtime - this.lastCheckTime < 100) {
            this.dt += dt;
            return;
        }
        this.lastCheckTime = curtime;

        const self = this;
        if (self.isGameStart == true) {
            var totalDamage = new BigNumber(0);
            if (self.damageArr && self.damageArr.length > 0) {
                for (let i = 0; i < self.damageArr.length; i++) {
                    totalDamage = totalDamage.plus(self.damageArr[i]);
                }
                self.damageArr = [];
            }
            totalDamage = totalDamage.plus(GameData.dpsDamage.times(this.dt));
            if (!totalDamage.isZero()) {
                self.monsterController.bleed(totalDamage);
            }

            if (this.goldArr&&this.goldArr.length>0) {
                let totalGold = new BigNumber(0)
                for (let i = 0; i < this.goldArr.length; i++) {
                    totalGold = totalGold.plus(this.goldArr[i])
                }
                this.goldArr = []
                DataCenter.addGold(totalGold);
                this.monsterController.playGoldAnim(Formulas.formatBigNumber(totalGold));
            }
        }
        this.dt = 0
        
        this.autoCacheGame()
        this.updateClickruby()
        // this.dtCombo = this.dtCombo || 0
        this.lastComboTime = this.lastComboTime || 0
        if (curtime - this.lastComboTime < 500) {
            // this.dtCombo += dt
            return;
        }
        this.lastComboTime = curtime;
        GameData.refreshComboDPS()
        // this.dtCombo = 0
    },

    updateClickruby(){
        if (window.nextClickruby) {
            let data = nextClickruby
            if (Date.now() > data.time) {
                console.log(data);
                Events.emit(Events.MAKE_CLICKRUBY,data.type)
            } else {
                // console.log(data.time - Date.now());
            }
        }
    },

    onMakeClickRuby(){
        if (window.nextClickruby) {
            if (Date.now() > nextClickruby.time) {
                const next = nextClickruby
                nextClickruby = null
                WeChatUtil.getSystemTime(function(b,time) {
                    console.log("xxxxxxj mark time");
                    console.log(time);
                    console.log(next.time);
                    if (b&&time > next.time - 10000) {
                        let node = new cc.Node()
                        let sp = node.addComponent(cc.Sprite)
                        sp.spriteFrame = PublicFunc.imgClickruby
                        this.nodeClickRuby.removeAllChildren()
                        node.parent = this.nodeClickRuby
                        let winWidth = cc.winSize.width - 60
                        let winHeight = cc.winSize.height - 300
                        let x = winWidth * Math.random() - winWidth/2
                        let y = winHeight * Math.random() - winHeight/2
                        node.x=x
                        node.y=y
                        node.scale = 0.25
                        node.rotation = Math.random()*360
                        node.addComponent(cc.Button)
                        node.on('click', function() {
                            let r = Math.random()
                            var lv = DataCenter.getDataByKey(DataCenter.KeyMap.maxPassLavel)
                            console.log("maxPassLavel:"+lv);
                            if (r < 0.45) {
                                PublicFunc.popGoldDialog(0, PublicFunc.getBagGold().times(0.5)) // 一袋金币
                            } else if(r < 0.75){
                                
                                if (lv < 200) {
                                    PublicFunc.popGoldDialog(0, PublicFunc.getBagGold()) // 一袋金币
                                } else {
                                    PublicFunc.popGoldDialog(1,PublicFunc.getBagSoul().times(0.03).integerValue())
                                }
                            } else {
                                PublicFunc.popGoldDialog(2,20+Math.ceil(Math.random()*10))
                            }
                            node.removeFromParent()
                            PublicFunc.makeNextClickruby()
                        }, this);
                    } else {
                        PublicFunc.makeNextClickruby()
                    }
                }.bind(this))
            }
        }
    },

    autoCacheGame(){
        const curtime = Date.now();
        if (curtime - this.autoCacheTime < 1000*60) {
            return;
        }
        this.autoCacheTime = curtime;
        console.log("每60秒保存一次游戏");
        this.cacheGameData()
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
        Events.off(Events.ON_IDLE_STATE, self.onIdleState, self);
        Events.off(Events.ON_COMBO_CHANGE, self.onComboChange, self);
        Events.off(Events.ON_MAXLEVEL_UPDATE, self.onMaxLvChange, self);
        Events.off(Events.ON_LEVEL_PASSED, self.onlvPassed, self);
        Events.off(Events.ON_RESUME_GAME, self.onResumeGame, self);
        Events.off(Events.SHOW_SKILL_FINGER, self.showSkillTabFinger, self);
        Events.off(Events.ON_RESETGAME, this.resetGame, this);
        Events.off(Events.MAKE_CLICKRUBY, this.onMakeClickRuby, this);
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
            self.isIdle = true; // 是否为挂机状态
            self.combo = 0; // 当前连击数
            DataCenter.init();
            GoodsDatas.init();
            HeroDatas.init();
            TaskDatas.init();
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
            Events.on(Events.ON_MAXLEVEL_UPDATE, self.onMaxLvChange, self);
            Events.on(Events.ON_LEVEL_PASSED, self.onlvPassed, self);
            Events.on(Events.ON_RESUME_GAME, self.onResumeGame, self);
            Events.on(Events.SHOW_SKILL_FINGER, self.showSkillTabFinger, self);
            Events.on(Events.ON_RESETGAME, this.resetGame, this);
            Events.on(Events.MAKE_CLICKRUBY, this.onMakeClickRuby, this);

            self.totalCostLab.string = DataCenter.getGoldStr();
            // self.totalSoulLab.string = DataCenter.getSoulStr();
            this.onSoulChange()
            self.clickDamageLab.string = Formulas.formatBigNumber(GameData.clickDamage);
            self.dpsDamageLab.string = Formulas.formatBigNumber(GameData.dpsDamage);


            self.upgrageSelectBtnLab.string = "×" + GameData.heroLvUnit;

            this.handleIdle()
            // self.scheduleOnce(self.handleIdle, 60);
            Events.emit(Events.ON_GAME_START);
            self.isGameStart = true;

            AudioMgr.playBG();

            
            this.initGuide()
            setTimeout(function() {
                GameData.refresh();
                self.checkOfflineGold()
            },100)
            this.showSettingAnim()
            if (!PublicFunc.isSignin()) {
                this.showBtnSigninTips()
            }
            this.showBtnShareTips()
            WeChatUtil.showBtnClub()
            PublicFunc.makeNextClickruby()
        } catch (error) {
            console.error(error)
        }
        

    },

    // 从后台切换到前台时
    onResumeGame(){
        this.checkOfflineGold()
    },

    // 检查离线收益
    checkOfflineGold(){
        var lastTime = DataCenter.getDataByKey(DataCenter.KeyMap.lastTime)
        if (lastTime) {
            // show dialog
            console.log(Date.now());
            console.log(lastTime);
            
            var diff = Date.now() - Number(lastTime)
            console.log("离线时间："+diff);
            if (diff >= 10*1000) {
                diff = Math.min(diff,1000*86400*30)
                var totalDamage = GameData.dpsDamage.times(diff/1000)
                console.log("离线伤害："+Formulas.formatBigNumber(totalDamage));
                var lv = DataCenter.getDataByKey(DataCenter.KeyMap.passLavel)
                let timesTreas = GameData.getTreasureTimes()*GameData.getTreasureOdds()+1
                console.log("timesTreas:" + timesTreas);
                let times10x = (10*GameData.addTenfoldGoldOdds+1)
                console.log("times10x:" + times10x);
                let times = GameData.globalGoldTimes*timesTreas*times10x
                console.log("globalGoldTimes:" + GameData.globalGoldTimes);
                console.log("times:" + times);
                let hp = Formulas.getMonsterHP(lv)
                var gold = Formulas.getMonsterGold(lv,hp).times(totalDamage.div(hp)).times(times)
                if (gold.gt(0)) {
                    PublicFunc.popGoldDialog(0,gold,"离线收益")
                }
                // let dialog = cc.instantiate(this.offlineDialog)
                // dialog.parent = cc.director.getScene();
                // dialog.x = cc.winSize.width / 2;
                // dialog.y = cc.winSize.height / 2;
            }
        }
    },

    cacheGameData() { // 格式化存档数据，用于存储到云端和从云端恢复数据
        const self = this;
        var map = DataCenter.KeyMap;
        // 获取存档数据，并存储到云端
        var curGold = DataCenter.getDataByKey(map.curGold);
        var historyTotalGold = DataCenter.getDataByKey(map.historyTotalGold);
        var curSoul = DataCenter.getDataByKey(map.curSoul);
        var rebirthSoul = DataCenter.getDataByKey(map.rebirthSoul);
        var obj = {}
        // 所有的bignumber都务必要 num.curGold.toExponential(4) 再存起来
        // obj[map.bAutoClickOpen] = self.getComponent("AutoClick").bAutoClickOpen; // 商店购买的自动点击是否开启
        obj[map.bAutoClickOpen] = false
        let lastTime = Date.now()
        DataCenter.setDataByKey(map.lastTime,lastTime)
        obj[map.lastTime] = lastTime.toString(); // 上次存档的时间
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
        obj[map.taskTargets] = TaskDatas.datas; // 任务领取列表
        // obj[map.skillList] = 
        obj[map.skillList] = self.userSkillController.formatUserSkillsInfo(); // 所有主动技能的状态
        // obj[map.achievementList] = 
        // obj[map.equipmentList] = 
        // obj[map.shopList] = 
        // obj[map.lansquenetList] = 
        obj[map.signinData] = DataCenter.getDataByKey(map.signinData); // 签到数据
        obj[map.shareReceiveData] = DataCenter.getDataByKey(map.shareReceiveData); // 分享任务 领取信息
        obj[map.shareDate] = DataCenter.getDataByKey(map.shareDate); // 分享日期
        obj[map.totalSoul] = DataCenter.getDataByKey(map.totalSoul).toExponential(4)
        obj[map.totalRuby] = DataCenter.getDataByKey(map.totalRuby);
        obj[map.skill6Data] = DataCenter.getDataByKey(map.skill6Data); // 阿弥陀佛
        console.log(obj);
        let result = DataCenter.saveGameData(obj)
        return [obj,result]
    },

    onGoldChange () {
        const self = this;
        self.totalCostLab.string = DataCenter.getGoldStr();
        let maxPassLavel = DataCenter.getDataByKey(DataCenter.KeyMap.maxPassLavel);
        if (maxPassLavel < 10) {
            let curGold = DataCenter.getDataByKey(DataCenter.KeyMap.curGold);
            let hero0 = HeroDatas.getHero(0)
            if (!hero0.isBuy) {
                if (Boolean(curGold&&curGold.gte(5))) {
                    self.showHeroTabFinger()
                }
            } else if(hero0.level == 1) {
                if (Boolean(curGold&&curGold.gte(6))) {
                    self.showHeroTabFinger()
                }
            } else if(hero0.level >= 5&&hero0.level < 10) {
                let skill = hero0.skills[0]
                if (!skill.isBuy&&curGold.gte(10)) {
                    self.showHeroTabFinger()
                }
            } else if(hero0.level >= 10){
                let skill = hero0.skills[1]
                if (!skill.isBuy&&curGold.gte(100)) {
                    self.showHeroTabFinger()
                }
            }
            let hero1 = HeroDatas.getHero(1)
            if (!hero1.isBuy) {
                if (Boolean(curGold&&curGold.gte(50))) {
                    self.showHeroTabFinger()
                }
            } else if(hero1.level >= 10){
                let skill = hero1.skills[0]
                if (!skill.isBuy&&curGold.gte(500)) {
                    self.showHeroTabFinger()
                }
            }
        }
    },

    showHeroTabFinger(){
        const self = this;
        if (!Boolean(self.nodeOpenTabTips)) {
            if (!this.pageNode.active||this.pageIndex!=0){
                self.nodeOpenTabTips = new cc.Node("nodeOpenTabTips")
                var sp = self.nodeOpenTabTips.addComponent(cc.Sprite)
                sp.spriteFrame = self.sFinger
                self.nodeOpenTabTips.parent = self.tabs[0]
                self.nodeOpenTabTips.setPosition(cc.v2(80,-20))
                self.nodeOpenTabTips.opacity = 0
                self.nodeOpenTabTips.scale = 0.8
                self.nodeOpenTabTips.runAction(cc.repeatForever(
                    cc.sequence(cc.spawn(cc.fadeTo(0.5,255),cc.moveBy(0.5,cc.v2(-20,10))),
                        cc.spawn(cc.fadeTo(0.5,100),cc.moveBy(0.5,cc.v2(20,-10))),)))
            }
        }
    },
    showSkillTabFinger(){
        const self = this;
        if (!Boolean(self.nodeSkillTabTips)) {
            if (!this.pageNode.active||this.pageIndex!=1){
                self.nodeSkillTabTips = new cc.Node("nodeSkillTabTips")
                var sp = self.nodeSkillTabTips.addComponent(cc.Sprite)
                sp.spriteFrame = self.sFinger
                self.nodeSkillTabTips.parent = self.tabs[1]
                self.nodeSkillTabTips.setPosition(cc.v2(80,-20))
                self.nodeSkillTabTips.opacity = 0
                self.nodeSkillTabTips.scale = 0.8
                self.nodeSkillTabTips.runAction(cc.repeatForever(
                    cc.sequence(cc.spawn(cc.fadeTo(0.5,255),cc.moveBy(0.5,cc.v2(-20,10))),
                        cc.spawn(cc.fadeTo(0.5,100),cc.moveBy(0.5,cc.v2(20,-10))),)))
            }
        }
    },

    onSoulChange(){
        const self = this;
        var str = DataCenter.getSoulStr();
        var rebirthSoul = DataCenter.getDataByKey(DataCenter.KeyMap.rebirthSoul);
        if (rebirthSoul && !rebirthSoul.isZero()) {
            str += "(" + Formulas.formatBigNumber(rebirthSoul) + ")";
        }
        self.totalSoulLab.string = str;
        let curSoul = DataCenter.getDataByKey(DataCenter.KeyMap.curSoul);
        if (BigNumber.isBigNumber(curSoul)&&curSoul.gt(0)&&this.tabs[2].active==false) {
            this.tabs[2].active=true
        }
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
        self.comboTypeLab.string = isIdle ? "(挂机)" : "(连击)";
        if (!isIdle) {
            self.comboCount.string = self.combo;
        }
    },

    onComboChange (event) {
        const self = this;
        self.comboCount.string = self.combo;
    },

    onMaxLvChange(event){
        let maxPassLavel = DataCenter.getDataByKey(DataCenter.KeyMap.maxPassLavel);
        let v1 = maxPassLavel >= 5
        if (!this.tabs[3].active) {
            this.tabs[3].active = v1
            this.tabs[4].active = v1
            this.shareBtn.active = v1
            this.btnSignin.active = v1
            if (v1) {
                this.showBtnSigninTips()
                this.showBtnShareTips()
            }
        }
        this.btnClub.active = Boolean(maxPassLavel && maxPassLavel >= 100)
        this.lastMaxlvTime = this.lastMaxlvTime || 0
        const curtime = Date.now();
        if (curtime - this.lastMaxlvTime < 30*1000) {
            return;
        }
        this.lastMaxlvTime = curtime;
        try {
            HttpUtil.updateMaxLv()
        } catch (error) {
            
        }
    },

    showBtnSigninTips(){
        if (this.nodeSigninTips) {
            return
        }
        this.nodeSigninTips = new cc.Node("nodeSigninTips")
        var sp = this.nodeSigninTips.addComponent(cc.Sprite)
        sp.spriteFrame = this.sTips
        this.nodeSigninTips.parent = this.btnSignin
        this.nodeSigninTips.setPosition(cc.v2(50,-20))
        this.nodeSigninTips.opacity = 0
        this.nodeSigninTips.scale = 0.8
        this.nodeSigninTips.runAction(
            cc.repeatForever(
                cc.sequence(cc.fadeIn(0.5),cc.fadeOut(0.5),cc.delayTime(1))
            )
        )
    },
    showBtnShareTips(){
        if (this.nodeShareTips) {
            return
        }
        // 检查下今天有没有显示
        var dateStr = cc.sys.localStorage.getItem("showShareTipsDate")
        if (dateStr == PublicFunc.getDateStr()) {
            return
        }
        cc.sys.localStorage.setItem("showShareTipsDate",PublicFunc.getDateStr())

        this.nodeShareTips = new cc.Node("nodeShareTips")
        var sp = this.nodeShareTips.addComponent(cc.Sprite)
        sp.spriteFrame = this.sTips
        this.nodeShareTips.parent = this.shareBtn
        this.nodeShareTips.setPosition(cc.v2(50,-20))
        this.nodeShareTips.opacity = 0
        this.nodeShareTips.scale = 0.8
        this.nodeShareTips.runAction(
            cc.repeatForever(
                cc.sequence(cc.fadeIn(0.5),cc.fadeOut(0.5),cc.delayTime(1))
            )
        )
    },

    onlvPassed(e){
        let lv = DataCenter.getDataByKey(DataCenter.KeyMap.passLavel);
        if (lv%5==0) {
            console.log("每通过5关 保存一下数据");
            this.cacheGameData()
        }
    },

    updataMonsterInfoDisplay () {
        // const self = this;
        // let info = self.monsterController.getCurMonsterInfo();
        // self.lvLab.string = info.lv;
        
        // self.hpLab.string = Formulas.formatBigNumber(info.hp);
        // self.costLab.string = Formulas.formatBigNumber(info.gold);
    },

    showClickLight(pos){
        let light = cc.instantiate(this.clickLight)
        if (this.node) {
            light.parent = this.node
        }
        light.x = pos.x - cc.winSize.width / 2
        light.y = pos.y - cc.winSize.height / 2
        var anim = light.getComponent(cc.Animation)
        anim.play("click")
        let onStop = function() {
            anim.off('stop', onStop)
            light.removeFromParent()
        }
        anim.on('stop', onStop)
    },

    onTouchStart (event) {
        const curtime = Date.now();
        this.lastClickTime = this.lastClickTime || 0
        if (curtime - this.lastClickTime < 30) {
            return;
        }
        
        this.lastClickTime = curtime;
        const self = this;
        // if (ClickEnable == true) {
        //     // let pos = event.getLocation();
        //     ClickEnable = false;
        // }
        let pos = event.getLocation();
        if (pos.y>cc.winSize.height*0.22 && pos.y<cc.winSize.height*0.78) {
            this.showClickLight(pos)
            self.clickHit();
            var map = DataCenter.KeyMap;
            DataCenter.setDataByKey(map.totalClick, DataCenter.getDataByKey(map.totalClick) + 1);
            Events.emit(Events.ON_MANUAL_CLICK)
        }
    },

    clickHit (isAuto) {

        const self = this;
        self._totalClickCount = self._totalClickCount.plus(1);
        // console.log("hit : count = " + self._totalClickCount.toExponential(3));
        var bCrit = Formulas.isHitRandom(GameData.critOdds); // 是否是暴击
        if (bCrit) {
            self.monsterController.hit(GameData.clickDamage.times(GameData.critTimes), false, true,isAuto);
            self.damageArr.push(GameData.clickDamage.times(GameData.critTimes));
        } else {
            self.monsterController.hit(GameData.clickDamage, false, false,isAuto);
            self.damageArr.push(GameData.clickDamage);
        }

        self.combo++;
        GameData.clickCombo = this.combo
        Events.emit(Events.ON_COMBO_CHANGE, self.combo);
        if (self.combo > DataCenter.getDataByKey(DataCenter.KeyMap.maxCombo)) {
            DataCenter.setDataByKey(DataCenter.KeyMap.maxCombo, self.combo);
        }
        
        if (self.isIdle === true) {
            self.isIdle = false;
            // 转为非挂机状态
            console.log("转为非挂机状态");
            Events.emit(Events.ON_IDLE_STATE, self.isIdle);
        }
        self.unschedule(self.handleIdle);
        self.scheduleOnce(self.handleIdle, 60);
        if (this.nodeFinger) {
            this.nodeFinger.removeFromParent()
            this.nodeFinger = null
        }
        if (this.nodeClickPop) {
            this.nodeClickPop.removeFromParent()
            this.nodeClickPop = null
        }
    },

    createClickGuide(){
        this.scheduleOnce(function() {
            this.nodeFinger = new cc.Node("nodeFinger")
            const sp = this.nodeFinger.addComponent(cc.Sprite);
            sp.spriteFrame = this.sFinger
            this.nodeFinger.parent = this.monsterController.monsterPos
            this.nodeFinger.setPosition(cc.v2(80,40))
            this.nodeFinger.opacity = 100
            this.nodeFinger.runAction(cc.repeatForever(
                    cc.sequence(cc.spawn(cc.fadeTo(0.5,255),cc.moveBy(0.5,cc.v2(-40,40))),
                        cc.spawn(cc.fadeTo(0.5,100),cc.moveBy(0.5,cc.v2(40,-40))),)))
            this.nodeClickPop = PublicFunc.createPopTips("快来点一下这个怪试试啊~")
            this.nodeClickPop.parent = this.monsterController.monsterPos
            this.nodeClickPop.setPosition(cc.v2(80,20))
            this.nodeClickPop.opacity = 100
            this.nodeClickPop.runAction(cc.fadeTo(0.5,255))
        }, 1);
    },

    handleIdle () {
        const self = this;
        self.isIdle = true;
        // 转为挂机状态
        console.log("转为挂机状态");
        self.combo = 0;
        Events.emit(Events.ON_IDLE_STATE, self.isIdle);
        Events.emit(Events.ON_COMBO_CHANGE, self.combo);
    },

    
    onUploadResponse(event, response){

        console.log("onUploadResponse"+event);
        
        // if (event == "success") {
        //     console.log("上传图片请求成功！");
        //     let res = JSON.parse(response);
        //     console.log(JSON.stringify(res));
        //     if (res.code == 1) {
        //         console.log("上传图片成功");
        //         this.fnames = this.fnames?this.fnames:[];
        //         this.fnames.push(res.data);
        //         if (this.fnames.length == this.imagePaths.length) {
        //             console.log(JSON.stringify(this.fnames));
        //             this.pubPosts();
        //         }
        //     } else {
        //         console.log("上传图片失败");
        //     }
        // } else if (event == "error") {
        //     console.log("上传图片请求出错");
        // } else if (event == "timeout") {
        //     console.log("上传图片超时");
        // }
    },

    onShareBtnClick () {
        // WeChatUtil.shareAppMessage();
        // Events.emit(Events.ON_SHARE_CLICK);
        this.showShareDialog();
        AudioMgr.playBtn();
        // var datas = {_id:"zhwwaaaaaa",registerTime:1.558077800538e+12,_openid:"newopenid",WeChatUserInfo:{gender:1.0,language:"zh_CN",city:"长春",province:"吉林",country:"中国",nickName:"东军"},gamedata:{}}
        // PublicFunc.httpRequest({
        //     url : "https://www.magicfun.xyz/update",
        //                 handler : function (event, response) {
        //         console.info("http请求返回");
        //         console.info(event);
        //         console.info(response);
        //         if (event == "success") {
                    
        //         } else if (event == "error") {
        //             // 
        //         } else if (event == "timeout") {
        //             // 
        //         }
        //     }.bind(this),
        //     method : "POST",
        //     uploadData : JSON.stringify({doc:"UserGameData",_id:"zhwwaaaaaa",data:datas}),
        // });
    },
// mark
    onMonsterGold (gold) {
        var realGold = gold.times(GameData.globalGoldTimes);
        this.goldArr.push(realGold);
        AudioMgr.playGetGoin();
    },

    onMonsterSoul (soul) {
        // DataCenter.addSoul(soul);
        DataCenter.addRebirthSoul(soul);
    },
    
    addRandomGolden(){
        console.log("addRandomGolden");
        let hero = HeroDatas.addRandomGolden()
        this.btnGolden.active = true
        this.btnGolden.hero = hero
    },

    onClickGolden(){
        // 显示出获得的金身，
        this.btnGolden.active = false
        let hero = this.btnGolden.hero
        if (hero) {
            this.btnGolden.hero = null
            PublicFunc.popGoldenDialog(hero)
        }
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
    setPageActive(curPageIndex) {
        for (let i = 0; i < this.pages.length; i++) {
            const page = this.pages[i];
            page.active = i == curPageIndex;
        }
        this.pageIndex = curPageIndex
    },
    onHeroBtnClick () {

        // console.log("请求http");
           
        // PublicFunc.httpRequest({
        //     url : "https://www.magicfun.xyz/",
        //     // url : "https://www.shenguigame.com/",
        // // url : "https://39.97.176.206",
        //     handler : this.onUploadResponse.bind(this),
        //     method : "GET",
        // });

        // if(true)
        // {
        //     return;
        // }

        const self = this;
        if (self.pageNode.active) {
            var curPageIndex = this.pageIndex
            if (curPageIndex == 0) { // 当前正在英雄列表界面
                self.setPageNodeActive(false);
            } else {
                self.setPageActive(0);
            }
        } else {
            self.setPageNodeActive(true);
            self.setPageActive(0);
        }
        self.upgrageSelectBtn.active = true;
        self.upgrageSelectBtnLab.string = "×" + GameData.heroLvUnit;
        AudioMgr.playBtn();
        if(this.nodeOpenTabTips){
            this.nodeOpenTabTips.removeFromParent()
            this.nodeOpenTabTips = null
        }
    },

    onUserSkillBtnClick () {
        const self = this;
        if (self.pageNode.active) {
            var curPageIndex = this.pageIndex
            if (curPageIndex == 1) { // 当前正在技能列表界面
                self.setPageNodeActive(false);
            } else {
                self.setPageActive(1);
            }
        } else {
            self.setPageNodeActive(true);
            self.setPageActive(1);
        }
        self.upgrageSelectBtn.active = false;
        AudioMgr.playBtn();
        if(this.nodeSkillTabTips){
            this.nodeSkillTabTips.removeFromParent()
            this.nodeSkillTabTips = null
        }
    },

    onAncientBtnClick() {
        const self = this;
        if (self.pageNode.active) {
            var curPageIndex = this.pageIndex
            if (curPageIndex == 2) { // 当前正在古神列表界面
                self.setPageNodeActive(false);
            } else {
                self.setPageActive(2);
            }
        } else {
            self.setPageNodeActive(true);
            self.setPageActive(2);
        }
        self.upgrageSelectBtn.active = true;
        // self.upgrageSelectBtnLab.string = "×" + GameData.ancientLvUnit;
        self.upgrageSelectBtnLab.string = "×" + (GameData.ancientLvUnit > 0?GameData.ancientLvUnit:"手动输入")
        AudioMgr.playBtn();
    },

    onStoreBtnClick() {
        const self = this;
        if (self.pageNode.active) {
            var curPageIndex = this.pageIndex
            if (curPageIndex == 3) { // 当前正在技能列表界面
                self.setPageNodeActive(false);
            } else {
                self.setPageActive(3);
            }
        } else {
            self.setPageNodeActive(true);
            self.setPageActive(3);
        }
        self.upgrageSelectBtn.active = false;
        AudioMgr.playBtn();
    },

    onTaskBtnClick() {
        const self = this;
        if (self.pageNode.active) {
            var curPageIndex = this.pageIndex
            if (curPageIndex == 4) { // 当前正在任务列表界面
                self.setPageNodeActive(false);
            } else {
                self.setPageActive(4);
            }
        } else {
            self.setPageNodeActive(true);
            self.setPageActive(4);
        }
        self.upgrageSelectBtn.active = false;
        AudioMgr.playBtn();
    },

    onUpgradeSelectClick() { // 1 10 25 100 1000 10000
        const self = this;
        AudioMgr.playBtn();
        if (self.pageNode.active) {
            const maxLv = DataCenter.getDataByKey(DataCenter.KeyMap.maxPassLavel)
            var curPageIndex = this.pageIndex
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
                        unit = maxLv>=1000?10000:1;
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
                        unit = maxLv>=1000?10000:1;
                        break;
                    case 10000:
                        unit = 0;
                        break;
                    case 0:
                        unit = 1;
                        break;
                    default:
                        break;
                }
                console.log("xxxx " + unit);
                
                HeroDatas.setAncientLvUnit(unit);//
                self.upgrageSelectBtnLab.string = "×" + (GameData.ancientLvUnit > 0?GameData.ancientLvUnit:"手动输入")
                Events.emit(Events.ON_ANCIENT_LVUNIT_CHANGE);//
            }
        }
    },

    showSigninDialog(){
        let dialog = cc.instantiate(this.SigninDialog)
        dialog.parent = cc.director.getScene();
        dialog.x = cc.winSize.width / 2;
        dialog.y = cc.winSize.height / 2;
        AudioMgr.playBtn();
        if (this.nodeSigninTips) {
            this.nodeSigninTips.removeFromParent()
            this.nodeSigninTips = null
        }
    },

    showShareDialog () {
        console.log("showShareDialog");
        let dialog = cc.instantiate(this.ShareDialog)
        dialog.parent = cc.director.getScene();
        dialog.x = cc.winSize.width / 2;
        dialog.y = cc.winSize.height / 2;
        if (this.nodeShareTips) {
            this.nodeShareTips.removeFromParent()
            this.nodeShareTips = null
        }
    },

    showRankDialog () {
        console.log("showRankDialog");
        let dialog = cc.instantiate(this.RankDialog)
        dialog.parent = cc.director.getScene();
        dialog.x = cc.winSize.width / 2;
        dialog.y = cc.winSize.height / 2;
        AudioMgr.playBtn();
    },

    showClub(){
        let club = cc.instantiate(this.preClub)
        club.parent = cc.director.getScene();
        club.x = cc.winSize.width / 2;
        club.y = cc.winSize.height / 2;
        AudioMgr.playBtn();
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
    resetGame(){
        this.setPageNodeActive(false)
        this.tabs[2].active = false
        this.tabs[3].active = false
        this.tabs[4].active = false
        this.shareBtn.active = false
        this.btnSignin.active = false
        this.btnClub.active = false
        this.getComponent("AutoClick").showAutoBtn(false)
    },
});
