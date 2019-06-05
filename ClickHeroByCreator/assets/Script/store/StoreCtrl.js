

cc.Class({
    extends: cc.Component,

    properties: {
        sv : cc.ScrollView,
        itemPrefab: cc.Prefab,
        dialogPrefab : cc.Prefab,
        lbRuby : cc.Label,
        btnAd : cc.Node,
    },

    onLoad(){
        console.log("StoreCtrl:ctor");
        this.items = new Array();
        Events.on(Events.ON_RUBY_CHANGE,this.showRuby,this);
        this.fullViews();
        this.showRuby();
        this.onMaxPassLavelChange()
        Events.on(Events.ON_MAXLEVEL_UPDATE, this.onMaxPassLavelChange, this)
        // Events.on(Events.ON_LEVEL_PASSED, this.onlvPassed, this);

        if (!window.videoAd) {
            this.btnAd.active = false
        }
    },

    onAdClick(){
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
                .catch(err => {
                    console.log('激励视频 广告显示失败')
                    wx.showModal({
                        title: '提示',
                        content: '广告显示失败，请稍后重试。'
                    })
                    videoAd.offClose(this.adcallback)
                    this.adcallback = null
                })
            })
        }
    },

    onCloseAd(res){
        console.log("[StoreCtrl]Video广告关闭，是否播放完成："+res.isEnded);
        if (res.isEnded) {
            PublicFunc.popGoldDialog(2,20,null,true)
            // this.btnAd.active = false
        }
        videoAd.offClose(this.adcallback)
        this.adcallback = null
    },


    onDestroy (){
        Events.off(Events.ON_MAXLEVEL_UPDATE, this.onMaxPassLavelChange, this)
    },

    showRuby(){
        var ruby = DataCenter.getDataByKey(DataCenter.KeyMap.ruby)
        this.lbRuby.string = ""+ruby
    },

    fullViews(){
        try {
            let list = GoodsDatas.datas;
            // console.log(list);

            list.forEach(e => {
                this.addItem(e);
            });
        } catch (error) {
            console.error(error);
            
        }

    },

    onMaxPassLavelChange(){
        let lv = DataCenter.getDataByKey(DataCenter.KeyMap.maxPassLavel) || 0
        lv = lv + 100
        this.items.forEach(node => {
            let data = node.getComponent("GoodsItem").data
            let active = Boolean(data.unlockLv <= lv)
            if (node.active != active){
                node.active = active
            }
        });
    },

    onlvPassed (){
        // let lv = DataCenter.getDataByKey(DataCenter.KeyMap.passLavel);
        // if (lv%5==0&&window.videoAd) {
        //     this.btnAd.active = true
        // }
    },

    addItem(goods) {
        var node = cc.instantiate(this.itemPrefab);
        node.parent = this.sv.content;
        node.getComponent("GoodsItem").bind(goods);
        this.items.push(node)
    },
});