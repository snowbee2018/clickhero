cc.Class({
    
    ctor () {
        const self = this;
        self.KeyMap = {
            lastTime: "lastEnterGameTime", // 最近一次保存数据的时间
            // 所有当前必须要保存的数据，用于恢复现场
            rebirthCount: "rebirthCount", // 已转生次数
            bAutoClickOpen: "bAutoClickOpen", // 商店购买的自动点击是否开启
            totalClick: "totalClick", // 历史总点击数
            maxCombo: "maxCombo", // 历史最大连击数
            monsterInfo: "monsterInfo", // 怪物信息，关卡，序号，是否宝箱，剩余血量
            passLavel: "passLavel", // 当前世界已通过的最高关卡
            maxPassLavel: "maxPassLavel", // 历史最高通过关卡
            curDiamond: "curDiamond", // 当前钻石数量
            curGold: "curGold", // 当前金币数量
            historyTotalGold: "historyTotalGold", // 历史获得的所有金币
            curSoul: "curSoul", // 当前可用英魂数量
            ruby : "ruby", // 当前可用宝石仙丹数量
            rebirthSoul: "rebirthSoul", // 转生英魂
            additionalSoul: "additionalSoul", // 由雇佣兵完成任务而附加的英魂数量，英雄等级加成的英魂不在此列
            heroList: "heroList", // 用户所有英雄的状态，存起来
            skillList: "skillList", // 所有主动技能的状态,主要是要记录技能是否激活的和最后使用的时间，以便确定何时冷却完毕
            ancientList: "ancientList", // 用户所拥有的古神
            goodsList: "goodsList",     // 用户拥有的商店道具
            achievementList: "achievementList", // 成就列表，转生次数也在这里
            equipmentList: "equipmentList", // 装备列表，圣遗物和神器都存这里
            shopList: "shopList", // 钻石商店商品列表，用户的购买状态也存里面
            lansquenetList: "lansquenetList", // 雇佣兵列表，任务的完成状态也存里面

            taskTargets: "taskTargets", // 任务领取索引列表

            signinData: "signinData", // 签到数据{times:0,date:"yyyy/MM/dd"}
            shareReceiveData: "shareReceiveData", // 分享任务 领取信息[[true,true],[true,false]]
            shareDate : "shareDate", // 分享日期
        }
        self.ContentData = {}
        self.DataMap = {
            WXUserInfo: "WXUserInfo", // 当前用户微信信息
            OPENID: "OPENID",
        }
        
    },

    // 读取存档之后用来初始化
    init () {
        const self = this;
        var cloudTime = self.getCloudDataByKey(self.KeyMap.lastTime);
        if (cloudTime) {
            self.setDataByKey(self.KeyMap.lastTime, Number(cloudTime));
        }
        // 初始化金币
        var cloudGold = self.getCloudDataByKey(self.KeyMap.curGold);
        if (cloudGold) {
            self.setDataByKey(self.KeyMap.curGold, (new BigNumber(cloudGold)));
        } else {
            self.setDataByKey(self.KeyMap.curGold, (new BigNumber("0")));
            // self.setDataByKey(self.KeyMap.curGold, (new BigNumber("10000000000000000000000000000000000000000000")));
        }
        var historyTotalGold = self.getCloudDataByKey(self.KeyMap.historyTotalGold);
        if (historyTotalGold) {
            self.setDataByKey(self.KeyMap.historyTotalGold, (new BigNumber(historyTotalGold)));
        } else {
            self.setDataByKey(self.KeyMap.historyTotalGold, new BigNumber(0));
        }
        // 初始化英魂
        var cloudSoul = self.getCloudDataByKey(self.KeyMap.curSoul);
        if (cloudSoul) {
            self.setDataByKey(self.KeyMap.curSoul, (new BigNumber(cloudSoul)));
        } else {
            self.setDataByKey(self.KeyMap.curSoul, (new BigNumber("0")));
        }
        // 初始化宝石
        var cloudRuby = self.getCloudDataByKey(self.KeyMap.ruby);
        if (cloudRuby) {
            self.setDataByKey(self.KeyMap.ruby, Number(cloudRuby));
        } else {
            self.setDataByKey(self.KeyMap.ruby, 0);
        }
        var cloudRebirthSoul = self.getCloudDataByKey(self.KeyMap.rebirthSoul);
        if (cloudRebirthSoul) {
            self.setDataByKey(self.KeyMap.rebirthSoul, (new BigNumber(cloudRebirthSoul)));
        } else {
            self.setDataByKey(self.KeyMap.rebirthSoul, (new BigNumber(0)));
        }
        // 初始化当前世界最大通关数
        var passedLevel = self.getCloudDataByKey(self.KeyMap.passLavel);
        if (passedLevel) {
            self.setDataByKey(self.KeyMap.passLavel, Number(passedLevel));
        } else {
            self.setDataByKey(self.KeyMap.passLavel, 0);
        }
        // 初始化历史最大通关数
        var maxPassLavel = self.getCloudDataByKey(self.KeyMap.maxPassLavel);
        if (maxPassLavel) {
            self.setDataByKey(self.KeyMap.maxPassLavel, Number(maxPassLavel));
        } else {
            self.setDataByKey(self.KeyMap.maxPassLavel, 0);
        }
        // 初始化历史总点击数
        var cloudTotalClick = self.getCloudDataByKey(self.KeyMap.totalClick);
        if (cloudTotalClick) {
            self.setDataByKey(self.KeyMap.totalClick, cloudTotalClick);
        } else {
            self.setDataByKey(self.KeyMap.totalClick, 0);
        }
        // 初始化历史最大连击数
        var cloudMaxCombo = self.getCloudDataByKey(self.KeyMap.maxCombo);
        if (cloudMaxCombo) {
            self.setDataByKey(self.KeyMap.maxCombo, cloudMaxCombo);
        } else {
            self.setDataByKey(self.KeyMap.maxCombo, 0);
        }
        // 初始化转生次数
        var count = self.getCloudDataByKey(self.KeyMap.rebirthCount);
        if (count) {
            self.setDataByKey(self.KeyMap.rebirthCount, Number(count));
        } else {
            self.setDataByKey(self.KeyMap.rebirthCount, 0);
        }
        // 初始化签到数据
        var signinData = self.getCloudDataByKey(self.KeyMap.signinData);
        console.log("signinData:" + signinData);
        if (signinData) {
            self.setDataByKey(self.KeyMap.signinData, signinData);
        }
        // 初始化签到数据
        var shareReceiveData = self.getCloudDataByKey(self.KeyMap.shareReceiveData);
        self.setDataByKey(self.KeyMap.shareReceiveData, shareReceiveData || []);

        var shareDate = self.getCloudDataByKey(self.KeyMap.shareDate);
        self.setDataByKey(self.KeyMap.shareDate, shareDate);
        //  else {
        //     self.setDataByKey(self.KeyMap.shareReceiveData, [[true,true],[true,false]]);
        // }
    },

    // 保存数据
    saveGameData(data){
        if (!data) {
            return false
        }
        let cdata = this.getDataByKey("CloudData");
        // console.log(cdata.gamedata);
        // console.log(data);
        if (cdata) {
            cdata.gamedata = data
            console.log("保存数据到本地");
            cc.sys.localStorage.setItem("GameData",JSON.stringify(cdata))
            return true
        }
        return false
    },

    readGameData(){
        let json = cc.sys.localStorage.getItem('GameData')
        if (json&&json.length>0) {
            let data = JSON.parse(json);
            return data
        }
        return null
    },

    saveChildUserData(data){
        console.log("保存子用户数据");
        this.setChildUserArr(data)
        cc.sys.localStorage.setItem("ChildGameData",JSON.stringify(data))
        cc.sys.localStorage.setItem("savechildtime",Date.now())
        Events.emit(Events.ON_CHILDUSERDATA)
    },

    setChildUserArr(data){
        var childUserArr = [];
        if (data && data.length > 0) {
            for (let index = 0; index < data.length; index++) {
                const childUserCloudData = data[index];
                var rebirthCount = childUserCloudData.gamedata.rebirthCount;
                childUserArr.push({
                    weChatUserInfo: childUserCloudData.WeChatUserInfo,
                    isRebirth: (rebirthCount && rebirthCount > 0) ? true : false,
                    registerTime: childUserCloudData.registerTime
                });
            }
        }
        DataCenter.setDataByKey("ChildUserArr", childUserArr);
    },

    readChildUserData(){
        let json = cc.sys.localStorage.getItem('ChildGameData')
        if (json&&json.length>0) {
            let data = JSON.parse(json);
            this.setChildUserArr(data)
            return data
        }
        return null
    },

    setDataByKey (key, params) {
        const self = this;
        // console.info("key = " + key);
        if ((!!params || params === 0) && key) {
            self.ContentData[key] = params;
        }
    },

    getDataByKey (key) {
        const self = this;
        // console.info("key = " + key);
        if (key) {
            return self.ContentData[key];
        }
    },

    addHistoryTotalGold(gold) {
        const self = this;
        if (BigNumber.isBigNumber(gold)) {
            var key = self.KeyMap.historyTotalGold;
            var oldGold = self.getDataByKey(key);
            self.setDataByKey(key, oldGold.plus(gold));
        } else {
            console.error("type error, 'gold' must be a BigNumber.");
        }
    },

    // 金币增加
    addGold (gold) {
        const self = this;
        if (BigNumber.isBigNumber(gold)) {
            var key = self.KeyMap.curGold;
            var oldGold = self.getDataByKey(key);
            self.setDataByKey(key, oldGold.plus(gold));
            self.addHistoryTotalGold(gold);
            Events.emit(Events.ON_GOLD_CHANGE);
        } else {
            console.error("type error, 'gold' must be a BigNumber.");
        }
    },

    // 英魂增加
    addSoul (soul) {
        const self = this;
        if (BigNumber.isBigNumber(soul)) {
            var key = self.KeyMap.curSoul;
            var old = self.getDataByKey(key);
            self.setDataByKey(key, old.plus(soul));
            Events.emit(Events.ON_SOUL_CHANGE);
        } else {
            console.error("type error, 'soul' must be a BigNumber.");
        }
    },
    // 宝石增加
    addRuby (ruby) {
        var key = this.KeyMap.ruby;
        var old = this.getDataByKey(key);
        this.setDataByKey(key, (old+ruby) );
        Events.emit(Events.ON_RUBY_CHANGE);
    },
    // 转身次数增加
    addRebirthCount () {
        var key = this.KeyMap.rebirthCount;
        var old = this.getDataByKey(key);
        this.setDataByKey(key, (old+1) );
        Events.emit(Events.ON_REBIRTH_COUNT)
    },
    addRebirthSoul(soul) {
        const self = this;
        if (BigNumber.isBigNumber(soul)) {
            var key = self.KeyMap.rebirthSoul;
            var old = self.getDataByKey(key);
            self.setDataByKey(key, old.plus(soul));
            Events.emit(Events.ON_SOUL_CHANGE);
        } else {
            console.error("type error, 'soul' must be a BigNumber.");
        }
    },

    // 消费金币
    consumeGold (gold) {
        const self = this;
        if (BigNumber.isBigNumber(gold)) {
            var key = self.KeyMap.curGold;
            var oldGold = self.getDataByKey(key);
            if (oldGold.isGreaterThanOrEqualTo(gold)) {
                self.setDataByKey(key, oldGold.minus(gold));
                Events.emit(Events.ON_GOLD_CHANGE);
            } else {
                console.error("gold is not enough.");
            }
        } else {
            console.error("type error, 'gold' must be a BigNumber.");
        }
    },

    // 消费英魂
    consumeSoul (soul) {
        const self = this;
        if (BigNumber.isBigNumber(soul)) {
            var key = self.KeyMap.curSoul;
            var oldSoul = self.getDataByKey(key);
            console.log("consumeSoul oldSoul:"+oldSoul);
            if (oldSoul.isGreaterThanOrEqualTo(soul)) {
                self.setDataByKey(key, oldSoul.minus(soul));
                Events.emit(Events.ON_SOUL_CHANGE);
            } else {
                console.error("soul is not enough.");
            }
        } else {
            console.error("type error, 'soul' must be a BigNumber.");
        }
    },
    // 消费仙丹
    consumeRuby (ruby) {
        var key = this.KeyMap.ruby;
        var old = this.getDataByKey(key);
        this.setDataByKey(key, (old-ruby) );
        Events.emit(Events.ON_RUBY_CHANGE);
    },
    consumeRebirthSoul() {
        const self = this;
        var key = self.KeyMap.rebirthSoul;
        var oldSoul = self.getDataByKey(key);
        self.setDataByKey(key, (new BigNumber(0)));
        return oldSoul;
    },
    getRealRebirthSoul() {
        var num = DataCenter.getDataByKey(this.KeyMap.rebirthSoul);
        return num.plus(2)
    },

    // 金币是否足够
    isGoldEnough(price) {
        const self = this;
        if (BigNumber.isBigNumber(price)) {
            var key = self.KeyMap.curGold;
            var curGold = self.getDataByKey(key);
            return curGold.isGreaterThanOrEqualTo(price);
        } else {
            console.error("type error, 'gold' must be a BigNumber.");
            return false;
        }
    },
    
    // 英魂是否足够
    isSoulEnough(soul) {
        const self = this;
        if (BigNumber.isBigNumber(soul)) {
            var key = self.KeyMap.curSoul;
            var curSoul = self.getDataByKey(key);
            console.log("isSoulEnough curSoul:"+curSoul);
            return curSoul.isGreaterThanOrEqualTo(soul);
        } else {
            console.error("type error, 'soul' must be a BigNumber.");
            return false;
        }
    },
    
    // 仙桃是否足够
    isRubyEnough(ruby) {
        var key = this.KeyMap.ruby;
        var old = this.getDataByKey(key);
        return old >= ruby
    },

    getGoldStr () {
        const self = this;
        var key = self.KeyMap.curGold;
        var curGold = self.getDataByKey(key);
        return Formulas.formatBigNumber(curGold);
    },

    getSoulStr () {
        const self = this;
        var key = self.KeyMap.curSoul;
        var curSoul = self.getDataByKey(key);
        return Formulas.formatBigNumber(curSoul);
    },

    updataMaxPassLevel(level) {
        const self = this;
        var key = self.KeyMap.maxPassLavel;
        var curPassLevel = self.getDataByKey(key);
        if (curPassLevel) {
            if (level > curPassLevel) {
                self.setDataByKey(key, level);
                Events.emit(Events.ON_MAXLEVEL_UPDATE);
            }
        } else {
            self.setDataByKey(key, level);
            Events.emit(Events.ON_MAXLEVEL_UPDATE);
        }
    },

    passLevel (level) {
        const self = this;
        var key = self.KeyMap.passLavel;
        var curPassLevel = self.getDataByKey(key);
        if (curPassLevel) {
            if (level > curPassLevel) {
                self.setDataByKey(key, level);
                self.updataMaxPassLevel(level);
                Events.emit(Events.ON_LEVEL_PASSED);
            }
        } else {
            self.setDataByKey(key, level);
            self.updataMaxPassLevel(level);
            Events.emit(Events.ON_LEVEL_PASSED);
        }
    },

    isLevelPassed (level) {
        const self = this;
        var key = self.KeyMap.passLavel;
        var curPassLevel = self.getDataByKey(key);
        return curPassLevel >= level;
    },

    saveCloudData (data) {
        const self = this;
        if (data) {
            self.setDataByKey("CloudData", data);
        }
    },

    getCloudData () {
        const self = this;
        var cloudData = self.getDataByKey("CloudData");
        if (cloudData) {
            return cloudData;
        }
    },

    getCloudDataByKey (key) {
        const self = this;
        var cloudData = self.getDataByKey("CloudData");
        if (key && cloudData && cloudData.gamedata && cloudData.gamedata[key]) {
            return cloudData.gamedata[key];
        }
    },

    rebirth () {
        const self = this;
        var rebirthSoul = self.consumeRebirthSoul();
        // self.addSoul(rebirthSoul.plus(2));
        PublicFunc.popGoldDialog(1,rebirthSoul.plus(2))
        self.setDataByKey(self.KeyMap.curGold, (new BigNumber(0)));
        self.setDataByKey(self.KeyMap.passLavel, 0);
    },

});