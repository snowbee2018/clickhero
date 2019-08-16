/*
 * @Author: xj 
 * @Date: 2019-08-06 22:37:53 
 * @Last Modified by: xj
 * @Last Modified time: 2019-08-15 10:50:34
 */
cc.Class({
    extends: cc.Component,

    properties: {
        lbTips : cc.Label,
        lbRuby : cc.Label,
        eb : cc.EditBox,
    },

    onLoad(){
        var ruby = DataCenter.getDataByKey(DataCenter.KeyMap.ruby);
        this.lbRuby.string = ""+ruby
    },

    onClick(){
        let name = this.eb.string.trim()
        if (name.length <2 || name.length > 7) {
            this.lbTips.string = "名字最少2个字，最多7个字"
            return
        }
        var ruby = DataCenter.getDataByKey(DataCenter.KeyMap.ruby);
        if (ruby < 1000) {
            this.lbTips.string = "仙桃不够"
            return
        }

        HttpUtil.createClub(name,function(b,data) {
            if (b) {
                if (data.code == 1) {
                    DataCenter.consumeRuby(1000)
                    Events.emit(Events.ON_CLUB_CREATED,data.club)
                    this.finish()
                } else if (data.code == 2){
                    this.lbTips.string = "名字已经被使用了"
                }
            }
        }.bind(this))
    },

    finish(){
        this.node.destroy()
    },
    onDestroy(){
    },
})