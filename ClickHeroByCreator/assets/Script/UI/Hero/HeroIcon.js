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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const self = this;
    },

    start () {

    },

    // update (dt) {},

    setIcon(heroListCtor, heroID) {
        let spr = this.getComponent(cc.Sprite);
        spr.spriteFrame = heroListCtor.getHeroIconSprf(heroID);
        // CloudRes.getHeroUrl(heroID, function (url) {
        //     if (url) {
        //         cc.loader.load({ url: url, type: 'png' }, function (err, texture) {
        //             if (!err && texture) {
        //                 self.spr.spriteFrame = new cc.SpriteFrame(texture);
        //             }
        //         });
        //     }
        // });
    },
});
