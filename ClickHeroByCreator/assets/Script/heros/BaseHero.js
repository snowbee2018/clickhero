let SkillMgr = require("SkillMgr");

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
    ctor(id,heroName,baseCost,baseDPS){
        this.isPassive = !(id == 0);
        this.id = id;
        this.heroName = heroName;
        this.baseCost = baseCost;
        this.baseDPS = baseDPS;
        this.skills = SkillMgr.getSkillObj(id);
    },

    buy(){
        // 伪代码
        let isSuccess = UserData.spendGold(this.baseCost);
        if (isSuccess) {
            this.level ++;
            this.isBuy = true;
            this.refresh();
            return true;
        } else {
            return false;
        }
    },
    
    // 升级
    upgrade(){
        // 伪代码
        let isSuccess = UserData.spendGold(this.cost);
        if (isSuccess) {
            this.level ++;
            this.refresh();
            return true;
        } else {
            return false;
        }
    },

    refresh(){
        if (this.isPassive) {
            this.DPS = Formulas.getDPS(this.baseDPS,this.level,this.getDPSTimes());
            this.cost = Formulas.getUpgradeCost(this.baseCost,thos.level+1);
        }else{
            this.DPS = this.level * this.getDPSTimes();//实际要考虑技能
            this.cost = Formulas.getClickHeroCost(this.level);
        }
    },
    
    getDPSTimes(){
        // 根据skills而升级
        let times = 1;
        this.skills.forEach(skill => {
            if (skill.isBuy&&skill.heroDPS) {
                time *= skill.heroDPS;
            }
        });
        return times;
    },
    getGlobalDPSTimes(){
        // 根据skills而升级
        let times = 1;
        this.skills.forEach(skill => {
            if (skill.isBuy&&skill.globalDPS) {
                times *= skill.globalDPS;
            }
        });
        return times;
    },
    getGlobalGoldTimes(){
        // 根据skills而升级
        let times = 1;
        this.skills.forEach(skill => {
            if (skill.isBuy&&skill.gold) {
                times *= skill.gold;
            }
        });
        return times;
    },
});
