// 古神

cc.Class({
    properties: {
        id : 0,
        isActive : false,
        isBuy : false,
        name : "",
        // skills : [],
        level : 0,
        // cost : 0,//升级花费
    },

    init(id,isActive,isBuy,name,level){
        this.id = id;
        this.isActive = isActive;
        this.isBuy = isBuy;
        this.name = name;
        this.level = level;
    },

    buy(){
        let soul = HeroDatas.getBuyAncientSoul();
        // 伪代码
        var isCanBy = DataCenter.isSoulEnough(soul);//--
        soul = new BigNumber(soul);
        if (isCanBy) {
            this.level ++;
            this.isBuy = true;
            this.refresh();//？？？
            // 这里要根据类型去调用，
            if (this.type == TYPE.DPS) {
                GameData.calDPSDamage();
            } else if (this.type == TYPE.CLICK){
                GameData.calClickDamage();
            }// 还有很多乱七八糟的 封装到refresh里

            DataCenter.consumeSoul(soul);//--
            Events.emit(Events.ON_BY_ANCIENT, this.id);//--
            return true;
        } else {
            return false;
        }
    },

    upgrade(){
        // 伪代码
        var soul = this.calUpgradeSoul();
        var isCanUpgrade = DataCenter.isSoulEnough(soul);
        soul = new BigNumber(soul);
        if (isCanUpgrade) {
            this.level ++;
            this.refresh();
            // 这里要根据类型去调用，
            if (this.type == TYPE.DPS) {
                GameData.calDPSDamage();
            } else if (this.type == TYPE.CLICK){
                GameData.calClickDamage();
            }// 还有很多乱七八糟的 封装到refresh里

            DataCenter.consumeSoul(soul);//--
            Events.emit(Events.ON_BY_ANCIENT, this.id);//--
            return true;
        } else {
            return false;
        }

    },

    calUpgradeSoul(){
        // 每个英雄都不一样哦，根据id去区分 by level
        return 1;
    },
})