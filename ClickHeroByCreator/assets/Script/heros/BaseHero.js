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

    // 重置英雄，转身时使用
    clear(isReset){
        this.isActive = false;
        this.isBuy = false;
        this.level = 0;
        this.cost = new BigNumber(0);
        this.DPS = new BigNumber(0);
        this.skills.forEach(sk => {
            sk.isBuy = false;
        });
        this.calGoldByLvUnit();
        if (isReset) {
            this.golden = 0
        }
    },

    init(id, heroName, baseCost, baseDPS, isBuy, desc, cloudHeroInfo) {
        this.isPassive = !(id == 0);
        this.id = id;
        this.heroName = heroName;
        this.baseCost = new BigNumber(baseCost);
        this.baseDPS = new BigNumber(baseDPS);
        this.isBuy = isBuy;
        var skills = CfgMgr.getHeroSkills(id);
        this.skills = skills ? skills : [];

        // 从云端数据恢复英雄技能列表
        if (cloudHeroInfo) {
            this.level = cloudHeroInfo.level?cloudHeroInfo.level:0;
            this.golden = cloudHeroInfo.golden?cloudHeroInfo.golden:0;
            if (cloudHeroInfo.skills) {
                for (let skillID = 0; skillID < this.skills.length; skillID++) {
                    if (cloudHeroInfo.skills[skillID]) {
                        this.skills[skillID].isBuy = true;
                    
                    }
                }
            }
        }
        this.calGoldByLvUnit();
        this.isActive = DataCenter.isGoldEnough(this.getBaseCost());
        this.desc = desc;
        this.refresh();
        Events.on(Events.ON_GOLD_CHANGE, this.onGoldChange, this);
        // Events.on(Events.ON_HERO_LVUNIT_CHANGE, this.calGoldByLvUnit, this);
        return this;
    },

    // 折后购买价
    getBaseCost(){
        // return this.baseCost.times(GameData.buyHeroDiscount).integerValue();
        return this.getCost();
    },
    // 折后升级价
    getCost(){
        return this.cost.times(GameData.buyHeroDiscount).integerValue();
    },

    calGoldByLvUnit(){
        var unit = GameData.heroLvUnit;
        if (this.isPassive) {
            this.cost = Formulas.getHeroCostByLevel(this.baseCost,this.level,unit);
        } else {
            this.cost = Formulas.getClickHeroCostByLevel(this.level,unit);
        }
    },

    onGoldChange () {
        const self = this;
        if (!self.isActive) {
            var isCanBy = DataCenter.isGoldEnough(this.getBaseCost());
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
        obj.level = this.level;
        obj.golden = this.golden;
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
        var isCanBy = DataCenter.isGoldEnough(this.getBaseCost());
        var cost = new BigNumber(this.getBaseCost());
        // let isSuccess = true;
        if (isCanBy) {
            this.level += GameData.heroLvUnit;
            this.isBuy = true;
            this.refresh();
            GameData.calDPSDamage()
            GameData.calClickDamage()
            // this.isPassive ? GameData.calDPSDamage() : GameData.calClickDamage();

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
        var isCanUpgrade = DataCenter.isGoldEnough(this.getCost());
        var cost = new BigNumber(this.getCost());
        if (isCanUpgrade) {
            this.level += GameData.heroLvUnit;
            this.refresh();
            GameData.calDPSDamage()
            GameData.calClickDamage()
            // this.isPassive ? GameData.calDPSDamage() : GameData.calClickDamage();

            DataCenter.consumeGold(cost);
            Events.emit(Events.ON_UPGRADE_HERO, this.id);
            return true;
        } else {
            return false;
        }
    },

    // 升级金身
    upgradeGolden(){
        var isCanUpgrade = DataCenter.isRubyEnough(GameData.upGoldenRuby);
        if (isCanUpgrade) {
            DataCenter.consumeRuby(GameData.upGoldenRuby)
            this.golden ++;
            this.refresh();
            GameData.calDPSDamage()
            GameData.calClickDamage()
            // this.isPassive ? GameData.calDPSDamage() : GameData.calClickDamage();
            Events.emit(Events.ON_UPGRADE_HERO, this.id);
            return true
        } else {
            return false
        }
    },
    // // 回收金身 当转移金身时 使用
    // delGolden(){
    //     var g = this.golden;
    //     this.golden = 0;
    //     this.refresh();
    //     GameData.calDPSDamage();
    //     return g;
    // },
    // 增加金身 当转移金身时 使用
    addGolden(golden){
        this.golden += golden;
        this.refresh();
        GameData.calDPSDamage()
        GameData.calClickDamage()
    },

    buySkill(skillID,isInstant){
        if (this.skills) {
            let skill = this.skills[skillID];
            if (this.level >= skill.level && skill.isBuy == false) {
                var cost = new BigNumber(skill.cost);
                var isCanBuy = DataCenter.isGoldEnough(cost);
                if (isCanBuy) {
                    if (this.id == 19 && skillID == 3) {
                        if (isInstant) {
                            return false
                        }
                        // 弹出对话框
                        var num = DataCenter.getRealRebirthSoul();
                        PublicFunc.popDialog({
                            contentStr: "这将清空你的英雄等级和游戏关卡和妖丹，并获得"+Formulas.formatBigNumber(num)+"仙丹，每个仙丹+10%DPS("+Formulas.formatBigNumber(num.div(10))+"%)，你愿意回到500年前吗？",
                            btnStrs: {
                                left: '是 的',
                                right: '不，谢谢'
                            },
                            onTap: function (dialog, bSure) {
                                if (bSure) {
                                    try {
                                        Events.emit(Events.CLOSE_DIALOG)
                                        DataCenter.consumeGold(cost);
                                        PublicFunc.rebirth(); // 处理转生逻辑
                                    } catch (error) {
                                        console.error(error);
                                    }
                                }
                            }
                        });
                    } else {
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
            else if(skill.gold)
            {
                result = "获得的妖丹增加" + (skill.gold -1)*100+"%";
            }else if(this.id == 39 && skillID == 2){
                result = "春十三娘\nDPS伤害+500,000,000%"
            }else if(this.id == 39 && skillID == 3){
                result = "女儿国国王\nDPS伤害+10,000,000,000%"
            }
            return result;
        }
    },  

    refresh() {
        if (this.isBuy) {
            if (this.isPassive) {
                this.DPS = Formulas.getDPS(this.baseDPS, this.level, this.getDPSTimes());
                // this.cost = Formulas.getHeroCost(this.baseCost, this.level + 1);
            } else {
                this.DPS = Formulas.getClickDPS(this.level, this.getDPSTimes());
                // this.cost = Formulas.getClickHeroCost(this.level);
            }
            if (this.id == 39) {
                HeroDatas.getHero(5).refresh()
                HeroDatas.getHero(15).refresh()
            }
        }
        this.calGoldByLvUnit();
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
        if (this.id == 5) {
            let hero39 = HeroDatas.getHero(39)
            if (hero39 && hero39.isBuy && hero39.skills[2].isBuy) {
                times *= 5000001
            }
        } else if(this.id == 15){
            let hero39 = HeroDatas.getHero(39)
            if (hero39 && hero39.isBuy && hero39.skills[3].isBuy) {
                times *= 100000001
            }
        }
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
    // 增加暴击伤害
    getBjDamage(){
        let times = 0;
        if (this.skills) { 
            this.skills.forEach(skill => {
                if (skill.isBuy && skill.bjDamage) {
                    times += skill.bjDamage;
                }
            });
        }
        return times;
    },
    // 增加暴击概率
    getBjOdds(){
        let odds = 0;
        if (this.skills) { 
            this.skills.forEach(skill => {
                if (skill.isBuy && skill.bjProbability) {
                    odds += skill.bjProbability;
                }
            });
        }
        return odds;
    },
    // 获得下一级DPS增益
    getNextAddDPS(){
        if (this.isPassive) {
            return Formulas.getDPS(this.baseDPS, this.level+1, this.getDPSTimes()).minus(this.DPS);
        } else {
            return Formulas.getClickDPS(this.level+1, this.getDPSTimes()).minus(this.DPS);
        }
    },
});
