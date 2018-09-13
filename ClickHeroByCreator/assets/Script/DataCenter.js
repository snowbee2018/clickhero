cc.Class({
    ctor () {
        const self = this;
        self.ContentData = {}
        self.DataMap = {
            WXUserInfo: "WXUserInfo", // 当前用户微信信息
        }
    },

    setDataByKey (key, params) {
        const self = this;
        // console.info("key = " + key);
        if (params && key) {
            self.ContentData[key] = params;
        }
    },

    getDataByKey (key) {
        const self = this;
        // console.info("key = " + key);
        if (key) {
            return self.ContentData[key];
        }
    },

});