// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
const screenWidth = window.innerWidth
const screenHeight = window.innerHeight
cc.Class({
    ctor () {
        const self = this;
        self.scope = {};
        self.isWeChatPlatform = cc.sys.platform === cc.sys.WECHAT_GAME;

        self.Events = {
            ShareAppDone: "ShareAppDone",
        }

        self.scope.userInfo = "scope.userInfo"; // 用户信息
        self.scope.userLocation = "scope.userLocation"; // wx.getLocation, wx.chooseLocation, wx.openLocation 地理位置
        self.scope.address = "scope.address"; // wx.chooseAddress 通讯地址
        self.scope.invoiceTitle = "scope.invoiceTitle"; // wx.chooseInvoiceTitle 发票抬头
        self.scope.invoiceTitle = "scope.werun"; // wx.getWeRunData 微信运动步数
        self.scope.invoiceTitle = "scope.record"; // wx.startRecord	录音功能
        self.scope.invoiceTitle = "scope.writePhotosAlbum"; // wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum	保存到相册
        self.scope.invoiceTitle = "scope.camera"; // < camera /> 组件	摄像头


        if (self.isWeChatPlatform) {
            self.fs = wx.getFileSystemManager();
            self.localStoragePath = `${wx.env.USER_DATA_PATH}/LocalUserStorage.json`;

            wx.onShow(self.onShow.bind(self));
            wx.onHide(self.onHide.bind(self));

            wx.cloud.init({
                env: 'test-72db6b',
                traceUser: true
            });

            // 显示设置中的被动转发选项
            wx.showShareMenu({
                success: function () {
                    console.log("wx.showShareMenu success");
                    wx.onShareAppMessage(self.onShareAppMessage.bind(self));
                },
                fail: function (params) {
                    console.log("wx.showShareMenu fail");
                    console.log(params);
                }
            });
            const version = wx.getSystemInfoSync().SDKVersion
            this.adEnable = this.compareVersion(version, '2.0.4') >= 0
            if (this.adEnable) {
                // 创建激励视频广告实例，提前初始化
                window.videoAd = wx.createRewardedVideoAd({
                    adUnitId: 'adunit-dfc42f6bd90a644c'
                })
                videoAd.onError(function(errMsg,errCode) {
                    console.log("Video广告error，errMsg:"+errMsg+" code:"+errCode);
                    // window.videoAd = null
                })
            }
        }
        
    },

    sayHello () {
        const self = this;
        console.log("Hello Snowbee");
        
    },

    getShareImage () {
        const self = this;
        if (self.isWeChatPlatform) {
            return canvas.toTempFilePathSync({
                destWidth: screenWidth,
                destHeight: screenWidth,
            });
        }
    },

    onShareAppMessage () {
        const self = this;
        if (self.isWeChatPlatform) {
            console.log("用户点击了设置中的“转发”按钮");
            // cc.systemEvent.emit(self.Events.ShareAppDone, { bInitiative: false });
            Events.emit(Events.ON_SHARE_CLICK);
            return {
                title: "点一下，玩一年，斩妖除魔，重温经典西行路。",
                imageUrl: self.getShareImage(),
                query: "openid=" + DataCenter.getDataByKey(DataCenter.DataMap.OPENID)
            }     
        }
    },

    shareAppMessage () {
        const self = this;
        if (self.isWeChatPlatform) {
            try {
                var result = wx.shareAppMessage({
                    title: '这个牛魔王太难打了，兄弟们快来帮我砍他！',
                    imageUrl: self.getShareImage(),
                    query: "openid=" + DataCenter.getDataByKey(DataCenter.DataMap.OPENID)
                });
                // cc.systemEvent.emit(self.Events.ShareAppDone, { bInitiative: true });
            } catch (error) {
                console.log(error);
            }
        }
    },

    getScopeState (scope, callBack) {
        const self = this;
        console.log("getScopeState, scope = " + scope);
        if (self.isWeChatPlatform) {
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
        if (self.isWeChatPlatform) {
            self.getScopeState(self.scope.userInfo, function (state) {
                if (state) {
                    wx.getUserInfo({
                        lang : "zh_CN",
                        withCredentials : false,
                        success : function (params) {
                            console.log("wx.getUserInfo success");
                            callBack(false, params);
                        },
                        fail : function (err) {
                            console.log("wx.getUserInfo fail");
                            callBack(1);
                        },
                    });
                } else {
                    if (!self.userInfoBtn) {
                        if (wx.createUserInfoButton) {
                            CloudRes.getLoginBtn(function (url) {
                                if (url) {
                                    var UserInfoBtnStyle = {
                                        type: "image",
                                        image: url,
                                        withCredentials: false,
                                        lang: "zh_CN",
                                        style: {
                                            lineHeight: 48,
                                            backgroundColor: '#ff0000',
                                            color: '#000000',
                                            borderColor: "#ffffff",
                                            textAlign: 'center',
                                            fontSize: 24,
                                            borderRadius: 24,
                                            borderWidth: 0,
                                        }
                                    }
                                    var scale = screenWidth / 720;
                                    UserInfoBtnStyle.style.width = 515 * scale;
                                    UserInfoBtnStyle.style.height = 170 * scale;
                                    UserInfoBtnStyle.style.left = (screenWidth - UserInfoBtnStyle.style.width) / 2;
                                    UserInfoBtnStyle.style.top = screenHeight * 0.65 + UserInfoBtnStyle.style.height / 2;
                                    console.log("wx.getUserInfo createUserInfoButton");
                                    console.log(UserInfoBtnStyle);
                                    self.userInfoBtn = wx.createUserInfoButton(UserInfoBtnStyle);
                                    console.log(self.userInfoBtn);
                                    self.userInfoBtn.show();
                                    self.userInfoBtn.onTap(function (params) {
                                        console.log("wx.getUserInfo ontap userInfoBtn");
                                        if (params.userInfo) {
                                            callBack(false, params);
                                            if (self.userInfoBtn)
                                            {
                                                self.userInfoBtn.destroy();
                                                delete self.userInfoBtn;
                                            }

                                        } else {
                                            callBack(2);
                                        }
                                    });
                                }
                            });

                        } else {
                            self.authorize(self.scope.userInfo, function (err) {
                                if (err) {
                                    callBack(err);
                                } else {
                                    wx.getUserInfo({
                                        lang: "zh_CN",
                                        withCredentials: false,
                                        success: function (params) {
                                            console.log("wx.getUserInfo success");
                                            callBack(false, params);
                                        },
                                        fail: function (err) {
                                            console.log("wx.getUserInfo fail");
                                            callBack(1);
                                        },
                                    });
                                }
                            });
                        }
                    }
                }
            });
        }
        
    },

    authorize (scope, callBack) {
        const self = this;
        console.log("authorize, scope = " + scope);
        if (self.isWeChatPlatform && scope != self.scope.userInfo) {
            self.getScopeState(scope, function (state) {
                if (state) {
                    callBack(true);
                } else {
                    wx.authorize({
                        scope : scope,
                        success: function () {
                            console.log("wx.authorize success");
                            callBack(false);
                        },
                        fail: function (err) {
                            console.log("wx.authorize fail");
                            callBack(err);
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

    postMsgToOpenDataView (msg) {
        const self = this;
        if (self.isWeChatPlatform) {
            wx.postMessage({
                msgName : "HelloMsg",
                msgContent : msg,
            });
        }
    },

    // 托管排行榜数据
    setCloudStorage (key, jsonObj) {
        const self = this;
        if (self.isWeChatPlatform) {
            jsonObj.update_time = Date.now().toString();
            let jsonStr = JSON.stringify(jsonObj);
            wx.setUserCloudStorage({
                KVDataList: [{ key: key, value: jsonStr }],
                success : function () {
                    console.log("wx.setUserCloudStorage, success");
                },
                fail : function (params) {
                    console.log("wx.setUserCloudStorage, fail");
                    console.log(params);
                }
            });
        }
    },

    removeCloudStorage(key) {
        const self = this;
        if (self.isWeChatPlatform) {
            wx.removeUserCloudStorage({
                keyList: [key],
                success: function () {
                    console.log("wx.removeUserCloudStorage, success");
                },
                fail: function (params) {
                    console.log("wx.removeUserCloudStorage, fail");
                    console.log(params);
                }
            });
        }
    },
    
    setLocalStorage (jsonStr) {
        const self = this;
        if (self.isWeChatPlatform) {
            if (jsonStr && jsonStr.length > 0) {
                self.fs.writeFile({
                    filePath: self.localStoragePath,
                    data: jsonStr,
                    encoding: "utf8",
                    success: function () {
                        console.log("setLocalStorage success");
                    },
                    fail: function (params) {
                        console.log(params);
                    }
                });
            }
            
        }
    },

    getLocalStorage (callBack) {
        const self = this;
        if (self.isWeChatPlatform) {
            self.fs.access({
                path: self.localStoragePath,
                success: function () {
                    self.fs.readFile({
                        filePath: self.localStoragePath,
                        encoding: "utf8",
                        success: function (res) {
                            callBack(true, res.data);
                        },
                        fail: function (params) {
                            console.log(params);
                            callBack(false);
                        }
                    });
                },
                fail: function (params) {
                    console.log(params);
                    callBack(false);
                }
            });
        }
    },


    // 返回值Object
    // 启动参数
    // 属性	         类型	 说明
    // scene	    number	场景值	
    // query	    Object	启动参数	
    // isSticky	    boolean	当前小游戏是否被显示在聊天顶部	
    // shareTicket	string	shareTicket	
    // referrerInfo	object	当场景为由从另一个小程序或公众号或App打开时，返回此字段
    // referrerInfo 的结构
    // 属性	        类型	 说明
    // appId	   string	来源小程序或公众号或App的 appId	
    // extraData   object	来源小程序传过来的数据，scene=1037或1038时支持	
    // 场景值ID	说明
    // 1001	发现栏小程序主入口，“最近使用”列表（基础库2.2.4版本起将包含“我的小程序”列表）
    // 1005	顶部搜索框的搜索结果页
    // 1006	发现栏小程序主入口搜索框的搜索结果页
    // 1007	单人聊天会话中的小程序消息卡片
    // 1008	群聊会话中的小程序消息卡片
    // 1011	扫描二维码
    // 1012	长按图片识别二维码
    // 1013	手机相册选取二维码
    // 1014	小程序模版消息
    // 1017	前往体验版的入口页
    // 1019	微信钱包
    // 1020	公众号 profile 页相关小程序列表
    // 1022	聊天顶部置顶小程序入口
    // 1023	安卓系统桌面图标
    // 1024	小程序 profile 页
    // 1025	扫描一维码
    // 1026	附近小程序列表
    // 1027	顶部搜索框搜索结果页“使用过的小程序”列表
    // 1028	我的卡包
    // 1029	卡券详情页
    // 1030	自动化测试下打开小程序
    // 1031	长按图片识别一维码
    // 1032	手机相册选取一维码
    // 1034	微信支付完成页
    // 1035	公众号自定义菜单
    // 1036	App 分享消息卡片
    // 1037	小程序打开小程序
    // 1038	从另一个小程序返回
    // 1039	摇电视
    // 1042	添加好友搜索框的搜索结果页
    // 1043	公众号模板消息
    // 1044	带 shareTicket 的小程序消息卡片 详情
    // 1045	朋友圈广告
    // 1046	朋友圈广告详情页
    // 1047	扫描小程序码
    // 1048	长按图片识别小程序码
    // 1049	手机相册选取小程序码
    // 1052	卡券的适用门店列表
    // 1053	搜一搜的结果页
    // 1054	顶部搜索框小程序快捷入口
    // 1056	音乐播放器菜单
    // 1057	钱包中的银行卡详情页
    // 1058	公众号文章
    // 1059	体验版小程序绑定邀请页
    // 1064	微信连Wi-Fi状态栏
    // 1067	公众号文章广告
    // 1068	附近小程序列表广告
    // 1069	移动应用
    // 1071	钱包中的银行卡列表页
    // 1072	二维码收款页面
    // 1073	客服消息列表下发的小程序消息卡片
    // 1074	公众号会话下发的小程序消息卡片
    // 1077	摇周边
    // 1078	连Wi - Fi成功页
    // 1079	微信游戏中心
    // 1081	客服消息下发的文字链
    // 1082	公众号会话下发的文字链
    // 1084	朋友圈广告原生页
    // 1089	微信聊天主界面下拉，“最近使用”栏（基础库2.2.4版本起将包含“我的小程序”栏）
    // 1090	长按小程序右上角菜单唤出最近使用历史
    // 1091	公众号文章商品卡片
    // 1092	城市服务入口
    // 1095	小程序广告组件
    // 1096	聊天记录
    // 1097	微信支付签约页
    // 1099	页面内嵌插件
    // 1102	公众号 profile 页服务预览
    // 1103	发现栏小程序主入口，“我的小程序”列表（基础库2.2.4版本起该场景值废弃）
    // 1104	微信聊天主界面下拉，“我的小程序”栏（基础库2.2.4版本起该场景值废弃）
    getLaunchOptionsSync () {
        const self = this;
        if (self.isWeChatPlatform) {
            return wx.getLaunchOptionsSync();    
        }
    },

    setCloudDataFormat (func) {
        const self = this;
        self.cloudDataFormatFunc = func;
    },

    // 从后台返回，参数同 getLaunchOptionsSync 的返回
    onShow(res) {
        const self = this;
        console.log("on game back");
        if (this.isTimeErr) {
            console.log("系统时间异常");
            return
        }
        // 检查和服务区时间的差异
        WeChatUtil.checkSystemTime()
        // console.log(res);
        Events.emit(Events.ON_RESUME_GAME)
    },

    // 切换到后台
    onHide() {
        const self = this;
        console.log("on game hide");
        if (this.isTimeErr) {
            console.log("系统时间异常，不保存任何数据");
            return
        }
        if (self.cloudDataFormatFunc) {
            var datas = self.cloudDataFormatFunc();
            var data = datas[0]
            var result = datas[1]
            let time = cc.sys.localStorage.getItem("savetime") || 0
            if (Date.now() - time > 10*60*1000||!result) {
                if (data&&data.heroList&&data.ancientList) {
                    // 每10分钟保存一次
                    console.log("保存数据到服务器");
                    CloudDB.update(data);
                    cc.sys.localStorage.setItem("savetime",Date.now())
                }
            }
            this.uploadRankScore()
            CloudDB.updateMaxLv()
        }
    },

    // 模态对话框，有取消和确定两个按钮，分享和播广告时可以先弹这个
    // object.success 回调函数参数
    // Object res
    // 属性	     类型	 说明
    // confirm	boolean	为 true 时，表示用户点击了确定按钮	
    // cancel	boolean	为 true 时，表示用户点击了取消（用于 Android 系统区分点击蒙层关闭还是点击取消按钮关闭）
    showModal(params) {
        const self = this;
        if (self.isWeChatPlatform) {
            wx.showModal({
                title: params.title,
                content: params.content,
                success: params.callBack,
                fail: function (params) {
                    console.log("wx.showModal fail");
                }
            });
        }
    },

    // 最多只支持显示7个汉字的长度，显示时间2秒，可以用来提示成就达成
    showToast (contentStr) {
        const self = this;
        if (self.isWeChatPlatform) {
            wx.showToast({
                title: contentStr,
                duration: 2000,
                success: function () {
                    console.log("wx.showToast success");
                },
                fail: function (params) {
                    console.log("wx.showToast fail");
                    console.log(params);
                }
            });
        }
    },
    compareVersion(v1, v2) {
        if (this.isWeChatPlatform) {
            v1 = v1.split('.')
            v2 = v2.split('.')
            const len = Math.max(v1.length, v2.length)
          
            while (v1.length < len) {
              v1.push('0')
            }
            while (v2.length < len) {
              v2.push('0')
            }
          
            for (let i = 0; i < len; i++) {
              const num1 = parseInt(v1[i])
              const num2 = parseInt(v2[i])
          
              if (num1 > num2) {
                return 1
              } else if (num1 < num2) {
                return -1
              }
            }
          
            return 0
        }
    },
    popVersionLow(){
        if (this.isWeChatPlatform) {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }
    },
    uploadRankScore(){
        if (this.isWeChatPlatform) {
            const version = wx.getSystemInfoSync().SDKVersion
            if (this.compareVersion(version, '1.9.92') >= 0) {
                let maxPassLavel = DataCenter.getDataByKey(DataCenter.KeyMap.maxPassLavel)
                console.log("uploadRankScore maxLv " + maxPassLavel);
                const value = JSON.stringify({
                    "wxgame": {
                          "score":maxPassLavel,
                          "update_time": Math.floor(Date.now()/1000)
                    }
                });
                console.log(value);
                wx.setUserCloudStorage({KVDataList: [{key:'maxLv',value:value}],
                    success: res => {
                        console.log("setUserCloudStorage success");
                        console.log(res);
                        // // 让子域更新当前用户的最高分，因为主域无法得到getUserCloadStorage;
                        // let openDataContext = wx.getOpenDataContext();
                        // openDataContext.postMessage({
                        //     type: 'updateMaxScore',
                        // });
                    },
                    fail: res => {
                        console.log("setUserCloudStorage fail");
                        console.log(res);
                    }
                })
            }
        }
    },
    checkSystemTime(){
        const self = this
        if (self.isTimeErr) {
            return
        }
        if (this.isWeChatPlatform) {
            wx.cloud.callFunction({
                name: 'test', // 需调用的云函数名
                complete: res => { // 成功回调
                    if (res.result&&res.result.time) {
                        const time = res.result.time;
                        const cur = Date.now()
                        const diff = Math.abs(time - cur)
                        if (diff > 1000*60*60*6) {
                            console.log("时间差大于6小时");
                            wx.showModal({
                                title: '提示',
                                content: '检测到系统时间异常，本次游戏数据不会保存。',
                            })
                            self.isTimeErr = true
                        } else {
                            self.isTimeErr = false
                        }
                    } else {
                        console.log("requestID = " + res.requestID + ", errMsg = " + res.errMsg);
                    }
                },
            })
        }
    },
});
