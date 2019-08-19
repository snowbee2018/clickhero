
cc.Class({
    extends: cc.Component,

    properties: {
        lbName : cc.Label,
        lbContent : cc.Label,
    },

    bind(data){
        this.lbName.string = data.nickname
        this.lbContent.string = data.content
    },

})