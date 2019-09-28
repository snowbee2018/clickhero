
cc.Class({
    extends: cc.Component,

    properties: {
        sp : cc.Sprite,
        lbTitle : cc.Label,
        lbCount : cc.Label,
        icons : [cc.SpriteFrame],
        btnAd : cc.Node,
        btn : cc.Node,
        lbTips : cc.Label,
        lbAd : cc.Label,
    },

    start () {
        WeChatUtil.showBannerAd()
    },

    onDestroy(){
        WeChatUtil.hideBannerAd()
    },

    // type: 0 gold, 1 soul, 2 ruby.
    setDatas(type,num,title,disDouble){
        if (title) {
            this.lbTitle.string = title
        }
        this.type = type
        this.num = num
        this.disDouble = disDouble
        this.sp.spriteFrame = this.icons[type]
        this.lbCount.string = type >= 2?num : Formulas.formatBigNumber(num)
        if (disDouble||!window.videoAd) {
            this.btnAd.active = false
            this.lbTips.node.active = false
            this.btn.x = 0
            console.log("this.btn.x = 0");
        } else {
            let strAd = ""
            if (type == 0) {
                strAd = "随机翻2-10倍"
                let times = Formulas.randomNum(2,10)
                this.numAd = this.num.times(times-1)
                this.lbTips.string = "金币×" + times
            } else if (type == 1) {
                let add = this.num.times(0.2).integerValue()
                if (add.lt(2)) {
                    add = new BigNumber(2)
                }
                this.numAd = add
                strAd = "额外获得"+Formulas.formatBigNumber(add) + "仙丹"
                this.lbTips.string = "已增加"+Formulas.formatBigNumber(add) + "仙丹"
            } else if (type == 2) {
                strAd = "翻倍获取仙桃"
                this.numAd = this.num
                this.lbTips.string = "仙桃×" + 2
            }
            this.lbAd.string = strAd
        }
        if (this.type == 0) {
            DataCenter.addGold(this.num)
        }else if(this.type == 1){
            DataCenter.addSoul(this.num)
        }else if(this.type == 2){
            DataCenter.addRuby(this.num)
        }else if(this.type == 3){
            DataCenter.addAS(this.num)
        }
    },

    onClick(){
        // if (this.type == 0) {
        //     DataCenter.addGold(this.num)
        // }else if(this.type == 1){
        //     DataCenter.addSoul(this.num)
        // }else if(this.type == 2){
        //     DataCenter.addRuby(this.num)
        // }
        this.node.destroy()
    },

    onAdClick(){
        const self = this
        if (!WeChatUtil.adEnable) {
            WeChatUtil.popVersionLow()
            return
        }
        if (this.adcallback) {
            return
        }
        if (window.videoAd) {
            this.adcallback = this.onCloseAd.bind(this)
            videoAd.onClose(this.adcallback)
            videoAd.show().catch(() => {
                // 失败重试
                videoAd.load()
                .then(() => videoAd.show())
                .catch(err => 
                    {
                    console.log('激励视频 广告显示失败')
                    let time = cc.sys.localStorage.getItem("sharetime") || 0
                    if (Date.now() - time > 30*60*1000) {
                        wx.showModal({
                            title: '提示',
                            content: '广告显示失败，本次可以通过分享游戏获得奖励(半小时一次)。',
                            confirmText: '分享游戏',
                            success: function(res) {
                                if (res.confirm) {
                                    console.log('用户点击分享游戏')
                                    WeChatUtil.shareAppMessage();
                                    cc.sys.localStorage.setItem("sharetime",Date.now())
                                    self.onCloseAd({isEnded:true})
                                }
                            }
                        })
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: '广告显示失败，请稍后重试。'
                        })
                    }
                    videoAd.offClose(this.adcallback)
                    this.adcallback = null
                })
            })
        }
    },

    onCloseAd(res){
        console.log("[GoldDialog]Video广告关闭，是否播放完成："+res.isEnded);
        if (res.isEnded && this.numAd) {
            this.btnAd.active = false
            let num = this.type == 2?this.numAd + this.num :  this.num.plus(this.numAd)
            this.lbCount.string = this.type == 2?num : Formulas.formatBigNumber(num)
            if (this.type == 0) {
                DataCenter.addGold(this.numAd)
            }else if(this.type == 1){
                DataCenter.addSoul(this.numAd)
            }else if(this.type == 2){
                DataCenter.addRuby(this.numAd)
            }
        }
        if (this.adcallback) {
            videoAd.offClose(this.adcallback)
            this.adcallback = null
        }
    },

    // update (dt) {},
});
