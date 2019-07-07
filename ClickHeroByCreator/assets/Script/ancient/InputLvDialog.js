/*
 * @Author: xj 
 * @Date: 2019-07-07 20:51:24 
 * @Last Modified by: xj
 * @Last Modified time: 2019-07-07 22:19:08
 */

cc.Class({
    extends: cc.Component,

    properties: {
        eb : cc.EditBox,
    },

    setCallback(cb){
        this._cb = cb
    },

    confirm(){
        let num = Number(this.eb.string)
        if ((num===+num)&&num>0) {
            if (this._cb) {
                this._cb(num)
            }
            this.finish()
        }
    },

    finish(){
        this.node.destroy()
    },

})