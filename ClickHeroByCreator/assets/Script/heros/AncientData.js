// 古神

cc.Class({
    properties: {
        id : 0,
        isActive : false,// 是否被随机选中
        isBuy : false,// 是否被购买
        name : "",
        // skills : [],
        level : 0,
        // cost : 0,//升级花费
        desc : "",
        soul : 0,
    },

    init(id,isActive,isBuy,name,level,desc){
        this.id = id;
        this.isActive = isActive;
        this.isBuy = isBuy;
        this.name = name;
        this.level = level;
        this.desc = desc;
        this.soul = new BigNumber(this.soul);
        if (level > 0 ) {
            this.calSoulByLvUnit();
        }
        return this;
    },

    formatInfo(){
        var obj = {}
        obj.id = this.id;
        obj.isActive = this.isActive;
        obj.isBuy = this.isBuy;
        obj.level = this.level;
        return obj;
    },

    buy(){
        let soul = HeroDatas.getBuyAncientSoul();
        soul = new BigNumber(soul);
        var isCanBy = DataCenter.isSoulEnough(soul);
        if (isCanBy) {
            DataCenter.consumeSoul(soul);
            this.isBuy = true;
            this.level ++;
            this.calSoulByLvUnit();
            HeroDatas.myAncients.push(this);
            this.refresh();
            Events.emit(Events.ON_BUY_ANCIENT,this.id);
            Events.emit(Events.ON_UPGRADE_ANCIENT,this.id);
            return true;
        } else {
            return false;
        }
    },

    calSoulByLvUnit(){
        var unit = GameData.ancientLvUnit;
        this.soul = Formulas.getAncientSoulByLevel(this.id,this.level,unit);
    },

    // 获得升级花费
    getSoul(){
        return this.soul.times(GameData.gdAncientSale).integerValue();//这里到时候会要加折扣
    },

    upgrade(){
        var soul = this.getSoul();
        var isCanUpgrade = DataCenter.isSoulEnough(soul);
        soul = new BigNumber(soul);
        if (isCanUpgrade) {
            this.level += GameData.ancientLvUnit;
            DataCenter.consumeSoul(soul);
            this.calSoulByLvUnit();
            this.refresh();
            Events.emit(Events.ON_UPGRADE_ANCIENT,this.id);
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
            // 增加远古boss出现几率
            var odds = 0.75 * (1 - Math.exp(-0.013*this.level));
            GameData.addPrimalBossOdds = odds;
        } else if (this.id == 3) {
            // + 2s Powersurge持续时间
            GameData.addPowersurgeSecond = this.level * 2;
        } else if (this.id == 4) {
            // +15% 暴击伤害 
            GameData.addCritTimes = 1 + this.level * 0.15;
            GameData.calCritTimes();
        } else if (this.id == 5) {
            // 减少boss生命 -5×(1-e^-0.002n) * 10% boss生命
            // 感觉太废物了 所以懒得做
        } else if (this.id == 6) {
            // + 2s Clickstorm持续时间
            GameData.addClickstormSecond = this.level * 2;
        } else if (this.id == 7) {
            // boss计时器 增加 30×(1-e^-0.034n)
            GameData.addBossTimerSecond = 30 * (1 - Math.exp(-0.034*this.level));
        } else if (this.id == 8) {
            // 英雄费用降低 99.99999999×(1-e^-0.01n)
            GameData.buyHeroDiscount = 1 - 0.9999999999 * (1 - Math.exp(-0.01*this.level));
            Events.emit(Events.REFRESH_HERO_BUYCOST);
        } else if (this.id == 9) {
            // 	宝箱出现概率 基于0.01 9900×(1-e^-0.002n)
            GameData.addTreasureOdds = 0.01 + 0.01 * (9900 * (1 - Math.exp(-0.02*this.level))/100.0);
        } else if (this.id == 10) {
            // 增加金币探测器持续时间2s MetalDetector
            GameData.addMetalDetectorSecond = this.level * 2;
        } else if (this.id == 11) {
            // 普怪 宝箱 10倍金币的概率
            GameData.addTenfoldGoldOdds = 1 - Math.exp(-0.0025*this.level);
        } else if (this.id == 12) {
            // +20% click damage
            GameData.addClickDamageTimes = 1 + 0.2 * this.level;
            GameData.calClickDamage();
        } else if (this.id == 13) {
            // 	+2s Super Clicks duration
            GameData.addSuperClickSecond = this.level * 2;
        } else if (this.id == 14) {
            // 连击DPS倍数
            GameData.addDPSClickDamageTimes = 0.0001*this.level;
            GameData.refresh();
            // 计算点击伤害
        } else if (this.id == 15) {
            // +2s Golden Clicks duration
            GameData.addGoldClickSecond = this.level * 2;
        } else if (this.id == 16) {
            // 减少每关怪物数量
            GameData.addMinusMonsterNum = -8*(1-Math.exp(-.025*this.level))
        } else if (this.id == 17) {
            // 加挂机金币
            let lv = this.level - 99;//纳税等级'
            let diff = 0;
            if (lv > 0) {
                let c = Math.min(Math.ceil(lv / 10),15);
                for (let i = 0; i < c; i++) {
                    diff += (lv - i * 10);
                }
            }
            GameData.addLeaveGoldTimes = 1 + this.level*0.25 - diff*0.01;//需要判断挂机
        } else if (this.id == 18) {
            // +5% Gold
            GameData.addGoldTimes = 1 + this.level * 0.05;
            GameData.calGoldTimes();
        } else if (this.id == 19) {
            // 宝箱金币倍数
            GameData.addTreasureTimes = 1 + 0.5 * this.level;//直接使用
        } else if (this.id == 20) {
            // soul dps 不做
        } else if (this.id == 21) {
            // 	空闲时每个未分配的自动点击器+ 10％Gold（没有点击60秒）。 放弃。。
        } else if (this.id == 22) {
            // +30% gold from Golden Clicks 
            GameData.addGoldClickTimes = 1 + 0.3*this.level;
        } else if (this.id == 23) {
            // 红宝石掉落后可点击双重红宝石的机会增加
        } else if (this.id == 24) {
            // 加挂机DPS伤害
            let lv = this.level - 99;//纳税等级'
            let diff = 0;
            if (lv > 0) {
                let c = Math.min(Math.ceil(lv / 10),15);
                for (let i = 0; i < c; i++) {
                    diff += (lv - i * 10);
                }
            }
            GameData.addLeaveDPSTimes = 1 + this.level*0.25 - diff*0.01;//需要判断挂机
            console.log("GameData.addLeaveDPSTimes:" + GameData.addLeaveDPSTimes);
            GameData.refresh()
        } else if (this.id == 25) {
            // 增加暴击风暴时间 +2s
            GameData.addCritStormSecond = this.level * 2;
        } else if (this.id == 26) {
            // 技能冷却减少 75×(1-e-0.026n)
            GameData.addSkillCoolReduction = 0.75 * (1 - Math.exp(-0.026*this.level));
        }
    },

    // calUpgradeSoul(){
    //     var soul;
    //     // 每个英雄都不一样哦，根据id去区分 by level
    //     if ([1,4,12,17,18,19,22,24].indexOf(this.id)>=0) {
    //         soul = new BigNumber(this.level + 1);
    //     } else if([2,3,5,6,7,8,9,10,11,13,15,16,23,25,26].indexOf(this.id)>=0) {
    //         soul = new BigNumber(2).pow(new BigNumber(this.level + 1));
    //     } else if([14,21].indexOf(this.id)>=0) {
    //         // soul = Math.pow(this.level + 1,1.5);
    //         // BigNumber只支持整数指数运行
    //         soul = new BigNumber(this.level + 1).pow(new BigNumber(1.5));
    //     } else if(this.id == 20) {
    //         soul = new BigNumber(1);
    //     } else {
    //         soul = new BigNumber(1);
    //     }
    //     this.soul = soul.integerValue(); 
    //     return this.soul;
    // },

    getDesc(){
        let desc = ""
        if (this.id == 1) {
            // 所有金身倍数 加 2%
            desc = "+" + (this.level * 2) + "%金身伤害" // 需要bigNumber
        } else if (this.id == 2) {
            // 增加远古boss出现几率
            desc = "+" + (GameData.getPrimalBossOdds()*100).toFixed(4) + "%的妖王出现概率"
        } else if (this.id == 3) {
            // + 2s Powersurge持续时间
            desc = "+" + (this.level * 2) + "s三头六臂持续时间"
        } else if (this.id == 4) {
            // +15% 暴击伤害 
            desc = "+" + (this.level * 15) + "%暴击伤害" // 需要bigNumber
        } else if (this.id == 5) {
            // 减少boss生命 -5×(1-e^-0.002n) * 10% boss生命
            // 感觉太废物了 所以懒得做
        } else if (this.id == 6) {
            // + 2s Clickstorm持续时间
            desc = "+" + (this.level * 2) + "s猴子猴孙持续时间"
        } else if (this.id == 7) {
            // boss计时器 增加 30×(1-e^-0.034n)  需要bigNumber
            desc = "+" + GameData.getBossTimerSecond().toFixed(4) + "秒Boss战时长"
        } else if (this.id == 8) {
            // 英雄费用降低 99.99999999×(1-e^-0.01n)
            desc = "-" + (99.99999999 * (1 - Math.exp(-0.01*this.level))).toFixed(4) + "%解锁和升级英雄花费"
        } else if (this.id == 9) {
            // 	宝箱出现概率 基于0.01 9900×(1-e^-0.002n)
            desc = "+" + (GameData.getTreasureOdds()*100-1).toFixed(4) + "%的葫芦妖出现概率"
        } else if (this.id == 10) {
            // 增加金币探测器持续时间2s MetalDetector
            desc = "+" + (this.level * 2) + "s火眼金睛持续时间"
        } else if (this.id == 11) {
            // 普怪 宝箱 10倍金币的概率
            desc = "+" + (GameData.addTenfoldGoldOdds*100).toFixed(4) + "%的小妖和葫芦妖10倍妖丹概率"
        } else if (this.id == 12) {
            // +20% click damage
            desc = "+" + (20 * this.level) + "%点击伤害" // 需要bigNumber
        } else if (this.id == 13) {
            // 	+2s Super Clicks duration
            desc = "+" + (this.level * 2) + "s如意金箍持续时间"
        } else if (this.id == 14) {
            // 附加DPS点击伤害倍数
            desc = "+" + (0.01*this.level) + "%连击DPS伤害"
        } else if (this.id == 15) {
            // +2s Golden Clicks duration
            desc = "+" + (this.level * 2) + "s点石成金持续时间"
        } else if (this.id == 16) {
            // 减少每关怪物数量 暂时不要
            desc = "每关"+GameData.getMinusMonsterNum().toFixed(4)+"个怪数量"
        } else if (this.id == 17) {
            // 加挂机金币
            desc = "+" + ((GameData.addLeaveGoldTimes-1)*100).toFixed(4) + "%挂机时妖丹"
        } else if (this.id == 18) {
            // +5% Gold
            desc = "+" + (5*this.level) + "%妖丹倍数"
        } else if (this.id == 19) {
            // 宝箱金币倍数
            desc = "+" + (50*this.level*GameData.gdTreasureTimes).toFixed(4) + "%葫芦妖丹倍数"
        } else if (this.id == 20) {
            // soul dps 不做
        } else if (this.id == 21) {
            // 	空闲时每个未分配的自动点击器+ 10％Gold（没有点击60秒）。 放弃。。
        } else if (this.id == 22) {
            // +30% gold from Golden Clicks 
            desc = "+" + (30*this.level) + "%点石成金倍数"
        } else if (this.id == 23) {
            // 红宝石掉落后可点击双重红宝石的机会增加
        } else if (this.id == 24) {
            // 加挂机DPS伤害
            desc = "+" + ((GameData.addLeaveDPSTimes-1)*100).toFixed(4) + "%挂机时DPS伤害"
        } else if (this.id == 25) {
            // 增加暴击风暴时间 +2s
            GameData.addCritStormSecond = this.level * 2;
            desc = "+" + (this.level * 2) + "s暴击风暴持续时间"
        } else if (this.id == 26) {
            // 技能冷却减少 75×(1-e-0.026n)
            desc = "-" + (GameData.addSkillCoolReduction*100).toFixed(4) + "%技能冷却时间"
        }
        return desc;
    },
})