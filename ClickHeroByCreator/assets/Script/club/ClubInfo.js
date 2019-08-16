/*
 * @Author: xj 
 * @Date: 2019-08-07 13:27:47 
 * @Last Modified by: xj
 * @Last Modified time: 2019-08-15 00:11:27
 */
cc.Class({
    extends: require("ListView"),

    properties: {
        spHead : cc.Sprite,
        lbName : cc.Label,
        lbLevel : cc.Label,
        btn : cc.Node,
        lbBtn : cc.Label
    },

    getType (index) {
        if (this.isLeader&&index==this.club.maxSeat) {
            return 1
        }
        return 0;
    },

    getItemCount () {
        return this.isLeader ? this.club.maxSeat+1 : this.club.maxSeat
    },

    onBindView (view, index) {
        if (view.type == 1) {
            if (!view.isbind) {
                view.isbind = true
                let ruby = this.club.addSeat*200 + 200
                view.getChildByName("lbRuby").getComponent(cc.Label).string = String(ruby)
                view.on('click', function (button) {
                    if (DataCenter.isRubyEnough(ruby)) {
                        PublicFunc.popDialog({
                            contentStr: "你确定要花"+ruby+"仙桃扩展一个位置吗？",
                            btnStrs: {
                                left: '是 的',
                                right: '不'
                            },
                            onTap: function (dialog, bSure) {
                                HttpUtil.request("addAddSeat",null,function(b,data) {
                                    if (b&&data.data) {
                                        DataCenter.consumeRuby(ruby)
                                        this.club.maxSeat = data.data.maxSeat
                                        this.club.addSeat = data.data.addSeat
                                        ruby = this.club.addSeat*200 + 200
                                        view.getChildByName("lbRuby").getComponent(cc.Label).string = String(ruby)
                                        this.refresh()
                                        if (this.com) {
                                            this.com.refreshBtn()
                                        }
                                    }else{
                                        PublicFunc.toast("请求失败")
                                    }
                                }.bind(this))
                            }.bind(this)
                        });
                    }else{
                        PublicFunc.toast("仙桃不足")
                    }
                }.bind(this))
            }
            return
        }
        view.getComponent("MemberItem").bind(this.club.members[index],this.isLeader,this)
    },

    onDestroy(){
        // Events.off(Events.ON_RESETGAME, this.resetGame, this);
    },

    setClub(data,com){
        console.log("ClubInfo setClub");
        this.com = com
        console.log(data);
        if (!data) {
            this.finish()
            return
        }
        PublicFunc.setClubLogo(this.spHead,data.logoid)
        this.isMy = false
        data.members.forEach(e => {
            if (e._openid == HttpUtil.openid) {
                this.isMy = true
                e.isMe = true
                this.isLeader = e.isLeader || false
                if (this.isLeader) {
                    this.btn.active =false
                    // this.lbBtn.string = "解散部落"
                }else{
                    this.lbBtn.string = "退出部落"
                }
            }
        });
        this.lbName.string = data.name
        this.lbLevel.string = data.level + "级"
        this.club = data
        this.refresh()
    },

    onClick(){
        if (this.isMy) {
            PublicFunc.popDialog({
                contentStr: "你确定要退出部落吗？",
                btnStrs: {
                    left: '是 的',
                    right: '不'
                },
                onTap: function (dialog, bSure) {
                    HttpUtil.request("exitClub",null,function(b,data) {
                        if (b&&data.success) {
                            PublicFunc.toast("已退出部落")
                            Events.emit(Events.ON_CLUB_EXIT)
                            this.finish()
                        }else{
                            PublicFunc.toast("退出失败")
                        }
                    }.bind(this))
                }.bind(this)
            });
        }else{
            // 发送申请请求
            HttpUtil.joinClub(this.club._id,function(b,data) {
                if (b) {
                    if (data.code == 1) {
                        Events.emit(Events.REQ_JOIN_CLUB)
                        this.finish()
                        PublicFunc.toast("申请已提交")
                    } else if (data.code == -2) {
                        // 提示 已经有申请的
                        PublicFunc.toast("已经有申请了")
                    } else if (data.code == -3) {
                        // 提示 已经加入了
                        PublicFunc.toast("你已经加入了部落")
                    }
                }else{
                    PublicFunc.toast("请求失败")
                }
            }.bind(this))
        }
    },

    finish(){
        this.node.destroy()
    },

})