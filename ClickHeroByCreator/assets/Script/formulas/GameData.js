/**
 * 游戏实时数值
 * 购买英雄触发 刷新点击伤害||刷新DPS伤害
 * 购买技能触发 refresh
 */

 /**
  * 流程：
  * let hero = HeroDatas.getHero(0);
  * hero.buy(); or hero.upgrade(); or hero.buySkill();
  * use GameData.clickDamage;
  * use GameData.dpsDamage;
  */

cc.Class({
    
    statics: {
        clickDamage : 1,
        dpsDamage : 0,
        DPSClickDamage : 0,
        globalDPSTimes : 1,
        globalGoldTimes : 1,
        critTimes : 1,// 暴击倍数
        critOdds : 0,// 暴击概率

        _tempClickDamage : 1,
        _tempDpsDamage : 0,

        playerStatus : 0,// 玩家状态 0:combo 1:闲置

        heroLvUnit: 1, // 英雄等级单位 1 10 25 100 1000 10000
        ancientLvUnit: 1,// 古神等级单位

        upGoldenRuby : 30,

        //--------古神的影响--------
        //说明：//[id][* 家恒支持][- 监听ON_UPGRADE_ANCIENT改变UI]
        addGoldenDpsTimes : 0,      //1- 所有金身加成倍数2% 0.02++ √
        addPrimalBossOdds : 0,      //2* 增加远古Boss出现几率 0~0.75 ?
        addPowersurgeSecond: 0,    //3*- Powersurge秒数增加 2s++ √
        addCritTimes : 1,           //4 古神附加暴击倍数 √
        addClickstormSecond: 0,    //6*- 毫毛变化秒数增加 2s++ √
        addBossTimerSecond: 0,     //7* Boss计时器持续时间 0~30.0s √
        buyHeroDiscount : 1,        //8- 购买英雄折扣 0~1 √
        addTreasureOdds: 0.01,     //9* 宝箱出现概率 0~1 √
        addMetalDetectorSecond: 0, //10*- 金币探测器 2s++ √
        addTenfoldGoldOdds : 0,     //11* 普怪 宝箱 10倍金币的概率 0~1 √
        addClickDamageTimes : 1,    //12- 点击伤害倍数 每级+20% √
        addSuperClickSecond: 0,    //13*- 如意金箍时间 2s++ √
        addDPSClickDamageTimes : 0, //14- 附加DPS点击伤害倍数 √
        addGoldClickSecond: 0,     //15*- 点金手时间 2s++ √
        addLeaveGoldTimes : 1,      //17- 闲置金币倍数 √
        addGoldTimes: 1,           //18* +5% Gold √
        addTreasureTimes: 1,       //19* 宝箱金币倍数 √
        addGoldClickTimes: 1,      //22*- 点金手倍数 +30% gold from Golden Clicks √
        addLeaveDPSTimes : 1,       //24- 加闲置DPS伤害 √
        addCritStormSecond: 0,     //25*- 增加暴击风暴时间 +2s √
        addSkillCoolReduction: 0,  //26*- 技能冷却减少 0~1 √

        //--------商店的影响--------
        gdDayDPSTimes : 1, //1 每天叠一次的永久伤害叠加
        gdDoubleGold : 1, //2 双倍金币
        gdDoubleDPS : 1, //3 双倍DPS
        gdAutoClick : 0,//4 自动点击数量
        gd10xDpsTimes : 1,//6 10倍DPS
        gdLeaveTimes : 1,//7 挂机效力倍数
        gdAncientSale : 1,//8 古神升级折扣*
        gdDPSTimes : 1,//9 DPS倍数
        gdSoulTimes : 1,//10 英魂获取倍数*
        gdPBossTimes : 1,//11 addPrimalBossOdds倍数
        gdPBossTSTimes : 1,//12 addBossTimerSecond倍数
        gdTreasureOddsTimes : 1,//13 addTreasureOdds倍数

        //--------被动技能的影响--------
        cskCritTimes : 1, // 暴击倍数 :calCritTimes()
        cskCritOdds : 0, // 附加暴击概率 :calCritOdds()
        //--------主动技能的影响--------
        powersurgeTimes : 1,//三头六臂DPS倍数 触发技能时 改为对应倍数，技能结束要改回为1 :refresh()
        skCritOdds : 0,// 当开启暴击风暴时 设置为0.5 结束改回0 :calCritOdds()
        skGoldTimes : 1,// 当开启金币探测器时 改为2 结束为1 :calGoldTimes()
        skDPSTimes : 1,// 当使用一次祭天大典，乘以1.05 :refresh()
        skClickTimes : 1,// 开启如意金箍 改为相应倍数 结束改为1 :calClickDamage()

        // 购买技能时触发
        // 刷新全局DPS倍数
        // 刷新全局金币倍数
        // 刷新DPS伤害
        // 刷新全局点击附加
        // 刷新暴击倍数
        // 刷新暴击倍率
        // 刷新点击伤害
        refresh(){
            this.calGlobalDPSTimes();
            this.calGoldTimes();
            this.calDPSDamage();
            this.calDPSClickDamage();
            this.calClickDamage();
            this.calCritTimes();
            this.calCritOdds();
        },
        // 计算全局DPS倍数
        calGlobalDPSTimes(){
            let times = 1;
            HeroDatas.heroList.forEach(hero => {
                if (hero.isBuy) {
                    var a = hero.getGlobalDPSTimes();
                    times *= a;
                    
                }
            });
            let idleTimes = (this.playerStatus==1?this.addLeaveDPSTimes:1)*this.gdLeaveTimes;
            this.globalDPSTimes = times * this.skDPSTimes * idleTimes
                *this.gdDayDPSTimes*this.gdDPSTimes*this.gdDoubleDPS*this.gd10xDpsTimes;
        },
        // 计算全局金币倍数
        calGoldTimes(){
            let times = 1;
            HeroDatas.heroList.forEach(hero => {
                if (hero.isBuy) {
                    times*=hero.getGlobalGoldTimes();
                }
            });
            let idleTimes = (this.playerStatus==1?this.addLeaveGoldTimes:1)*this.gdLeaveTimes;
            this.globalGoldTimes = times * this.skGoldTimes * this.addGoldTimes * idleTimes * this.gdDoubleGold;
        },
        // 计算总DPS伤害
        calDPSDamage(){
            let dps = new BigNumber(0);
            HeroDatas.heroList.forEach(hero => {
                if (hero.isBuy&&hero.isPassive) {
                    dps = dps.plus(hero.DPS)
                }
            });
            this.dpsDamage = dps.times(this.globalDPSTimes).times(this.powersurgeTimes)
            if (!this.dpsDamage.eq(this._tempDpsDamage)) {
                this._tempDpsDamage = this.dpsDamage
                Events.emit(Events.ON_DPS_DAMAGE_CHANGE);
            }
        },
        // 计算点击附加伤害
        calDPSClickDamage(){
            let times = 0;
            HeroDatas.heroList.forEach(hero => {
                if (hero.isBuy&&hero.isPassive) {
                    times+=hero.getDPSClickTimes();
                }
            });
            this.DPSClickDamage = this.dpsDamage.times(times + this.addDPSClickDamageTimes);
        },

        // 计算总点击伤害
        calClickDamage() {
            var baseClickDamage = new BigNumber(HeroDatas.getHero(0).DPS);
            const soul = DataCenter.getDataByKey(DataCenter.KeyMap.curSoul) || 0
            this.clickDamage = baseClickDamage.plus(1).plus(this.DPSClickDamage)
                .plus(soul).times(this.skClickTimes).times(this.addClickDamageTimes);
            if (!this.clickDamage.eq(this._tempClickDamage)) {
                this._tempClickDamage = this.clickDamage
                Events.emit(Events.ON_CLICK_DAMAGE_CHANGE);
            }
            
        },
        // 计算点击暴击倍数
        calCritTimes(){
            this.critTimes = (2 + this.cskCritTimes) * this.addCritTimes;
        },
        // 计算点击暴击概率
        calCritOdds(){
            this.critOdds = this.cskCritOdds + this.skCritOdds;
        },

        //====下面是针对古神的====
        //刷新金身英雄
        refreshGoldenHero(){
            HeroDatas.heroList.forEach(hero => {
                if (hero.golden > 0) {
                    hero.refresh();
                }
            });
            this.refresh();
        },

        //====下面是游戏区的====
        // 获得增加的远古Boss出现几率（原为0-0.75 现可能大于0.75）
        getPrimalBossOdds() {
            return this.addPrimalBossOdds * this.gdPBossTimes;
        },
        // 获得Boss计时增加时间
        getBossTimerSecond() {
            return this.addBossTimerSecond * this.gdPBossTSTimes;
        },
        // 获得宝箱出现概率
        getTreasureOdds() {
            return this.addTreasureOdds * this.gdTreasureOddsTimes;
        },
    }
})