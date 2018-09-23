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
            let dps = 0;
            HeroDatas.heroList.forEach(hero => {
                if (hero.isBuy&&hero.isPassive) {
                    dps+=hero.DPS;
                }
            });
            this.dpsDamage = dps * this.globalDPSTimes;
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
        calClickDamage(){
            this.clickDamage = HeroDatas.getHero(0).DPS + 1 + this.DPSClickDamage;
        },
        // 计算点击暴击倍数
        calClickCrit(){

        },
        // 计算点击暴击概率
        calClickCritOdds(){

        },
    }
})