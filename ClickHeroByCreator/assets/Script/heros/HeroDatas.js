// 这里管理Hero列表
var BaseHero = require("BaseHero");
var AncientData = require("AncientData");
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
        myAncients : [],// 拥有的
        selAncients : [],// 选中的
        otherAncients : [],// 剩余的
        init() {
            this.buyAncientSouls = buyAncientSouls;
            this.initAncient(true);
            this.initHeros();
        },
        initHeros(){
            var map = DataCenter.KeyMap;
            var herosCloudInfo = DataCenter.getCloudDataByKey(map.heroList);
            for (let heroID = 0; heroID < HerosCfg.length; heroID++) {
                const heroCfg = HerosCfg[heroID];
                if (herosCloudInfo && herosCloudInfo[heroID] && herosCloudInfo[heroID].isBuy == true) {
                    // 从云端数据恢复英雄数据
                    var hero = new BaseHero().init(
                        heroID, heroCfg.name,
                        heroCfg.baseCost,
                        heroCfg.baseDPS,
                        true,
                        heroCfg.desc,
                        herosCloudInfo[heroID]
                    );
                    this.heroList.push(hero);
                } else {
                    var hero = new BaseHero().init(
                        heroID, heroCfg.name,
                        heroCfg.baseCost,
                        heroCfg.baseDPS,
                        false,
                        heroCfg.desc
                    );
                    this.heroList.push(hero);
                }
            }
        },
        initAncient(resumeCloud){
            var map = DataCenter.KeyMap;
            this.myAncients = []
            this.selAncients = []
            this.otherAncients = [
                new AncientData().init(1,false,false,"金身",0,"desc0"),
                new AncientData().init(2,false,false,"远古Bos几率",0,"desc1"),
                new AncientData().init(3,false,false,"能量风暴2s",0,"desc2"),
                new AncientData().init(4,false,false,"暴击哥",0,"desc3"),
                // new AncientData().init(5,false,false,"削弱Boss",0,"desc4"),
                new AncientData().init(6,false,false,"点击风暴2s",0,"desc5"),
                new AncientData().init(7,false,false,"计时器++",0,"desc6"),
                new AncientData().init(8,false,false,"英雄减费",0,"desc7"),
                new AncientData().init(9,false,false,"宝箱概率",0,"desc8"),
                new AncientData().init(10,false,false,"金币探测器2s",0,"desc9"),
                new AncientData().init(11,false,false,"非Boss十倍",0,"desc10"),
                new AncientData().init(12,false,false,"20%点击伤害",0,"desc11"),
                new AncientData().init(13,false,false,"超级点击2s",0,"desc12"),
                // new AncientData().init(14,false,false,"jugg剑圣",0,"desc13"),
                new AncientData().init(15,false,false,"点金手2s",0,"desc14"),
                // new AncientData().init(16,false,false,"Argaiv",0),
                new AncientData().init(17,false,false,"加闲置金币",0,"desc15"),
                new AncientData().init(18,false,false,"+5%Gold",0,"desc16"),
                new AncientData().init(19,false,false,"宝箱金币50%",0,"desc17"),
                // new AncientData().init(20,false,false,"Argaiv",0),
                // new AncientData().init(21,false,false,"Argaiv",0),
                new AncientData().init(22,false,false,"30%点金手",0,"desc18"),
                // new AncientData().init(23,false,false,"Argaiv",0),
                new AncientData().init(24,false,false,"加闲置DPS伤害",0,"desc19"),
                new AncientData().init(25,false,false,"暴击风暴2s",0,"desc20"),
                new AncientData().init(26,false,false,"技能冷却哥",0,"desc21"),
            ];
            if (resumeCloud) {
                let cAncients = DataCenter.getCloudDataByKey(map.ancientList);
                if (cAncients) {
                    let my = cAncients[0]?cAncients[0]:[];
                    let sel = cAncients[1]?cAncients[1]:[];
                    for (let i = 0; i < my.length; i++) {
                        const e = my[i];
                        for (let j = 0; j < this.otherAncients.length;j++ ) {
                            const ancient = this.otherAncients[j];
                            if (ancient.id = e.id) {
                                ancient.isActive = e.isActive;
                                ancient.isBuy = e.isBuy;
                                ancient.level = e.level;
                                this.otherAncients.splice(j,1);
                                this.myAncients.push(ancient);
                                ancient.refresh();
                                ancient.calUpgradeSoul();
                                break;
                            }
                        }
                    }
                    for (let i = 0; i < sel.length; i++) {
                        const e = sel[i];
                        for (let j = 0; j < this.otherAncients.length;j++ ) {
                            const ancient = this.otherAncients[j];
                            if (ancient.id = e.id) {
                                ancient.isActive = e.isActive;
                                ancient.isBuy = e.isBuy;
                                ancient.level = e.level;
                                this.otherAncients.splice(j,1);
                                this.selAncients.push(ancient);
                                break;
                            }
                        }
                    }
                }
            }
            if (this.selAncients.length==0) {
                // 首次随机生成4个选中的古神
                this.initSelAncients();
            }
        },
        getHero(id){
            return this.heroList[id];
        },
        getAncient(id){
            this.otherAncients.forEach(e => {
                if (id == e.id) {
                    return e;
                }
            });
            this.myAncients.forEach(e => {
                if (id == e.id) {
                    return e;
                }
            });
            this.selAncients.forEach(e => {
                if (id == e.id) {
                    return e;
                }
            });
            console.error("getAncient(id) 错误 找不到");
            return null;
        },

        formatHeroList() { // 格式化存档数据，用于存储到云端和从云端恢复数据
            var arr = []
            for (let heroID = 0; heroID < this.heroList.length; heroID++) {
                const hero = this.heroList[heroID];
                var heroInfo = hero.formatHeroInfo();
                arr.push(heroInfo);
            }
            return arr;
        },
        formatAncientList() {
            var arr = [[],[]];
            this.myAncients.forEach(ancient => {
                arr[0].push(ancient.formatInfo());
            });
            this.selAncients.forEach(ancient => {
                arr[1].push(ancient.formatInfo());
            });
            return arr;
        },

        initSelAncients(){
            this.otherAncients=this.otherAncients.concat(this.selAncients);
            this.selAncients = [];
            this.addSelAncient();
            this.addSelAncient();
            this.addSelAncient();
            this.addSelAncient();
            console.log("4个随机的古神产生了！");
        },
        addSelAncient(){
            let count = this.otherAncients.length;
            if (count==0) {
                return;
            }
            let i = Math.floor(Math.random()*count);
            let data = this.otherAncients.splice(i,1)[0];
            this.selAncients.push(data);
        },
        // buy and reroll Ancient
        getBuyAncientSoul(){
            let index = this.myAncients.length;
            let soul = buyAncientSouls[index][0];
            return new BigNumber(soul);
        },
        getRerollAncientSoul(){
            let index = this.myAncients.length;
            let soul = buyAncientSouls[index][1];
            return new BigNumber(soul);
        },
        calAncientSoulByLevel(id,fromLv,toLv){
            var soul;
            var lv = this.level;
            if ([1,4,12,17,18,19,22,24].indexOf(this.id)>=0) {
                soul = new BigNumber(lv*(lv+1)/2-1);
            } else if([2,3,5,6,7,8,9,10,11,13,15,16,23,25,26].indexOf(this.id)>=0) {
                soul = new BigNumber(2).pow(new BigNumber(this.level + 1));
            } else if([14,21].indexOf(this.id)>=0) {
                // soul = Math.pow(this.level + 1,1.5);
                // BigNumber只支持整数指数运行
                soul = new BigNumber(this.level + 1).pow(new BigNumber(1.5));
            } else if(this.id == 20) {
                soul = new BigNumber(1);
            } else {
                soul = new BigNumber(0);
            }
            this.soul = soul.integerValue(); 
            return this.soul;
        },

        // 设置英雄升级单位 1 10 25 100 1000 10000
        setHeroLvUnit(unit){
            GameData.heroLvUnit = unit;
            this.heroList.forEach(hero => {
                // if (hero.isActive) {
                    hero.calGoldByLvUnit();
                // }
            });
        },
    },
});
