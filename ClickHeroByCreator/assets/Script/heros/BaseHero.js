let CfgMgr = require("LocalCfgMgr");

cc.Class({
    // name : "Hero",//用于序列化
    properties: {
        isActive : false,
        isBuy : false,
        isPassive : false,//被动
        id : 0,
        heroName : "",
        baseCost : 0,
        baseDPS : 0,
        skills : [],
        level : 0,
        cost : 0,//升级花费
        DPS : 0,//当前dps
        golden : 0,//金身等级
        desc: "",
    },

    init(id, heroName, baseCost, baseDPS, isBuy, desc, cloudHeroInfo) {
        this.isPassive = !(id == 0);
        this.id = id;
        this.heroName = heroName;
        this.baseCost = new BigNumber(baseCost);
        this.baseDPS = new BigNumber(baseDPS);
        this.isBuy = isBuy;
        this.skills = CfgMgr.getHeroSkills(id);

        // 从云端数据恢复英雄技能列表
        if (cloudHeroInfo && ) {
            if (cloudHeroInfo.skills) {
                for (let skillID = 0; skillID < this.skills.length; skillID++) {
                    if (cloudHeroInfo.skills[skillID]) {
                        this.skills[skillID].isBuy = true;
                    
                }
            }
            // todo
        }

        this.isActive = DataCenter.isGoldEnough(this.baseCost);
        this.desc = desc;
        this.refresh();
        Events.on(Events.ON_GOLD_CHANGE, this.onGoldChange, this);
        return this;
    },

    onGoldChange () {
        const self = this;
        if (!self.isActive) {
            var isCanBy = DataCenter.isGoldEnough(this.baseCost);
            if (isCanBy) {
                self.isActive = isCanBy;
                Events.emit(Events.HERO_ACTIVE, this.id);
            }
        }
    },

    formatHeroInfo() { // 格式化存档数据，用于存储到云端和从云端恢复数据
        var obj = {}
        obj.id = this.id;
        obj.isBuy = this.isBuy;
        obj.skills = [];
        for (let skillID = 0; skillID < this.skills.length; skillID++) {
            const skill = this.skills[skillID];
            obj.skills.push(skill.isBuy);
        }
        return obj;
    },

    buy(){
        // 伪代码
        // let isSuccess = UserData.spendGold(this.baseCost);
        var isCanBy = DataCenter.isGoldEnough(this.baseCost);
        var cost = new BigNumber(this.baseCost);
        // let isSuccess = true;
        if (isCanBy) {
            this.level ++;
            this.isBuy = true;
            this.refresh();
            this.isPassive ? GameData.calDPSDamage() : GameData.calClickDamage();

            DataCenter.consumeGold(cost);
            Events.emit(Events.ON_BY_HERO, this.id);
            return true;
        } else {
            return false;
        }
    },

    // 升级
    upgrade(){
        // 伪代码
        var isCanUpgrade = DataCenter.isGoldEnough(this.cost);
        var cost = new BigNumber(this.cost);
        // let isSuccess = true;
        // let isSuccess = UserData.spendGold(this.cost);
        if (isCanUpgrade) {
            this.level ++;
            this.refresh();
            this.isPassive ? GameData.calDPSDamage() : GameData.calClickDamage();

            DataCenter.consumeGold(cost);
            Events.emit(Events.ON_UPGRADE_HERO, this.id);
            return true;
        } else {
            return false;
        }
    },

    // 升级金身
    upgradeGolden(){
        this.golden ++;
        // 然后计算dps啊
        this.refresh();
        this.isPassive ? GameData.calDPSDamage() : GameData.calClickDamage();
        Events.emit(Events.ON_UPGRADE_HERO, this.id);
    },
    // 回收金身 当转移金身时 使用
    delGolden(){
        var g = this.golden;
        this.golden = 0;
        this.refresh();
        GameData.calDPSDamage();
        return g;
    },
    // 增加金身 当转移金身时 使用
    addGolden(golden){
        this.golden += golden;
        this.refresh();
        GameData.calDPSDamage();
    },

    buySkill(skillID){
        if (this.skills) {
            let skill = this.skills[skillID];
            if (this.level >= skill.level && skill.isBuy == false) {
                var cost = new BigNumber(skill.cost);
                var isCanBuy = DataCenter.isGoldEnough(cost);
                if (isCanBuy) {
                    this.skills[skillID].isBuy = true;
                    // 刷新全局点击附加
                    // 刷新全局DPS倍数
                    // 刷新全局金币倍数
                    // 刷新点击伤害
                    // 刷新DPS伤害
                    // 刷新暴击倍数
                    // 刷新暴击倍率
                    this.refresh();
                    GameData.refresh();
                    if (this.skills[skillID].unlock) {
                        Events.emit(Events.ON_USER_SKILL_UNLOCK, {
                            heroID: this.id,
                            skillID: skillID,
                        });
                    }
                    DataCenter.consumeGold(cost);
                    Events.emit(Events.ON_UPGRADE_HERO_SKILLS, {
                        heroID: this.id,
                        skillID: skillID,
                    });
                    return true;
                }
            }
        }
        return false;
    },

    getSkillDesc (skillID) {
        // console.log("skillID = " + skillID);
        // console.log("skillID = " + skillID);
        if (skillID < this.skills.length) {
            var skill = this.skills[skillID];
            var result = "";
            if (skill.globalDPS) {
                result = "全局DPS伤害×" + skill.globalDPS;
            } else if (skill.heroDPS) {
                if (this.isPassive) {
                    result = this.heroName + "DPS伤害×" + skill.heroDPS;
                } else {
                    result = "点击伤害×" + skill.heroDPS;
                }
            } else if (skill.bjDamage) {
                result = "暴击伤害倍数增加" + skill.bjDamage;
            } else if (skill.bjProbability) {
                result = "暴击概率增加" + skill.bjProbability;
            } else if (skill.unlock) {
                result = "解锁主动技能" + skill.unlock;
            } else if (skill.DPSClick) {
                result = "将DPS伤害的" + skill.DPSClick * 100 + "%增加到点击伤害";
            }
            return result;
        }
    },

    refresh() {
        if (this.isBuy) {
            if (this.isPassive) {
                this.DPS = Formulas.getDPS(this.baseDPS, this.level, this.getDPSTimes());
                this.cost = Formulas.getHeroCost(this.baseCost, this.level + 1);
            } else {
                this.DPS = Formulas.getClickDPS(this.level, this.getDPSTimes());
                this.cost = Formulas.getClickHeroCost(this.level);
            }
        }
    },
    // DPS倍数
    getDPSTimes(){
        let times = 1;
        if (this.skills) {
            this.skills.forEach(skill => {
                if (skill.isBuy && skill.heroDPS) {
                    times *= skill.heroDPS;
                }
            });
        }
        // 金身
        times *= (1+this.golden*0.5 + GameData.addGoldenDpsTimes);
        return times;
    },
    // 全局DPS倍数
    getGlobalDPSTimes(){
        let times = 1;
        if (this.skills) {
            this.skills.forEach(skill => {
                if (skill.isBuy && skill.globalDPS) {
                    times *= skill.globalDPS;
                }
            });
        }
        return times;
    },
    // 全局金币倍数
    getGlobalGoldTimes(){
        let times = 1;
        if (this.skills) {
            this.skills.forEach(skill => {
                if (skill.isBuy && skill.gold) {
                    times *= skill.gold;
                }
            });
        }
        return times;
    },
    // 附加点击伤害倍数
    getDPSClickTimes(){
        let times = 0;
        if (this.skills) { 
            this.skills.forEach(skill => {
                if (skill.isBuy && skill.DPSClick) {
                    times += skill.DPSClick;
                }
            });
        }
        return times;
    },
});
