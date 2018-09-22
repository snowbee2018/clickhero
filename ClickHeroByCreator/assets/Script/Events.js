
cc.Class({

    statics: {
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
    },
})