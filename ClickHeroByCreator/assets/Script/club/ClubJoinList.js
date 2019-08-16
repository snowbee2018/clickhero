/*
 * @Author: xj 
 * @Date: 2019-08-09 17:31:27 
 * @Last Modified by: xj
 * @Last Modified time: 2019-08-14 23:40:57
 */
cc.Class({
    extends: require("ListView"),

    properties: {
    },

    setClub(data,com){
        if (!data) {
            this.finish()
            return
        }
        this.com = com
        this.club = data
        this.refresh()
    },

    getItemCount () {
        return this.club.joinList.length
    },

    onBindView (view, index) {
        view.getComponent("MemberItem").bindJoin(this.club.joinList[index],this)
    },

    finish(){
        this.node.destroy()
    },

})