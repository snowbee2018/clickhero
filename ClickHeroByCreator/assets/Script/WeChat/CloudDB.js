// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var envID = 'test-72db6b';
// var dbName = 'release';
cc.Class({
    statics: {
        db(){
            if (WeChatUtil.isWeChatPlatform) {
                const db = wx.cloud.database({
                    env: envID
                });
                return db
            }
        },
        getDB (collname) {
            const self = this;
            if (WeChatUtil.isWeChatPlatform) {
                return this.db().collection(collname || 'UserGameData');
            }
        },
        saveDBID (id) {
            const self = this;
            self.id = id;
        },
        
        getAddruby(callback){
            const self = this;
            if (WeChatUtil.isWeChatPlatform) {
                this.getDB("addruby").where({
                    _openid: DataCenter.getDataByKey(DataCenter.DataMap.OPENID)
                }).get({
                    success : function(res) {
                        console.log("获取addruby成功");
                        if (res.data) {
                            if (res.data.length>0) {
                                self.addrubyID = res._id
                                let ruby = res.data[0].ruby
                                if (ruby>0) {
                                    self.zeroAddruby(callback,ruby)
                                }
                            }else{
                                self.addAddruby()
                            }
                        }
                    },
                    fail: function (params) {
                        console.log("获取addruby失败");
                        console.log(params);
                        // callBack(false);
                    }
                })
            }
        },

        zeroAddruby(callback,ruby){
            // console.log("zeroAddruby");
            if (WeChatUtil.isWeChatPlatform) {
                this.getDB("addruby").doc(this.addrubyID).update({
                    data: {
                        // 表示将 done 字段置为 true
                        ruby: 0,
                    },
                    success: function (res) {
                        // console.log(res);
                        callback(true,ruby)
                    }
                })

            }
        },

        getUserData (callBack) {
            const self = this;
            if (WeChatUtil.isWeChatPlatform) {
                let userData = DataCenter.readGameData()
                if (userData) {
                    console.log("使用本地UserData数据");
                    callBack(false, [userData]);
                } else {
                    self.getDB().where({
                        _openid: DataCenter.getDataByKey(DataCenter.DataMap.OPENID)
                    }).get({
                        success: function (res) {
                            // res.data 包含该记录的数据
                            console.log("使用服务器UserData数据");
                            console.log(res.data);
                            callBack(false, res.data);
                        },
                        fail: function (params) {
                            console.log("获取用户数据发生错误");
                            console.log(params);
                            callBack(true);
                        }
                    });
                }
            }
        },

        getChildUserData(callBack,isNew) { // 获取被自己推荐的用户
            const self = this;
            if (WeChatUtil.isWeChatPlatform) {
                let childDatas = []
                let db = self.getDB()
                let time = cc.sys.localStorage.getItem("savechildtime") || 0
                if (time == 0||(isNew&&Date.now()-time > 5*60*1000)) {
                    var query = function() {
                        db.where({
                            referrer: DataCenter.getDataByKey(DataCenter.DataMap.OPENID)
                        }).skip(childDatas.length).limit(20).get({
                            success: function (res) {
                                // res.data 包含该记录的数据
                                childDatas = childDatas.concat(res.data)
                                if (res.data.length < 20||childDatas.length == 200) {
                                    DataCenter.saveChildUserData(childDatas)
                                    callBack(false, childDatas);
                                    Events.emit(Events.ON_BUY_GOODS,16)
                                } else {
                                    query()
                                }
                            },
                            fail: function (params) {
                                console.log("获取子用户数据发生错误，使用本地的ChildUserData");
                                childDatas = DataCenter.readChildUserData() || childDatas
                                callBack(false, childDatas);
                            }
                        });
                    }
                    query()
                } else {
                    console.log("使用本地的ChildUserData");
                    childDatas = DataCenter.readChildUserData() || childDatas
                    callBack(false, childDatas);
                }
            }
        },

        add (data) {
            const self = this;
            if (WeChatUtil.isWeChatPlatform) {
                var params = {
                    WeChatUserInfo: data.WeChatUserInfo,
                    gamedata: data.gamedata,
                    ChildUsers: [],
                    registerTime: data.registerTime
                }
                if (data.referrer) {
                    params.referrer = data.referrer;
                }
                self.getDB().add({
                    // data 字段表示需新增的 JSON 数据
                    data: params,
                    success: function (res) {
                        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                        // console.log(res)
                        self.saveDBID(res._id);
                    }
                });
            }
        },

        addAddruby(){
            // console.log("cloud addAddruby");
            this.getDB("addruby").add({
                data: {
                    ruby : 0
                }
            });
        },

        update (gamedata) {
            const self = this;
            if (WeChatUtil.isWeChatPlatform) {
                self.getDB().doc(self.id).update({
                    // data 传入需要局部更新的数据
                    data: {
                        // 表示将 done 字段置为 true
                        gamedata: gamedata,
                        WeChatUserInfo: DataCenter.getDataByKey(DataCenter.DataMap.WXUserInfo)
                    },
                    success: function (res) {
                        // console.log(res);
                    }
                });
            }
        },

        updataChildUsers (usersArr) {
            const self = this;
            if (WeChatUtil.isWeChatPlatform) {
                self.getDB().doc(self.id).update({
                    // data 传入需要局部更新的数据
                    data: {
                        ChildUsers: usersArr
                    },
                    success: function (res) {
                        console.log(res);
                    }
                });
            }
        },

        updateMaxLv (){
            if (WeChatUtil.isWeChatPlatform) {
                let maxPassLavel = DataCenter.getDataByKey(DataCenter.KeyMap.maxPassLavel)||0;
                this.getDB().doc(this.id).update({
                    // data 传入需要局部更新的数据
                    data: {
                        maxLv: maxPassLavel
                    },
                    success: function (res) {
                        console.log("更新maxLv成功");
                        console.log(res);
                    }
                });
            }
        },

        getRankUsers(callback,offset){
            if (WeChatUtil.isWeChatPlatform) {
                const db = this.getDB()
                const _ = this.db().command
                db.orderBy('maxLv','desc').where({
                    isbug: _.neq(true)
                }).skip(offset).limit(20).get({
                    success: function (res) {
                        console.log("getRankUsers success");
                        console.log(res);
                        callback(res.data);
                    },
                    fail: function (params) {
                        console.log("getRankUsers fail");
                        callback([]);
                    }
                });
            }
        },
    }
});
