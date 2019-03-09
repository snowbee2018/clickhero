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
        skillNode: cc.Node,
        levelLimit: cc.Label,
        skillName: cc.Label,
        describe: cc.Label,
        btn: cc.Button,
        cost: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const self = this;
        self.skillIcon = self.skillNode.getComponent("SkillIcon");
    },

    start () {

    },

    // update (dt) {},

    setItem(heroListCtor, heroID, skillID) {
        const self = this;
        self._heroListCtor = heroListCtor;
        self._heroID = heroID;
        self._skillID = skillID;
    },

    setDisplay() {
        const self = this;
        var hero = HeroDatas.getHero(self._heroID);
        var skillArr = hero.skills;
        if (skillArr) {
            var skillData = skillArr[self._skillID];
            self.skillIcon.setIcon(self._heroListCtor, self._heroID, self._skillID, skillData.icon);
            self.skillIcon.lightIcon(true);
            self.skillName.string = skillData.name;
            self.describe.string = skillData.describe + "--" + hero.getSkillDesc(self._skillID);
            if (skillData.isBuy) {
                self.levelLimit.node.active = false;
                self.btn.node.active = false;
            } else {
                if (hero.level >= skillData.level) {
                    self.levelLimit.node.active = false;
                    self.btn.node.active = true;
                    self.cost.string = Formulas.formatBigNumber(skillData.cost) + " 金币";
                    if (DataCenter.isGoldEnough(skillData.cost)) {
                        self.btn.interactable = true;
                    } else {
                        self.btn.interactable = false;
                    }
                } else {
                    self.levelLimit.node.active = true;
                    self.btn.node.active = false;
                    self.levelLimit.string = skillData.level + "级解锁";
                    self.skillIcon.lightIcon(false);
                }
                
            }
        }
    },

    onBuyBtnClick () {
        const self = this;
        var hero = HeroDatas.getHero(self._heroID);
        var skillArr = hero.skills;
        if (skillArr) {
            var skill = skillArr[self._skillID];
            if (skill.isBuy == false) {
                hero.buySkill(self._skillID);
            }
        }
    },
});
