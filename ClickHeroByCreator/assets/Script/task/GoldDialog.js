
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
    },

    start () {
        
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
        this.lbCount.string = type == 2?num : Formulas.formatBigNumber(num)
        if (disDouble||!window.videoAd) {
            this.btnAd.active = false
            this.lbTips.node.active = false
        }
    },

    onClick(){
        if (this.type == 0) {
            DataCenter.addGold(this.num)
        }else if(this.type == 1){
            DataCenter.addSoul(this.num)
        }else if(this.type == 2){
            DataCenter.addRuby(this.num)
        }
        this.node.destroy()
    },

    onAdClick(){
        const self = this
        if (videoAd) {
            this.callback = this.onCloseAd.bind(this)
            videoAd.onClose(this.callback)
            videoAd.show().catch(() => {
                // 失败重试
                videoAd.load()
                .then(() => videoAd.show())
                .catch(err => {
                    console.log('激励视频 广告显示失败')
                })
            })
        }
    },

    onCloseAd(res){
        console.log("Video广告关闭，是否播放完成："+res.isEnded);
        if (res.isEnded) {
            this.btnAd.active = false
            this.num = this.type == 2 ? this.num *2 : this.num.times(2)
            this.lbCount.string = this.type == 2?this.num : Formulas.formatBigNumber(this.num)
        }
        videoAd.offClose(this.callback)
    },

    // update (dt) {},
});
