/*
 * @Author: xj 
 * @Date: 2019-08-06 16:06:47 
 * @Last Modified by: xj
 * @Last Modified time: 2019-12-01 13:36:05
 * 进来后 用openid请求下club，返回的code是1 就显示layoutClub，是2就显示layoutJoin
 */

cc.Class({
    extends: cc.Component,

    properties: {
        layoutJoin : cc.Node,
        ClubLayout : cc.Prefab,
        lbTips : cc.Label,
    },

    onLoad(){
        Events.on(Events.ON_CLUB_EXIT, this.onFree, this);
        Events.on(Events.ON_CLUB_CREATED, this.onCreated, this);
        Events.on(Events.REQ_JOIN_CLUB, this.finish, this);
        HttpUtil.club(this.onClub.bind(this))
    },

    onClub(b,data){
        console.log("onClub");
        if (!this.isValid) {
            return
        }
        if (!b) {
            return
        }
        console.log(data);
        if (data.code == 1) {
            this.enterMyClub(data.club)
        } else if (data.code == 2) {
            this.layoutJoin.active = true
            this.layoutJoin.getComponent("ClubJoin").setClubs(data.clubs)
        } else if (data.code == 3) {
            this.lbTips.node.active = true
            let clubName = data.club.name
            this.lbTips.string = "你正在申请加入部落\n["+clubName+"]("+data.club.members.length+"/"+data.club.maxSeat+")"
        }
    },

    cancelJoin(){
        HttpUtil.request("cancelJoin",null,function(b,data) {
            if (b && data.success) {
                console.log("提示取消成功！");
                this.finish()
            }
        }.bind(this))
    },

    enterMyClub(club){
        this.layoutJoin.active = false
        let layout = cc.instantiate(this.ClubLayout)
        layout.parent = cc.director.getScene();
        layout.x = cc.winSize.width / 2;
        layout.y = cc.winSize.height / 2;
        layout.getComponent("ClubLayout").setClub(club)
        this.finish()
    },

    onCreated(club){
        if (club) {
            this.enterMyClub(club)
        }
    },

    onFree(){
        this.finish()
    },

    onDestroy(){
        Events.off(Events.ON_CLUB_EXIT, this.onFree, this);
        Events.off(Events.ON_CLUB_CREATED, this.onCreated, this);
        Events.off(Events.REQ_JOIN_CLUB, this.finish, this);
    },

    finish(){
        this.node.destroy()
    },

})