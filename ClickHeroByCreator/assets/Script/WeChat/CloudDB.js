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
        getDB () {
            const self = this;
            if (WeChatUtil.isWeChatPlatform) {
                const db = wx.cloud.database({
                    env: envID
                });
                return db.collection('UserGameData');
            }
        },
        saveDBID (id) {
            const self = this;
            self.id = id;
        },

        getUserData (callBack) {
            const self = this;
            if (WeChatUtil.isWeChatPlatform) {
                self.getDB().where({
                    _openid: DataCenter.getDataByKey(DataCenter.DataMap.OPENID)
                }).get({
                    success: function (res) {
                        // res.data 包含该记录的数据
                        // console.log(res);
                        callBack(false, res.data);
                    },
                    fail: function (params) {
                        console.log("获取用户数据发生错误");
                        console.log(params);
                        callBack(true);
                    }
                });
            }
        },

        getChildUserData(callBack) { // 获取被自己推荐的用户
            const self = this;
            if (WeChatUtil.isWeChatPlatform) {
                let childDatas = []
                let db = self.getDB()
                var query = function() {
                    db.where({
                        referrer: DataCenter.getDataByKey(DataCenter.DataMap.OPENID)
                    }).skip(childDatas.length).limit(20).get({
                        success: function (res) {
                            // res.data 包含该记录的数据
                            childDatas = childDatas.concat(res.data)
                            if (res.data.length < 20) {
                                callBack(false, childDatas);
                            } else {
                                query()
                            }
                        },
                        fail: function (params) {
                            if (childDatas.length==0) {
                                console.log("获取子用户数据发生错误");
                                console.log(params);
                                callBack(true);
                            } else {
                                callBack(false, childDatas);
                            }
                        }
                    });
                }
                query()
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
    }
});
