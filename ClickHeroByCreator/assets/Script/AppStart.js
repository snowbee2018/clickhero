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

    ctor () {
        
    },

    onLoad () {
        const self = this;
        self.node.active = false;
        self.initGame();
    },

    initGame () {
        const self = this;
        window.GameGlobal = {};
        GameGlobal.WeChatUtil = new (require("WeChatUtils"))();
        GameGlobal.DataCenter = new (require("DataCenter"))();
        window.Formulas = require("Formulas");
        // window.GameData = new (require("GameData"))();
        // window.HeroDatas = new (require("HeroDatas"))();
        window.GameData = require("GameData");
        window.HeroDatas = require("HeroDatas");
        window.Events = require("Events");
        window.BigNumber = require("BigNumber");

        CfgMgr.loadHeroCfg(self.checkReady.bind(self));
        CfgMgr.loadSkillCfg(self.checkReady.bind(self));
    },

    checkReady() {
        const self = this;
        // 检查全局工具类是否加载完成
        if (window.GameGlobal == undefined) return;
        if (GameGlobal.WeChatUtil == undefined) return;
        if (GameGlobal.DataCenter == undefined) return;
        if (window.Formulas == undefined) return;
        if (window.GameData == undefined) return;
        if (window.HeroDatas == undefined) return;
        if (window.Events == undefined) return;
        if (window.BigNumber == undefined) return;
        
        // 检查本地配置是否加载完成
        if (window.HerosCfg == undefined) return;
        if (window.SkillCfg == undefined) return;

        console.log("所有本地配置加载完成");

        GameGlobal.WeChatUtil.sayHello();
        
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            GameGlobal.WeChatUtil.getUserInfo(function (bSuccess, userData) {
                console.log("bSuccess = " + bSuccess);
                console.log(userData);
                let DataMap = GameGlobal.DataCenter.DataMap;
                GameGlobal.DataCenter.setDataByKey(DataMap.WXUserInfo, userData.userInfo);
                let launchOpt = GameGlobal.WeChatUtil.getLaunchOptionsSync();
                console.log(launchOpt);
                self.getComponent("GameController").setWeChatUser();
                self.startGame();
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
