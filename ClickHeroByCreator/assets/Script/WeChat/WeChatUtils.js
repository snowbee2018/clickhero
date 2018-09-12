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


        
        let winSize = cc.director.getWinSize();
        self.UserInfoBtnStyle = {
            type : "text",
            text : "为了您更好的体验，请先同意授权，点我点我",
        }
        let style = {
            width : 300,
            height : 80,
            lineHeight : 40,
            backgroundColor: '#ff0000',
            color: '#ffffff',
            textAlign: 'center',
            fontSize: 16,
            borderRadius: 4,
        }
        let offsetY = 20;
        console.log(winSize);
        
        // style.left = (winSize.width - style.width)/2;
        // style.top = winSize.height / 2;
        console.log(style);
        // 不知道这个坐标是怎么回事，先随便写一个能看到的吧
        style.left = 10;
        style.top = 100;
        self.UserInfoBtnStyle.style = style;
    },

    isWeChatPlatform () {
        const self = this;
        return cc.sys.platform === cc.sys.WECHAT_GAME;
    },

    sayHello () {
        const self = this;
        console.log("Hello Snowbee");
        
    },

    getUserInfo () {
        const self = this;
    },

    getScopeState (scope, callBack) {
        const self = this;
        console.log("getScopeState, scope = " + scope);
        if (self.isWeChatPlatform()) {
            wx.getSetting({
                success: function (result) {
                    console.log("wx.getSetting success");
                    console.log(result);
                    var state = false;
                    if (result.authSetting[scope]) {
                        state = true;
                    }
                    callBack(state);
                },
                fail: function () {
                    console.log("wx.getSetting fail");
                    callBack(false);
                },
                // complete: function () {
                //     console.log("authorize complete");
                //     callBack(false);
                // }
            });
        }
    },

    // 属性	           类型	       说明	   
    // userInfo	      UserInfo    用户信息对象，不包含 openid 等敏感信息
    // rawData	      string	  不包括敏感信息的原始数据字符串，用于计算签名
    // signature	  string	  使用 sha1(rawData + sessionkey) 得到字符串，用于校验用户信息，参考文档signature
    // encryptedData  string	  包括敏感数据在内的完整用户信息的加密数据，详细见加密数据解密算法
    // iv	          string	  加密算法的初始向量，详细见加密数据解密算法
    //////////////
    // userInfo
    // string language 显示 country province city 所用的语言
    // string nickName 用户昵称
    // string avatarUrl 用户头像图片的 URL。URL 最后一个数值代表正方形头像大小（有 0、46、64、96、132 数值可选，0 代表 640x640 的正方形头像，46 表示 46x46 的正方形头像，剩余数值以此类推），用户没有头像时该项为空。若用户更换头像，原有头像 url 将失效。
    // number gender 用户性别，0:未知，1:男，2:女
    getUserInfo (callBack) {
        const self = this;
        console.log("getUserInfo");
        if (self.isWeChatPlatform()) {
            self.getScopeState(self.scope.userInfo, function (state) {
                if (state) {
                    wx.getUserInfo({
                        withCredentials : false,
                        success : function (params) {
                            console.log("wx.getUserInfo success");
                            callBack(false, params);
                        },
                        fail : function () {
                            console.log("wx.getUserInfo fail");
                            callBack(false);
                        },
                    });
                } else {
                    if (!self.userInfoBtn) {
                        console.log("wx.getUserInfo createUserInfoButton");
                        self.userInfoBtn = wx.createUserInfoButton(self.UserInfoBtnStyle);
                        self.userInfoBtn.show();
                        self.userInfoBtn.onTap(function (params) {
                            console.log("wx.getUserInfo ontap userInfoBtn");
                            callBack(true, params);
                            self.userInfoBtn.destroy();
                            delete self.userInfoBtn;
                        });
                    }
                }
            });
        }
        
    },

    authorize (scope, callBack) {
        const self = this;
        console.log("authorize, scope = " + scope);
        if (self.isWeChatPlatform() && scope != self.scope.userInfo) {
            self.getScopeState(scope, function (state) {
                if (state) {
                    callBack(true);
                } else {
                    wx.authorize({
                        scope : scope,
                        success: function () {
                            console.log("wx.authorize success");
                            callBack(true);
                        },
                        fail: function () {
                            console.log("wx.authorize fail");
                            callBack(false);
                        },
                        // complete: function () {
                        //     console.log("authorize complete");
                        //     callBack(false);
                        // }
                    })
                }

            });
        }
    },
});
