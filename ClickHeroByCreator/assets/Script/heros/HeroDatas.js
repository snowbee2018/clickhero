// 这里管理Hero列表
var BaseHero = require("BaseHero");
var CfgMgr = require("LocalCfgMgr");

// 召唤费用和重选需要的魂，按照召唤个数递增
var buyAncientSouls = [
    [1,1],
    [2,1],
    [4,2],
    [8,3],
    [16,6],
    [35,12],
    [70,24],
    [125,42],
    [250,84],
    [500,167],
    [800,267],
    [1200,400],
    [1700,567],
    [2200,734],
    [2750,917],
    [3400,1134],
    [4100,1367],
    [5000,1667],
    [6000,2000],
    [7500,2500],
    [10000,3334],
    [12500,4167],
    [16000,5334],
    [25000,8334],
    [35000,11667],
    [50000,16667],
    ];
cc.Class({
    
    statics:{
        heroList : [],
        ancients : [],
        init() {
            for (let heroID = 0; heroID < HerosCfg.length; heroID++) {
                const heroCfg = HerosCfg[heroID];
                var hero = new BaseHero().init(heroID, heroCfg.name, heroCfg.baseCost, heroCfg.baseDPS, false, heroCfg.desc);
                this.heroList.push(hero);
            }

            // this.heroList = [
            //     new BaseHero().init(0,"冒险家",5,1),
            //     new BaseHero().init(1,"树妖",50,5),
            //     new BaseHero().init(2,"亦凡",250,22),
            //     new BaseHero().init(3,"沙滩公主",1000,74),
            //     new BaseHero().init(4,"厨子",20000,976),
            //     new BaseHero().init(5,"蒙面武士",1e+5,3725),
            //     new BaseHero().init(6,"里昂",4e+5,10859),
            //     new BaseHero().init(7,"大森林先知",2.5e+6,47143),
            //     new BaseHero().init(8,"刺客",1.5e+7,1.869e5),
            //     new BaseHero().init(9,"冰箱学徒",1.000e8,7.820e5),
            //     new BaseHero().init(10,"利刃女公爵",8.000e8,3.721e6),
            //     new BaseHero().init(11,"赏金猎人",6.500e9,1.701e7),
            //     new BaseHero().init(12,"火法师",5.000e10,6.948e7),
            //     new BaseHero().init(13,"国王护卫",4.500e11,4.607e8),
            //     new BaseHero().init(14,"国王",4.000e12,3.017e9),
            //     new BaseHero().init(15,"冰箱法师",3.600e13,2.000e10),
            //     new BaseHero().init(16,"阿巴顿",3.200e14,1.310e11),
            //     new BaseHero().init(17,"马祖",2.700e15,8.147e11),
            //     new BaseHero().init(18,"阿蒙",2.400e16,5.335e12),
            //     new BaseHero().init(19,"兽王",3.000e17,4.914e13),
            // ]
            
        },
        getHero(id){
            return this.heroList[id];
        },
        formatHeroList () {
            var arr = []
            for (let heroID = 0; heroID < this.heroList.length; heroID++) {
                const hero = this.heroList[heroID];
                if (hero.isBuy) {
                    var heroInfo = hero.formatHeroInfo();
                    arr.push(heroInfo);
                }
            }
            return JSON.stringify(arr);
        },

        // buy and reroll Ancient
        getBuyAncientSoul(){
            let index = this.ancients.length + 1;
            return buyAncientCosts[index][0];
        },
        getRerollAncientSoul(){
            let index = this.ancients.length + 1;
            return buyAncientCosts[index][1];
        },
    }
});
