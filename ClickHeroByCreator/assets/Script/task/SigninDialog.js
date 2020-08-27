/*
 * @Author: xj 
 * @Date: 2019-01-01 02:18:47 
 * @Last Modified by: xj
 * @Last Modified time: 2020-07-09 21:13:03
 */
 
cc.Class({
    extends: cc.Component,

    properties: {
        days : cc.Node,
        day1 : cc.Node,
        lbTips : cc.Label,
        btn : cc.Button,
    },

    start () {
        this.data = DataCenter.getDataByKey(DataCenter.KeyMap.signinData)
        console.log(this.data);
        this.times = 0 // 默认次数
        if (this.data) {
            // 如果是本周
            if (this.isThisWeek()) {
                this.times = this.data.times
                console.log("是本周哦：" + this.times);
            }
        }
        this.rubys = [30,40,50,60,70,80,100]
        this.bindViews()
        this.lbTips.string = PublicFunc.getTipsStr()
        
        if (this.isSignin()) {
            this.btn.interactable = false
        }
        WeChatUtil.showBannerAd()
    },

    onDestroy(){
        WeChatUtil.hideBannerAd()
    },

    bindViews(){
        this.viewHolders = []
        this.today = 0
        if (this.isSignin()) {
            this.today = this.times - 1
        } else {
            this.today = this.times 
        }
        for (let i = 0; i < 7; i++) {
            var view
            if (i == 0) {
                view = this.day1
            } else {
                view = cc.instantiate(this.day1)
                view.parent = this.days
                const w = 640 / 8
                if (i < 4) {
                    view.x = w * ((i - 2) * 2 + 1)
                } else {
                    view.x = w * ((i - 4 - 1) * 2)
                    view.y = -339
                }
                // 这里根据i 设置x 和 y
            }
            let lbDay = view.getChildByName("lbDay").getComponent(cc.Label)
            let lbCount = view.getChildByName("lbCount").getComponent(cc.Label)
            let ndGray = view.getChildByName("ndGray")
            let ndToday = view.getChildByName("ndToday")
            lbDay.string = "第"+(i+1)+"天"
            ndGray.active = i < this.times
            lbCount.string = "×"+this.rubys[i]
            ndToday.active = i == this.today
            this.viewHolders[i] = {}
            this.viewHolders[i].view = view
            this.viewHolders[i].lbDay = lbDay
            this.viewHolders[i].lbCount = lbCount
            this.viewHolders[i].ndGray = ndGray
        }
    },

    signinClick(){
        if (this.isSignin()) {
            console.log("今天已经签到过了");
            return
        }
        // 得到钻石,
        let ruby = this.rubys[this.times]
        console.log("得到ruby：" + ruby);
        PublicFunc.popGoldDialog(2,ruby)
        // DataCenter.addRuby(ruby)
        // 更改data和ui
        let dateStr = new Date().toLocaleDateString()
        this.data = {times:this.times+1,date:dateStr}
        DataCenter.setDataByKey(DataCenter.KeyMap.signinData,this.data)
        this.viewHolders[this.today].ndGray.active = true
        this.btn.interactable = false
    },
    isSignin(){
        if (!this.data) {
            return false
        }
        let date = this.strToDate(this.data.date)
        let b = date.toLocaleDateString() == new Date().toLocaleDateString()
        if (!b) {
            if (date.getTime() > Date.now()) {
                WeChatUtil.isTimeErr = true
                b = true
            }
        }
        return b
    },
    isThisWeek(){
        let date = this.strToDate(this.data.date)
        let b = String(this.getFirstDayOfWeek(new Date())) == String(this.getFirstDayOfWeek(date))
        console.log("isThisWeek:" + b);
        return b
    },
    getFirstDayOfWeek (date) {
        var day = date.getDay() || 7;
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 - day);
    },
    strToDate(value){
        if (value){
            return (new Date(Date.parse(value.replace(/-/g, "/"))));
        }
        return value;
    },
    finish(){
        this.node.destroy()
    },

});
