cc.Class({
    extends: cc.Component,

    properties: {
        ndNew : cc.Node,
        lbRuby : cc.Label,
    },

    onLoad(){
        
    },

    bind(lv,data){
        this.lv = lv
        this.data = data
        this.ndNew.active = data.isnew
        this.lbRuby.string = data.ruby
        data.isnew = false
    },

    // 分解
    click1(){
        const ruby = this.data.ruby*0.02
        PublicFunc.popDialog({
            contentStr: "这会消耗翻倍券并获得额度的2%的仙桃，共"+ruby+"仙桃，你确定要分解吗？",
            btnStrs: {
                left: '是 的',
                right: '不，谢谢'
            },
            onTap: function (dialog, bSure) {
                let b = this.lv.consume(this.data)
                if (b) {
                    PublicFunc.popGoldDialog(2,ruby,null,true)
                }
            }.bind(this)
        })
        
    },

    // 使用
    click2(){
        PublicFunc.popCDKeyDialog()
    },

})