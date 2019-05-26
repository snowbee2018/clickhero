
cc.Class({
    extends: require('ListView'),

    properties: {
        lbTips : cc.Label,
    },

    start(){
        this.lbTips.string = PublicFunc.getTipsStr()
        this.datas = []
        this.loadmore()
    },

    loadmore(){
        if (this.isloading||this.getItemCount()>= 200) {
            return
        }
        this.isloading = true
        CloudDB.getRankUsers(this.onData.bind(this),this.getItemCount())
    },

    onData(datas){
        console.log("onData");
        if (this.node.isValid) {
            console.log(datas);
            this.datas = this.datas.concat(datas)
            this.refresh()
        }
        this.isloading = false
    },

    getItemCount () {
        return this.datas.length;
    },

    onBindView (view, index) {
        view.getComponent('RankItem').bind(index,this.datas[index])
    },

    onScrollToBottom(){
        console.log("loadmore");
        this.loadmore()
    },

    finish(){
        this.node.destroy()
    },
})