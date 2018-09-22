// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var SkillCfg = require("SkillCfg");

cc.Class({
    statics: {
        // globalDPS // 全局DPS加成
        // clickDamage // 点击伤害加成
        // gold // 金币加成
        // heroDPS // 英雄DPS加成
        // bjDamage // 暴击伤害加成
        // bjProbability // 暴击概率加成
        // unlock // 解锁主动技能
        // cost // 解锁技能的花费
        // level // 解锁技能的等级
        // name // 技能显示的名字
        // describe // 技能描述
        getObj() {
            return {
                globalDPS: 0,
                clickDamage: 0,
                gold: 0,
                heroDPS: 0,
                bjDamage: 0,
                bjProbability: 0,
                unlock: "",
                cost: 0,
                level: 0,
                name: "",
                describe: "",
            }
        },

        // var ShillMgr = require("SkillMgr");
        // let shillObj = ShillMgr.getSkillObj(0);
        // console.log(shillObj);
        getSkillObj(heroID) {
            let cfg = SkillCfg[heroID];
            if (cfg) {
                let skills = [];
                for (let index = 0; index < cfg.length; index++) {
                    const skilData = cfg[index];
                    var skillObj = this.getObj();
                    for (const key in skilData) {
                        if (skilData.hasOwnProperty(key)) {
                            const element = skilData[key];
                            skillObj[key] = element;
                        }
                    }
                    console.log(skillObj);

                    skills.push(skillObj);
                }

                return skills;
            }

        },
    }


});
