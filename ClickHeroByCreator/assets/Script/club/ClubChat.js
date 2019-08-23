cc.Class({
    extends: require("ListView"),

    properties: {
        eb : cc.EditBox,
    },

    setClub(club){
        if (!club) {
            this.finish()
            return
        }
        this.club = club
        this.chats = club.chats
        this.refresh()
        setTimeout(function() {
            this.scrollView.scrollToBottom(0.1)
        }.bind(this),100)
    },

    onClick(){
        let msg = this.eb.string.trim()
        if (msg.length <= 0) {
            PublicFunc.toast("内容不能为空")
            return
        }
        // 这里要判断下时间
        if (window.sendChatTime&&sendChatTime+30000>Date.now()) {
            PublicFunc.toast("30秒才能发送一次")
            return
        }
        PublicFunc.toast(msg)
        HttpUtil.request("addChat",{msg:msg},function(b,data) {
            if (b&&data.chats) {
                this.chats = data.chats
                this.club.chats = this.chats
                this.refresh()
                setTimeout(function() {
                    this.scrollView.scrollToBottom(0.1)
                }.bind(this),100)
                PublicFunc.toast("发送成功")
                this.eb.string = ""
                window.sendChatTime = Date.now()
                DataCenter.setLocalValue("readChatTime",Date.now())
            } else {
                PublicFunc.toast("发送失败")
            }
        }.bind(this))
    },

    getItemCount () {
        return this.chats.length
    },

    onBindView (view, index) {
        view.getComponent("ChatItem").bind(this.chats[index])
    },

    finish(){
        this.node.destroy()
    },

})