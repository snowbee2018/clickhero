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
        sTips : cc.SpriteFrame,
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
            if (skillData.unlock) {
                if (skillData.unlock=="ClickStorm") {
                    self.describe.string = "解锁[猴子猴孙]技能"
                }else if (skillData.unlock=="Powersurge") {
                    self.describe.string = "解锁[三头六臂]技能"
                }else if (skillData.unlock=="Lucky Strikes") {
                    self.describe.string = "解锁[暴击风暴]技能"
                }else if (skillData.unlock=="火眼金睛") {
                    self.describe.string = "解锁[火眼金睛]技能"
                }else if (skillData.unlock=="Golden Clicks") {
                    self.describe.string = "解锁[点石成金]技能"
                }else if (skillData.unlock=="The Dark Ritual") {
                    self.describe.string = "解锁[阿弥陀佛]技能"
                }else if (skillData.unlock=="如意金箍") {
                    self.describe.string = "解锁[如意金箍]技能"
                }else if (skillData.unlock=="Energize") {
                    self.describe.string = "解锁[观音赐福]技能"
                }else if (skillData.unlock=="筋斗云") {
                    self.describe.string = "解锁[筋斗云]技能"
                }
                else if (skillData.unlock=="转生") {
                    // var map = DataCenter.KeyMap;
                    var num = DataCenter.getRealRebirthSoul();
                    self.describe.string = "般若波罗蜜，穿越时空，回到500年前，获得"+ num + "仙丹";
                }
            } else if(skillData.bjProbability) {
                self.describe.string = "增加" + (skillData.bjProbability*100) + "%暴击概率"
            } else if(skillData.bjDamage) {
                self.describe.string = "增加" + skillData.bjDamage + "倍暴击伤害"
            } else if(skillData.DPSClick) {
                self.describe.string = "增加" + (skillData.DPSClick*100) + "%DPS点击伤害"
            } else{
                self.describe.string = skillData.describe + "--" + hero.getSkillDesc(self._skillID);
            }
            if (skillData.isBuy) {
                self.levelLimit.node.active = false;
                self.btn.node.active = false;
            } else {
                if (hero.level >= skillData.level) {
                    self.levelLimit.node.active = false;
                    self.btn.node.active = true;
                    self.cost.string = Formulas.formatBigNumber(skillData.cost) + " 妖丹";
                    if (DataCenter.isGoldEnough(skillData.cost)) {
                        self.btn.interactable = true;
                        if (self._heroID == 0 && self._skillID == 0) {
                            let maxPassLavel = DataCenter.getDataByKey(DataCenter.KeyMap.maxPassLavel);
                            if (maxPassLavel < 10){
                                if (!self.nodeFingerTips) {
                                    self.nodeFingerTips = new cc.Node("nodeFingerTips")
                                    var sp = self.nodeFingerTips.addComponent(cc.Sprite)
                                    sp.spriteFrame = self.sTips
                                    self.nodeFingerTips.parent = self.btn.node
                                    self.nodeFingerTips.setPosition(cc.v2(50,-40))
                                    self.nodeFingerTips.opacity = 0
                                    self.nodeFingerTips.scale = 0.8
                                    self.nodeFingerTips.runAction(cc.repeatForever(
                                        cc.sequence(cc.spawn(cc.fadeTo(0.5,255),cc.moveBy(0.5,cc.p(-20,10))),
                                            cc.spawn(cc.fadeTo(0.5,100),cc.moveBy(0.5,cc.p(20,-10))),)))
                                }
                            }
                        }
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
        AudioMgr.playBtn();
        var hero = HeroDatas.getHero(self._heroID);
        var skillArr = hero.skills;
        if (skillArr) {
            var skill = skillArr[self._skillID];
            if (skill.isBuy == false) {
                hero.buySkill(self._skillID);
            }
        }
        if (this.nodeFingerTips) {
            this.nodeFingerTips.removeFromParent()
            this.nodeFingerTips = null
        }
        if (self._heroID == 0 && self._skillID == 1) {
            let maxPassLavel = DataCenter.getDataByKey(DataCenter.KeyMap.maxPassLavel);
            if (maxPassLavel < 20){
                Events.emit(Events.SHOW_SKILL_FINGER)
            }
        }
    },
});
