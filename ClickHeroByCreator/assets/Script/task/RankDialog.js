
cc.Class({
    extends: require('ListView'),

    properties: {
        lbTips : cc.Label,
        tabs : [cc.Button],
    },

    start(){
        this.datas = this.datas || [[],[]]
        WeChatUtil.showBannerAd()

        var cloudData = DataCenter.getDataByKey("CloudData");
        let time = cloudData ? cloudData.registerTime : 0
        this.onTab(null,time >Date.now() - 3600000*24*7 ? 1 : 0)
    },

    onTab(event,i){
        if (this.isloading|| this.index == i) {
            return
        }
        if(i == 0){
            this.lbTips.string = PublicFunc.getTipsStr()
        } else {
            this.lbTips.string = "新人榜收集的是7天内的新玩家等级排行"
        }
        this.index = Number(i)
        this.refresh()
        if (this.getItemCount()==0) {
            this.loadmore()
        }
        this.tabs[this.index].interactable = false
        this.tabs[(this.index+1)%2].interactable = true
    },

    onDestroy(){
        WeChatUtil.hideBannerAd()
    },

    loadmore(){
        if (this.isloading||this.getItemCount()>= 200) {
            return
        }
        this.isloading = true
        CloudDB.getRankUsers(this.index,this.onData.bind(this),this.getItemCount())
    },

    onData(datas){
        console.log("onData");
        if (this.node.isValid) {
            console.log(datas);
            this.datas[this.index] = this.getDatas().concat(datas)
            if (this.getDatas().length == datas.length) {
                this.refresh()
            }else {
                this.calContentHeight()
            }
        }
        this.isloading = false
    },

    getDatas(){
        return this.datas[this.index]
    },

    getItemCount () {
        return this.getDatas().length;
    },

    onBindView (view, index) {
        view.getComponent('RankItem').bind(index,this.getDatas()[index])
    },

    onScrollToBottom(){
        console.log("loadmore");
        this.loadmore()
    },

    finish(){
        this.node.destroy()
    },
})