// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var CfgMgr = require("LocalCfgMgr");
cc.Class({
    extends: cc.Component,

    properties: {
        //
    },

    ctor () {
        
    },

    onLoad () {
        const self = this;
        self.node.active = false;
        self.initGame();
    },
    
    start () {
        const self = this;
        
    },

    initGame () {
        const self = this;
        window.WeChatUtil = new (require("WeChatUtils"))();
        window.DataCenter = new (require("DataCenter"))();
        window.Formulas = require("Formulas");
        // window.GameData = new (require("GameData"))();
        // window.HeroDatas = new (require("HeroDatas"))();
        window.GameData = require("GameData");
        window.HeroDatas = require("HeroDatas");
        window.Events = require("Events");
        window.BigNumber = require("BigNumber");
        window.ZoneArr = require("ZoneCfg");
        window.CloudDB = require("CloudDB");

        CfgMgr.loadHeroCfg(self.checkReady.bind(self));
        CfgMgr.loadSkillCfg(self.checkReady.bind(self));
        CfgMgr.loadAncientCfg();
        if (window.WeChatUtil.isWeChatPlatform) {
            wx.cloud.init({
                env: 'test-72db6b'
            })
        }
    },

    checkReady() {
        const self = this;
        // 检查全局工具类是否加载完成
        if (window.WeChatUtil == undefined) return;
        if (window.DataCenter == undefined) return;
        if (window.Formulas == undefined) return;
        if (window.GameData == undefined) return;
        if (window.HeroDatas == undefined) return;
        if (window.Events == undefined) return;
        if (window.BigNumber == undefined) return;
        if (window.ZoneArr == undefined) return;
        
        // 检查本地配置是否加载完成
        if (window.HerosCfg == undefined) return;
        if (window.SkillCfg == undefined) return;

        console.log("所有本地配置加载完成");

        WeChatUtil.sayHello();
        
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            WeChatUtil.getUserInfo(function (bSuccess, userData) {
                console.log("bSuccess = " + bSuccess);
                console.log(userData);
                let DataMap = DataCenter.DataMap;
                DataCenter.setDataByKey(DataMap.WXUserInfo, userData.userInfo);
                let launchOpt = WeChatUtil.getLaunchOptionsSync();
                console.log(launchOpt);
                self.getComponent("GameController").setWeChatUser();
                wx.cloud.callFunction({
                    // 需调用的云函数名
                    name: 'login',
                    // 传给云函数的参数
                    data: userData,
                    // 成功回调
                    complete: res => {
                        console.log('callFunction test result: ', res);
                        console.log("AAAAAAAAAAAAAAAA");
                        console.log(res);
                        if (res.result) {
                            var openID = res.result.OPENID;
                            console.log("openID = " + openID);
                            DataCenter.setDataByKey(DataMap.OPENID, openID);

                            // 从云数据库中获取用户数据
                            console.log("使用openID从云数据库中获取用户数据");
                            CloudDB.getUserData(openID, function (err, data) {
                                if (!err) {
                                    console.log("获取到了用户数据");
                                    console.log(data);
                                } else {
                                    console.log("未获取到用户数据，用户第一次进入游戏");
                                }
                                self.startGame();
                            });

                        } else {
                            console.log("requestID = " + res.requestID + ", errMsg = " + res.errMsg);
                        }
                    },
                })
                
            });
        } else {
            self.startGame();
        }
    },

    startGame () {
        const self = this;
        console.log("开始游戏逻辑");
        self.node.active = true;
        self.getComponent("GameController").onGameStart();
    },
});
