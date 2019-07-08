/*
 * @Author: xj 
 * @Date: 2019-07-07 20:51:24 
 * @Last Modified by: xj
 * @Last Modified time: 2019-07-07 23:29:45
 */

cc.Class({
    extends: cc.Component,

    properties: {
        eb : cc.EditBox,
    },

    start(){
        
        let num = cc.sys.localStorage.getItem('inputLv')
        if (num) {
            this.eb.string = num
        }
    },

    setCallback(cb){
        this._cb = cb
    },

    confirm(){
        let num = Number(this.eb.string)
        if ((num===+num)&&num>0) {
            if (this._cb) {
                cc.sys.localStorage.setItem("inputLv",num)
                let result = this._cb(num)
                if (result) {
                    this.finish()
                }
                wx.showToast({
                    title: result?"升级成功":"仙丹不够",
                    icon: 'none',
                    duration: 800
                })
            }
        }
    },

    finish(){
        this.node.destroy()
    },

})