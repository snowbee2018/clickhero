cc.Class({
    extends: require("ListView"),

    properties: {
    },

    setData(chats){
        if (!chats) {
            this.finish()
            return
        }
        this.chats = chats
        this.refresh()
        setTimeout(function() {
            // 这里要滚动到底下去
        },100)
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