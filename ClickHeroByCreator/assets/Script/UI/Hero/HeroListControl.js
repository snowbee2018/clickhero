
cc.Class({
    extends: require('MySV'),

    properties: {
        heroList: cc.ScrollView,
        heroItemPrefab: cc.Prefab,
        heroRes: cc.SpriteAtlas,
        skillRes: cc.SpriteAtlas,
    },

    ctor () {
        const self = this;
        self._heroItemMap = {}
    },

    // onLoad () {},

    start () {
        
    },

    getHeroIconSprf(heroID) {
        let result = this.heroRes.getSpriteFrame(String(heroID));
        if (!result) {
            console.error('找不到英雄图片，heriID = ' + heroID);
        } else {
            return result;
        }
    },

    getSkillIconSprf(iconName) {
        let result = this.skillRes.getSpriteFrame(iconName);
        if (!result) {
            console.error('找不到被动技能图片，iconName = ' + iconName);
        } else {
            return result;
        }
    },

    setHeroList () {
        let curGold = DataCenter.getDataByKey(DataCenter.KeyMap.curGold);
        for (let id = 0; id < HeroDatas.heroList.length; id++) {
            this.addHeroItem(id);
            var hero = HeroDatas.getHero(id);
            if (!hero.isBuy&&new BigNumber(hero.baseCost).gt(curGold)) {
                break
            }
        }
        Events.on(Events.ON_GOLD_CHANGE, this.onGoldChange, this);
        // const self = this;
        // var id = 0;
        // for (let heroID = 0; heroID < HeroDatas.heroList.length; heroID++) {
        //     if (heroID == 0 || heroID == 1 || heroID == 2) {
        //         id = heroID;
        //     } else {
        //         var hero = HeroDatas.getHero(heroID);
        //         if (hero.isBuy) {
        //             id = heroID;
        //         }
        //     }
        // }
        
        // for (let heroID = 0; heroID <= id; heroID++) {
        //     self.addHeroItem(heroID);
        // }
        // var mapKeys = Object.keys(self._heroItemMap);
        // var id = parseInt(mapKeys[mapKeys.length - 1]);
        // var h = HeroDatas.getHero(id + 1);
        // // console.log(h);
        // if (h) {
        //     self.addHeroItem(id + 1);
        // }
        // var h1 = HeroDatas.getHero(id + 2);
        // // console.log(h);
        // if (h1) {
        //     self.addHeroItem(id + 2);
        // }
        
        // Events.on(Events.ON_BY_HERO, self.onBuyHero, self);
    },

    addHeroItem(heroID) {
        const self = this;
        var listItemNode = cc.instantiate(self.heroItemPrefab);
        listItemNode.getComponent("HeroListItem").setItem(this, heroID, viewRect);
        listItemNode.parent = self.heroList.content;
        listItemNode.y = heroID * -140 - 70
        listItemNode.zIndex = 100 - heroID
        let wPos = self.heroList.content.parent.convertToWorldSpaceAR(cc.v2(0, 0));
        let view = self.heroList.content.parent;
        let viewSize = cc.size(view.width, view.height);
        let viewRect = cc.rect(
            wPos.x - viewSize.width/2,
            wPos.y - viewSize.height / 2,
            viewSize.width,
            viewSize.height
        );

        self._heroItemMap[heroID] = true;
        listItemNode.active = false

        this.heroList.content.height = 140 * this.heroList.content.childrenCount
        this.pushItem(listItemNode)
    },

    onGoldChange () {
        let curGold = DataCenter.getDataByKey(DataCenter.KeyMap.curGold);
        let maxId
        for (let id = 0; id < HeroDatas.heroList.length; id++) {
            var hero = HeroDatas.getHero(id);
            if (!hero.isBuy&&new BigNumber(hero.baseCost).gt(curGold)) {
                maxId = id
                break
            }
            // if (!this._heroItemMap[id]) {
            //     this.addHeroItem(id);
            //     var hero = HeroDatas.getHero(id);
            //     if (!hero.isBuy&&new BigNumber(hero.baseCost).gt(curGold)) {
            //         return
            //     }
            // }
        }
        if (maxId) {
            for (let id = 1; id <= maxId; id++) {
                if (!this._heroItemMap[id]) {
                    this.addHeroItem(id);
                }
            }
        }
    },
    // onBuyHero (heroID) {
    //     const self = this;
    //     if (heroID != 0) {
    //         var h = HeroDatas.getHero(heroID + 1);
    //         if (h && !self._heroItemMap[heroID + 1]) {
    //             self.addHeroItem(heroID + 1);
    //         }
    //         var h1 = HeroDatas.getHero(heroID + 2);
    //         if (h1 && !self._heroItemMap[heroID + 2]) {
    //             self.addHeroItem(heroID + 2);
    //         }
    //     }
    // },

    rebirth () {
        const self = this;
        self._heroItemMap = {}
        this.clearItems()
        self.heroList.content.removeAllChildren();
        // Events.off(Events.ON_BY_HERO, self.onBuyHero, self);
        Events.off(Events.ON_GOLD_CHANGE, self.onGoldChange, self);
        self.setHeroList();
    },
});
