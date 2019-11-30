/*
 * @Author: xj 
 * @Date: 2019-06-12 15:30:28 
 * @Last Modified by: xj
 * @Last Modified time: 2019-11-17 12:39:29
 */

cc.Class({
    extends: cc.Component,

    properties: {
        lbName : cc.Label,
        lbProgress : cc.Label,
        btn:cc.Node,
        lbRuby : cc.Label,
        lbBtn : cc.Label,
        SigninDialog : cc.Prefab,
        ShareDialog : cc.Prefab,
    },

    start () {
        if (this.i == 0) {
            Events.on(Events.ON_MAXLEVEL_UPDATE,this.bind,this)
        } else if (this.i == 1) {
            Events.on(Events.ON_GOLD_CHANGE,this.bind,this)
        } else if (this.i == 2) {
            Events.on(Events.ON_MANUAL_CLICK,this.bind,this)
        } else if (this.i == 3) {
            Events.on(Events.ON_BY_HERO,this.bind,this)
        } else if (this.i == 4) {
            Events.on(Events.ON_REBIRTH_COUNT,this.bind,this)
        } else if (this.i == -1) {
            Events.on(Events.ON_SHARE_CLICK,this.onShare,this)
        }
    },

    onDestroy (){
        if (this.i == 0) {
            Events.off(Events.ON_MAXLEVEL_UPDATE,this.bind,this)
        } else if (this.i == 1) {
            Events.off(Events.ON_GOLD_CHANGE,this.bind,this)
        } else if (this.i == 2) {
            Events.off(Events.ON_MANUAL_CLICK,this.bind,this)
        } else if (this.i == 3) {
            Events.off(Events.ON_BY_HERO,this.bind,this)
        } else if (this.i == 4) {
            Events.off(Events.ON_REBIRTH_COUNT,this.bind,this)
        } else if (this.i == -1) {
            Events.off(Events.ON_SHARE_CLICK,this.onShare,this)
        }
    },

    bind(i){
        this.i = typeof(this.i)=="number" ? this.i : i
        i = this.i
        if (i == -1) {
            this.lbName.string = "每日分享奖励"
            this.lbProgress.string = this.isShared() ? "今天的奖励已经领了~" : "每日首次分享获得30仙桃哦"
            this.lbBtn.string = "去分享"
            return
        }
        const curtime = Date.now();
        this.lastCheckTime = this.lastCheckTime || 0
        const diff = curtime - this.lastCheckTime
        if (diff < 100) {
            return;
        }
        this.lastCheckTime = curtime;
        
        this.lbName.string = TaskDatas.getTitle(i)
        this.lbProgress.string = TaskDatas.getProgress(i)
        this.btn.active = TaskDatas.isFinish(i)
    },

    onShare(){
        // 判断今天有没有分享
        if (!this.isShared()) {
            DataCenter.setDataByKey(DataCenter.KeyMap.shareDate,new Date().toLocaleDateString())
            PublicFunc.popGoldDialog(2,30,"每日分享奖励")
            this.bind()
        }
    },
    isShared(){
        let date = this.strToDate(DataCenter.getDataByKey(DataCenter.KeyMap.shareDate))
        if (date) {
            const cur = new Date().toLocaleDateString()
            if (date.toLocaleDateString() == cur) {
                return true
            }
        }
        return false
    },
    strToDate(value){
        if (value){
            return (new Date(Date.parse(value.replace(/-/g, "/"))));
        }
        return value;
    },

    click(){
        if (this.i == -1) {
            this.showShareDialog()
            return
        }
        if (TaskDatas.getRuby(this.i)) {
            this.bind()
        }
    },

    showSigninDialog(){
        let dialog = cc.instantiate(this.SigninDialog)
        dialog.parent = cc.director.getScene();
        dialog.x = cc.winSize.width / 2;
        dialog.y = cc.winSize.height / 2;
    },

    showShareDialog () {
        console.log("showShareDialog");
        let dialog = cc.instantiate(this.ShareDialog)
        dialog.parent = cc.director.getScene();
        dialog.x = cc.winSize.width / 2;
        dialog.y = cc.winSize.height / 2;
    },
})