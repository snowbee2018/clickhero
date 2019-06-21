/*
 * @Author: xj 
 * @Date: 2019-06-18 16:01:20 
 * @Last Modified by: xj
 * @Last Modified time: 2019-06-20 19:03:17
 */
const url = "【西游降魔铺子】https://m.tb.cn/h.eUKHC2j?sm=2194cc 点击链接，再选择浏览器咑閞；或復·制这段描述￥nBezYU6mCQq￥"

cc.Class({
    extends: cc.Component,

    properties: {
        
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
        WeChatUtil.copyToClipboard(DataCenter.getDataByKey(DataCenter.DataMap.OPENID),function() {
            wx.showToast({
                title: "ID复制成功",
                icon: 'success',
            })
        })
    },
})