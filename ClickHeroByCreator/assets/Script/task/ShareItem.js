const rubys = [100,200,400,500] // 每邀请5个给的奖励
const rebirthRuby = 150
const shareRuby = 30
cc.Class({
    extends: cc.Component,

    properties: {
        lbNo : cc.Label,
        spHead : cc.Sprite,
        lbRuby : cc.Label,
        lbRuby2 : cc.Label,
        btnGet : cc.Button,
        btnGet1 : cc.Button,
        sp1 : cc.Sprite,
        sp2 : cc.Sprite,
    },

    onLoad(){
        this.frameHead = this.spHead.spriteFrame
    },

    bind(index,data){
        // temp 需要持久化 从datacenter拿哦
        this.shareReceiveData = DataCenter.getDataByKey(DataCenter.KeyMap.shareReceiveData)
        // this.shareReceiveData = [[true,true],[true,false]]
        this.lbBtn = this.btnGet.node.children[0].getComponent(cc.Label)
        this.lbBtn1 = this.btnGet1.node.children[0].getComponent(cc.Label)
        this.data = data
        this.index = index
        let i = index+1
        this.lbNo.string = "第" + i + "位"
        if (i%5 == 0) {
            let num = i/5-1
            num = Math.min(num,rubys.length-1)
            this.shareRuby = rubys[num]
        } else {
            this.shareRuby = shareRuby
        }
        this.lbRuby.string = String(this.shareRuby) + "仙桃"
        this.lbRuby.node.opacity = 255
        this.lbRuby2.node.opacity = 255
        this.sp1.node.y = 68
        this.sp2.node.y = 25
        if (data) {
            cc.loader.load({url: data.weChatUserInfo.avatarUrl, type: 'jpg'},function(err, texture) {
                texture = texture || this.defaultCover
                var spriteFrame = new cc.SpriteFrame(texture);
                this.spHead.spriteFrame = spriteFrame;
            }.bind(this))
            if (this.isReceived(0)) {
                this.btnGet.interactable = false
                this.lbBtn.string = "已领取"
                this.lbRuby.node.opacity = 0
                this.sp1.node.y = 48
            } else {
                this.btnGet.interactable = true
                this.lbBtn.string = "领取"
            }
            if (this.isReceived(1)) {
                this.btnGet1.interactable = false
                this.lbBtn1.string = "已领取"
                this.lbRuby2.node.opacity = 0
                this.sp2.node.y = 5
            } else {
                if (data.isRebirth) {
                    this.btnGet1.interactable = true
                    this.lbBtn1.string = "领取"
                } else {
                    this.btnGet1.interactable = false
                    this.lbBtn1.string = "未完成"
                }
            }
        } else {
            // this.spHead 设为默认图
            this.spHead.spriteFrame = this.frameHead
            this.btnGet.interactable = false
            this.lbBtn.string = "领取"
            this.btnGet1.interactable = false
            this.lbBtn1.string = "领取"
        }
    },
    // type 0 share 1 Rebirth
    isReceived(type){
        let rec = this.shareReceiveData[this.index]
        if (rec) {
            return rec[type]
        }else {
            return false
        }
    },

    saveReceived(type){
        this.shareReceiveData = this.shareReceiveData || []
        this.shareReceiveData[this.index] = this.shareReceiveData[this.index] || []
        this.shareReceiveData[this.index][type] = true
        DataCenter.setDataByKey(DataCenter.KeyMap.shareReceiveData,this.shareReceiveData)
    },

    receive(){
        // DataCenter.addRuby(this.shareRuby)
        this.saveReceived(0)
        this.bind(this.index,this.data)
        PublicFunc.popGoldDialog(2,this.shareRuby)
    },

    receive1(){
        // DataCenter.addRuby(200)
        this.saveReceived(1)
        this.bind(this.index,this.data)
        PublicFunc.popGoldDialog(2,rebirthRuby)
    },
})