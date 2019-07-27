/*
 * @Author: xj 
 * @Date: 2019-05-19
 * @Last Modified by: xj
 * @Last Modified time: 2019-06-23 21:53:20
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
        if (bBgm === "") {
            bBgm = 1
        }
        let bGold = cc.sys.localStorage.getItem("tgGold")
        if (bGold === "") {
            bGold = 1
        }
        let bClick = cc.sys.localStorage.getItem("tgClick")
        if (bClick === "") {
            bClick = 1
        }
        let bClickEffect = cc.sys.localStorage.getItem("tgClickEffect")
        if (bClickEffect === "") {
            bClickEffect = 1
        }
        console.log(bBgm);
        console.log(Boolean(Number(bBgm)));
        
        this.tgBgm.isChecked = Boolean(Number(bBgm))
        this.tgGold.isChecked = Boolean(Number(bGold))
        this.tgClick.isChecked = Boolean(Number(bClick))
        this.tgClickEffect.isChecked = Boolean(Number(bClickEffect))

        this.lbTips.string = PublicFunc.getTipsStr()
        WeChatUtil.showBannerAd()
    },

    onDestroy(){
        WeChatUtil.hideBannerAd()
    },

    resetGame(){
        PublicFunc.resetGame()
    },

    onCheckBgm(){
        console.log("onCheckBgm" + this.tgBgm.isChecked);
        cc.sys.localStorage.setItem("tgBgm",this.tgBgm.isChecked ? 1 : 0)
        AudioMgr.init(true)
    },

    onCheckGold(){
        cc.sys.localStorage.setItem("tgGold",this.tgGold.isChecked ? 1 : 0)
        AudioMgr.init()
    },

    onCheckClick(){
        cc.sys.localStorage.setItem("tgClick",this.tgClick.isChecked ? 1 : 0)
        AudioMgr.init()
    },

    onCheckClickEffect(){
        cc.sys.localStorage.setItem("tgClickEffect",this.tgClickEffect.isChecked ? 1 : 0)
        AudioMgr.init()
    },

    finish(){
        this.node.destroy()
    },

});
