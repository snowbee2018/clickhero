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

    ctor () {
        
    },

    onLoad () {
        const self = this;
        window.GameGlobal = {};
        GameGlobal.WeChatUtil = new (require("WeChatUtils"))();
        GameGlobal.DataCenter = new (require("DataCenter"))();
        window.Formulas = require("Formulas");
        window.Events = require("Events");
        window.BigNumber = require("BigNumber");

        console.log("开始加载英雄技能配置");
        cc.loader.loadResDir("SkillCfg", function (err, assets) {
            // console.log(assets);
            window.SkillCfg = {};
            for (let index = 0; index < assets.length; index++) {
                const textAsset = assets[index];
                var str = textAsset.text;
                SkillCfg[index] = [];
                // console.log("str = " + str); 
                var rowArr = str.split("\n");
                var keyArr;
                for (let i = 0; i < rowArr.length; i++) {
                    const rowStr = rowArr[i];
                    var lArr = rowStr.split(",");
                    if (i == 0) {
                        keyArr = lArr;
                        var len = keyArr.length;
                        var a = keyArr;
                        for (let index = 0; index < a.length; index++) {
                            keyArr[index] = a[index].trim();
                        }
                        
                    } else {
                        var skillCfgObj = {}
                        for (let j = 0; j < lArr.length; j++) {
                            const value = lArr[j];
                            var key = String(keyArr[j]);
                            // console.log("key = " + key);
                            // console.log(key.length);
                            
                            
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
            console.log("英雄配置加载完成");

            GameGlobal.WeChatUtil.sayHello();
            self.node.active = false;
            if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                GameGlobal.WeChatUtil.getUserInfo(function (bSuccess, userData) {
                    console.log("bSuccess = " + bSuccess);
                    console.log(userData);
                    let DataMap = GameGlobal.DataCenter.DataMap;
                    GameGlobal.DataCenter.setDataByKey(DataMap.WXUserInfo, userData.userInfo);
                    self.node.active = true;
                    self.startGame();
                });
            } else {
                self.node.active = true;
                self.startGame();
            }
        });


        
    },

    startGame () {
        const self = this;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            let launchOpt = GameGlobal.WeChatUtil.getLaunchOptionsSync();
            console.log(launchOpt);
            self.getComponent("GameController").setWeChatUser();
        } else {
            
        }
        self.getComponent("GameController").onGameStart();
    },
});
