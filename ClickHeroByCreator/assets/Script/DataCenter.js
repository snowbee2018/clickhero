cc.Class({
    
    ctor () {
        const self = this;
        self.KeyMap = {
            lastTime: "lastEnterGameTime", // 最近一次保存数据的时间
            // 所有当前必须要保存的数据，用于恢复现场
            monsterInfo: "monsterInfo", // 怪物信息，关卡，序号，是否宝箱，剩余血量，存json
            passLavel: "passLavel", // 已通过的最高关卡
            curDiamond: "curDiamond", // 当前钻石数量
            curGold: "curGold", // 当前金币数量
            curSoul: "curSoul", // 当前英魂数量
            additionalSoul: "additionalSoul", // 由雇佣兵完成任务而附加的英魂数量，英雄等级加成的英魂不在此列
            heroList: "heroList", // 用户所有英雄的状态，用json存起来
            skillList: "skillList", // 所有主动技能的状态，同样存json,主要是要记录技能是否激活的和最后使用的时间，以便确定何时冷却完毕
            achievementList: "achievementList", // 成就列表，存json，转生次数也在这里
            equipmentList: "equipmentList", // 装备列表，存json，圣遗物和神器都存这里
            shopList: "shopList", // 钻石商店商品列表，存json，用户的购买状态也存里面
            lansquenetList: "lansquenetList", // 雇佣兵列表，存json，任务的完成状态也存里面

            curSetting: "curSetting", // 当前设置信息
        }
        self.ContentData = {}
        self.DataMap = {
            WXUserInfo: "WXUserInfo", // 当前用户微信信息
        }
        
    },

    // 读取本地用户数据之后用来初始化
    init () {
        const self = this;
        self.setDataByKey(self.KeyMap.curGold, (new BigNumber("9e+99")));
        // self.setDataByKey(self.KeyMap.curGold, (new BigNumber("0")));
        this.setDataByKey(this.KeyMap.curSoul , new BigNumber("30"));
    },

    setDataByKey (key, params) {
        const self = this;
        // console.info("key = " + key);
        if (params && key) {
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
});