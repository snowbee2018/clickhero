// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        heroList: cc.ScrollView,
        heroItemPrefab: cc.Prefab,
    },

    ctor () {
        const self = this;
        self._heroItemMap = {}
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    setHeroList () {
        const self = this;
        for (let heroID = 0; heroID < HeroDatas.heroList.length; heroID++) {
            var flag = false;
            if (heroID == 0) {
                flag = true;
            } else {
                var hero = HeroDatas.getHero(heroID);
                if (hero.isActive) {
                    flag = true;
                } else {
                    var isCanBy = DataCenter.isGoldEnough(hero.baseCost);
                    if (isCanBy) {
                        flag = true;
                    }
                }
            }
            if (flag) {
                self.addHeroItem(heroID);
            }
        }
        Events.on(Events.HERO_ACTIVE, self.onHeroActive, self);
    },

    addHeroItem(heroID) {
        const self = this;
        var listItemNode = cc.instantiate(self.heroItemPrefab);
        listItemNode.parent = self.heroList.content;
        listItemNode.getComponent("HeroListItem").setItem(heroID);
        self._heroItemMap[heroID] = true;
    },

    onHeroActive (heroID) {
        const self = this;
        if (heroID != 0) {
            var hero = HeroDatas.getHero(heroID);
            if (hero.isActive) {
                if (!self._heroItemMap[heroID]) {
                    self.addHeroItem(heroID);
                }
            }
        }
        
        
    },
});
