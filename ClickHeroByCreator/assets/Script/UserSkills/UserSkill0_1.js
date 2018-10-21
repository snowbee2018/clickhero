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

    appply() {
        const self = this;
        console.log("appply");
        self.sceneRoot.getComponent("AutoClick").createClickStorm(false);
    }, // 应用技能

    backout() {
        const self = this;
        console.log("backout");
        self.sceneRoot.getComponent("AutoClick").destroyClickStorm();
    }, // 撤销技能效果
});
