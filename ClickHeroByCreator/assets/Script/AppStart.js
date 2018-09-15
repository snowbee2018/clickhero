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
        window.GameGlobal = {};
        GameGlobal.WeChatUtil = new (require("WeChatUtils"))();
        GameGlobal.DataCenter = new (require("DataCenter"))();
    },

    onLoad () {
        const self = this;
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
        }
        
    },

    startGame () {
        const self = this;
        let launchOpt = GameGlobal.WeChatUtil.getLaunchOptionsSync();
        console.log(launchOpt);
        
        self.getComponent("HelloWord").setWeChatUser();
    },
});
