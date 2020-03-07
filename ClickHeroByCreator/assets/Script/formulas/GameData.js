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

        playerStatus : 1,// 玩家状态 0:combo 1:挂机
        clickCombo : 0,

        heroLvUnit: 1, // 英雄等级单位 1 10 25 100 1000 10000
        ancientLvUnit: 1,// 古神等级单位 1 10 25 100 1000 10000 -1

        upGoldenRuby : 30,

        //--------为统计数据--------
        idleTimes : 1,
        idleGoldTimes : 1,
        heroGlobalDPSTimes : 1,
        comboDPSTimes : 1,
        heroGoldTimes : 1,
        soulDPSTimes : 1,
        //--------古神的影响--------
        //说明：//[id][* 家恒支持][- 监听ON_UPGRADE_ANCIENT改变UI]
        addGoldenDpsTimes : 1,      //1- 所有金身加成倍数2% 0.02++ √
        addPrimalBossOdds : 0,      //2* 增加远古Boss出现几率 0~0.75 ?
        addPowersurgeSecond: 0,    //3*- Powersurge秒数增加 2s++ √
        addCritTimes : 1,           //4 古神附加暴击倍数 √
        addMinusBoosLife : 0,      //5 减Boss生命值
        addClickstormSecond: 0,    //6*- 猴子猴孙秒数增加 2s++ √
        addBossTimerSecond: 0,     //7* Boss计时器持续时间 0~30.0s √
        buyHeroDiscount : 1,        //8- 购买英雄折扣 0~1 √
        addTreasureOdds: 0.01,     //9* 宝箱出现概率 0~1 √
        addMetalDetectorSecond: 0, //10*- 金币探测器 2s++ √
        addTenfoldGoldOdds : 0,     //11* 普怪 宝箱 10倍金币的概率 0~1 √
        addClickDamageTimes : 1,    //12- 点击伤害倍数 每级+20% √
        addSuperClickSecond: 0,    //13*- 如意金箍时间 2s++ √
        addDPSClickDamageTimes : 0, //14- 连击DPS倍数 √
        addGoldClickSecond: 0,     //15*- 点金手时间 2s++ √
        addMinusMonsterNum: 0,     //16   减怪数
        addLeaveGoldTimes : 0,      //17- 挂机金币加成 √
        addGoldTimes: 1,           //18* +5% Gold √
        addTreasureTimes: 1,       //19* 宝箱金币倍数 √
        addSoulDPSTimes : 0,       //20  11%仙丹伤害加成
        addAutoIdleTimes: 0,       //21 自动点击的挂机DPS加成
        addGoldClickTimes: 1,      //22*- 点金手倍数 +30% gold from Golden Clicks √
        addLeaveDPSTimes : 0,       //24- 加挂机DPS伤害 √
        addCritStormSecond: 0,     //25*- 增加暴击风暴时间 +2s √
        addSkillCoolReduction: 0,  //26*- 技能冷却减少 0~1 √

        //--------商店的影响--------
        gdDayDPSTimes : 1, //1 每天叠一次的永久伤害叠加
        gdShareDPSTimes : 1, //16 呼朋唤友
        gdDayGoldTimes : 1, //14 每天叠一次的永久金币
        gdDoubleGold : 1, //2 双倍金币
        gdDoubleDPS : 1, //3 双倍DPS
        gdAutoClick : 0,//4 自动点击数量
        gd10xDpsTimes : 1,//6 10倍DPS
        gdLeaveTimes : 1,//7 挂机效力倍数
        gdAncientSale : 1,//8 古神升级折扣*
        gdDPSTimes : 1,//9 DPS倍数
        gdGoldTimes : 1,//10 仙丹获取倍数*
        gdSoulTimes : 1,//15 英魂获取倍数*
        gdPBossTimes : 1,//11 addPrimalBossOdds倍数
        gdPBossTSTimes : 1,//12 addBossTimerSecond倍数
        gdTreasureTimes : 1,//13 addTreasureTimes倍数
        gdSoulDPSTimes : 1,//17 addSoulDPSTimes倍数
        gdMinusMonsterNumTimes : 1,//18 addMinusMonsterNum倍数
        gdMinusBoosLifeTimes : 1,//19 addMinusBoosLife倍数
        ngdSoulTimes : 1,// new 15
        //--------被动技能的影响--------
        // cskCritTimes : 1, // 暴击倍数 :calCritTimes()
        // cskCritOdds : 0, // 附加暴击概率 :calCritOdds()
        //--------主动技能的影响--------
        powersurgeTimes : 1,//三头六臂DPS倍数 触发技能时 改为对应倍数，技能结束要改回为1 :refresh()
        skCritOdds : 0,// 当开启暴击风暴时 设置为0.5 结束改回0 :calCritOdds()
        skGoldTimes : 1,// 当开启金币探测器时 改为2 结束为1 :calGoldTimes()
        skDPSTimes : 1,// 当使用一次祭天大典，乘以1.05 :refresh()
        skClickTimes : 1,// 开启如意金箍 改为相应倍数 结束改为1 :calClickDamage()
        //--------装备的影响--------
        eqSkill : [],// 猴子猴孙 +10*v,三头六臂 +1x*v,暴击风暴 +1%*x,火眼金睛 +1x*v,如意金箍 +1x*v
        eqAncient : [], // 
        eqGoods : [],

        // 购买技能时触发
        // 刷新全局DPS倍数
        // 刷新全局金币倍数
        // 刷新DPS伤害
        // 刷新全局点击附加
        // 刷新暴击倍数
        // 刷新暴击倍率
        // 刷新点击伤害
        refresh(async){
            if (async) {
                if (!this.needRefresh) {
                    this.needRefresh = true
                    setTimeout(function() {
                        this.needRefresh = false
                        this.refresh()
                    }.bind(this), 10);
                }
            } else {
                this.calGlobalDPSTimes();
                this.calGoldTimes();
                this.calDPSDamage();
                this.calDPSClickDamage();
                this.calClickDamage();
                this.calCritTimes();
                this.calCritOdds();
            }
        },
        refreshDamage(){
            this.calDPSDamage();
            this.calDPSClickDamage();
            this.calClickDamage();
            this.calCritTimes();
            this.calCritOdds();
        },
        refreshComboDPS(){
            if (this.playerStatus == 0&&this.addDPSClickDamageTimes>0) {
                this.refresh()
            }
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
            this.heroGlobalDPSTimes = times
            this.skDPSTimes = Math.pow(1.05,DataCenter.getSkill6Data().count)
            let idleTimes = (this.playerStatus==1?this.addLeaveDPSTimes*this.gdLeaveTimes:0) + 1
            let idleAutoTimes = (this.playerStatus==1?this.addAutoIdleTimes*this.gdLeaveTimes:0) + 1
            idleTimes *= idleAutoTimes
            this.idleTimes = idleTimes
            // console.log("英雄的times" + times)
            // console.log("skDPSTimes" + this.skDPSTimes)
            // console.log("idleTimes" + idleTimes)
            // console.log("this.gdShareDPSTimes" + this.gdShareDPSTimes)
            // console.log("this.gdDayDPSTimes" + this.gdDayDPSTimes)
            // console.log("this.gdDPSTimes" + this.gdDPSTimes)
            // console.log("this.gdDoubleDPS" + this.gdDoubleDPS)
            // console.log("this.gd10xDpsTimes" + this.gd10xDpsTimes)
            this.globalDPSTimes = times * this.skDPSTimes * idleTimes*this.gdShareDPSTimes
                *this.gdDayDPSTimes*this.gdDPSTimes*this.gdDoubleDPS*this.gd10xDpsTimes;

                // console.log("this.globalDPSTimes" + this.globalDPSTimes)
            if (this.playerStatus == 0) {
                this.comboDPSTimes = (1+this.addDPSClickDamageTimes*this.clickCombo)
                this.globalDPSTimes = this.globalDPSTimes * this.comboDPSTimes
            }
            this.soulDPSTimes = 1 + (DataCenter.getDataByKey(DataCenter.KeyMap.curSoul)*0.1 + this.addSoulDPSTimes*this.gdSoulDPSTimes)
            this.globalDPSTimes *= this.soulDPSTimes
            // console.log("this.addSoulDPSTimes" + this.addSoulDPSTimes)
            // console.log("this.gdSoulDPSTimes" + this.gdSoulDPSTimes)
            // console.log("this.globalDPSTimes" + this.globalDPSTimes)
        },
        // 计算全局金币倍数
        calGoldTimes(){
            let times = 1;
            HeroDatas.heroList.forEach(hero => {
                if (hero.isBuy) {
                    times*=hero.getGlobalGoldTimes();
                }
            });
            this.heroGoldTimes = times
            let idleTimes = (this.playerStatus==1?this.addLeaveGoldTimes*this.gdLeaveTimes:0) + 1
            this.idleGoldTimes = idleTimes
            this.globalGoldTimes = this.heroGoldTimes * this.skGoldTimes * this.addGoldTimes
                 * idleTimes * this.gdDoubleGold * this.gdDayGoldTimes * this.gdGoldTimes;
        },
        // 计算总DPS伤害
        calDPSDamage(){
            let dps = new BigNumber(0);
            HeroDatas.heroList.forEach(hero => {
                if (hero.isBuy&&hero.isPassive) {
                    dps = dps.plus(hero.DPS)
                }
            });
            // console.log("计算总的dps")
            // console.log("this.globalDPSTimes"+this.globalDPSTimes)
            // console.log("this.powersurgeTimes"+this.powersurgeTimes)     
            this.dpsDamage = dps.times(this.globalDPSTimes).times(this.powersurgeTimes)
            // console.log("this.dpsDamage"+this.dpsDamage)
            if (!this.dpsDamage.eq(this._tempDpsDamage)) {
                this._tempDpsDamage = this.dpsDamage
                // console.log("this._tempDpsDamage"+this._tempDpsDamage)
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
            this.DPSClickDamage = this.dpsDamage.times(times);
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
            let times = 1;
            HeroDatas.heroList.forEach(hero => {
                if (hero.isBuy) {
                    times+=hero.getBjDamage();
                }
            });
            this.critTimes = times * this.addCritTimes;
        },
        // 计算点击暴击概率
        calCritOdds(){
            let odds = 0;
            HeroDatas.heroList.forEach(hero => {
                if (hero.isBuy) {
                    odds+=hero.getBjOdds();
                }
            });
            this.critOdds = odds + this.skCritOdds;
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
        getAddPrimalBossOdds() {
            return this.addPrimalBossOdds * this.gdPBossTimes;
        },
        // 实际妖王概率
        getPrimalBossOdds(){
            var zonesRule = this.getZonesRule() * -0.02
            var odds = 0.25 + this.getAddPrimalBossOdds() + zonesRule
            odds = Math.max(odds,0.05)
            return odds
        },
        // 每500关为一个区
        getZonesRule(){
            var lv = DataCenter.getDataByKey(DataCenter.KeyMap.passLavel)
            return Math.floor(lv / 500)
        },
        getMonsterHpTimes(lv){
            let hpTimes = 1
            if (lv % 5 == 0) {
                hpTimes = Math.max(1 + this.addMinusBoosLife*this.gdMinusBoosLifeTimes
                     + Math.floor((lv-1)/500)*0.04, 0.5)
            }
            return hpTimes
        },
        // 获得Boss计时增加时间
        getAddBossTimerSecond() {
            return this.addBossTimerSecond * this.gdPBossTSTimes;
        },
        // 获得Boss计时时间
        getBossTimerSecond() {
            return this.addBossTimerSecond * this.gdPBossTSTimes + 30 + this.getZonesRule()*-2
        },
        // 获得add宝箱出现概率
        getAddTreasureOdds() {
            return this.addTreasureOdds
        },
        // 获得宝箱出现概率
        getTreasureOdds() {
            let n = Math.floor(this.getZonesRule())
            return this.addTreasureOdds * Math.pow(0.994,n)
        },
        // 获得宝箱倍数
        getTreasureTimes() {
            return this.addTreasureTimes * this.gdTreasureTimes;
        },

        getMinusMonsterNum() {
            return this.addMinusMonsterNum * this.gdMinusMonsterNumTimes
        },
        // 根据关卡等级 获得怪数
        getZoneMonsterCount(lv){
            let c = Math.floor(10 + (lv-1)/500*0.1 + this.getMinusMonsterNum())
            return Math.max(c,2)
        },
    }
})