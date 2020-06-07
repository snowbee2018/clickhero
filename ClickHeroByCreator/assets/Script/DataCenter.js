cc.Class({
    
    ctor () {
        const self = this;
        self.zoneStartTimes = [0,1566943200000,1569794400000,1586102400000
            ,1589126400000 // 5.11
            ,1590940800000 // 6.1
            ,1596211200000 // 8.1
            ,1601481600000 // 10.1
            ,1606752000000 // 12.1
            ,1612108800000 // 2021.2.1
        ];
        self.KeyMap = {
            lastTime: "lastEnterGameTime", // 最近一次保存数据的时间
            // 所有当前必须要保存的数据，用于恢复现场
            rebirthCount: "rebirthCount", // 已转生次数
            bAutoClickOpen: "bAutoClickOpen", // 商店购买的自动点击是否开启
            totalClick: "totalClick", // 历史总点击数
            maxCombo: "maxCombo", // 历史最大连击数
            monsterInfo: "monsterInfo", // 怪物信息，关卡，序号，是否宝箱，剩余血量
            passLavel: "passLavel", // 当前世界已通过的最高关卡
            maxPassLavel: "maxPassLavel", // 历史最高通过关卡
            maxLvNew : "maxLvNew", // 当前大循环的最高关卡
            curDiamond: "curDiamond", // 当前钻石数量
            curGold: "curGold", // 当前金币数量
            historyTotalGold: "historyTotalGold", // 历史获得的所有金币
            curSoul: "curSoul", // 当前可用英魂数量
            ruby : "ruby", // 当前可用宝石仙丹数量
            rebirthSoul: "rebirthSoul", // 转生英魂
            heroList: "heroList", // 用户所有英雄的状态，存起来
            skillList: "skillList", // 所有主动技能的状态,主要是要记录技能是否激活的和最后使用的时间，以便确定何时冷却完毕
            ancientList: "ancientList", // 用户所拥有的古神
            goodsList: "goodsList",     // 用户拥有的商店道具
            ASCounts: "ASCounts",     // 用户拥有的商店道具

            taskTargets: "taskTargets", // 任务领取索引列表

            signinData: "signinData", // 签到数据{times:0,date:"yyyy/MM/dd"}
            shareReceiveData: "shareReceiveData", // 分享任务 领取信息[[true,true],[true,false]]
            shareDate : "shareDate", // 分享日期
            totalSoul:"totalSoul", // 历史总仙丹
            totalRuby: "totalRuby", // 历史总仙桃
            skill6Data : "skill6Data", // 阿弥陀佛的次数
            goldenLv : "goldenLv", // 下一个金身判断等级
            sale0 : "sale0",
            AS : "AS",
            totalAS : "totalAS",
            tree : "tree",
            myEquips : 'myEquips',
        }
        self.ContentData = {}
        self.DataMap = {
            WXUserInfo: "WXUserInfo", // 当前用户微信信息
            OPENID: "OPENID",
        }
        
    },

    // 读取存档之后用来初始化
    init () {
        const self = this;
        var cloudTime = self.getCloudDataByKey(self.KeyMap.lastTime);
        if (cloudTime) {
            self.setDataByKey(self.KeyMap.lastTime, Number(cloudTime));
        }
        // 初始化金币
        var cloudGold = self.getCloudDataByKey(self.KeyMap.curGold);
        if (cloudGold) {
            self.setDataByKey(self.KeyMap.curGold, (newBigNumber(cloudGold)));
        } else {
            self.setDataByKey(self.KeyMap.curGold, (new BigNumber("0")));
            // self.setDataByKey(self.KeyMap.curGold, (new BigNumber("9999910000000000000")));
        }
        var historyTotalGold = self.getCloudDataByKey(self.KeyMap.historyTotalGold);
        if (historyTotalGold) {
            self.setDataByKey(self.KeyMap.historyTotalGold, (newBigNumber(historyTotalGold)));
        } else {
            self.setDataByKey(self.KeyMap.historyTotalGold, new BigNumber(0));
        }
        // 初始化英魂
        var cloudSoul = self.getCloudDataByKey(self.KeyMap.curSoul);
        if (cloudSoul) {
            self.setDataByKey(self.KeyMap.curSoul, (newBigNumber(cloudSoul)));
        } else {
            self.setDataByKey(self.KeyMap.curSoul, (new BigNumber("0")));
            // self.setDataByKey(self.KeyMap.curSoul, (new BigNumber("90990")));
        }
        // 初始化宝石
        var cloudRuby = self.getCloudDataByKey(self.KeyMap.ruby);
        if (cloudRuby) {
            self.setDataByKey(self.KeyMap.ruby, Number(cloudRuby));
        } else {
            self.setDataByKey(self.KeyMap.ruby, 0);
            // self.setDataByKey(self.KeyMap.ruby, 99990);
        }
        var AS = self.getCloudDataByKey(self.KeyMap.AS);
        if (AS) {
            self.setDataByKey(self.KeyMap.AS, Number(AS));
        } else {
            self.setDataByKey(self.KeyMap.AS, 0);
        }
        var cloudRebirthSoul = self.getCloudDataByKey(self.KeyMap.rebirthSoul);
        if (cloudRebirthSoul) {
            self.setDataByKey(self.KeyMap.rebirthSoul, (newBigNumber(cloudRebirthSoul)));
        } else {
            self.setDataByKey(self.KeyMap.rebirthSoul, (new BigNumber(0)));
        }
        // 初始化当前世界最大通关数
        var passedLevel = self.getCloudDataByKey(self.KeyMap.passLavel);
        if (passedLevel) {
            self.setDataByKey(self.KeyMap.passLavel, Number(passedLevel));
        } else {
            self.setDataByKey(self.KeyMap.passLavel, 0);
        }
        // 初始化历史最大通关数
        var maxPassLavel = self.getCloudDataByKey(self.KeyMap.maxPassLavel);
        if (maxPassLavel) {
            self.setDataByKey(self.KeyMap.maxPassLavel, Number(maxPassLavel));
        } else {
            maxPassLavel = 0
            self.setDataByKey(self.KeyMap.maxPassLavel, maxPassLavel);
        }
        var maxLvNew = self.getCloudDataByKey(self.KeyMap.maxLvNew);
        self.setDataByKey(self.KeyMap.maxLvNew, maxLvNew ? maxLvNew : maxPassLavel);
        // 初始化历史总点击数
        var cloudTotalClick = self.getCloudDataByKey(self.KeyMap.totalClick);
        if (cloudTotalClick) {
            self.setDataByKey(self.KeyMap.totalClick, cloudTotalClick);
        } else {
            self.setDataByKey(self.KeyMap.totalClick, 0);
        }
        // 初始化历史最大连击数
        var cloudMaxCombo = self.getCloudDataByKey(self.KeyMap.maxCombo);
        if (cloudMaxCombo) {
            self.setDataByKey(self.KeyMap.maxCombo, cloudMaxCombo);
        } else {
            self.setDataByKey(self.KeyMap.maxCombo, 0);
        }
        // 初始化转生次数
        var count = self.getCloudDataByKey(self.KeyMap.rebirthCount);
        if (count) {
            self.setDataByKey(self.KeyMap.rebirthCount, Number(count));
        } else {
            self.setDataByKey(self.KeyMap.rebirthCount, 0);
        }
        // 初始化签到数据
        var signinData = self.getCloudDataByKey(self.KeyMap.signinData);
        console.log("signinData:" + signinData);
        if (signinData) {
            self.setDataByKey(self.KeyMap.signinData, signinData);
        }
        // 初始化签到数据
        var shareReceiveData = self.getCloudDataByKey(self.KeyMap.shareReceiveData);
        self.setDataByKey(self.KeyMap.shareReceiveData, shareReceiveData || []);

        var shareDate = self.getCloudDataByKey(self.KeyMap.shareDate);
        self.setDataByKey(self.KeyMap.shareDate, shareDate);
        //  else {
        //     self.setDataByKey(self.KeyMap.shareReceiveData, [[true,true],[true,false]]);
        // }
        var totalSoul = self.getCloudDataByKey(self.KeyMap.totalSoul);
        if (totalSoul) {
            self.setDataByKey(self.KeyMap.totalSoul, (newBigNumber(totalSoul)));
        } else {
            self.setDataByKey(self.KeyMap.totalSoul, new BigNumber(0));
        }
        var totalRuby = self.getCloudDataByKey(self.KeyMap.totalRuby);
        if (totalRuby) {
            self.setDataByKey(self.KeyMap.totalRuby, Number(totalRuby));
        } else {
            self.setDataByKey(self.KeyMap.totalRuby, 1);
        }
        var totalAS = self.getCloudDataByKey(self.KeyMap.totalAS);
        if (totalAS) {
            self.setDataByKey(self.KeyMap.totalAS, Number(totalAS));
        } else {
            self.setDataByKey(self.KeyMap.totalAS, 0);
        }
        var tree = self.getCloudDataByKey(self.KeyMap.tree);
        if (tree) {
            self.setDataByKey(self.KeyMap.tree, tree);
            tree.boxList = tree.boxList || []
        } else {
            self.setDataByKey(self.KeyMap.tree, {date:"",tickets:[],boxList:[] });
            
        }
        console.log("xxxxj init 0");
        
        var myEquips = self.getCloudDataByKey(self.KeyMap.myEquips);
        if (myEquips) {
            self.setDataByKey(self.KeyMap.myEquips, myEquips);
        } else {
            self.setDataByKey(self.KeyMap.myEquips, {on:[],off:[],chip:0});
        }
        console.log(DataCenter.getCloudDataByKey(DataCenter.KeyMap.myEquips));
        
        var skill6Data = DataCenter.getCloudDataByKey(DataCenter.KeyMap.skill6Data)
        self.setDataByKey(self.KeyMap.skill6Data, {count:0,useCount:0})
        if (skill6Data) {
            self.setDataByKey(self.KeyMap.skill6Data, skill6Data);
        }
        var goldenLv = DataCenter.getCloudDataByKey(DataCenter.KeyMap.goldenLv)
        self.setDataByKey(self.KeyMap.goldenLv, goldenLv ? goldenLv:5);
        var sale0 = DataCenter.getCloudDataByKey(DataCenter.KeyMap.sale0)
        self.setDataByKey(self.KeyMap.sale0, sale0 ? sale0:false);
        if (DataCenter.getCloudData()) {
            this.isbug = DataCenter.getCloudData().isbug
        }
        
    },

    saveUserData(data){
        if (data) {
            // DataCenter.getCloudData().WeChatUserInfo = data
            // cc.sys.localStorage.setItem("UserData",JSON.stringify(data))
        }
    },

    readUserData(){
        // console.log("xxxj readUserData");
        // let json = cc.sys.localStorage.getItem('UserData_')
        // if (json&&json.length>0) {
        //     let data = JSON.parse(json);
        //     return data
        // }
        return null
    },

    saveOpenID(id){
        console.log("xxxj saveOpenID");
        if (id) {
            cc.sys.localStorage.setItem("OpenID",id)
        }
    },

    readOpenID(){
        console.log("xxxj readOpenID");
        return cc.sys.localStorage.getItem('OpenID_')
    },

    setLocalValue(key,value){
        cc.sys.localStorage.setItem(key,value)
    },

    getLocalValue(key){
        return cc.sys.localStorage.getItem(key)
    },

    // 保存数据
    saveGameData(data){
        if (!data) {
            return false
        }
        let cdata = this.getDataByKey("CloudData");
        // console.log(cdata.gamedata);
        // console.log(data);
        if (cdata) {
            cdata.gamedata = data
            cdata.rebirthCount = data.rebirthCount
            cdata.maxLv = data.maxPassLavel
            if (this.isbug) {
                cdata.isbug = true
            }
            console.log("保存数据到本地");
            if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                wx.setStorageSync('GameDataNew',JSON.stringify(cdata))
            } else {
                cc.sys.localStorage.setItem("GameDataNew",JSON.stringify(cdata))
            }
            Formulas.saveTempP()
            return true
        }
        return false
    },

    readGameData(){
        let json
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            json = wx.getStorageSync('GameDataNew')
        } else {
            json = cc.sys.localStorage.getItem('GameDataNew')
        }
        if (json&&json.length>0) {
            let data = JSON.parse(json);
            return data
        }
        return null
    },

    // readOldGameData(){
    //     let json = cc.sys.localStorage.getItem('GameData')
    //     if (json&&json.length>0) {
    //         let data = JSON.parse(json);
    //         return data
    //     }
    //     return null
    // },

    saveChildUserData(data){
        console.log("保存子用户数据");
        this.setChildUserArr(data)
        var childUserArr = [];
        if (data && data.length > 0) {
            for (let index = 0; index < data.length; index++) {
                const childUserCloudData = data[index];
                var rebirthCount = childUserCloudData.rebirthCount;
                childUserArr.push({
                    weChatUserInfo: childUserCloudData.WeChatUserInfo,
                    isRebirth: (rebirthCount && rebirthCount > 0) ? true : false,
                    registerTime: childUserCloudData.registerTime,
                    mark : true,
                    maxLv : childUserCloudData.maxLv
                });
            }
        }
        DataCenter.setDataByKey("ChildUserArr", childUserArr);
        cc.sys.localStorage.setItem("ChildGameData",JSON.stringify(childUserArr))
        cc.sys.localStorage.setItem("savechildtime",Date.now())
        Events.emit(Events.ON_CHILDUSERDATA)
    },

    setChildUserArr(data){
        var childUserArr = [];
        if (data && data.length > 0) {
            for (let index = 0; index < data.length; index++) {
                const childUserCloudData = data[index];
                var rebirthCount = childUserCloudData.rebirthCount;
                childUserArr.push({
                    weChatUserInfo: childUserCloudData.WeChatUserInfo,
                    isRebirth: (rebirthCount && rebirthCount > 0) ? true : false,
                    registerTime: childUserCloudData.registerTime
                });
            }
        }
        DataCenter.setDataByKey("ChildUserArr", childUserArr);
        return childUserArr
    },

    readChildUserData(){
        let json = cc.sys.localStorage.getItem('ChildGameData')
        if (json&&json.length>0) {
            let data = JSON.parse(json);
            if (data.length>0&&data[0].mark) {
                DataCenter.setDataByKey("ChildUserArr", data);
            }else{
                data = this.setChildUserArr(data)
                DataCenter.setDataByKey("ChildUserArr", data);
            }
            return data
        }
        return null
    },

    setDataByKey (key, params) {
        const self = this;
        // console.info("key = " + key);
        if ((!!params || params === 0) && key) {
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

    addHistoryTotalGold(gold) {
        const self = this;
        if (BigNumber.isBigNumber(gold)) {
            var key = self.KeyMap.historyTotalGold;
            var oldGold = self.getDataByKey(key);
            self.setDataByKey(key, oldGold.plus(gold));
        } else {
            console.error("type error, 'gold' must be a BigNumber.");
        }
    },

    // 金币增加
    addGold (gold) {
        const self = this;
        if (BigNumber.isBigNumber(gold)) {
            var key = self.KeyMap.curGold;
            var oldGold = self.getDataByKey(key);
            self.setDataByKey(key, oldGold.plus(gold));
            self.addHistoryTotalGold(gold);
            Events.emit(Events.ON_GOLD_CHANGE);
        } else {
            console.error("type error, 'gold' must be a BigNumber.");
        }
    },

    // 英魂增加
    addSoul (soul,bRecycle) {
        const self = this;
        if (BigNumber.isBigNumber(soul)) {
            var key = self.KeyMap.curSoul;
            var old = self.getDataByKey(key);
            self.setDataByKey(key, old.plus(soul));
            if (!bRecycle) {
                var key = self.KeyMap.totalSoul;
                var totalSoul = self.getDataByKey(key);
                self.setDataByKey(key, totalSoul.plus(soul));
            }
            Events.emit(Events.ON_SOUL_CHANGE);
            GameData.refresh()
        } else {
            console.error("type error, 'soul' must be a BigNumber.");
        }
    },
    // 宝石增加
    addRuby (ruby) {
        var key = this.KeyMap.ruby;
        var old = this.getDataByKey(key);
        this.setDataByKey(key, (old+ruby) );
        this.setDataByKey(this.KeyMap.totalRuby, this.getDataByKey(this.KeyMap.totalRuby)+ruby);
        Events.emit(Events.ON_RUBY_CHANGE);
    },
    // 魂魄增加
    addAS (AS) {
        var key = this.KeyMap.AS;
        var old = this.getDataByKey(key);
        this.setDataByKey(key, (old+AS) );
        this.setDataByKey(this.KeyMap.totalAS, this.getDataByKey(this.KeyMap.totalAS)+AS);
        Events.emit(Events.ON_AS_CHANGE);
    },
    // 转身次数增加
    addRebirthCount () {
        var key = this.KeyMap.rebirthCount;
        var old = this.getDataByKey(key);
        this.setDataByKey(key, (old+1) );
        this.getSkill6Data().useCount = 0
        Events.emit(Events.ON_REBIRTH_COUNT)
    },
    addRebirthSoul(soul) {
        const self = this;
        if (BigNumber.isBigNumber(soul)) {
            var key = self.KeyMap.rebirthSoul;
            var old = self.getDataByKey(key);
            self.setDataByKey(key, old.plus(soul));
            Events.emit(Events.ON_SOUL_CHANGE);
        } else {
            console.error("type error, 'soul' must be a BigNumber.");
        }
    },

    // 消费金币
    consumeGold (gold) {
        const self = this;
        if (BigNumber.isBigNumber(gold)) {
            var key = self.KeyMap.curGold;
            var oldGold = self.getDataByKey(key);
            if (oldGold.isGreaterThanOrEqualTo(gold)) {
                self.setDataByKey(key, oldGold.minus(gold));
                Events.emit(Events.ON_GOLD_CHANGE);
            } else {
                console.error("gold is not enough.");
            }
        } else {
            console.error("type error, 'gold' must be a BigNumber.");
        }
    },

    // 消费英魂
    consumeSoul (soul) {
        const self = this;
        if (BigNumber.isBigNumber(soul)) {
            var key = self.KeyMap.curSoul;
            var oldSoul = self.getDataByKey(key);
            console.log("consumeSoul oldSoul:"+oldSoul);
            if (oldSoul.isGreaterThanOrEqualTo(soul)) {
                self.setDataByKey(key, oldSoul.minus(soul));
                Events.emit(Events.ON_SOUL_CHANGE);
                GameData.refresh()
            } else {
                console.error("soul is not enough.");
            }
        } else {
            console.error("type error, 'soul' must be a BigNumber.");
        }
    },
    // 消费仙丹
    consumeRuby (ruby) {
        var key = this.KeyMap.ruby;
        var old = this.getDataByKey(key);
        this.setDataByKey(key, (old-ruby) );
        Events.emit(Events.ON_RUBY_CHANGE);
    },
    // 消费魂魄
    consumeAS (AS) {
        var key = this.KeyMap.AS;
        var old = this.getDataByKey(key);
        this.setDataByKey(key, (old-AS) );
        Events.emit(Events.ON_AS_CHANGE);
    },
    consumeRebirthSoul() {
        const self = this;
        var key = self.KeyMap.rebirthSoul;
        var oldSoul = self.getDataByKey(key);
        self.setDataByKey(key, (new BigNumber(0)));
        return oldSoul;
    },
    getRealRebirthSoul() {
        var num = DataCenter.getDataByKey(this.KeyMap.rebirthSoul);
        return num.plus(2)
    },

    // 金币是否足够
    isGoldEnough(price) {
        if (this.checkBug()) {
            return false
        }
        const self = this;
        if (BigNumber.isBigNumber(price)) {
            var key = self.KeyMap.curGold;
            var curGold = self.getDataByKey(key);
            return curGold.isGreaterThanOrEqualTo(price);
        } else {
            console.error("type error, 'gold' must be a BigNumber.");
            return false;
        }
    },
    
    // 英魂是否足够
    isSoulEnough(soul) {
        if (this.checkBug()) {
            return false
        }
        const self = this;
        if (BigNumber.isBigNumber(soul)) {
            var key = self.KeyMap.curSoul;
            var curSoul = self.getDataByKey(key);
            console.log("isSoulEnough curSoul:"+curSoul);
            return curSoul.isGreaterThanOrEqualTo(soul);
        } else {
            console.error("type error, 'soul' must be a BigNumber.");
            return false;
        }
    },
    
    // 仙桃是否足够
    isRubyEnough(ruby) {
        if (this.checkBug()) {
            return false
        }
        var key = this.KeyMap.ruby;
        var old = this.getDataByKey(key);
        return old >= ruby
    },
    // 魂魄是否足够
    isASEnough(AS) {
        if (this.checkBug()) {
            return false
        }
        var key = this.KeyMap.AS;
        var old = this.getDataByKey(key);
        return old >= AS
    },

    checkBug(){
        let isbug = this.isbug
        if (isbug) {
            return true
        }
        // 1.判断ruby是否大于9000000
        // 2.判断ruby是否大于totalruby
        var key = this.KeyMap.ruby
        var ruby = this.getDataByKey(key);
        key = this.KeyMap.totalRuby
        var totalRuby = this.getDataByKey(key);
        if (ruby >= 9000000) {
            isbug = true
        } else if (ruby > totalRuby) {
            isbug = true
        }
        // 3.判断AS是否大于totalAS
        key = this.KeyMap.AS
        var AS = this.getDataByKey(key);
        key = this.KeyMap.totalAS
        var totalAS = this.getDataByKey(key);
        if (AS > totalAS) {
            isbug = true
        }
        // 如果有一项为true，直接标为isbug
        if (isbug) {
            this.isbug = true
        }
        return isbug
    },

    getGoldStr () {
        const self = this;
        var key = self.KeyMap.curGold;
        var curGold = self.getDataByKey(key);
        return Formulas.formatBigNumber(curGold);
    },

    getSoulStr () {
        const self = this;
        var key = self.KeyMap.curSoul;
        var curSoul = self.getDataByKey(key);
        return Formulas.formatBigNumber(curSoul);
    },

    updataMaxPassLevel(level) {
        const self = this;
        var key = self.KeyMap.maxPassLavel;
        var key2 = self.KeyMap.maxLvNew;
        var curPassLevel = self.getDataByKey(key);
        var maxLvNew = self.getDataByKey(key2);
        if (level > curPassLevel) {
            self.setDataByKey(key, level);
        }
        if (level > maxLvNew) {
            self.setDataByKey(key2, level);
            Events.emit(Events.ON_MAXLEVEL_UPDATE);
        }
        // if (curPassLevel) {
        //     if (level > curPassLevel) {
        //         self.setDataByKey(key, level);
        //         Events.emit(Events.ON_MAXLEVEL_UPDATE);
        //     }
        // } else {
        //     self.setDataByKey(key, level);
        //     Events.emit(Events.ON_MAXLEVEL_UPDATE);
        // }
    },

    passLevel (level) {
        const self = this;
        var key = self.KeyMap.passLavel;
        var curPassLevel = self.getDataByKey(key);
        if (curPassLevel) {
            if (level > curPassLevel) {
                self.setDataByKey(key, level);
                self.updataMaxPassLevel(level);
                Events.emit(Events.ON_LEVEL_PASSED);
            }
        } else {
            self.setDataByKey(key, level);
            self.updataMaxPassLevel(level);
            Events.emit(Events.ON_LEVEL_PASSED);
        }
        if (level == self.getGoldenLv()) {
            self.upGoldenLv()
        }
    },

    isLevelPassed (level) {
        const self = this;
        var key = self.KeyMap.passLavel;
        var curPassLevel = self.getDataByKey(key);
        return curPassLevel >= level;
    },

    isLevelMaxPassed (level) {
        const self = this;
        var key = self.KeyMap.maxPassLavel;
        var curPassLevel = self.getDataByKey(key);
        return curPassLevel >= level;
    },

    saveCloudData (data) {
        const self = this;
        if (data) {
            let wxinfo = self.getDataByKey(self.DataMap.WXUserInfo);
            if (wxinfo) {
                data.WeChatUserInfo = wxinfo
            }
            self.setDataByKey("CloudData", data);
        }
    },

    getCloudData () {
        const self = this;
        var cloudData = self.getDataByKey("CloudData");
        if (cloudData) {
            return cloudData;
        }
    },

    getCloudDataByKey (key) {
        const self = this;
        var cloudData = self.getDataByKey("CloudData");
        if (key && cloudData && cloudData.gamedata && cloudData.gamedata[key]) {
            return cloudData.gamedata[key];
        }
    },

    addSkill6Count(bDouble){
        var skill6Data = DataCenter.getDataByKey(this.KeyMap.skill6Data)
        console.log("当前世界阿弥陀佛使用次数：" + skill6Data.useCount);
        
        if (skill6Data.useCount < 20) {
            skill6Data.count += bDouble?2:1
            skill6Data.useCount ++
        }
    },

    getSkill6Data(){
        var skill6Data = DataCenter.getDataByKey(this.KeyMap.skill6Data)
        return skill6Data
    },

    getGoldenLv(){
        return DataCenter.getDataByKey(this.KeyMap.goldenLv) || 5
    },

    upGoldenLv(){
        var goldenLv = this.getGoldenLv()
        goldenLv += 5
        DataCenter.setDataByKey(this.KeyMap.goldenLv,goldenLv)
    },
    isSale0(){
        return DataCenter.getDataByKey(this.KeyMap.sale0)
    },
    useSale0(){
        DataCenter.setDataByKey(this.KeyMap.sale0,true)
    },

    getTreeData(){
        return DataCenter.getDataByKey(this.KeyMap.tree)
    },

    rebirth() {
        const self = this;
        var rebirthSoul = self.consumeRebirthSoul();
        // self.addSoul(rebirthSoul.plus(2));
        PublicFunc.popGoldDialog(1,rebirthSoul.plus(2))
        self.setDataByKey(self.KeyMap.curGold, (new BigNumber(0)));
        self.setDataByKey(self.KeyMap.passLavel, 0);
        this.addRebirthCount()
        setTimeout(function() {
            self.setDataByKey(self.KeyMap.curGold, (new BigNumber(0)));
        }.bind(this),200)
        Formulas.tempP = null
    },

    revive(){
        this.setDataByKey(this.KeyMap.curSoul, (new BigNumber("0")));
        this.setDataByKey(this.KeyMap.passLavel, 0);
        this.setDataByKey(this.KeyMap.rebirthSoul, (new BigNumber("0")));
        const c6 = this.getSkill6Data().count || 0
        this.setDataByKey(this.KeyMap.skill6Data, {count:Math.ceil(c6/2),useCount:0})
        this.setDataByKey(this.KeyMap.maxLvNew, 0);

        setTimeout(function() {
            this.setDataByKey(this.KeyMap.curGold, (new BigNumber(0)));
        }.bind(this),200)
        Formulas.tempP = null
    },

    resetGame () {
        // 不需要重置的数据
        const shareDate = this.getDataByKey(this.KeyMap.shareDate)
        const signinData = this.getDataByKey(this.KeyMap.signinData)
        const shareReceiveData = this.getDataByKey(this.KeyMap.shareReceiveData)
        
        this.saveCloudData({
            registerTime : Date.now(),
            // registerTime : this.getDataByKey("CloudData").registerTime,
            _openid : HttpUtil.openid
        })
        this.init()

        this.setDataByKey(this.KeyMap.shareDate, shareDate);
        this.setDataByKey(this.KeyMap.signinData, signinData);
        this.setDataByKey(this.KeyMap.shareReceiveData, shareReceiveData || [])
        setTimeout(function() {
            this.setDataByKey(this.KeyMap.curGold, (new BigNumber(0)));
        }.bind(this),100)
        Formulas.tempP = null
    },

    getUserZone(){
        let zone = this.zoneStartTimes.length-1
        var cloudData = this.getDataByKey("CloudData");
        const registerTime = cloudData ? cloudData.registerTime : 0
        for (let i = zone; i >= 0; i--) {
            const time = this.zoneStartTimes[i];
            if (registerTime && registerTime >= time) {
                zone = i
                break
            }
        }
        return zone
    },

});