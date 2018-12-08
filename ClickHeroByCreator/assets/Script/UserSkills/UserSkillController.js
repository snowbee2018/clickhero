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
        // 获取存档，初始化关卡和怪物
        var map = DataCenter.KeyMap;
        var userSkillsCloudInfo = DataCenter.getCloudDataByKey(map.skillList);
        console.log(userSkillsCloudInfo);
        var getCloudSkillInfo = function (heroid, skillid) {
            if (userSkillsCloudInfo) {
                for (let index = 0; index < userSkillsCloudInfo.length; index++) {
                    const element = userSkillsCloudInfo[index];
                    if (element.heroID == heroid && element.skillID == skillid) {
                        return userSkillsCloudInfo[index];
                    }
                }
            }

        }
        // console.log(self.skillList);
        for (let index = 0; index < self.skillList.children.length; index++) {
            const item = self.skillList.children[index];
            var component = item.getComponent("UserSkill");
            component.initUserSkill(getCloudSkillInfo(component.heroID, component.skillID));
        }
        // self.ClickStorm.getComponent("UserSkill").initUserSkill();
    },

    formatUserSkillsInfo () {
        const self = this;
        var obj = []
        for (let index = 0; index < self.skillList.children.length; index++) {
            const item = self.skillList.children[index];
            var component = item.getComponent("UserSkill");
            if (component._isBuy) {
                var info = component.formatUserSkillInfo();
                obj.push(info);
            }
        }
        return obj;
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

    getLastReleaseSkill () {
        const self = this;
        var tempArr = [];
        for (let index = 0; index < self.skillList.children.length; index++) {
            const skillNode = self.skillList.children[index];
            var skill = skillNode.getComponent("UserSkill");
            tempArr.push(skill);
        }
        tempArr.sort(function (left, right) {
            return left._lastTimestamp - right._lastTimestamp;
        });
        // console.log(tempArr);
        // console.log(tempArr[tempArr.length]);
        
        if (tempArr[tempArr.length - 1]._lastTimestamp > 0) {
            return tempArr[tempArr.length - 1];
        }
    },

    rebirth () {
        const self = this;
        for (let index = 0; index < self.skillList.children.length; index++) {
            const item = self.skillList.children[index];
            var component = item.getComponent("UserSkill");
            component.rebirth();
        }
    },
});
