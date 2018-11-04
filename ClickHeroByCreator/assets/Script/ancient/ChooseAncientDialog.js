
cc.Class({
    extends: cc.Component,

    properties: {
        items : [cc.Sprite],
        desc : cc.Label,
    },

    // onLoad () {},

    start () {

    },

    onAccept(){

    },

    onCancal(){
        this.node.destroy();
    },
});
