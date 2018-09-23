
cc.Class({
    statics: {
        loadHeroCfg(callBack) {
            const self = this;
            console.log("开始加载英雄配置");
            cc.loader.loadRes("HeroCfg", function (err, textAsset) {
                var str = textAsset.text.trim();
                var rowArr = str.split("\n");
                var keyArr;
                window.HerosCfg = [];
                for (let i = 0; i < rowArr.length; i++) {
                    const rowStr = rowArr[i].trim();
                    var lArr = rowStr.split(",");
                    if (i == 0) {
                        keyArr = lArr;
                    } else {
                        var cfgObj = {}
                        for (let j = 0; j < lArr.length; j++) {
                            const value = lArr[j];
                            var key = keyArr[j];
                            switch (key) {
                                case "baseCost":
                                case "baseDPS":
                                    cfgObj[key] = new BigNumber(value);
                                    break;
                                default:
                                    cfgObj[key] = value;
                                    break;
                            }
                        }
                        HerosCfg.push(cfgObj);
                    }
                }
                console.log(HerosCfg);
                console.log("英雄配置加载完成");
                if (callBack) callBack();
            });
        },

        loadSkillCfg(callBack) {
            const self = this;
            console.log("开始加载英雄技能配置");
            cc.loader.loadResDir("SkillCfg", function (err, assets) {
                // console.log(assets);
                window.SkillCfg = {};
                for (let index = 0; index < assets.length; index++) {
                    const textAsset = assets[index];
                    var str = textAsset.text.trim();
                    SkillCfg[index] = [];
                    // console.log("str = " + str); 
                    var rowArr = str.split("\n");
                    var keyArr;
                    for (let i = 0; i < rowArr.length; i++) {
                        const rowStr = rowArr[i].trim();
                        var lArr = rowStr.split(",");
                        if (i == 0) {
                            keyArr = lArr;
                        } else {
                            var skillCfgObj = {}
                            for (let j = 0; j < lArr.length; j++) {
                                const value = lArr[j];
                                var key = keyArr[j];
                                // globalDPS // 全局DPS加成
                                // gold // 金币加成
                                // heroDPS // 英雄DPS加成
                                // bjDamage // 暴击伤害加成
                                // bjProbability // 暴击概率加成
                                // unlock // 解锁主动技能
                                // cost // 解锁技能的花费
                                // level // 解锁技能的等级
                                // name // 技能显示的名字
                                // describe // 技能描述
                                // DPSClick // 附加DPS点击
                                switch (key) {
                                    case "globalDPS":
                                    case "gold":
                                    case "heroDPS":
                                    case "bjDamage":
                                    case "bjProbability":
                                    case "DPSClick":
                                    case "level":
                                        if (value.length > 0) {
                                            skillCfgObj[key] = Number(value);
                                        }
                                        break;
                                    case "cost":
                                        skillCfgObj[key] = new BigNumber(value);
                                        break;
                                    case "unlock":
                                        if (value.length > 0) {
                                            skillCfgObj[key] = value;
                                        }
                                        break;
                                    default:
                                        skillCfgObj[key] = value;
                                        break;
                                }
                            }
                            SkillCfg[index].push(skillCfgObj);
                        }
                    }
                }
                console.log(SkillCfg);
                console.log("英雄技能配置加载完成");
                if (callBack) callBack();
            });
        },


        // globalDPS // 全局DPS加成
        // gold // 金币加成
        // heroDPS // 英雄DPS加成
        // bjDamage // 暴击伤害加成
        // bjProbability // 暴击概率加成
        // unlock // 解锁主动技能
        // cost // 解锁技能的花费
        // level // 解锁技能的等级
        // name // 技能显示的名字
        // describe // 技能描述
        // isBy // 是否被激活
        // var CfgMgr = require("LocalCfgMgr");
        // let skillObj = CfgMgr.getHeroSkills(0);
        // console.log(skillObj);
        getHeroSkills(heroID) {
            if (SkillCfg) {
                let cfg = SkillCfg[heroID];
                if (cfg) {
                    let skills = [];
                    for (let index = 0; index < cfg.length; index++) {
                        const skilData = cfg[index];
                        var skillObj = {
                            // globalDPS: 0,
                            // gold: 0,
                            // heroDPS: 0,
                            // bjDamage: 0,
                            // bjProbability: 0,
                            // unlock: "",
                            cost: 0,
                            level: 0,
                            name: "",
                            describe: "",
                            isBy: false,
                        }
                        for (const key in skilData) {
                            if (skilData.hasOwnProperty(key)) {
                                const element = skilData[key];
                                skillObj[key] = element;
                            }
                        }
                        skills.push(skillObj);
                    }

                    return skills;
                }
            } else {
                console.log("配置尚未加载完成");
            }
        },

        getHeroCfg(heroID) {
            var result = HerosCfg[heroID];
            if (result) {
                return result;
            }
        },
    }
});
