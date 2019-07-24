var CfgMgr = require("LocalCfgMgr");
cc.Class({
    extends: cc.Component,

    properties: {
        bg: cc.Node,
        uiRoot: cc.Node,
        loginBtn: cc.Sprite,
        viewLoading : cc.Node,
        spLoading : cc.Node,
        lbTips : cc.Label,
    },

    ctor () {
        
    },

    onLoad () {
        const self = this;
        self.bg.zIndex = 0;
        self.uiRoot.active = false;
        self.gameController = self.uiRoot.getComponent("GameController")
        self.initGame();
    },
    
    start () {
        
    },

    initGame () {
        const self = this;
        var root = cc.find("root", self.node);
        window.PublicFunc = root.getComponent("PublicFunc");
        window.WeChatUtil = new (require("WeChatUtils"))();
        window.DataCenter = new (require("DataCenter"))();
        window.Formulas = require("Formulas");
        window.GameData = require("GameData");
        window.HeroDatas = require("HeroDatas");
        window.GoodsDatas = require("GoodsDatas");
        window.TaskDatas = require("TaskDatas");
        window.Events = require("Events");
        window.BigNumber = (require("BigNumber")).clone();
        // 更安全的创建bigNumber
        window.newBigNumber = function(numStr){
            numStr = String(numStr)
            if (numStr.indexOf("e ")) {
                numStr = numStr.replace("e ","e+")
            }
            let num = new BigNumber(numStr)
            if (num.s==null&&num.e==null&&num.c==null) {
                num = new BigNumber(0)
            }
            return num
        }
        window.HttpUtil = require("HttpUtil");
        cc.game.setFrameRate(40)
        // wx.setPreferredFramesPerSecond(34)
        cc.debug.setDisplayStats(false);
        // window.BigNumber.config({
        //     DECIMAL_PLACES: 4,
        //     POW_PRECISION: 4,
        // });
        window.ZoneArr = require("ZoneCfg");
        window.CloudDB = require("CloudDB");
        window.CloudRes = require("CloudRes");
        window.AudioMgr = new (require('AudioMgr'))();

        CfgMgr.loadHeroCfg(self.checkReady.bind(self));
        CfgMgr.loadSkillCfg(self.checkReady.bind(self));
        CfgMgr.loadAncientCfg();
        
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            CloudRes.init();
            console.log('加载怪物资源');
            CloudRes.preloadMonsterRes(function () {
                self.monsterResDone = true;
                self.showGame();
            });
            AudioMgr.init();
            
        } else {
            self.monsterResDone = true;
        }
        
    },

    checkReady() {
        const self = this;
        // 检查全局工具类是否加载完成
        if (window.PublicFunc == undefined) return;
        if (window.WeChatUtil == undefined) return;
        if (window.DataCenter == undefined) return;
        if (window.Formulas == undefined) return;
        if (window.GameData == undefined) return;
        if (window.HeroDatas == undefined) return;
        if (window.GoodsDatas == undefined) return;
        if (window.TaskDatas == undefined) return;
        if (window.Events == undefined) return;
        if (window.BigNumber == undefined) return;
        if (window.ZoneArr == undefined) return;
        
        // 检查本地配置是否加载完成
        if (window.HerosCfg == undefined) return;
        if (window.SkillCfg == undefined) return;

        console.log("所有本地配置加载完成");
        self.login();
    },

    onChildUserData(dataArr) {
        const self = this;
        console.log("onChildUserData");
        console.log(dataArr);
        
        self.gameController.setWeChatUser();
        self.startGame();
    },

    onCloudGameData(dataArr) {
        const self = this;
        console.log("onCloudGameData");
        if (dataArr.length > 0) {
            console.log("获取到了用户游戏数据");
            console.log(dataArr[0]);
            var data = dataArr[0];
            CloudDB.saveDBID(data._id);
            HttpUtil.setGameDataID(data._id)
            console.log(data);
            let oldData = DataCenter.readOldGameData()
            if (oldData && oldData.gamedata) {
                data.gamedata = oldData.gamedata
                cc.sys.localStorage.setItem("GameData","")
            }
            DataCenter.saveCloudData(data);
            // 获取子用户
            // CloudDB.getChildUserData(function (err, dataArr) {
            //     if (!err) {
            //         console.log(dataArr);
            //         self.onChildUserData(dataArr);
            //     }
            // });
            HttpUtil.getChildUsers(function(success,datas) {
                if (success) {
                    console.log(datas);
                    self.onChildUserData(datas);
                }
            })
        } else {
            console.log("未获取到用户数据，用户第一次进入游戏");
            var launchOptions = WeChatUtil.getLaunchOptionsSync();
            var referrer;
            console.log(launchOptions);
            let DataMap = DataCenter.DataMap;
            var openID = DataCenter.getDataByKey(DataMap.OPENID);
            switch (launchOptions.scene) {
                case 1007:
                case 1008:
                    if (launchOptions.query && launchOptions.query.openid) {
                        // 推荐人
                        if (launchOptions.query.openid != openID) {
                            referrer = launchOptions.query.openid;
                            console.log("推荐人referrer = " + referrer);
                        } else {
                        }
                    } else {
                        console.log("没有推荐人");
                    }
                    break;
                default:
                    break;
            }
            
            var weChatUserInfo = DataCenter.getDataByKey(DataMap.WXUserInfo);
            console.log(weChatUserInfo);
            let oldData = DataCenter.readOldGameData()
            let gamedata = {}
            if (oldData && oldData.gamedata) {
                gamedata = oldData.gamedata
                cc.sys.localStorage.setItem("GameData","")
            }
            const gameData = {
                gamedata: gamedata,
                WeChatUserInfo: weChatUserInfo,
                referrer: referrer || "",
                registerTime: new Date().getTime(),
                _openid : openID,
                maxLv : 0,
            }
            // CloudDB.add(gameData);
            HttpUtil.addGameData(gameData,function(success,_id) {
                if (success) {
                    // gameData._id = _id
                    DataCenter.saveCloudData(gameData);
                    self.gameController.setWeChatUser();
                    self.startGame();
                    if (referrer) {
                        PublicFunc.popGoldDialog(2,100,"被邀请奖励")
                    }
                }
            })
        }
    },

    onOpenID(openID) {
        const self = this;
        console.log("onOpenID");
        HttpUtil.setOpenID(openID)
        let DataMap = DataCenter.DataMap;
        DataCenter.setDataByKey(DataMap.OPENID, openID);
        // 从云数据库中获取用户数据
        console.log("使用openID从云数据库中获取用户数据");
        // CloudDB.getUserData(function (err, dataArr) {
        //     if (!err) {
        //         self.onCloudGameData(dataArr);
        //     }
        // });
        HttpUtil.getGameData(openID , function (success, dataArr) {
            if (success) {
                self.onCloudGameData(dataArr);
            }
        })
    },

    checkAddruby(){
        console.log("checkAddruby");
        CloudDB.getAddruby(function (b, ruby) {
            if (b&&ruby>0) {
                PublicFunc.popGoldDialog(2,ruby,null,true)
            }
        });
    },

    onWeChatUserInfo(userData) {
        const self = this;
        console.log("onWeChatUserInfo");
        let DataMap = DataCenter.DataMap;
        DataCenter.setDataByKey(DataMap.WXUserInfo, userData.userInfo);
        const openid = DataCenter.readOpenID()
        if (openid) {
            console.log("xxxj 使用本地的 OPENID");
            self.onOpenID(openid);
        } else {
            console.log("xxxj 云函数 login");
            wx.cloud.callFunction({
                name: 'login', // 需调用的云函数名
                data: userData, // 传给云函数的参数
                complete: res => { // 成功回调
                    if (res.result) {
                        var openID = res.result.OPENID;
                        console.log("openID = " + openID);
                        if (openID) {
                            DataCenter.saveOpenID(openID)
                            self.onOpenID(openID);
                        }
                    } else {
                        console.log("requestID = " + res.requestID + ", errMsg = " + res.errMsg);
                    }
                },
            })
        }
    },

    login() {
        const self = this;
        console.log("login");
        this.viewLoading.active = true
        this.spLoading.stopAllActions()
        this.spLoading.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.delayTime(0.3),cc.rotateBy(0.3,90)
                )
            )
        )
        let tipsArr = [
            "我就是你最爱的冰棍~",
            "游戏每5~10分钟会出现冰棍",
            "冰棍可以得到妖丹、仙丹、仙桃奖励哦",
        ]
        let index = Formulas.randomNum(0,tipsArr.length - 1)
        this.lbTips.string = tipsArr[index]
        this.lbTips.node.active = true
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            WeChatUtil.checkSystemTime()
            const userdata = DataCenter.readUserData()
            if (userdata) {
                console.log("xxxj 使用本地的WXUserData");
                self.onWeChatUserInfo(userdata);
            }else{
                console.log("xxxj 请求WXUserData");
                WeChatUtil.getUserInfo(function (err, userData) {
                    console.log(userData);
                    if (err) {
                        if (err == 1) {
                            // 显示按钮
                            CloudRes.getLoginBtn(function (url) {
                                if (url) {
                                    cc.loader.load({url:url,type:"png"}, function (err, textrue) {
                                        if (!err && textrue) {
                                            cc.find('Canvas/tip').active = false
                                            self.loginBtn.node.active = true;
                                            self.viewLoading.active = false
                                            self.loginBtn.spriteFrame = new cc.SpriteFrame(textrue);
                                            self.loginBtn.node.width = textrue.width;
                                            self.loginBtn.node.height = textrue.height;
                                        }
                                    });
                                }
                            });
                            // cc.sys.localStorage.setItem("GameData","")
                        }
                    } else if (userData && userData.userInfo) {
                        DataCenter.saveUserData(userData)
                        self.onWeChatUserInfo(userData);
                    }
                });
            }
        } else {
            self.startGame();
            
        }
    },

    onLoginBtnClick () {
        self.loginBtn.node.active = false;
        cc.find('Canvas/tip').active = true
        self.login();
    },

    showGame () {
        const self = this;
        // console.log('self.monsterResDone = ' + self.monsterResDone);
        // console.log('self.loginDone = ' + self.loginDone);
        if (self.monsterResDone == true && self.loginDone == true) {
            setTimeout(function() {
                console.log("开始游戏逻辑");
                self.bg.zIndex = 0;
                self.uiRoot.active = true;
                self.viewLoading.active = false
                self.gameController.onGameStart();
                HttpUtil.updateMaxLv()
            },500)
        }
    },

    startGame() {
        const self = this;
        var start = function () {
            self.loginDone = true
            self.showGame();
        }
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            CloudRes.initUrl(function () {
                start()
                self.checkAddruby()
            });
        } else {
            start();
        }
        // cc.find('Canvas/tip').active = false
    },
});
