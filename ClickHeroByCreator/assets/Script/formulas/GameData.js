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
        clickCrit : 1,// 暴击倍数
        clickCritOdds : 0,// 暴击概率

        //--------古神的影响--------
        addGoldenDpsTimes : 0,// 第一个古神 会影响数值 0.02++
        addPrimalBossOdds : 0,// 增加远古Boss出现几率
        addPowersurgeSecond : 0,// Powersurge秒数增加 2s++
        addBjTimes : 0,//古神附加暴击倍数
        addClickstormSecond : 0, //点击风暴秒数增加 2s++
        addBossTimerSecond : 0,// Boss计时器持续时间

        //--------技能的影响--------
        powersurgeTimes : 1,//能量风暴DPS倍数 触发技能时 改为对应倍数，技能结束要改回为1


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
            this.calClickCrit();
            this.calClickCritOdds();
        },
        // 计算全局DPS倍数
        calGlobalDPSTimes(){
            let times = 1;
            HeroDatas.heroList.forEach(hero => {
                if (hero.isBuy) {
                    times*=hero.getGlobalDPSTimes();
                }
            });
            this.globalDPSTimes = times;
        },
        // 计算全局金币倍数
        calGoldTimes(){
            let times = 1;
            HeroDatas.heroList.forEach(hero => {
                if (hero.isBuy) {
                    times*=hero.getGlobalGoldTimes();
                }
            });
            this.globalGoldTimes = times;
        },
        // 计算总DPS伤害
        calDPSDamage(){
            let dps = new BigNumber(0);
            HeroDatas.heroList.forEach(hero => {
                if (hero.isBuy&&hero.isPassive) {
                    dps = dps.plus(hero.DPS)
                }
            });
            this.dpsDamage = dps.times(this.globalDPSTimes).times(powersurgeTimes);
        },
        // 计算点击附加伤害
        calDPSClickDamage(){
            let times = 0;
            HeroDatas.heroList.forEach(hero => {
                if (hero.isBuy&&hero.isPassive) {
                    times+=hero.getDPSClickTimes();
                }
            });
            this.DPSClickDamage = times;
        },

        // 计算总点击伤害
        calClickDamage() {
            var baseClickDamage = new BigNumber(HeroDatas.getHero(0).DPS);
            this.clickDamage = baseClickDamage.plus(1).plus(this.DPSClickDamage);
            // this.clickDamage = HeroDatas.getHero(0).DPS + 1 + this.DPSClickDamage;
        },
        // 计算点击暴击倍数
        calClickCrit(){

        },
        // 计算点击暴击概率
        calClickCritOdds(){

        },

        //====下面是针对古神的====
        refreshGoldenHero(){
            HeroDatas.heroList.forEach(hero => {
                if (hero.golden > 0) {
                    hero.refresh();
                }
            });
            this.calDPSDamage();
        },
    }
})