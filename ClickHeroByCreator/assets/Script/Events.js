
cc.Class({
    statics: {
        ON_GAME_START: "on_game_start",
        ON_GOLD_CHANGE : "on_gold_change", // 金币变化
        ON_SOUL_CHANGE : "on_soul_change", // 魂变化
        ON_RUBY_CHANGE : "on_ruby_change", // 仙丹变化
        ON_BY_HERO: "on_by_hero", // 购买英雄
        ON_UPGRADE_HERO : 'on-upgrade-hero', //升级英雄
        ON_UPGRADE_HERO_SKILLS : 'on-upgrade-hero-skills',//升级英雄技能
        REFRESH_HERO_BUYCOST : 'refresh-hero-buycost',//刷新购买英雄金币UI
        HERO_ACTIVE : "hero_active",
        ON_USER_SKILL_UNLOCK : "on_user_skill_unlock",
        ON_BUY_ANCIENT : 'on-buy-ancient',// 购买古神
        ON_UPGRADE_ANCIENT : 'on-upgrade-ancient',// 升级古神
        ON_BUY_GOODS : 'on-buy-goods',// 购买商品
        ON_IDLE_STATE: "ON_IDLE_STATE", // 闲置状态改变
        ON_COMBO_CHANGE: "ON_COMBO_CHANGE", // 连击次数改变
        // ON_HERO_LVUNIT_CHANGE: "ON_HERO_LVUNIT_CHANGE",// 英雄升级单位改变
        ON_ANCIENT_LVUNIT_CHANGE: "ON_ANCIENT_LVUNIT_CHANGE",// 古神升级单位改变
        ON_HEROLVUNIT_CHANGE: "ON_HEROLVUNIT_CHANGE", // 英雄升级单位改变
        // ON_UPGRADE_HERO : 'on-upgrade-hero',
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