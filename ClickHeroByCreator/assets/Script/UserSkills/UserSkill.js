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
    extends: require("UserSkillBase"),

    properties: {
        sceneRoot: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {,

    // update (dt) {},

    // onItemClick() {
    //     const self = this;
    //     console.log("onItemClick");
    //     self.releaseSkill();
    // },

    // onCoolingDone() {
    //     const self = this;
    //     console.log("onCoolingDone");
    //     self.timeLab.string = "";
    //     self.gray.active = !self._isActive;
    // }, // 冷却完成

    // onSustainDone() {
    //     const self = this;
    //     console.log("onSustainDone");
    // }, // 技能持续结束

    skill0_1(flag) {
        const self = this;
        console.log("appply, skill0_1");
        if (flag) {
            self.sceneRoot.getComponent("AutoClick").createClickStorm(false);
        } else {
            self.sceneRoot.getComponent("AutoClick").destroyClickStorm();
        }
        
    },

    skill2_3(flag) {
        const self = this;
        console.log("appply, skill2_3");
        if (flag) {
            GameData.powersurgeTimes = 2;
            GameData.calDPSDamage();
            GameData.calDPSClickDamage();
            GameData.calClickDamage();
        } else {
            GameData.powersurgeTimes = 1;
            GameData.calDPSDamage();
            GameData.calDPSClickDamage();
            GameData.calClickDamage();
        }
    },

    appply() {
        const self = this;
        console.log("appply");
        if (self.heroID == 0 && self.skillID == 1) {
            self.skill0_1(true);
        } else if (self.heroID == 2 && self.skillID == 3) {
            self.skill2_3(true);
        }
        
    }, // 应用技能

    backout() {
        const self = this;
        console.log("backout");
        if (self.heroID == 0 && self.skillID == 1) {
            self.skill0_1(false);
        } else if (self.heroID == 2 && self.skillID == 3) {
            self.skill2_3(false);
        }
    }, // 撤销技能效果
});
