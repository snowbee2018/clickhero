/*
 * @Author: xj 
 * @Date: 2019-06-18 16:01:20 
 * @Last Modified by: xj
 * @Last Modified time: 2019-07-30 20:14:46
 */
const url = "【西游降魔仙桃兑换码 微信小游戏小程序桃子】，椱ァ製这段描述$g2a2YiuMJxf$后到◇綯℡寳"

cc.Class({
    extends: cc.Component,

    properties: {
        eb : cc.EditBox,
    },

    onClick () {
        const self = this
        let key = this.eb.string.trim()
        HttpUtil.keycode(key,function(success,data) {
            if (success) {
                console.log(data)
                if (data.code == 1) {
                    PublicFunc.popGoldDialog(2,data.ruby,"兑换成功",true)
                    self.eb.string = ""
                } else if(data.code == 0) {
                    wx.showToast({
                        title: "兑换失败",
                        icon: 'none',
                    })
                } else if(data.code == -1) {
                    wx.showToast({
                        title: "兑换码校验失败",
                        icon: 'none',
                    })
                } else if(data.code == -2) {
                    wx.showToast({
                        title: "兑换码已被使用过",
                        icon: 'none',
                    })
                } else {
                    wx.showToast({
                        title: "兑换码校验失败~",
                        icon: 'none',
                    })
                }
            } else {
                wx.showToast({
                    title: "兑换码校验失败",
                    icon: 'none',
                })
            }
        })
    },

    finish(){
        this.node.destroy()
    },

    onLinkClick(){
        WeChatUtil.copyToClipboard(url,function() {
            wx.showToast({
                title: "打开淘宝访问",
                icon: 'success',
            })
        })
    },

    onIDClick(){
        let str = DataCenter.getDataByKey(DataCenter.DataMap.OPENID) + "\n" + HttpUtil.gameDataID
        WeChatUtil.copyToClipboard(str,function() {
            wx.showToast({
                title: "ID复制成功",
                icon: 'success',
            })
        })
    },
})