// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad() {
    //     const self = this;
    // },

    // start() {
    //     const self = this;
    // },

    // update (dt) {},

    setNum(numStr) {
        const self = this;
        self.content.string = "+" + numStr;
    },

    onAnimEnd() {
        const self = this;
        self.node.destroy();
    },
});
