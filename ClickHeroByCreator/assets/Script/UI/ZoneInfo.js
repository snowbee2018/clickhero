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
        zoneName: cc.Label,
        level: cc.Label,
        percent: cc.Label,
        lastBtn: cc.Node,
        nextBtn: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    setZonrInfo (level, killCount, isBoss) {
        const self = this;
        var yu = level % ZoneArr.length;
        if (yu == 0) {
            self.zoneName.string = ZoneArr[ZoneArr.length - 1];
        } else {
            var zheng = Math.floor((yu - 1) / 5);
            self.zoneName.string = ZoneArr[zheng];
        }
        self.level.string = "等级 " + level;
        if (DataCenter.isLevelPassed(level)) {
            self.percent.string = "已通关";
            self.nextBtn.opacity = 255;
        } else {
            if (isBoss) {
                self.percent.string = "BOSS";
                self.nextBtn.opacity = 0;
            } else {
                self.percent.string = killCount + "/10";
                self.nextBtn.opacity = 0;
            }
        }
        self.lastBtn.opacity = level > 1 ? 255 : 0;
    },
});
