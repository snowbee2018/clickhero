/*
 * @Author: xj 
 * @Date: 2019-08-07 13:40:54 
 * @Last Modified by: xj
 * @Last Modified time: 2019-08-14 23:40:45
 */
cc.Class({
    extends: cc.Component,

    properties: {
        spHead : cc.Sprite,
        lbName : cc.Label,
        lbLevel : cc.Label,
        btnDel : cc.Node,
        btnAgree : cc.Node,
        vContent : cc.Node,
        lbTips : cc.Label,
        leader : cc.Node,
    },

    start(){
        this.frameHead = this.spHead.spriteFrame
    },

    bind(user,isLeader,clubInfo){
        if (user) {
            this.lbTips.string = ""
            this.vContent.active = true
            this.user = user
            this.clubInfo = clubInfo
            this.lbName.string = user.nickname
            this.lbLevel.string = user.maxLv + "关"
            if (isLeader&&user._openid!=HttpUtil.openid) {
                this.btnDel.active = true
            }else {
                this.btnDel.active = false
            }
            this.leader.active = Boolean(user.isLeader)
            cc.loader.load({url: user.headurl, type: 'jpg'},function(err, texture) {
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
            this.vContent.active = false
            this.lbTips.string = "（空位）"
        }
    },

    bindJoin(user,clubInfo){
        this.isJoin = true
        this.user = user
        this.clubInfo = clubInfo
        this.lbName.string = user.nickName
        this.lbLevel.string = user.maxLv + "关"
        this.btnDel.active = true
        this.btnAgree.active = true
        cc.loader.load({url: user.avatarUrl, type: 'jpg'},function(err, texture) {
            try {
                var spriteFrame = texture ? new cc.SpriteFrame(texture):this.frameHead
                this.spHead.spriteFrame = spriteFrame
            } catch (error) {
                try {
                    this.spHead.spriteFrame = this.frameHead
                } catch (error) {}
            }
        }.bind(this))
    },

    delSelfOnInfo(){
        let arr
        if (this.isJoin) {
            arr = this.clubInfo.club.joinList
        } else {
            arr = this.clubInfo.club.members
        }
        for (let i = 0; i < arr.length; i++) {
            const e = arr[i];
            if (e == this.user) {
                arr.splice(i,1)
            }
        }
        this.clubInfo.refresh() // 明天试试删除和同意拒绝
        if (this.clubInfo.com) {
            this.clubInfo.com.refreshBtn()
        }
    },
    
    clickAgree(){
        HttpUtil.request("agreeJoin",{targetid:this.user._openid},function(b,data) {
            if (b&&data.members) {
                this.clubInfo.club.members = data.members
                this.delSelfOnInfo()
            } else {
                PublicFunc.toast("操作失败")
            }
        }.bind(this))
    },

    clickDel(){
        if (this.isJoin) {
            HttpUtil.request("cancelJoin",{openid:this.user._openid},function(b,data) {
                if (b && data.success) {
                    this.delSelfOnInfo()
                }else{
                    PublicFunc.toast("删除失败")
                }
            }.bind(this))
        } else {
            PublicFunc.popDialog({
                contentStr: "你确定要踢出该成员吗？",
                btnStrs: {
                    left: '是 的',
                    right: '不'
                },
                onTap: function (dialog, bSure) {
                    HttpUtil.request("removeMember",{targetid:this.user._openid},function(b,data) {
                        if (b&&data.success) {
                            this.delSelfOnInfo()
                        }else{
                            PublicFunc.toast("删除失败")
                        }
                    }.bind(this))
                }.bind(this)
            });
        }
    },
})