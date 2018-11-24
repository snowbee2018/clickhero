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

    skill1(flag) {
        const self = this;
        var str = flag ? "apply" : "backout";
        console.log("user skill " + str + "--点击风暴");
        if (flag) {
            var baseValue = self.baseValue;
            if (self.getDoubleSkill() == true) {
                baseValue*=2;
                self.sceneRoot.getComponent("UserSkillController").setDoubleSkill(false);
            }
            self.sceneRoot.getComponent("AutoClick").createClickStorm(baseValue);
        } else {
            self.sceneRoot.getComponent("AutoClick").destroyClickStorm();
        }
        
    },

    skill2(flag) {
        const self = this;
        var str = flag ? "apply" : "backout";
        console.log("user skill " + str + "--能量风暴");
        if (flag) {
            var baseValue = self.baseValue;
            if (self.getDoubleSkill() == true) {
                baseValue = (baseValue - 1) * 2 + 1;
                self.sceneRoot.getComponent("UserSkillController").setDoubleSkill(false);
            }
            GameData.powersurgeTimes = baseValue;
            GameData.refresh();
        } else {
            GameData.powersurgeTimes = 1;
            GameData.refresh();
        }
    },

    skill3 (flag) {
        const self = this;
        var str = flag ? "apply" : "backout";
        console.log("user skill " + str + "--幸运星");
        if (flag) {
            // 暴击几率增加50%
            var baseValue = self.baseValue;
            if (self.getDoubleSkill() == true) {
                baseValue = 1;
                self.sceneRoot.getComponent("UserSkillController").setDoubleSkill(false);
            }
            GameData.skCritOdds = baseValue;
            GameData.calCritOdds();
        } else {
            GameData.skCritOdds = 0;
            GameData.calCritOdds();
        }
    },

    skill4 (flag) {
        const self = this;
        var str = flag ? "apply" : "backout";
        console.log("user skill " + str + "--金属探测器");
        if (flag) {
            // 金币掉落增加100%
            var baseValue = self.baseValue;
            if (self.getDoubleSkill() == true) {
                baseValue = (baseValue - 1) * 2 + 1;
                self.sceneRoot.getComponent("UserSkillController").setDoubleSkill(false);
            }
            GameData.skGoldTimes = baseValue;
            GameData.calGoldTimes();
        } else {
            GameData.skGoldTimes = 1;
            GameData.calGoldTimes();
        }
    },

    skill5(flag) {
        const self = this;
        var str = flag ? "apply" : "backout";
        console.log("user skill " + str + "--金手指");
        if (flag) {
            // 每次点击获得金币
            var baseValue = self.baseValue;
            if (self.getDoubleSkill() == true) {
                baseValue *= 2;
                self.sceneRoot.getComponent("UserSkillController").setDoubleSkill(false);
            }
            self.sceneRoot.getComponent("MonsterController").goldClick(true, baseValue);
        } else {
            self.sceneRoot.getComponent("MonsterController").goldClick(false);
        }
    },

    skill6(flag) {
        const self = this;
        var str = flag ? "apply" : "backout";
        console.log("user skill " + str + "--黑暗仪式");
        if (flag) {
            // 黑暗仪式DPS翻倍
            var baseValue = self.baseValue;
            if (self.getDoubleSkill() == true) {
                baseValue = (baseValue - 1) * 2 + 1;
                self.sceneRoot.getComponent("UserSkillController").setDoubleSkill(false);
            }
            GameData.skDPSTimes *= baseValue;
            GameData.refresh();
        } else {
            
        }
    },

    skill7(flag) {
        const self = this;
        var str = flag ? "apply" : "backout";
        console.log("user skill " + str + "--超级点击");
        if (flag) {
            // 点击伤害翻倍
            var baseValue = self.baseValue;
            if (self.getDoubleSkill() == true) {
                baseValue = (baseValue - 1) * 2 + 1;
                self.sceneRoot.getComponent("UserSkillController").setDoubleSkill(false);
            }
            GameData.skClickTimes = baseValue;
            GameData.calClickDamage();
        } else {
            GameData.skClickTimes = 1;
            GameData.calClickDamage();
        }
    },

    skill8(flag) {
        const self = this;
        var str = flag ? "apply" : "backout";
        console.log("user skill " + str + "--充能");
        if (flag) {
            // 增加下个技能的效果
            self.sceneRoot.getComponent("UserSkillController").setDoubleSkill(true);
        } else {

        }
    },

    skill9(flag) {
        const self = this;
        var str = flag ? "apply" : "backout";
        console.log("user skill " + str + "--刷新");
        if (flag) {
            // 将使用的最后一项技能的冷却时间缩短1小时
            var skill = self.sceneRoot.getComponent("UserSkillController").getLastReleaseSkill();
            if (skill) {
                skill.setCoolingCurtail(3600 * 1000);
            }
        } else {
            
        }
    },

    getDoubleSkill () {
        const self = this;
        return self.sceneRoot.getComponent("UserSkillController").getDoubleSkill();
    },

    appply() {
        const self = this;
        // console.log("appply");
        if (self.heroID == 0 && self.skillID == 1) {
            self.skill1(true); // 点击风暴
        } else if (self.heroID == 2 && self.skillID == 3) {
            self.skill2(true); // 能量风暴
        } else if (self.heroID == 9 && self.skillID == 4) {
            self.skill3(true); // 幸运星
        } else if (self.heroID == 13 && self.skillID == 4) {
            self.skill4(true); // 金属探测器
        } else if (self.heroID == 15 && self.skillID == 4) {
            self.skill5(true); // 金手指
        } else if (self.heroID == 17 && self.skillID == 3) {
            self.skill6(true); // 黑暗仪式
        } else if (self.heroID == 22 && self.skillID == 4) {
            self.skill7(true); // 超级点击
        } else if (self.heroID == 24 && self.skillID == 3) {
            self.skill8(true); // 充能
        } else if (self.heroID == 25 && self.skillID == 4) {
            self.skill9(true); // 刷新
        }
    }, // 应用技能

    backout() {
        const self = this;
        // console.log("backout");
        if (self.heroID == 0 && self.skillID == 1) {
            self.skill1(false); // 点击风暴
        } else if (self.heroID == 2 && self.skillID == 3) {
            self.skill2(false); // 能量风暴
        } else if (self.heroID == 9 && self.skillID == 4) {
            self.skill3(false); // 幸运星
        } else if (self.heroID == 13 && self.skillID == 4) {
            self.skill4(false); // 金属探测器
        } else if (self.heroID == 15 && self.skillID == 4) {
            self.skill5(false); // 金手指
        } else if (self.heroID == 17 && self.skillID == 3) {
            self.skill6(false); // 黑暗仪式
        } else if (self.heroID == 22 && self.skillID == 4) {
            self.skill7(false); // 超级点击
        } else if (self.heroID == 24 && self.skillID == 3) {
            self.skill8(false); // 充能
        } else if (self.heroID == 25 && self.skillID == 4) {
            self.skill9(false); // 刷新
        }
        
    }, // 撤销技能效果    

    getSkillDesStr () {
        const self = this;
        var sustainTimeAdded = self.getSustainTimeAdded(); // 持续附加
        var coolingTimeReduction = self.getCoolingTimeReduction(); // 冷却缩减
        var sustainTime = self.sustainTime + sustainTimeAdded;
        var coolingTime = self.coolingTime * (1 - coolingTimeReduction);
        var baseValue = self.baseValue;
        if (self.heroID == 0 && self.skillID == 1) {
            // 点击风暴
            // 处理效果加成，持续时间和冷却时间的加成
            var sustainTimeStr = self.dateFormat(sustainTime);
            var coolingTimeStr = self.dateFormat(coolingTime);
            return "自动点击器，每秒执行" + baseValue + "次点击，持续" + sustainTimeStr + "，冷却时间" + coolingTimeStr;
        } else if (self.heroID == 2 && self.skillID == 3) {
            // 能量风暴
            // 处理效果加成，持续时间和冷却时间的加成
            var sustainTimeStr = self.dateFormat(sustainTime);
            var coolingTimeStr = self.dateFormat(coolingTime);
            return "DPS伤害×" + baseValue + "，持续" + sustainTimeStr + "，冷却时间" + coolingTimeStr;
        } else if (self.heroID == 9 && self.skillID == 4) {
            // 幸运星
            // 处理效果加成，持续时间和冷却时间的加成
            var sustainTimeStr = self.dateFormat(sustainTime);
            var coolingTimeStr = self.dateFormat(coolingTime);
            return "暴击概率增加" + baseValue * 100 + "%，持续" + sustainTimeStr + "，冷却时间" + coolingTimeStr;
        } else if (self.heroID == 13 && self.skillID == 4) {
            // 金属探测器
            // 处理效果加成，持续时间和冷却时间的加成
            var sustainTimeStr = self.dateFormat(sustainTime);
            var coolingTimeStr = self.dateFormat(coolingTime);
            return "金币掉落×" + baseValue + "，持续" + sustainTimeStr + "，冷却时间" + coolingTimeStr;
        } else if (self.heroID == 15 && self.skillID == 4) {
            // 金手指
            // 处理效果加成，持续时间和冷却时间的加成
            var sustainTimeStr = self.dateFormat(sustainTime);
            var coolingTimeStr = self.dateFormat(coolingTime);
            var value = baseValue * GameData.addGoldClickTimes; // 古神点金手倍数
            return "每次点击获得怪物金币的" + value * 100 + "%，持续" + sustainTimeStr + "，冷却时间" + coolingTimeStr;
        } else if (self.heroID == 17 && self.skillID == 3) {
            // 黑暗仪式
            // 处理效果加成，持续时间和冷却时间的加成
            // var sustainTimeStr = self.dateFormat(sustainTime);
            var coolingTimeStr = self.dateFormat(coolingTime);
            return "当前DPS伤害×" + baseValue + "，可无限叠加，冷却时间" + coolingTimeStr;
        } else if (self.heroID == 22 && self.skillID == 4) {
            // 超级点击
            // 处理效果加成，持续时间和冷却时间的加成
            var sustainTimeStr = self.dateFormat(sustainTime);
            var coolingTimeStr = self.dateFormat(coolingTime);
            return "点击伤害×" + baseValue + "，持续" + sustainTimeStr + "，冷却时间" + coolingTimeStr;
        } else if (self.heroID == 24 && self.skillID == 3) {
            // 充能
            // 处理效果加成，持续时间和冷却时间的加成
            // var sustainTimeStr = self.dateFormat(sustainTime);
            var coolingTimeStr = self.dateFormat(coolingTime);
            return "增加下一个使用用的技能的效果，冷却时间" + coolingTimeStr;
        } else if (self.heroID == 25 && self.skillID == 4) {
            // 刷新
            // 处理效果加成，持续时间和冷却时间的加成
            // var sustainTimeStr = self.dateFormat(sustainTime);
            var coolingTimeStr = self.dateFormat(coolingTime);
            return "将使用的最后一项技能的冷却时间缩短1小时，冷却时间" + coolingTimeStr;
        } else {
            return "";
        }
    },
});
