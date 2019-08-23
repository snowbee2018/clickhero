/*
 * @Author: xj 
 * @Date: 2019-08-06 19:14:11 
 * @Last Modified by: xj
 * @Last Modified time: 2019-08-19 16:09:50
 */
cc.Class({
    extends: cc.Component,

    properties: {
        spHead : cc.Sprite,
        lbName : cc.Label,
        lbLv : cc.Label,
        lbCount : cc.Label,
        lbNo : cc.Label,
    },

    onLoad(){
        // Events.on(Events.ON_RESETGAME, this.resetGame, this);
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
        this.lbNo.string = String(index+1)
        this.bind(data)
    },

    onClick(){
        PublicFunc.showClubInfo(this.club)
    },

})