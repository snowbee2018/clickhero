cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!',
        openDataNode : cc.Node,

        headSprite : cc.Sprite,
        location : cc.Label,
        nickaName : cc.Label,
        gender : cc.Label,
    },
    
    // use this for initialization
    onLoad: function () {
        const self = this;
        self.label.string = this.text;
        self.openDataNode.active = true;
        self.openDataNode.x = 0;
        self.openDataNode.y = 1000;
        self.wXSubContextView = self.openDataNode.getComponent("WXSubContextView");
        self._show = cc.moveTo(0.2, 0, 0);
        self._hide = cc.moveTo(0.2, 0, 1000);
    },

    // called every frame
    update: function (dt) {

    },

    setWeChatUser () {
        const self = this;
        let DataMap = GameGlobal.DataCenter.DataMap;
        let weChatUserInfo = GameGlobal.DataCenter.getDataByKey(DataMap.WXUserInfo);
        console.log("weChatUserInfo.avatarUrl = " + weChatUserInfo.avatarUrl);
        
        cc.loader.load({ url: weChatUserInfo.avatarUrl, type: "png"}, function (err, texture) {
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
                
            }
        })
    },
});
