
cc.Class({
    extends: require('ListView'),

    properties: {
        lbTips : cc.Label,
        tabs : [cc.Button],
    },

    start(){
        this.datas = this.datas || [[],[]]
        WeChatUtil.showBannerAd()

        // var cloudData = DataCenter.getDataByKey("CloudData");
        // let time = cloudData ? cloudData.registerTime : 0
        this.onTab(null,0)
    },

    onTab(event,i){
        if (this.isloading|| this.index == i) {
            return
        }
        this.lbTips.string = PublicFunc.getTipsStr()
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
        if (this.isloading||this.getItemCount()>= 100) {
            return
        }
        if (this.index == 1&&this.getItemCount() > 0) {
            return
        }
        this.isloading = true
        if (this.index == 0) {
            HttpUtil.getRankUsers(this.index==1,this.getItemCount(),this.onData.bind(this))
        } else if (this.index == 1){
            HttpUtil.request("getRankClubs",null,this.onClubs.bind(this))
        }
    },

    onClubs(b,data){
        if (b && data.clubs) {
            this.datas[1] = data.clubs
            this.refresh()
        }
        this.isloading = false
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

    getType (index) { //type对应prefabs
        return this.index
    },

    getItemCount () {
        return this.getDatas().length;
    },

    onBindView (view, index) {
        if (view.type == 0) {
            view.getComponent('RankItem').bind(index,this.getDatas()[index],this.index)
        } else {
            view.getComponent('ClubItem').bindRank(index,this.getDatas()[index])
        }
    },

    onScrollToBottom(){
        console.log("loadmore");
        this.loadmore()
    },

    finish(){
        this.node.destroy()
    },
})