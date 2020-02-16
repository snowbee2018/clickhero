cc.Class({
    extends: cc.Component,

    properties: {
        ndNew : cc.Node,
        boxDes : cc.Label,
        sfArr : [cc.SpriteFrame],// 2种图片
        boxSpr : cc.Sprite
    },

    onLoad(){
        
    },

    bind(lv,data){
        this.lv = lv
        this.data = data
        this.ndNew.active = data.isnew
        var str = ["打开铜箱子，必定获得普通及以上品质的装备","打开银箱子，必定获得稀有及以上品质的装备","打开金箱子，必定获得史诗及以上品质的装备"]
        this.boxDes.string = str[data.boxType]
        this.boxSpr.spriteFrame = this.sfArr[data.boxType]
        data.isnew = false
    },

    // 打开
    click1(){
        const self = this
        const ruby = this.data.ruby*0.02
        const str = [100,1000,10000]
        
        PublicFunc.popDialog({
            contentStr: "花费"+str[this.data.boxType]+"仙桃，打开宝箱，获得装备",
            btnStrs: {
                left: '是 的',
                right: '不，谢谢'
            },
            onTap: function (dialog, bSure) {
                const count = [100,1000,10000]
                var isCanUpgrade = DataCenter.isRubyEnough(count[self.data.boxType]);
                if (!isCanUpgrade) {
                    PublicFunc.toast("仙桃不足")
                    return
                }
                let b = self.lv.consume(self.data)
                if (b) {
                    console.log("打开宝箱获得装备")
                    PublicFunc.popGoldDialog(3,"狂战斧","获得装备",true)
                }
            }.bind(this)
        })
        
    },

})