
cc.Class({
    extends: cc.Component,

    properties: {
        lbNo : cc.Label,
        spHead : cc.Sprite,
        lbName : cc.Label,
        lbLevel : cc.Label,
    },

    start(){
        this.frameHead = this.spHead.spriteFrame
    },

    bind(index,data){
        this.lbNo.string = String(index+1)
        this.lbName.string = data.WeChatUserInfo.nickName
        this.lbLevel.string = (data.maxLv||'0')+"级"
        try {
            cc.loader.load({url: data.WeChatUserInfo.avatarUrl, type: 'jpg'},function(err, texture) {
                var spriteFrame = texture ? new cc.SpriteFrame(texture):this.frameHead
                this.spHead.spriteFrame = spriteFrame
            }.bind(this))
        } catch (error) {
            this.spHead.spriteFrame = this.frameHead
        }
    },
})