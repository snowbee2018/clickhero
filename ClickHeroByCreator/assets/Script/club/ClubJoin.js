/*
 * @Author: xj 
 * @Date: 2019-08-06 17:28:49 
 * @Last Modified by: xj
 * @Last Modified time: 2019-08-14 23:39:45
 */

cc.Class({
    extends: require("ListView"),

    properties: {
        eb : cc.EditBox,
        preCreate : cc.Prefab,
    },

    onClickCreate(){
        console.log("onClickCreate");
        let club = cc.instantiate(this.preCreate)
        club.parent = cc.director.getScene();
        club.x = cc.winSize.width / 2;
        club.y = cc.winSize.height / 2;
    },

    onClickRandom(){
        console.log("onClickRandom");
        HttpUtil.randomClub(function(b,data) {
            if (b && data.club) {
                PublicFunc.showClubInfo(data.club)
            }
        }.bind(this))
    },

    onClickSearch(){
        this.eb.string = this.eb.string.trim()
        let str = this.eb.string
        HttpUtil.searchClub(str,function(b,data) {
            if (b&&data.code==1) {
                this.clubs = data.clubs || []
                this.refresh()
            }
        }.bind(this))
    },

    setClubs(clubs){
        this.clubs = clubs || []
        this.refresh()
    },

    getItemCount () {
        return this.clubs.length;
    },

    onBindView (view, index) {
        view.getComponent("ClubItem").bind(this.clubs[index])
    },

    // onLoad(){
    //     // Events.on(Events.ON_RESETGAME, this.resetGame, this);
    // },

    onDestroy(){
        // Events.off(Events.ON_RESETGAME, this.resetGame, this);
    },


})