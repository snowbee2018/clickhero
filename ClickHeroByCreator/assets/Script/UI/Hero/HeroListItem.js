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

        nodeGolden : cc.Node,
        lbGolden : cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const self = this;
        self.heroIcon = self.heroNode.getComponent("HeroIcon");
        self.heroIcon.setIcon(self._heroListCtor, self._heroID);
        self.addSkillIcon();
        self.setDisplay();

        Events.on(Events.ON_GOLD_CHANGE, self.onGoldChange, self);
        Events.on(Events.ON_BY_HERO, self.onHeroChange, self);
        Events.on(Events.ON_UPGRADE_HERO, self.onHeroChange, self);
        Events.on(Events.ON_UPGRADE_HERO_SKILLS, self.onSkillChange, self);
        Events.on(Events.REFRESH_HERO_BUYCOST, self.refreshBuyCost, self);
        Events.on(Events.ON_HEROLVUNIT_CHANGE, self.refreshBuyCost, self);
        Events.on(Events.ON_BUYSKILLS, self.onBuySkills, self);
        Events.on(Events.ON_BUYHEROS, self.onBuyHeros, self);
        
    },

    start () {
        const self = this;
        
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
        Events.off(Events.ON_BUYSKILLS, self.onBuySkills, self);
        Events.off(Events.ON_BUYHEROS, self.onBuyHeros, self);
    },

    onGoldChange () {
        const self = this;
        var hero = HeroDatas.getHero(self._heroID);
        if (hero.isBuy) {
            self.btn.interactable = self.isCanUpgrade();
        } else {
            self.btn.interactable = self.isCanBuy();
        }
        let curGold = DataCenter.getDataByKey(DataCenter.KeyMap.curGold);
        let maxPassLavel = DataCenter.getDataByKey(DataCenter.KeyMap.maxPassLavel);
        if (this._heroID == 0) {
            if (maxPassLavel < 10)
            if (!hero.isBuy) {
                if (Boolean(curGold&&curGold.gte(5))) {
                    self.showFinger("点这里购买英雄，加点击伤害！")
                }
            } else if(hero.level == 1){
                if (Boolean(curGold&&curGold.gte(6))) {
                    self.showFinger("点这里升级英雄，加点击伤害！")
                }
            } else if(hero.level >= 5&&hero.level < 10) {
                let skill = hero.skills[0]
                if (!skill.isBuy&&curGold.gte(10)) {
                    self.showSkillFinger(1)
                }
            } else if(hero.level >= 10) {
                let skill = hero.skills[1]
                if (!skill.isBuy&&curGold.gte(100)) {
                    self.showSkillFinger(2)
                }
            }
        } else if (this._heroID == 1){
            if (maxPassLavel < 15)
            if (!hero.isBuy) {
                if (Boolean(curGold&&curGold.gte(50))) {
                    self.showFinger("点这里购买英雄，加每秒伤害！")
                }
            } else if(hero.level >= 10) {
                let skill = hero.skills[0]
                if (!skill.isBuy&&curGold.gte(500)) {
                    self.showSkillFinger(3)
                }
            }
        }
    },

    showSkillFinger(flag){
        const self = this;
        if (self.nodeSkillTips&&self.nodeSkillTips.flag != flag) {
            self.nodeSkillTips = null
        }
        if (!self.nodeSkillTips) {
            self.nodeSkillTips = new cc.Node("nodeSkillTips")
            self.nodeSkillTips.flag = flag
            var sp = self.nodeSkillTips.addComponent(cc.Sprite)
            sp.spriteFrame = self.sTips
            self.nodeSkillTips.parent = self.node
            self.nodeSkillTips.setPosition(cc.v2(20,-30))
            self.nodeSkillTips.opacity = 0
            self.nodeSkillTips.scale = 0.8
            self.nodeSkillTips.runAction(cc.repeatForever(
                cc.sequence(cc.spawn(cc.fadeTo(0.5,255),cc.moveBy(0.5,cc.v2(-40,20))),
                    cc.spawn(cc.fadeTo(0.5,100),cc.moveBy(0.5,cc.v2(40,-20))),)))
            this.nodeSkillPop = PublicFunc.createPopTips("点这里进入英雄技能界面！")
            this.nodeSkillPop.parent = self.node.parent.parent
            this.nodeSkillPop.setPosition(cc.v2(80,140 - (130 * self._heroID)))
            this.nodeSkillPop.opacity = 100
            this.nodeSkillPop.runAction(cc.fadeTo(0.5,255))
        }
    },

    showFinger(txt){
        const self = this;
        if (!self.nodeFingerTips) {
            self.nodeFingerTips = new cc.Node("nodeFingerTips")
            var sp = self.nodeFingerTips.addComponent(cc.Sprite)
            sp.spriteFrame = self.sTips
            self.nodeFingerTips.parent = self.btn.node
            self.nodeFingerTips.setPosition(cc.v2(50,-40))
            self.nodeFingerTips.opacity = 0
            self.nodeFingerTips.scale = 0.8
            self.nodeFingerTips.runAction(cc.repeatForever(
                cc.sequence(cc.spawn(cc.fadeTo(0.5,255),cc.moveBy(0.5,cc.v2(-30,10))),
                    cc.spawn(cc.fadeTo(0.5,100),cc.moveBy(0.5,cc.v2(30,-10))),)))
            this.nodePop = PublicFunc.createPopTips(txt)
            this.nodePop.parent = self.node.parent.parent
            this.nodePop.setPosition(cc.v2(300,140 - (130 * self._heroID)))
            this.nodePop.opacity = 100
            this.nodePop.runAction(cc.fadeTo(0.5,255))
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
        } else if(skillInfo.heroID == 39){
            if (this._heroID == 5 || this._heroID == 15) {
                self.setDisplay()
            }
        }
    },

    setItem(heroListCtor, heroID, viewRect) {
        const self = this;
        self.viewRect = viewRect;
        self.checkPointTop = cc.v2(0, this.node.height / 2);
        self.checkPointBotm = cc.v2(0, -this.node.height / 2);
        
        self._heroListCtor = heroListCtor;
        self._heroID = heroID;
        
        // this.node.parent.on(cc.Node.EventType.POSITION_CHANGED, this.onPosChange.bind(this), this);
    },

    onPosChange() {
        // console.log('ppppppppppp');
        
        // let topPos = this.node.convertToWorldSpaceAR(this.checkPointTop);
        // let botmPos = this.node.convertToWorldSpaceAR(this.checkPointBotm);
        
        // console.log(this);
        // console.log(this.viewRect);
        // console.log();
        
        
        // this.contentNode.active = this.viewRect.contains(topPos) || this.viewRect.contains(botmPos);
        // console.log('self._heroID = ' + self._heroID + ', this.node.active = ' + this.node.active);
        
    },

    refreshBuyCost() {
        const self = this;
        var hero = HeroDatas.getHero(this._heroID);
        if (hero.isBuy) {
            self.btnTitle.string = "升" + GameData.heroLvUnit + "级";
            self.upgradeCost.string = Formulas.formatBigNumber(hero.getCost()) + " 金币";
            self.btn.interactable = self.isCanUpgrade();
        } else {
            self.btnTitle.string = "购买";
            self.upgradeCost.string = Formulas.formatBigNumber(hero.getBaseCost()) + " 金币";
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
            self.upgradeCost.string = Formulas.formatBigNumber(hero.getCost()) + " 金币";
            self.btn.interactable = self.isCanUpgrade();
        } else {
            self.btnTitle.string = "购买";
            self.upgradeCost.string = Formulas.formatBigNumber(hero.getBaseCost()) + " 金币";
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
        this.setSkillsDisplay()

        if (hero.golden > 0) {
            this.nodeGolden.active = true
            this.lbGolden.string = "×"+hero.golden
        } else {
            this.nodeGolden.active = false
        }
    },

    setSkillsDisplay(){
        var hero = HeroDatas.getHero(this._heroID);
        var skillArr = hero.skills;
        if (skillArr) {
            for (let skillID = 0; skillID < skillArr.length; skillID++) {
                const icon = this.skillIcon[skillID];
                console.log(hero.level >= skillArr[skillID].level);
                icon.node.active = hero.level >= skillArr[skillID].level
            }
        }
    },

    onBuyHeros(){
        var hero = HeroDatas.getHero(this._heroID);
        if (hero.id == 0 && hero.level >= 200) {
            return 
        }
        if (this.btn.interactable) {
            this.onUpgradeBtnClick(true)
        }
    },

    onBuySkills(){
        var hero = HeroDatas.getHero(this._heroID);
        var skillArr = hero.skills;
        let hasChange = false
        if (hero.isBuy&&skillArr) {
            console.log("buy hero skill" + hero.heroName);
            for (let skillID = 0; skillID < skillArr.length; skillID++) {
                console.log(skillArr[skillID]);
                if (!skillArr[skillID].isBuy) {
                    console.log("buy " + skillArr[skillID].name);
                    let result = hero.buySkill(skillID,true)
                    console.log("result:" + result);
                    hasChange = hasChange || result
                    if (!result) {
                        break
                    }
                }
            }
        }
        if (hasChange) {
            this.setDisplay()
        }
    },

    onItemClick () {
        const self = this;
        AudioMgr.playBtn();
        var hero = HeroDatas.getHero(self._heroID);
        if (!cc.isValid(self.dialog) && hero.isBuy) {
        // if (!cc.isValid(self.dialog)) {
            self.dialog = cc.instantiate(self.skillDialogPrefab);
            self.dialog.getComponent("SkillDialog").setDialog(self._heroListCtor, self._heroID);
            self.dialog.parent = cc.director.getScene();
            if (self.nodeSkillTips&&this.nodeSkillTips.active) {
                this.nodeSkillTips.active = false
                this.nodeSkillTips.removeFromParent()
                // this.nodeSkillTips = null
            }
            if (this.nodeSkillPop) {
                this.nodeSkillPop.removeFromParent()
                this.nodeSkillPop = null
            }
        }
    },

    onUpgradeBtnClick (isIntant) {
        const self = this;
        if (isIntant!=true) {
            AudioMgr.playBtn();
        }
        var hero = HeroDatas.getHero(self._heroID);
        if (hero.isBuy) {
            hero.upgrade();
        } else {
            hero.buy();
        }
        if (this.nodeFingerTips) {
            this.nodeFingerTips.removeFromParent()
            this.nodeFingerTips = null
        }
        if (this.nodePop) {
            this.nodePop.removeFromParent()
            this.nodePop = null
        }
    },
});
