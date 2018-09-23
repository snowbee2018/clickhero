let CfgMgr = require("LocalCfgMgr");

cc.Class({
    name : "Hero",//用于序列化
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
    },

    init(id,heroName,baseCost,baseDPS){
        this.isPassive = !(id == 0);
        this.id = id;
        this.heroName = heroName;
        this.baseCost = baseCost;
        this.baseDPS = baseDPS;
        this.skills = CfgMgr.getHeroSkills(id);
        this.refresh();
        return this;
    },

    onGoldChange () {

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

    buySkill(index){
        let skill = this.skills[index];
        let isSuccess = false;
        if (this.level >= skill.level) {
            isSuccess = UserData.spendGold(skill.cost);
            // 刷新全局点击附加
            // 刷新全局DPS倍数
            // 刷新全局金币倍数
            // 刷新点击伤害
            // 刷新DPS伤害
            // 刷新暴击倍数
            // 刷新暴击倍率
            this.refresh();
            GameData.refresh();
        }
        return isSuccess;
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
        this.skills.forEach(skill => {
            if (skill.isBuy&&skill.heroDPS) {
                time *= skill.heroDPS;
            }
        });
        return times;
    },
    // 全局DPS倍数
    getGlobalDPSTimes(){
        let times = 1;
        this.skills.forEach(skill => {
            if (skill.isBuy&&skill.globalDPS) {
                times *= skill.globalDPS;
            }
        });
        return times;
    },
    // 全局金币倍数
    getGlobalGoldTimes(){
        let times = 1;
        this.skills.forEach(skill => {
            if (skill.isBuy&&skill.gold) {
                times *= skill.gold;
            }
        });
        return times;
    },
    // 附加点击伤害倍数
    getDPSClickTimes(){
        let times = 0;
        this.skills.forEach(skill => {
            if (skill.isBuy&&skill.bjDamage) {
                times += skill.bjDamage;
            }
        });
        return times;
    },
});
