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

        //--------古神的影响--------
        addGoldenDpsTimes : 0,// 第一个古神 会影响数值 0.02++
        addPrimalBossOdds : 0,// 增加远古Boss出现几率
        addPowersurgeSecond : 0,// Powersurge秒数增加 2s++
        addCritTimes : 1,//古神附加暴击倍数
        addClickstormSecond : 0, //点击风暴秒数增加 2s++
        addBossTimerSecond : 0,// Boss计时器持续时间
        buyHeroDiscount : 1,// 购买英雄折扣 0~1
        addTreasureOdds : 0.01,// 宝箱出现概率
        addMetalDetectorSecond : 0,// 金币探测器 2s++
        addTenfoldGoldOdds : 0, // 普怪 宝箱 10倍金币的概率
        addClickDamageTimes : 1,// 点击伤害倍数 每级+20%
        addSuperClickSecond : 0,// 超级点击时间 2s++
        addDPSClickDamageTimes : 0,// 附加DPS点击伤害倍数
        addGoldClickSecond : 0,//点金手时间 2s++
        addLeaveGoldTimes : 1,// 闲置金币倍数
        addGoldTimes : 1,//+5% Gold
        addTreasureTimes : 1,//宝箱金币倍数
        addGoldClickTimes : 1,// 点金手倍数 +30% gold from Golden Clicks 
        addLeaveDPSTimes : 1,//加闲置DPS伤害
        addCritStormSecond : 0,//增加暴击风暴时间 +2s
        addSkillCoolReduction : 0,//技能冷却减少

        //--------被动技能的影响--------
        cskCritTimes : 1, // 暴击倍数 :calCritTimes()
        cskCritOdds : 0, // 附加暴击概率 :calCritOdds()
        //--------主动技能的影响--------
        powersurgeTimes : 1,//能量风暴DPS倍数 触发技能时 改为对应倍数，技能结束要改回为1 :refresh()
        skCritOdds : 0,// 当开启暴击风暴时 设置为0.5 结束改回0 :calCritOdds()
        skGoldTimes : 1,// 当开启金币探测器时 改为2 结束为1 :calGoldTimes()
        skDPSTimes : 1,// 当使用一次黑暗仪式，乘以1.05 :refresh()
        skClickTimes : 1,// 开启超级点击 改为相应倍数 结束改为1 :calClickDamage()

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
                    times*=hero.getGlobalDPSTimes();
                }
            });
            this.globalDPSTimes = times * this.skDPSTimes;
        },
        // 计算全局金币倍数
        calGoldTimes(){
            let times = 1;
            HeroDatas.heroList.forEach(hero => {
                if (hero.isBuy) {
                    times*=hero.getGlobalGoldTimes();
                }
            });
            // 伪代码
            // let t = game.isLeave? this.addLeaveGoldTimes : 1; 然后乘上去
            this.globalGoldTimes = times * this.skGoldTimes * addGoldTimes;
        },
        // 计算总DPS伤害
        calDPSDamage(){
            let dps = new BigNumber(0);
            HeroDatas.heroList.forEach(hero => {
                if (hero.isBuy&&hero.isPassive) {
                    dps = dps.plus(hero.DPS)
                }
            });
            this.dpsDamage = dps.times(this.globalDPSTimes).times(this.powersurgeTimes);
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
            this.clickDamage = baseClickDamage.plus(1).plus(this.DPSClickDamage).times(this.skClickTimes);
            // this.clickDamage = HeroDatas.getHero(0).DPS + 1 + this.DPSClickDamage;
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
    }
})