// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var dbName = 'test';
// var dbName = 'release';
cc.Class({
    statics: {
        getUserData (openID, callBack) {
            if (WeChatUtil.isWeChatPlatform) {
                const db = wx.cloud.database({
                    env: dbName
                });
                var UserGameData = db.collection('UserGameData');
                console.log(UserGameData);
                
                UserGameData.where({
                    openid: openID
                }).get({
                    success: function (res) {
                        // res.data 包含该记录的数据
                        console.log("FFFFFFFFFFFFF");
                        console.log(res);
                        callBack(false, res.data);
                    },
                    fail: function (params) {
                        console.log("GGGGGGGGGGGGGGG");
                        callBack(true);
                    }
                });
            }
        },
    }
});
