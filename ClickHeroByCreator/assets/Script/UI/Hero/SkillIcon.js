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
        gray: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const self = this;
        self.spr = self.getComponent(cc.Sprite);
    },

    start () {
        // set spriteframe
    },

    // update (dt) {},

    lightIcon (bLight) {
        const self = this;
        bLight = bLight ? true : false;
        self.gray.active = !bLight;
    },

    setIcon (heroID, skillID) {
        const self = this;
        self._heroID = heroID;
        self._skillID = skillID;
    },
});
