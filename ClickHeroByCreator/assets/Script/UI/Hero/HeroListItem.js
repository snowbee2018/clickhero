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

        contentNode: cc.Node,
        sTips : cc.SpriteFrame,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const self = this;
        self.heroIcon = self.heroNode.getComponent("HeroIcon");
    },

    start () {
        const self = this;
        self.heroIcon.setIcon(self._heroListCtor, self._heroID);
        self.addSkillIcon();
        self.setDisplay();
        
    },

    // update (dt) {},

    // onEnable () {
    //     const self = this;
    // },

    onDestroy () {
        const self = this;
        Events.off(Events.ON_GOLD_CHANGE, self.onGoldChange, self);
        Events.off(Events.ON_BY_HERO, self.onHeroChange, self);
        Events.off(Events.ON_UPGRADE_HERO, self.onHeroChange, self);
        Events.off(Events.ON_UPGRADE_HERO_SKILLS, self.onSkillChange, self);
        Events.off(Events.REFRESH_HERO_BUYCOST,self.refreshBuyCost,self);
        Events.off(Events.ON_HEROLVUNIT_CHANGE, self.refreshBuyCost, self);
    },

    onGoldChange () {
        const self = this;
        var hero = HeroDatas.getHero(self._heroID);
        if (hero.isBuy) {
            self.btn.interactable = self.isCanUpgrade();
        } else {
            self.btn.interactable = self.isCanBuy();
        }
        if (this._heroID == 0 && !hero.isBuy) {
            let historyTotalGold = DataCenter.getDataByKey(DataCenter.KeyMap.historyTotalGold);
            if (Boolean(historyTotalGold&&historyTotalGold.eq(5))) {
                console.log("加个感叹号2");
                this.nodeOpenTabTips = new cc.Node("nodeOpenTabTips")
                this.nodeOpenTabTips.color = new cc.Color(0xee,0x33,0x66)
                var sp = this.nodeOpenTabTips.addComponent(cc.Sprite)
                sp.spriteFrame = this.sTips
                this.nodeOpenTabTips.parent = this.btn.node
                this.nodeOpenTabTips.setPosition(cc.v2(50,0))
                this.nodeOpenTabTips.opacity = 0
                this.nodeOpenTabTips.runAction(
                    cc.repeatForever(
                        cc.sequence(cc.fadeIn(0.5),cc.fadeOut(0.5),cc.delayTime(1))
                    )
                )
            }
        }
    },

    onHeroChange(heroID) {
        const self = this;
        if (self._heroID == heroID) {
            self.setDisplay();
        }
    },

    onSkillChange (skillInfo) {
        const self = this;
        if (skillInfo.heroID == self._heroID) {
            self.setDisplay();
        }
    },

    setItem(heroListCtor, heroID, viewRect) {
        const self = this;
        self.viewRect = viewRect;
        self.checkPointTop = cc.v2(0, this.node.height / 2);
        self.checkPointBotm = cc.v2(0, -this.node.height / 2);
        


        self._heroListCtor = heroListCtor;
        self._heroID = heroID;
        Events.on(Events.ON_GOLD_CHANGE, self.onGoldChange, self);
        Events.on(Events.ON_BY_HERO, self.onHeroChange, self);
        Events.on(Events.ON_UPGRADE_HERO, self.onHeroChange, self);
        Events.on(Events.ON_UPGRADE_HERO_SKILLS, self.onSkillChange, self);
        Events.on(Events.REFRESH_HERO_BUYCOST, self.refreshBuyCost, self);
        Events.on(Events.ON_HEROLVUNIT_CHANGE, self.refreshBuyCost, self);

        this.node.parent.on(cc.Node.EventType.POSITION_CHANGED, this.onPosChange.bind(this), this);
    },

    onPosChange() {
        // console.log('ppppppppppp');
        
        let topPos = this.node.convertToWorldSpaceAR(this.checkPointTop);
        let botmPos = this.node.convertToWorldSpaceAR(this.checkPointBotm);
        
        // console.log(this);
        // console.log(this.viewRect);
        // console.log();
        
        
        this.contentNode.active = this.viewRect.contains(topPos) || this.viewRect.contains(botmPos);
        // console.log('self._heroID = ' + self._heroID + ', this.node.active = ' + this.node.active);
        
    },

    refreshBuyCost() {
        const self = this;
        var hero = HeroDatas.getHero(this._heroID);
        if (hero.isBuy) {
            self.btnTitle.string = "升" + GameData.heroLvUnit + "级";
            self.upgradeCost.string = "消耗" + Formulas.formatBigNumber(hero.getCost()) + " 妖丹";
            self.btn.interactable = self.isCanUpgrade();
        } else {
            self.btnTitle.string = "购买";
            self.upgradeCost.string = "消耗" + Formulas.formatBigNumber(hero.getBaseCost()) + " 妖丹";
            self.btn.interactable = self.isCanBuy();
        }

        var hero = HeroDatas.getHero(self._heroID);
        var added = Formulas.formatBigNumber(hero.getNextAddDPS());
        if (hero.isPassive) {
            self.damageAdd.string = "DPS+" + added;
        } else {
            self.damageAdd.string = "点击伤害+" + added;
        }
        if (GameData.heroLvUnit > 1) {
            self.damageAdd.node.active = false;
        } else {
            self.damageAdd.node.active = true;
        }
    },

    isCanBuy () {
        const self = this;
        var hero = HeroDatas.getHero(self._heroID);
        return DataCenter.isGoldEnough(hero.getBaseCost());
    },

    isCanUpgrade () {
        const self = this;
        var hero = HeroDatas.getHero(self._heroID);
        
        return DataCenter.isGoldEnough(hero.getCost());
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
                var skillData = skillArr[skillID];
                component.setIcon(self._heroListCtor, self._heroID, skillID, skillData.icon);
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
            self.btnTitle.string = "升" + GameData.heroLvUnit + "级";
            self.upgradeCost.string = "消耗" + Formulas.formatBigNumber(hero.getCost()) + " 妖丹";
            self.btn.interactable = self.isCanUpgrade();
        } else {
            self.btnTitle.string = "购买";
            self.upgradeCost.string = "消耗" + Formulas.formatBigNumber(hero.getBaseCost()) + " 妖丹";
            self.btn.interactable = self.isCanBuy();
        }

        var hero = HeroDatas.getHero(self._heroID);
        var added = Formulas.formatBigNumber(hero.getNextAddDPS());
        if (hero.isPassive) {
            self.damageAdd.string = "DPS+" + added;
        } else {
            self.damageAdd.string = "点击伤害+" + added;
        }
        if (GameData.heroLvUnit > 1) {
            self.damageAdd.node.active = false;
        } else {
            self.damageAdd.node.active = true;
        }
        

        self.nameLab.string = hero.heroName;
        self.level.string = "等级:" + hero.level;
        
        hero.DPS = hero.DPS ? hero.DPS : 0;
        hero.DPS = new BigNumber(hero.DPS);
        if (self._heroID == 0) {
            self.dps.string = "点击伤害:" + Formulas.formatBigNumber(hero.DPS);
        } else {
            self.dps.string = "DPS伤害:" + Formulas.formatBigNumber(hero.DPS);
        }

        for (let skillID = 0; skillID < self.skillIcon.length; skillID++) {
            const icon = self.skillIcon[skillID];
            icon.lightIcon(skillArr[skillID].isBuy);
        }
    },

    onItemClick () {
        const self = this;
        AudioMgr.playBtn();
        var hero = HeroDatas.getHero(self._heroID);
        if (!cc.isValid(self.dialog) && hero.isBuy) {
        // if (!cc.isValid(self.dialog)) {
            self.dialog = cc.instantiate(self.skillDialogPrefab);
            self.dialog.parent = cc.director.getScene();
            self.dialog.getComponent("SkillDialog").setDialog(self._heroListCtor, self._heroID);
        }
    },

    onUpgradeBtnClick () {
        const self = this;
        AudioMgr.playBtn();
        var hero = HeroDatas.getHero(self._heroID);
        if (hero.isBuy) {
            hero.upgrade();
        } else {
            hero.buy();
        }
        if (this.nodeOpenTabTips) {
            this.nodeOpenTabTips.removeFromParent()
            this.nodeOpenTabTips = null
        }
    },
});
