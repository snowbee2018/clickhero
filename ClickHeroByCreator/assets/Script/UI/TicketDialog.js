/*
 * @Author: xj 
 * @Date: 2019-12-24 21:05:00 
 * @Last Modified by: xj
 * @Last Modified time: 2019-12-24 23:13:24
 */

cc.Class({
    extends: require('ListView'),

    properties: {
    },

    start(){
        Events.on(Events.CONSUME_TICKET,this.refresh.bind(this))
        WeChatUtil.showBannerAd()
        this.datas = DataCenter.getDataByKey(DataCenter.KeyMap.tree).tickets
        this.refresh()
    },

    getItemCount () {
        return this.datas.length;
    },

    onBindView (view, index) {
        view.getComponent('TicketItem').bind(this,this.datas[index])
    },

    consume(data){
        for (let i = 0; i < this.datas.length; i++) {
            if (data == this.datas[i]) {
                this.datas.splice(i,1)
                this.refresh()
                return true
            }
        }
        return false
    },

    finish(){
        this.node.destroy()
    },

    onDestroy(){
        Events.off(Events.CONSUME_TICKET)
        WeChatUtil.hideBannerAd()
    },
})
