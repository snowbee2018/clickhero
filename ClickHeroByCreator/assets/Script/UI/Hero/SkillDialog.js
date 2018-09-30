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
        heroNode: cc.Node,
        heroName: cc.Label,
        heroLevel: cc.Label,
        heroDPS: cc.Label,
        list: cc.ScrollView,
        skillItemPrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const self = this;
        self.heroIcon = self.heroNode.getComponent("HeroIcon");
    },

    start () {
        const self = this;
        self.addSkillItem();
        self.setDisplay();
    },

    // update (dt) {},

    onEnable () {
        const self = this;
        Events.on(Events.ON_GOLD_CHANGE, self.onGoldChange, self);
        Events.on(Events.ON_UPGRADE_HERO_SKILLS, self.onBuySkill, self);
    },

    onDisable () {
            const self = this;
        Events.off(Events.ON_GOLD_CHANGE, self.onGoldChange, self);
        Events.off(Events.ON_UPGRADE_HERO_SKILLS, self.onBuySkill, self);
    },
    
    onGoldChange () {
        const self = this;
        self.setDisplay();
    },

    onBuySkill() {
        const self = this;
        self.setDisplay();
    },

    setDialog (heroID) {
        const self = this;
        self._heroID = heroID;
    },

    addSkillItem () {
        const self = this;
        var hero = HeroDatas.getHero(self._heroID);
        var skillArr = hero.skills;
        self.skillItem = [];
        if (skillArr) {
            for (let skillID = 0; skillID < skillArr.length; skillID++) {
                // const element = skillArr[skillID];
                var itemNode = cc.instantiate(self.skillItemPrefab);
                itemNode.parent = self.list.content;
                var component = itemNode.getComponent("SkillListItem");
                component.setItem(self._heroID, skillID);
                self.skillItem.push(component);
            }
        }
    },

    setDisplay () {
        const self = this;
        var hero = HeroDatas.getHero(self._heroID);
        var skillArr = hero.skills;
        self.heroIcon.setIcon(self._heroID);
        self.heroName.string = hero.heroName;
        self.heroLevel.string = "等级:" + hero.level;
        if (self._heroID == 0) {
            self.heroDPS.string = "点击伤害:" + Formulas.formatBigNumber(hero.DPS);
        } else {
            self.heroDPS.string = "DPS伤害:" + Formulas.formatBigNumber(hero.DPS);
        }
        
        for (let index = 0; index < self.skillItem.length; index++) {
            const item = self.skillItem[index];
            item.setDisplay();
        }
    },

    close () {
        const self = this;
        self.node.destroy();
    },
});
