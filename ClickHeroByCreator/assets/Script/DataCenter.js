cc.Class({
    
    ctor () {
        const self = this;
        self.KeyMap = {
            lastTime: "lastEnterGameTime", // 最近一次保存数据的时间
            // 所有当前必须要保存的数据，用于恢复现场
            totalClick: "totalClick", // 历史总点击数
            maxCombo: "maxCombo", // 历史最大连击数
            monsterInfo: "monsterInfo", // 怪物信息，关卡，序号，是否宝箱，剩余血量
            passLavel: "passLavel", // 当前世界已通过的最高关卡
            curDiamond: "curDiamond", // 当前钻石数量
            curGold: "curGold", // 当前金币数量
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

            curSetting: "curSetting", // 当前设置信息
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
        // 初始化金币
        var cloudGold = self.getCloudDataByKey(self.KeyMap.curGold);
        if (cloudGold) {
            self.setDataByKey(self.KeyMap.curGold, (new BigNumber(cloudGold)));
        } else {
            // self.setDataByKey(self.KeyMap.curGold, (new BigNumber("9e+9999")));
            self.setDataByKey(self.KeyMap.curGold, (new BigNumber("10000")));
        }
        // 初始化英魂
        var cloudSoul = self.getCloudDataByKey(self.KeyMap.curSoul);
        if (cloudSoul) {
            self.setDataByKey(self.KeyMap.curSoul, (new BigNumber(cloudSoul)));
        } else {
            self.setDataByKey(self.KeyMap.curSoul, (new BigNumber("3000")));
        }
        // 初始化仙丹
        var cloudSoul = self.getCloudDataByKey(self.KeyMap.ruby);
        if (cloudSoul) {
            self.setDataByKey(self.KeyMap.ruby, Number(cloudSoul));
        } else {
            self.setDataByKey(self.KeyMap.ruby, 3000);
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
            self.setDataByKey(self.KeyMap.passLavel, passedLevel);
        } else {
            self.setDataByKey(self.KeyMap.passLavel, 0);
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

    // 金币增加
    addGold (gold) {
        const self = this;
        if (BigNumber.isBigNumber(gold)) {
            var key = self.KeyMap.curGold;
            var oldGold = self.getDataByKey(key);
            self.setDataByKey(key, oldGold.plus(gold));
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
    // 仙丹增加
    addRuby (ruby) {
        var key = this.KeyMap.ruby;
        var old = this.getDataByKey(key);
        this.setDataByKey(key, (old+ruby) );
        Events.emit(Events.ON_RUBY_CHANGE);
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
        var key = self.KeyMap.curSoul;
        var oldSoul = self.getDataByKey(key);
        self.setDataByKey(key, (new BigNumber(0)));
        return oldSoul;
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
    
    // 仙丹是否足够
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

    passLevel (level) {
        const self = this;
        var key = self.KeyMap.passLavel;
        var curPassLevel = self.getDataByKey(key);
        if (curPassLevel) {
            if (level > curPassLevel) {
                self.setDataByKey(key, level);
            }
        } else {
            self.setDataByKey(key, level);
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
        self.addSoul(rebirthSoul);
        self.setDataByKey(self.KeyMap.curGold, (new BigNumber(0)));
        self.setDataByKey(self.KeyMap.passLavel, 0);
    },
});