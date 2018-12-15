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
        pageArr: [cc.Node],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const self = this;
        var pageView = self.getComponent(cc.PageView);
        if (pageView) {
            var pageIndex = Number(pageView.getCurrentPageIndex());
            for (let i = 0; i < self.pageArr.length; i++) {
                const page = self.pageArr[i];
                if (i == pageIndex) {
                    page.active = true;
                } else {
                    page.active = false;
                }
            }
        }
    },

    // start () {

    // },

    // update (dt) {},
    onPageEvent (sender) {
        const self = this;
        var pageIndex = Number(sender.getCurrentPageIndex());
        for (let i = 0; i < self.pageArr.length; i++) {
            const page = self.pageArr[i];
            if (i == pageIndex) {
                page.active = true;
            } else {
                page.active = false;
            }
        }
    },
});
