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
        var id = 0;
        for (let heroID = 0; heroID < HeroDatas.heroList.length; heroID++) {
            if (heroID == 0 || heroID == 1 || heroID == 2) {
                id = heroID;
            } else {
                var hero = HeroDatas.getHero(heroID);
                if (hero.isBuy) {
                    id = heroID;
                }
            }
        }
        for (let heroID = 0; heroID <= id; heroID++) {
            self.addHeroItem(heroID);
        }
        var mapKeys = Object.keys(self._heroItemMap);
        var id = parseInt(mapKeys[mapKeys.length - 1]);
        var h = HeroDatas.getHero(id + 1);
        console.log(h);
        if (h) {
            self.addHeroItem(id + 1);
        }
        var h1 = HeroDatas.getHero(id + 2);
        console.log(h);
        if (h1) {
            self.addHeroItem(id + 2);
        }
        
        Events.on(Events.ON_BY_HERO, self.onBuyHero, self);
    },

    addHeroItem(heroID) {
        const self = this;
        var listItemNode = cc.instantiate(self.heroItemPrefab);
        listItemNode.parent = self.heroList.content;
        listItemNode.getComponent("HeroListItem").setItem(heroID);
        self._heroItemMap[heroID] = true;
    },

    onBuyHero (heroID) {
        const self = this;
        if (heroID != 0) {
            var h = HeroDatas.getHero(heroID + 1);
            if (h && !self._heroItemMap[heroID + 1]) {
                self.addHeroItem(heroID + 1);
            }
            var h1 = HeroDatas.getHero(heroID + 2);
            if (h1 && !self._heroItemMap[heroID + 2]) {
                self.addHeroItem(heroID + 2);
            }
        }
    },
});
