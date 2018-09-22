// 这里管理Hero列表
var BaseHero = require("BaseHero");
cc.Class({
    statics:{
        heroList = [
            new BaseHero(0,"冒险家",5,1),
            new BaseHero(1,"树妖",50,5),
            new BaseHero(2,"亦凡",250,22),
            new BaseHero(3,"沙滩公主",1000,74),
            new BaseHero(4,"厨子",20000,976),
            new BaseHero(5,"蒙面武士",1e+5,3725),
            new BaseHero(6,"里昂",4e+5,10859),
            new BaseHero(7,"大森林先知",2.5e+6,47143),
            new BaseHero(8,"刺客",1.5e+7,1.869e5),
            new BaseHero(9,"冰箱学徒",1.000e8,7.820e5),
            new BaseHero(10,"利刃女公爵",8.000e8,3.721e6),
            new BaseHero(11,"赏金猎人",6.500e9,1.701e7),
            new BaseHero(12,"火法师",5.000e10,6.948e7),
            new BaseHero(13,"国王护卫",4.500e11,4.607e8),
            new BaseHero(14,"国王",4.000e12,3.017e9),
            new BaseHero(15,"冰箱法师",3.600e13,2.000e10),
            new BaseHero(16,"阿巴顿",3.200e14,1.310e11),
            new BaseHero(17,"马祖",2.700e15,8.147e11),
            new BaseHero(18,"阿蒙",2.400e16,5.335e12),
            new BaseHero(19,"兽王",3.000e17,4.914e13),
        ],
        getHore(id){
            return this.heroList[id];
        },
    }
});
