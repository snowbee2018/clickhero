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
    extends: cc.Component,

    properties: {
        dialog: cc.Prefab,
        goldDialog: cc.Prefab,
        popTips : cc.Prefab,
    },

    onLoad(){
        this.tipsArr = [
            "英雄200级后，每升级25级伤害会提高4倍！",
            "英雄每1000级伤害会涨10倍！",
            "每天买一次苦海无涯伤害会指数增长",
            "神器对战斗帮助很大，仔细研究研究吧。",
            "你是想走挂机流还是点击流？好好规划哦。",
            "100级以后会掉落仙丹哦，越到后面掉的越多！",
            "邀请好友一起玩游戏，奖励丰厚！",
            "紫霞的月光宝盒带你回500年前，收获仙丹",
        ]
    },

    // params = {
    //     contentStr,
    //     leftBtnStr,
    //     rightStr,
    //     onTap,
    // }
    popDialog (params) {
        const self = this;
        try {
            var dialogNode = cc.instantiate(self.dialog);
            var curScene = cc.director.getScene();
            dialogNode.parent = curScene;
            dialogNode.x = cc.winSize.width/2;
            dialogNode.y = cc.winSize.height/2;
            var dialogComponent = dialogNode.getComponent("Dialog");
            dialogComponent.setDesc(params.contentStr);
            if (params.btnStrs) {
                dialogComponent.setBtnText(params.btnStrs);
            }
            dialogComponent.setCallback(params.onTap);
            if (params.toggle) {
                dialogComponent.setToggle(params.toggle.bShow, params.toggle.str, params.toggle.checked);
            }
        } catch (error) {
            console.error(error);
        }
        
    },

    popGoldDialog (type,num,title,disDouble){
        let dialog = cc.instantiate(this.goldDialog)
        dialog.getComponent("GoldDialog").setDatas(type,num,title,disDouble)
        dialog.parent = cc.director.getScene();
        dialog.x = cc.winSize.width / 2;
        dialog.y = cc.winSize.height / 2;
    },

    rebirth () {
        const self = this;
        DataCenter.rebirth();
        HeroDatas.rebirth();
        self.getComponent("HeroListControl").rebirth();
        self.getComponent("MonsterController").rebirth();
        GameData.refresh();
        self.getComponent("UserSkillController").rebirth();
        DataCenter.addRebirthCount()
        Events.emit(Events.ON_GOLD_CHANGE);
        Events.emit(Events.ON_SOUL_CHANGE);
        WeChatUtil.onHide();
    },

    bindAncientSprite () {
        
    },

        /**
     * Http请求
     * @param {Object} params - 参数表
     * @param {String} params.method - 请求模式 : "GET", "POST", "PUT", "DELETE"，默认为 "GET"
     * @param {String} params.url - 请求url
     * @param {Function} params.handler - 回调函数，当请求成功、发生错误、请求超时的时候会回调
     * @param {String} params.responseType - 指定返回response的数据类型，"arraybuffer" "blob" "document" "json" "text"，默认为 "text"
     * @param {Number} params.timeout - 指定请求超时时间，单位毫秒
     * @param {ArrayBuffer} params.uploadData - 需要发送的数据，可以为空，也可以是ArrayBuffer
     */
    httpRequest (params) {
        // method, url, handler, responseType, timeout, uploadData
        if (!params || !params.hasOwnProperty("url")) {
            console.error("url must not null");
            return;
        }
        var logTag = "[HttpRequest]";
        var xhr = new XMLHttpRequest();
        // Simple events
        ['loadstart', 'progress', 'abort', 'error', 'load', 'loadend', 'timeout'].forEach(function (eventname) {
            xhr["on" + eventname] = function (progressEvent) {
                console.info(logTag + "eventName = " + eventname + ", url = " + params.url);
                if (eventname == 'error' || eventname == 'timeout') {
                    if (params.hasOwnProperty("handler")) {
                        params.handler(eventname);
                    } else {
                        console.log(logTag + "callback handler is null.");
                    }
                }
            }
        });
        // Special event
        xhr.onreadystatechange = function (event) {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                console.log(logTag + "httpRequest Success.");
                if (params.hasOwnProperty("handler")) {
                    params.handler("success", xhr.response);
                } else {
                    console.log(logTag + "callback handler is null.");
                }
            }
        }

        if (!params.hasOwnProperty("method")) params.method = "GET";
        if (!params.hasOwnProperty("timeout")) params.timeout = 10000;
        if (params.hasOwnProperty("responseType")) xhr.responseType = params.responseType;
        xhr.timeout = params.timeout;
        xhr.open(params.method, params.url, true);
        if (params.hasOwnProperty("uploadData")) {
            xhr.send(params.uploadData);
        } else {
            xhr.send();
        }
    },

    getTipsStr(){
        let index = Formulas.randomNum(0,this.tipsArr.length - 1)
        return "提示："+this.tipsArr[index]
    },

    createPopTips(txt){
        let popTips = cc.instantiate(this.popTips)
        let lb = cc.find("label",popTips)
        lb.getComponent(cc.Label).string = txt
        return popTips
    },
});
