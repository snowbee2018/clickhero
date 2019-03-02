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
        getUrlByPath (path, callBack) {
            const self = this;
            if (!WeChatUtil.isWeChatPlatform || !path) return;
            if (!self.urlList) self.urlList = {}
            // console.log("CloudRes getUrlByPath path: " + path);
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
                        // console.log(res.fileList)
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

        getHeroUrl (heroID, callBack) {
            const self = this;
            if (!WeChatUtil.isWeChatPlatform) return;
            // if (!self.urlList) self.urlList = {}
            var path = imgRoot + "/hero/" + heroID + ".png";
            self.getUrlByPath(path, callBack);
        },

        getLoginBtn(callBack) {
            const self = this;
            if (!WeChatUtil.isWeChatPlatform) return;
            var path = imgRoot + "/loginBtn.png";
            self.getUrlByPath(path, callBack);
        },

        getSkillIconUrl(heroID, skillID, callBack) {
            const self = this;
            if (!WeChatUtil.isWeChatPlatform) return;
            var path = imgRoot + "/skill/" + heroID + "_" + skillID + ".png";
            self.getUrlByPath(path, callBack);
        },

        getBDSkillIconUrl(name, callBack) {
            const self = this;
            if (!WeChatUtil.isWeChatPlatform) return;
            if (self.bdSkillUrls) {
                var path = imgRoot + "/beidong/" + name + ".png";
                if (self.bdSkillUrls[path]) {
                    callBack(self.bdSkillUrls[path]);
                } else {
                    self.getUrlByPath(path, callBack);
                }
            }
        },

        getBossUrl(id, callBack) {
            const self = this;
            if (!WeChatUtil.isWeChatPlatform) return;
            var path = imgRoot + "/boss/boss_" + id + ".png";
            self.getUrlByPath(path, callBack);
        },

        preloadBoosRes(id) {
            const self = this;
            if (!WeChatUtil.isWeChatPlatform) return;
            var path = imgRoot + "/boss/boss_" + id + ".png";
            self.getUrlByPath(path, function (url) {
                if (url) {
                    cc.loader.load({ url: url, type: 'png' });
                }
            });
        },

        initUrl (onSuccess) {
            const self = this;
            if (!self.bdSkillUrls) {
                var list = []
                var iconLen = 40
                for (let i = 0; i < iconLen; i++) {
                    list.push(imgRoot + "/beidong/" + i + ".png")
                }
                // list.push(imgRoot + "/beidong/yueguang.png")
                wx.cloud.getTempFileURL({
                    fileList: list,
                    success: res => {
                        // fileList 是一个有如下结构的对象数组
                        // [{
                        //    fileID: 'cloud://xxx.png', // 文件 ID
                        //    tempFileURL: '', // 临时文件网络链接
                        //    maxAge: 120 * 60 * 1000, // 有效期
                        // }]
                        console.log(res.fileList)
                        if (res.fileList && res.fileList.length == iconLen) {
                            self.bdSkillUrls = {}
                            for (let i = 0; i < res.fileList.length; i++) {
                                const file = res.fileList[i];
                                self.bdSkillUrls[file.fileID] = file.tempFileURL;
                            }
                            if (onSuccess) onSuccess();
                        }
                    },
                    fail: console.error
                });
            }
        },
    }
});
