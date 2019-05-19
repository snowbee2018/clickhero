/*
 * @Author: xj 
 * @Date: 2019-05-19
 * @Last Modified by: xj
 * @Last Modified time: 2019-05-19 13:11:58
 */
 
cc.Class({
    extends: cc.Component,

    properties: {
        tgBgm : cc.Toggle,
        tgGold : cc.Toggle,
        tgClick : cc.Toggle,
        tgClickEffect : cc.Toggle,
    },

    start () {
        
    },

    finish(){
        this.node.destroy()
    },

});
