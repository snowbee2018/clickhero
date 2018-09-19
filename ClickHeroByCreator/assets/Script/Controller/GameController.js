var BigNumber = require("BigNumber");
var Formulas = require("Formulas");
var ClickEnable = true;
var ClickDt = 0;
cc.Class({
    extends: cc.Component,

    properties: {
        openDataNode : cc.Node,

        headSprite : cc.Sprite,
        location : cc.Label,
        nickaName : cc.Label,
        gender : cc.Label,

        totalCostLab: cc.Label,
        lvLab: cc.Label,
        numLab: cc.Label,
        hpLab: cc.Label,
        costLab: cc.Label,
    },
    
    // use this for initialization
    onLoad: function () {
        const self = this;
        self.openDataNode.active = true;
        self.openDataNode.x = 0;
        self.openDataNode.y = 1000;
        self.wXSubContextView = self.openDataNode.getComponent("WXSubContextView");
        self._show = cc.moveTo(0.2, 0, 0);
        self._hide = cc.moveTo(0.2, 0, 1000);

        self.monsterController = self.getComponent("MonsterController");
    },

    onEnable () {
        const self = this;
        
    },

    onDisable () {
        const self = this;
        
    },

    // called every frame
    update (dt) {
        const self = this;
        // console.log("dt = " + dt);
        if (ClickEnable == false) {
            ClickDt += dt;
            if (ClickDt >= 0.05) {
                ClickDt = 0;
                ClickEnable = true;
            }
        }
    },

    start () {
        const self = this;
        
    },

    onGameStart () {
        const self = this;
        self.monsterController.makeMonster(1, 1);
        self.node.on(cc.Node.EventType.TOUCH_START, self.onTouchStart.bind(self));
        self._totalClickCount = new BigNumber(0);
        
        self._totalCost = new BigNumber(0);
        self.totalCostLab.string = self._totalCost.toString();
    },

    updataMonsterInfoDisplay () {
        const self = this;
        let info = self.monsterController.getCurMonsterInfo();
        self.lvLab.string = info.lv;
        self.numLab.string = info.num;
        self.hpLab.string = info.hp.toExponential(5);
        self.costLab.string = info.cost.toExponential(5);
    },

    onTouchStart (event) {
        const self = this;
        if (ClickEnable == true) {
            let pos = event.getLocation();
            self.clickHit();
            ClickEnable = false;
        }
        
    },

    clickHit () {
        const self = this;
        self._totalClickCount = self._totalClickCount.plus(1);
        // console.log("hit : count = " + self._totalClickCount.toString());
        
        let damage = new BigNumber(1);
        self.monsterController.hit(damage);
    },

    onMonsterCost (cost) {
        const self = this;
        self._totalCost = self._totalCost.plus(cost.times(Formulas.getGoldTimes()));
        self.totalCostLab.string = self._totalCost.toString();
    },

    setWeChatUser () {
        const self = this;
        let DataMap = GameGlobal.DataCenter.DataMap;
        let weChatUserInfo = GameGlobal.DataCenter.getDataByKey(DataMap.WXUserInfo);
        console.log("weChatUserInfo.avatarUrl = " + weChatUserInfo.avatarUrl);
        
        cc.loader.load({ url: weChatUserInfo.avatarUrl, type: "jpg"}, function (err, texture) {
            if (texture) {
                // 不知道为什么远程图片显示不出来，以后来看一下
                self.headSprite.sreiteFrame = new cc.SpriteFrame(texture);
            }
        });
        let str = weChatUserInfo.country;
        str += " " + weChatUserInfo.province;
        str += " " + weChatUserInfo.city;
        self.location.string = str;
        switch (weChatUserInfo.gender) {
            case 1: self.gender.string = "男"; break;
            case 2: self.gender.string = "女"; break;
            default: self.gender.string = "未知"; break;
        }
        self.nickaName.string = weChatUserInfo.nickName;
    },

    onLeftBtnClick () {
        const self = this;
        // GameGlobal.WeChatUtil.authorize(GameGlobal.WeChatUtil.scope.userLocation, function (result) {
        //     console.log("FFFFFFF, result = " + result);
            
        // });

 
        self._isShow = !self._isShow;
        self.openDataNode.stopAllActions();
        if (self._isShow) {
            self.openDataNode.runAction(self._show);
        } else {
            self.openDataNode.runAction(self._hide);
        }
        // self.openDataNode.active = true;
        // self.wXSubContextView.updateSubContextViewport();
        // self.wXSubContextView.update();

        GameGlobal.WeChatUtil.showModal({
            title: "分享给好友",
            content: "点一下，玩一年，把快乐分享给好友吧",
            callBack: function (res) {
                console.log("模态对话框用户操作返回");
                console.log(res);
                if (res.confirm) {
                    console.log("点击了确定");
                    GameGlobal.WeChatUtil.shareAppMessage();
                } else if (res.cancel) {
                    console.log("点击了取消");
                    GameGlobal.WeChatUtil.showToast("取消了分享");
                }
            }
        });
    },

    onRightBtnClick () {
        const self = this;
        GameGlobal.WeChatUtil.postMsgToOpenDataView("你好，开放数据域。这是来自主域的问候！");
        let obj = {
            helloMsg: "你好，开放数据域。这是主域托管的数据！"
        }
        
        GameGlobal.WeChatUtil.setCloudStorage("test_cloud_storage", obj);

        obj.helloMsg = "你好，微信小游戏。这是保存到微信小游戏文件系统的数据！";
        GameGlobal.WeChatUtil.setLocalStorage(JSON.stringify(obj));

        GameGlobal.WeChatUtil.getLocalStorage(function (bSuccess, jsonStr) {
            if (bSuccess) {
                console.log("jsonStr = " + jsonStr);
                GameGlobal.WeChatUtil.showModal({
                    title: "测试模态对话框",
                    content: "本地数据获取成功：" + jsonStr,
                    callBack: function (res) {
                        console.log("模态对话框用户操作返回");
                        console.log(res);
                        if (res.confirm) {
                            console.log("点击了确定");
                            GameGlobal.WeChatUtil.showToast("点击了确定");
                        } else if (res.cancel) {
                            console.log("点击了取消");
                            GameGlobal.WeChatUtil.showToast("点击了取消");
                        }
                    }
                });
            }
        });

        
    },
});
