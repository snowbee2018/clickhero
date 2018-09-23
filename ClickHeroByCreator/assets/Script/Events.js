
cc.Class({
    statics: {
        ON_GOLD_CHANGE : "on_gold_change", // 金币变化
        ON_BY_HERO: "on_by_hero", // 购买英雄
        ON_UPGRADE_HERO : 'on-upgrade-hero', //升级英雄
        ON_UPGRADE_HERO_SKILLS : 'on-upgrade-hero-skills',//升级英雄技能
        // ON_UPGRADE_HERO = 'on-upgrade-hero',
        // ON_UPGRADE_HERO = 'on-upgrade-hero',
        // ON_UPGRADE_HERO = 'on-upgrade-hero',
        emit(name,params){
            cc.systemEvent.emit(name,params);
        },
        on(name,callback,target){
            cc.systemEvent.on(name,callback,target);
        },
        off(name, callback, target) {
            cc.systemEvent.off(name, callback, target);
        },
    },
})