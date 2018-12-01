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
var imgRoot = "cloud://test-72db6b.7465-test-72db6b/img";
// var dbName = 'release';
// cloud://test-72db6b.7465-test-72db6b/img/hero/0.png
// cloud://test-72db6b.7465-test-72db6b/img/hero/1.png
// cloud://test-72db6b.7465-test-72db6b/hero/3.png
cc.Class({
    statics: {
        getHeroUrl (heroID, callBack) {
            const self = this;
            if (!WeChatUtil.isWeChatPlatform) return;
            if (!self.urlList) self.urlList = {}
            var path = imgRoot + "/hero/" + heroID + ".png";
            if (self.urlList[path]) {
                callBack(self.urlList[path]);
            } else {
                wx.cloud.getTempFileURL({
                    fileList: [path],
                    success: res => {
                        // fileList 是一个有如下结构的对象数组
                        // [{
                        //    fileID: 'cloud://xxx.png', // 文件 ID
                        //    tempFileURL: '', // 临时文件网络链接
                        //    maxAge: 120 * 60 * 1000, // 有效期
                        // }]
                        console.log(res.fileList)
                        if (res.fileList && res.fileList.length == 1) {
                            var file = res.fileList[0];
                            self.urlList[file.fileID] = file.tempFileURL;
                            callBack(file.tempFileURL);
                        }
                    },
                    fail: console.error
                });
            }
        },
    }
});
