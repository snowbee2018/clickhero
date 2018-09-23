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
        nameLab: cc.Label,
        dps: cc.Label,
        level: cc.Label,
        damageAdd: cc.Label,
        upgradeCost: cc.Label,
        btn: cc.Button,
        btnTitle: cc.Label,
        grayBg: cc.Node,

        skillList: cc.Node,
        heroNode: cc.Node,
        skillIconPrefab: cc.Prefab,
        skillDialogPrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const self = this;
        self.heroIcon = self.heroNode.getComponent("HeroIcon");
    },

    start () {
        const self = this;
        self.heroIcon.setIcon(self._heroID);
        self.addSkillIcon();
        self.setDisplay();
        
    },

    // update (dt) {},

    onEnable () {
        const self = this;
        Events.on(Events.ON_GOLD_CHANGE, self.onGoldChange, self);
        Events.on(Events.ON_BY_HERO, self.onHeroChange, self);
        Events.on(Events.ON_UPGRADE_HERO, self.onHeroChange, self);
    },

    onDisable () {
        const self = this;
        Events.off(Events.ON_GOLD_CHANGE, self.onGoldChange, self);
        Events.off(Events.ON_BY_HERO, self.onHeroChange, self);
        Events.on(Events.ON_UPGRADE_HERO, self.onHeroChange, self);
    },

    onGoldChange () {
        const self = this;
        var hero = HeroDatas.getHero(self._heroID);
        if (hero.isBuy) {
            self.btn.interactable = self.isCanUpgrade();
        } else {
            self.btn.interactable = self.isCanBuy();
        }
    },

    onHeroChange(heroID) {
        const self = this;
        if (self._heroID == heroID) {
            self.setDisplay();
        }
    },

    setItem (heroID) {
        const self = this;
        self._heroID = heroID;
        
    },

    isCanBuy () {
        const self = this;
        var hero = HeroDatas.getHero(self._heroID);
        return DataCenter.isGoldEnough(hero.baseCost);
    },

    isCanUpgrade () {
        const self = this;
        var hero = HeroDatas.getHero(self._heroID);
        
        return DataCenter.isGoldEnough(hero.cost);
    },

    addSkillIcon () {
        const self = this;
        // cc.instantiate(skillIconPrefab)
        var hero = HeroDatas.getHero(self._heroID);
        var skillArr = hero.skills;
        self.skillIcon = [];
        if (skillArr) {
            
            for (let skillID = 0; skillID < skillArr.length; skillID++) {
                // const skillData = skillArr[skillID];
                var skillNode = cc.instantiate(self.skillIconPrefab);
                skillNode.parent = self.skillList;
                var component = skillNode.getComponent("SkillIcon");
                component.setIcon(self._heroID, skillID);
                self.skillIcon.push(component);
            }
            
        }
    },

    setDisplay () {
        const self = this;
        var hero = HeroDatas.getHero(self._heroID);
        var skillArr = hero.skills;
        self.grayBg.active = !hero.isBuy;
        
        if (hero.isBuy) {
            self.btnTitle.string = "升级";
            self.upgradeCost.string = hero.cost.toExponential(2) + " 金币";
            self.btn.interactable = self.isCanUpgrade();
        } else {
            self.btnTitle.string = "购买";
            self.upgradeCost.string = hero.baseCost.toExponential(2) + " 金币";
            self.btn.interactable = self.isCanBuy();
        }
        self.nameLab.string = hero.heroName;
        self.level.string = "等级:" + hero.level;
        
        if (self._heroID == 0) {
            self.dps.string = "点击伤害:" + hero.DPS.toExponential(2);
        } else {
            self.dps.string = "DPS伤害:" + hero.DPS.toExponential(2);
        }

        for (let skillID = 0; skillID < self.skillIcon.length; skillID++) {
            const icon = self.skillIcon[skillID];
            icon.lightIcon(skillArr[skillID].isBuy);
        }
    },

    onItemClick () {
        const self = this;
        var hero = HeroDatas.getHero(self._heroID);
        if (!cc.isValid(self.dialog) && hero.isBuy) {
        // if (!cc.isValid(self.dialog)) {
            self.dialog = cc.instantiate(self.skillDialogPrefab);
            self.dialog.parent = cc.director.getScene();
            self.dialog.getComponent("SkillDialog").setDialog(self._heroID);
        }
    },

    onUpgradeBtnClick () {
        const self = this;
        var hero = HeroDatas.getHero(self._heroID);
        if (hero.isBuy) {
            hero.upgrade();
        } else {
            hero.buy();
        }
        
    },
});
