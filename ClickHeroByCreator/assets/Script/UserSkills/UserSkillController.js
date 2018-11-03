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
        skillList: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    getLastUseSkill () {
        const self = this;
        for (let index = 0; index < self.skillList.children.length; index++) {
            const item = self.skillList.children[index];
            var skill = item.getComponent("UserSkill");
            if (skill.heroID == heroID && skill.skillID == skillID) {
                return skill;
            }
        }
    },

    minusCoolingDownTime () {
        const self = this;
    },

    setDoubleSkill (bDouble) { // 设置充能标志
        const self = this;
        self._bDoubleSkill = bDouble;
    },

    getDoubleSkill () {
        const self = this;
        return self._bDoubleSkill;
    },

    initUserSkills () {
        const self = this;
        // console.log(self.skillList);
        for (let index = 0; index < self.skillList.children.length; index++) {
            const item = self.skillList.children[index];
            item.getComponent("UserSkill").initUserSkill();
        }
        // self.ClickStorm.getComponent("UserSkill").initUserSkill();
    },

    getUserSkill (heroID, skillID) {
        const self = this;
        for (let index = 0; index < self.skillList.children.length; index++) {
            const item = self.skillList.children[index];
            var skill = item.getComponent("UserSkill");
            if (skill.heroID == heroID && skill.skillID == skillID) {
                return skill;
            }
        }
    },
});
