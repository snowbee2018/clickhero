/*
 * @Author: xj 
 * @Date: 2019-12-24 21:05:00 
 * @Last Modified by: xj
 * @Last Modified time: 2019-12-24 23:13:24
 */

cc.Class({
    extends: require('ListView'),

    properties: {
        btnNode1 : cc.Node,
        btnStr1 : cc.Node,
        btnNode2 : cc.Node,
        btnStr2 : cc.Node,
    },

    start(){
        Events.on(Events.CONSUME_TICKET,this.refresh.bind(this))
        WeChatUtil.showBannerAd()
        this.datas = DataCenter.getDataByKey(DataCenter.KeyMap.tree).tickets
        this._boxData = DataCenter.getDataByKey(DataCenter.KeyMap.tree).boxList
        this.onBtnBox()
        
    },

    getItemCount () {
        if(2 == this._type){
            return this.datas.length;
        }else if(1 == this._type){
            return this._boxData.length;
        }
    },

    onBindView (view, index) {
        if(2 == this._type){
            view.getComponent('TicketItem').bind(this,this.datas[index])
        }else if(1 == this._type){
            view.getComponent('BoxItem').bind(this,this._boxData[index])
        }
        
    },

    consume(data){
        console.log(data)
        for (let i = 0; i < this.datas.length; i++) {
            if (data == this.datas[i]) {
                this.datas.splice(i,1)
                this.refresh()
                return true
            }
        }
        console.log(this._boxData)
        for (let i = 0; i < this._boxData.length; i++) {
            if (data == this._boxData[i]) {
                this._boxData.splice(i,1)
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

    onBtnBox()
    {
        this._type = 1
        this.btnNode1.scale = 1.2
        this.btnStr1.color = new cc.Color(0x41,0xff,0x05)
        this.btnNode2.scale = 1
        this.btnStr2.color = new cc.Color(0xff,0xff,0xff)
        this.refresh()
    },

    onBtnTicket()
    {
        this._type = 2
        this.btnNode2.scale = 1.2
        this.btnStr2.color = new cc.Color(0x41,0xff,0x05)
        this.btnNode1.scale = 1
        this.btnStr1.color = new cc.Color(0xff,0xff,0xff)
        this.refresh()
    },

    getType (index) { //type对应prefabs
        if(this._type == 2){
            return 0;
        }
        else
        {
            return 1;  
        }
        
    },
})
