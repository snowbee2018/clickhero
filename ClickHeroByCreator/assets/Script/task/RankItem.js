
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
        this.lbLevel.string = (data.maxLv||'1')+"关"
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
        this.index = index
        this.btnAward.active = index < 10
    },

    onAwardClick(){
        let str
        if (this.type == 0) {
            if(this.index==0)
            {
                str = "第1名每周获得3000仙桃，100魅力值\n\n *以每周天晚十点数据为准\n*详情见游戏圈"
            }             
            else if(this.index==1)
            {
                str = "第2名每周获得2000仙桃，50魅力值\n\n *以每周天晚十点数据为准\n*详情见游戏圈"
            }
            else if(this.index==2)
            {
                str = "第3名每周获得1000仙桃，20魅力值\n\n *以每周天晚十点数据为准\n*详情见游戏圈"
            }
            else if(3 <=this. index <10)
            {
                str = "排行榜第4-10名每周获得500仙桃\n\n *以每周天晚十点数据为准\n*详情见游戏圈"
            }

        } else {
            if(this.index==0)
            {
                str = "第1名每周获得1000仙桃，20魅力值\n\n *新人榜只针对本周新玩家\n*以每周天晚十点数据为准\n*详情见游戏圈"
            }             
            else if(this.index==1)
            {
                str = "新人榜第2名每周获得600仙桃\n\n *新人榜只针对本周新玩家\n*以每周天晚十点数据为准\n*详情见游戏圈"
            }
            else if(this.index==2)
            {
                str = "新人榜第3名每周获得300仙桃\n\n *新人榜只针对本周新玩家\n*以每周天晚十点数据为准\n*详情见游戏圈"
            }
            else if(3 <=this. index <10)
            {
                str = "新人榜第4-10名每周获得100仙桃\n\n *新人榜只针对本周新玩家\n*以每周天晚十点数据为准\n*详情见游戏圈"
            }
        }
        PublicFunc.popDialog({
            contentStr: str,
            btnStrs: {
                mid: '确 定',
            },
        });
    },
})