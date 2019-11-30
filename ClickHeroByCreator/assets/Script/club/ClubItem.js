/*
 * @Author: xj 
 * @Date: 2019-08-06 19:14:11 
 * @Last Modified by: xj
 * @Last Modified time: 2019-11-24 15:24:50
 */
cc.Class({
    extends: cc.Component,

    properties: {
        spHead : cc.Sprite,
        lbName : cc.Label,
        lbLv : cc.Label,
        lbCount : cc.Label,
        lbNo : cc.Label,
        spNo : cc.Sprite,
        sfRanks : [cc.SpriteFrame],
        spUserHead : cc.Sprite,
        lbUserName : cc.Label,
    },

    start(){
        this.frameHead = this.spHead.spriteFrame
    },

    onDestroy(){
        // Events.off(Events.ON_RESETGAME, this.resetGame, this);
    },

    bind(data){
        this.club = data
        this.lbName.string = data.name
        this.lbLv.string = (data.level + "级")
        this.lbCount.string = (data.members.length + "/" + data.maxSeat)
        PublicFunc.setClubLogo(this.spHead,data.logoid)
    },

    bindRank(index,data){
        if (index < 3) {
            this.spNo.node.active = true
            this.spNo.spriteFrame = this.sfRanks[index]
        } else {
            this.spNo.node.active = false
        }
        this.lbNo.string = String(index+1)
        this.bind(data)
        let user = data.members[0]
        if (user) {
            this.lbUserName.string = user.nickname
            if (user.headurl) {
                cc.loader.load({url: user.headurl, type: 'jpg'},function(err, texture) {
                    try {
                        var spriteFrame = texture ? new cc.SpriteFrame(texture):this.frameHead
                        this.spUserHead.spriteFrame = spriteFrame
                    } catch (error) {
                        try {
                            this.spUserHead.spriteFrame = this.frameHead
                        } catch (error) {}
                    }
                }.bind(this))
            }
        }
    },

    onClick(){
        PublicFunc.showClubInfo(this.club)
    },

})