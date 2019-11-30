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
        CDKeyDialog : cc.Prefab,
        imgClickruby : cc.SpriteFrame,
        ClubInfo : cc.Prefab,
        baseClubLogo : cc.SpriteFrame,
        goldenDialog : cc.Prefab,
        SaleDialog : cc.Prefab,
        ValueInfo : cc.Prefab,
    },

    onLoad(){
        this.tipsArr = [
            "英雄200级后，每升级25级伤害会翻4倍！",
            "英雄每1000级伤害会翻10倍！",
            "每天买一次苦海无涯伤害会指数增长",
            "神器对战斗帮助很大，仔细研究研究吧。",
            "你是想走挂机流还是点击流？好好规划哦。",
            "100级以后会掉落仙丹哦，越到后面掉的越多！",
            "邀请好友一起玩游戏，奖励仙桃和伤害加成！",
            "紫霞的月光宝盒带你回500年前，收获仙丹",
            "每个仙丹会附加10%的DPS伤害",
        ]
        Date.prototype.format = function (fmt) { //author: meizz 
            var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
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
        // GoodsDatas.rebirth()
        HeroDatas.rebirth();
        self.getComponent("HeroListControl").rebirth();
        self.getComponent("MonsterController").rebirth();
        GameData.refresh();
        self.getComponent("UserSkillController").rebirth();
        Events.emit(Events.ON_GOLD_CHANGE);
        Events.emit(Events.ON_SOUL_CHANGE);
        WeChatUtil.onHide();
    },

    revive(AS){
        const self = this;
        PublicFunc.popDialog({
            contentStr: "转世将失去所有金币、仙丹、英雄等级、神器、关卡，由此获得"+AS+"魂魄，你确定要转世吗？",
            btnStrs: {
                left: '是 的',
                right: '不，谢谢'
            },
            onTap: function (dialog, bSure) {
                // 重置游戏
                DataCenter.revive();
                HeroDatas.rebirth();
                // Events.emit(Events.ON_RESETGAME);
                self.getComponent("HeroListControl").rebirth();
                self.getComponent("AncientCtrl").resetGame();
                self.getComponent("MonsterController").rebirth();
                GameData.refresh();
                self.getComponent("UserSkillController").rebirth(true);
                Events.emit(Events.ON_GOLD_CHANGE);
                Events.emit(Events.ON_LEVEL_PASSED);
                Events.emit(Events.ON_MAXLEVEL_UPDATE);
                self.popGoldDialog(3,AS,"转世魂魄",true)
                Events.emit(Events.ON_SOUL_CHANGE);
            }
        });
    },

    resetGame(){
        let ruby2 = DataCenter.getDataByKey(DataCenter.KeyMap.ruby)
        ruby2 += Math.round(GoodsDatas.getTotalRuby()*0.75)
        const self = this;
        PublicFunc.popDialog({
            contentStr: "这将重置你的所有游戏数据，你会进入新区（排行榜），但是会保留仙桃，并以75%的价值变卖商店的道具，共保留"+ruby2+"仙桃，你确定要重置吗？",
            btnStrs: {
                left: '是 的',
                right: '不，谢谢'
            },
            onTap: function (dialog, bSure) {
                // 重置游戏
                // let ruby = DataCenter.getDataByKey(DataCenter.KeyMap.ruby)
                DataCenter.resetGame();
                GoodsDatas.resetGame()
                HeroDatas.resetGame();
                Events.emit(Events.ON_RESETGAME);
                self.getComponent("HeroListControl").rebirth();
                self.getComponent("AncientCtrl").resetGame();
                self.getComponent("MonsterController").rebirth();
                GameData.refresh();
                self.getComponent("UserSkillController").rebirth(true);
                Events.emit(Events.ON_GOLD_CHANGE);
                Events.emit(Events.ON_SOUL_CHANGE);
                Events.emit(Events.ON_RUBY_CHANGE);
                // WeChatUtil.onHide();
                self.popGoldDialog(2, ruby2,null,true)
            }
        });
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

    isSignin(){
        const data = DataCenter.getDataByKey(DataCenter.KeyMap.signinData)
        if (!data) {
            return false
        }
        let date = this.strToDate(data.date)
        let b = date.toLocaleDateString() == new Date().toLocaleDateString()
        return b
    },
    strToDate(value){
        if (value&&value.length>0){
            return (new Date(Date.parse(value.replace(/-/g, "/"))));
        }
        return value;
    },
    getDateStr(){
        var d = new Date()
        return d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate()
    },
    // 计算10倍仙丹和金币 根据购买数 得到的百分比结果
    get10TimesByCount(c,n){
        // let result = 0
        // for (let i = 0; i < c; i++) {
        //     // result += 10+1*i
        //     result += Math.pow(n||1.1,i) * 10
        // }
        this.goodsExp = this.goodsExp || (DataCenter.getUserZone()==1?1.12:1.1)
        n = n?n:this.goodsExp
        var result = (Math.pow(n,c) - 1)/(n-1) *10
        return result
    },

    showUpgradeInfo(){
        let info
        info = ["修复了一些BUG",
        // "2.解决部分技能冷却时间不显示的bug",
        // "3.解决部分新玩家进不了游戏的bug"
        ].join("\n")
        // if (DataCenter.getUserZone()==1) {
            
        // } else {
        //     info = ["1.100关以后，每个boss首次击败有25%的概率随机获得一个金身，100关以上的老玩家需要穿越一次触发",
        //     "2.优化1000关以后，进游戏会卡一会儿的问题",
        //     ].join("\n")
        // }
        this.popDialog({
            contentStr: info,
            btnStrs: {
                mid: '确 定',
            },
        });
        // wx.showModal({
        //     title: '更新内容',
        //     content: info,
        //     // confirmText: '分享游戏',
        //     // success: function(res) {
        //     //     if (res.confirm) {
        //     //         console.log('用户点击分享游戏')
        //     //         WeChatUtil.shareAppMessage();
        //     //         cc.sys.localStorage.setItem("sharetime",Date.now())
        //     //         self.onCloseAd({isEnded:true})
        //     //     }
        //     // }
        // })
    },

    popCDKeyDialog(){
        if (this.showSale(true)) {
            return
        }
        let dialog = cc.instantiate(this.CDKeyDialog)
        // dialog.getComponent("CDKeyDialog")
        dialog.parent = cc.director.getScene();
        dialog.x = cc.winSize.width / 2;
        dialog.y = cc.winSize.height / 2;
    },

    popGoldenDialog(hero){
        let dialog = cc.instantiate(this.goldenDialog)
        dialog.getComponent("GoldenDialog").setHero(hero,this.node.getComponent("HeroListControl"))
        dialog.parent = cc.director.getScene();
        dialog.x = cc.winSize.width / 2;
        dialog.y = cc.winSize.height / 2;
    },

    numToStr(num){
        if (num >= 1000000) {
            return this.num2e(num)
        }
        return Number(num.toFixed(2))
    },

    num2e(num){
        var p = Math.floor(Math.log(num)/Math.LN10);
        var n = (num * Math.pow(10, -p)).toFixed(3)
        return n + 'e' + p;
    },

    makeNextClickruby(){
        // 随机5~10分钟产生一个nextClickruby
        let nextTime = Date.now() + (Math.random()+1) * 5 * 1000 * 60
        // let nextTime = Date.now() + 1000 * 10
        let r = Math.random()
        let type
        if (r <= 0.5) {
            type = 1
        } else {
            type = Math.ceil((r - 0.5)*10)
        }
        window.nextClickruby = {
            type : type,
            time : nextTime
        }
        console.log(nextClickruby);
    },

    // 一袋金币的数额
    getBagGold(){
        var key = DataCenter.KeyMap.passLavel
        var lv = DataCenter.getDataByKey(key) + 1
        lv = Math.ceil(lv / 5) * 5
        let timesTreas = GameData.getTreasureTimes()*GameData.getTreasureOdds()+1
        let times10x = (10*GameData.addTenfoldGoldOdds+1)
        let times = GameData.globalGoldTimes*timesTreas*times10x
        var gold = Formulas.getMonsterGold(lv).times(100).times(times)
        return gold
    },
    // 快速转生能获得的英魂
    getBagSoul(){
        var maxlv = DataCenter.getDataByKey(DataCenter.KeyMap.maxLvNew) + 1
        var soul = new BigNumber(0)
        for (let lv = 0; lv <= maxlv; lv++) {
            if (lv >= 100 && (lv % 5) == 0) {
                soul = soul.plus(Formulas.getPrimalBossSoul(lv))
            }
        }
        soul = soul.times(GameData.getPrimalBossOdds()).plus(4).integerValue()
        return soul
    },

    showClubInfo(club,com){
        let v = cc.instantiate(this.ClubInfo)
        v.parent = cc.director.getScene();
        v.x = cc.winSize.width / 2;
        v.y = cc.winSize.height / 2;
        v.getComponent("ClubInfo").setClub(club,com)
    },

    toast(str){
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.showToast({
                title: str,
                icon: 'none',
            })
        }
    },

    setClubLogo(sp,id){
        if (id==-1) {
            sp.spriteFrame = this.baseClubLogo
        } else {

        }
    },

    showSale(active){
        if (this.switchList&&this.switchList.sale0) {
            let showday = DataCenter.getLocalValue("showsaledate")
            let today = this.getDateStr()
            if (!active&&showday === today) {
                console.log("今天已经显示了");
                return false
            }
            let max = DataCenter.getDataByKey(DataCenter.KeyMap.maxPassLavel)
            if(max>=10&&!DataCenter.isSale0()){
                let v = cc.instantiate(this.SaleDialog)
                v.parent = cc.director.getScene();
                v.x = cc.winSize.width / 2;
                v.y = cc.winSize.height / 2;
                DataCenter.setLocalValue("showsaledate",today)
                return true
            }
            return false
        }else{
            return false
        }
    },

    initSwitch(){
        HttpUtil.request("switch",null,function(b,data) {
            if (data.switchList) {
                let switchList = data.switchList
                this.switchList = switchList
                if (switchList.sale0) {
                    this.showSale()
                }
            }
        }.bind(this))
    },

    showValueInfo(){
        let v = cc.instantiate(this.ValueInfo)
        v.parent = cc.director.getScene();
        v.x = cc.winSize.width / 2;
        v.y = cc.winSize.height / 2;
    },
});
