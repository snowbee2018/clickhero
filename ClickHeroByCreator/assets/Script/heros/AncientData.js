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

    refresh(){
        if (this.id == 1) {
            // 所有金身倍数 加 2%
            GameData.addGoldenDpsTimes = this.level * 0.02;
            GameData.refreshGoldenHero();
        } else if (this.id == 2) {
            // + 2s Powersurge持续时间
            GameData.addPowersurgeSecond = this.level * 2;
        } else if (this.id == 2) {
            // +15% 暴击伤害
        } else if (this.id == 2) {
            // 
        } else if (this.id == 2) {
            
        } else if (this.id == 2) {
            
        } else if (this.id == 2) {
            
        } else if (this.id == 2) {
            
        } else if (this.id == 2) {
            
        }
    },

    calUpgradeSoul(){
        var soul = 0;
        // 每个英雄都不一样哦，根据id去区分 by level
        if ([1,4,12,17,18,19,22,24].indexOf(this.id)>=0) {
            soul = this.level + 1;
        } else if([2,3,5,6,7,8,9,10,11,13,15,16,23,25,26].indexOf(this.id)>=0) {
            soul = Math.pow(2,this.level + 1);
        } else if([14,21].indexOf(this.id)>=0) {
            soul = Math.pow(this.level,1.5);
        } else if(this.id == 20) {
            soul = 1;
        } else {
            soul = 1;
        }
        return soul;
    },
})