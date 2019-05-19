/*
 * @Author: xj 
 * @Date: 2019-05-19
 * @Last Modified by: xj
 * @Last Modified time: 2019-05-19 16:06:37
 */
 
cc.Class({
    extends: cc.Component,

    properties: {
        tgBgm : cc.Toggle,
        tgGold : cc.Toggle,
        tgClick : cc.Toggle,
        tgClickEffect : cc.Toggle,
        lbTips : cc.Label,
    },

    start () {
        let bBgm = cc.sys.localStorage.getItem("tgBgm")
        if (bBgm == null) {
            bBgm = 1
        }
        let bGold = cc.sys.localStorage.getItem("tgGold")
        if (bGold == null) {
            bGold = 1
        }
        let bClick = cc.sys.localStorage.getItem("tgClick")
        if (bClick == null) {
            bClick = 1
        }
        let bClickEffect = cc.sys.localStorage.getItem("tgClickEffect")
        if (bClickEffect == null) {
            bClickEffect = 1
        }
        
        this.tgBgm.isChecked = Boolean(Number(bBgm))
        this.tgGold.isChecked = Boolean(Number(bGold))
        this.tgClick.isChecked = Boolean(Number(bClick))
        this.tgClickEffect.isChecked = Boolean(Number(bClickEffect))

        this.lbTips.string = PublicFunc.getTipsStr()
    },

    onCheckBgm(){
        console.log(this.tgBgm.isChecked);
        cc.sys.localStorage.setItem("tgBgm",this.tgBgm.isChecked ? 1 : 0)
        AudioMgr.init()
    },

    onCheckGold(){
        console.log(this.tgGold.isChecked);
        cc.sys.localStorage.setItem("tgGold",this.tgGold.isChecked ? 1 : 0)
        AudioMgr.init()
    },

    onCheckClick(){
        console.log(this.tgClick.isChecked);
        cc.sys.localStorage.setItem("tgClick",this.tgClick.isChecked ? 1 : 0)
        AudioMgr.init()
    },

    onCheckClickEffect(){
        console.log(this.tgClickEffect.isChecked);
        cc.sys.localStorage.setItem("tgClickEffect",this.tgClickEffect.isChecked ? 1 : 0)
        AudioMgr.init()
    },

    finish(){
        this.node.destroy()
    },

});
