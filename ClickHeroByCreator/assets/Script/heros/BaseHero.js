
cc.Class({
    name : "Hero",//用于序列化
    properties: {
        isActive : false,
        isBuy : false,
        id : 0,
        heroName : "",
        sprite : null,//cc.SpriteFrame,
        baseCost : 0,
        baseDPS : 0,
        skills : [],
        level : 0,
        cost : 0,//升级花费
        DPS : 0,//当前dps
    },
    // 升级
    upgrade(){
        // 伪代码
        let isSuccess = UserData.spendGold(this.cost);
        if (isSuccess) {
            this.level ++;
            this.DPS = Formulas.getDPS(this.baseDPS,this.level);
            this.cost = Formulas.getUpgradeCost(this.baseCost,thos.level);
            return true;
        } else {
            return false;
        }
    },
    
    onUpgrade(){
        // 刷新UI
    },
    getDPSTimes(){
        // 根据skills而升级
        return 1;
    },
    getGoldTimes(){
        // 根据skills而升级
        return 1;
    },
});
