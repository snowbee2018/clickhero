
cc.Class({
    statics: {
        ON_GOLD_CHANGE : "on_gold_change", // 金币变化
        ON_BY_HERO: "on_by_hero", // 购买英雄
        ON_UPGRADE_HERO : 'on-upgrade-hero', //升级英雄
        ON_UPGRADE_HERO_SKILLS : 'on-upgrade-hero-skills',//升级英雄技能
        HERO_ACTIVE : "hero_active",
        // ON_UPGRADE_HERO = 'on-upgrade-hero',
        // ON_UPGRADE_HERO = 'on-upgrade-hero',
        // ON_UPGRADE_HERO = 'on-upgrade-hero',
        emit  = cc.systemEvent.emit,
        on  = cc.systemEvent.on,
        off  = cc.systemEvent.off,
    },
})