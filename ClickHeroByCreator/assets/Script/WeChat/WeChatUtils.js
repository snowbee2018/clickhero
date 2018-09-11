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
    ctor () {
        const self = this;
        self.scope = {};
        
        self.scope.userInfo = "scope.userInfo"; // 用户信息
        self.scope.userLocation = "scope.userLocation"; // wx.getLocation, wx.chooseLocation, wx.openLocation 地理位置
        self.scope.address = "scope.address"; // wx.chooseAddress 通讯地址
        self.scope.invoiceTitle = "scope.invoiceTitle"; // wx.chooseInvoiceTitle 发票抬头
        self.scope.invoiceTitle = "scope.werun"; // wx.getWeRunData 微信运动步数
        self.scope.invoiceTitle = "scope.record"; // wx.startRecord	录音功能
        self.scope.invoiceTitle = "scope.writePhotosAlbum"; // wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum	保存到相册
        self.scope.invoiceTitle = "scope.camera"; // < camera /> 组件	摄像头
    },

    isWeChatPlatform () {
        const self = this;
        return cc.sys.platform === cc.sys.WECHAT_GAME;
    },

    sayHello () {
        const self = this;
        console.log("Hello Snowbee");
        
    },

    authorize () {
        const self = this;
        if (self.isWeChatPlatform()) {
            // console.log(wx);
            // <button open-type="getUserInfo />
            wx.getSetting({
                // scope : self.scope.userInfo,
                success : function (result) {
                    console.log("authorize success");
                    console.log(result);
                    // if (!result.authSetting[self.scope.userInfo]) {
                    //     wx.createUserInfoButton({
                    //         type : "text",
                    //         text : "为了您更好的体验,请先同意授权",

                    //     });
                    // }
                },
                // fail : function (params) {
                //     console.log("authorize fail");
                //     console.log(params);
                    
                // },
                // complete : function (params) {
                //     console.log("authorize complete");
                //     console.log(params);
                    
                // }
            });
        }
    },

    getUserInfo () {
        const self = this;
        if (self.isWeChatPlatform()) {

        }
    },
});
