/*
 * @Author: xj 
 * @Date: 2019-06-18 16:01:20 
 * @Last Modified by: xj
 * @Last Modified time: 2019-06-18 16:02:21
 */


cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    finish(){
        this.node.destroy()
    },
})