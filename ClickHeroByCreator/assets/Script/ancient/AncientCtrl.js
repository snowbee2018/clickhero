

cc.Class({
    extends: cc.Component,

    properties: {
        sv : cc.ScrollView,
        itemPrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    setHeroList () {
        const self = this;
        for (let heroID = 0; heroID < HeroDatas.heroList.length; heroID++) {
            var flag = false;
            if (heroID == 0 || heroID == 1 || heroID == 2) {
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
    // update (dt) {},
});
