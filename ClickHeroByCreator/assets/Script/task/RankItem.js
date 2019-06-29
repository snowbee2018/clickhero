
cc.Class({
    extends: cc.Component,

    properties: {
        lbNo : cc.Label,
        spHead : cc.Sprite,
        lbName : cc.Label,
        lbLevel : cc.Label,
        btnAward : cc.Node,
    },

    start(){
        this.frameHead = this.spHead.spriteFrame
    },

    bind(index,data,type){
        this.lbNo.string = String(index+1)
        this.lbName.string = data.WeChatUserInfo.nickName
        this.lbLevel.string = (data.maxLv||'0')+"级"
        if (data.WeChatUserInfo&&data.WeChatUserInfo.avatarUrl) {
            cc.loader.load({url: data.WeChatUserInfo.avatarUrl, type: 'jpg'},function(err, texture) {
                try {
                    var spriteFrame = texture ? new cc.SpriteFrame(texture):this.frameHead
                    this.spHead.spriteFrame = spriteFrame
                } catch (error) {
                    try {
                        this.spHead.spriteFrame = this.frameHead
                    } catch (error) {}
                }
            }.bind(this))
        }else {
            this.spHead.spriteFrame = this.spHead.spriteFrame
        }
        this.type = type
        this.btnAward.active = index < 10
    },

    onAwardClick(){
        let str
        if (this.type == 0) {
            str = "总榜奖励的文字内容"
        } else {
            str = "新人榜奖励的文字内容"
        }
        PublicFunc.popDialog({
            contentStr: str,
            btnStrs: {
                mid: '确 定',
            },
        });
    },
})