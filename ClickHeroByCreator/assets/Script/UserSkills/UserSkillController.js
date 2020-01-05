
cc.Class({
    extends: cc.Component,

    properties: {
        skillList: cc.Node,
        ndItem0 : cc.Node,
        sfIcons : [cc.SpriteFrame],
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

    setDoubleSkill (bDouble) { // 设置神之祝福标志
        const self = this;
        self._bDoubleSkill = bDouble;
    },

    getDoubleSkill () {
        const self = this;
        return self._bDoubleSkill;
    },

    initUserSkills () {
        if (this.skillList.children.length <= 1) {
            // 初始化9个技能
            const skillDatas = [
                ["三头六臂",2,600,true,30,"2e+5",2,3],
                ["暴击风暴",0.5,1800,true,30,"1.2e+11",9,4],
                ["火眼金睛",2,1800,true,30,"4e+14",13,4],
                ["点石成金",0.01,3600,true,30,"3.2e+16",15,4],
                ["阿弥陀佛",1.05,28800,false,0,"2.56e+17",17,3],
                ["如意金箍",3,3600,true,30,"2.4e+21",20,4],
                ["观音赐福",1,3600,false,0,"2.799e+23",22,3],
                ["筋斗云",1,3600,false,0,"1.12e+26",23,4],
            ]
            
            for (let i = 0; i < 8; i++) {
                const d = skillDatas[i]
                const node = cc.instantiate(this.ndItem0)
                node.parent = this.skillList
                console.log(this.sfIcons[i+1]);
                
                node.getComponent("UserSkill").setData(d[0],d[1],d[2],d[3],d[4],d[5],d[6],d[7],this.sfIcons[i+1])
            }
        }
        
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

    rebirth (isReset) {
        const self = this;
        for (let index = 0; index < self.skillList.children.length; index++) {
            const item = self.skillList.children[index];
            var component = item.getComponent("UserSkill");
            component.rebirth(isReset);
        }
    },
});
