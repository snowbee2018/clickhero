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
        skillName: "", // 技能名称
        describe: "", // 技能描述
        coolingTime: 0, // 冷却时间，秒
        bSustain: false, // 是否是持续技能
        sustainTime: 0, // 持续时间
        heroID: 0,
        skillID: 0,

        gray: cc.Node,
        skillNameLab: cc.Label,
        describeLab: cc.Label,
        timeLab: cc.Label,
        
        _isBuy: false, // 是否已经购买
        _lastTimestamp: 0, // 上次使用技能的时间
        _isActive: true, // 是否已经冷却完成
        _isSustainFinish: true, // 技能持续是否结束
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        const self = this;
        self.schedule(function () {
            if (!self._isBuy) return;
            if (self._isActive) {
                
            } else {
                var nowTime = Date.parse(new Date());
                var time = 1000*self.coolingTime - nowTime + self._lastTimestamp;
                if (time > 0) {
                    var timeStr = self.dateFormat(time/1000);
                    self.onCoolingCountDown(time/1000, timeStr);
                } else {
                    self._isActive = true;
                    self.onCoolingDone();
                }
            }

            if (self.bSustain) {
                if (self._isSustainFinish) {

                } else {
                    var nowTime = Date.parse(new Date());
                    var time = 1000*self.sustainTime - nowTime + self._lastTimestamp;
                    if (time > 0) {
                        var timeStr = self.dateFormat(time/1000);
                        self.onSustainCountDown(time/1000, timeStr);
                    } else {
                        self._isSustainFinish = true;
                        self.onSustainDone();
                    }
                }
            }
        }, 1);
    },

    // update (dt) {},

    dateFormat (second) {
        var dd, hh, mm, ss;
        second = typeof second === 'string' ? parseInt(second) : second;
        if (!second || second < 0) {
            return;
        }
        var result = "";
        //天
        dd = second / (24 * 3600) | 0;
        if (dd > 0) {
            second = Math.round(second) - dd * 3600;
            result += dd + "D";
        }
        //小时
        hh = second / 3600 | 0;
        if (hh > 0) {
            second = Math.round(second) - hh * 3600;
            result += hh + "H";
        }
        //分
        mm = second / 60 | 0;
        if (mm > 0) {
            second = Math.round(second) - mm * 60;
            result += mm + "M";
        }
        //秒
        ss = Math.round(second) - mm * 60;
        result += ss + "S";
        return result;
    },

    releaseSkill () { // 释放技能
        const self = this;
        console.log("self._isBuy = " + self._isBuy);
        
        if (!self._isBuy) return;
        self._lastTimestamp = Date.parse(new Date());
        console.log("self._lastTimestamp = " + self._lastTimestamp);
        
        self._isActive = false;
        if (self.bSustain) {
            self._isSustainFinish = false;
        }
        self.appply();
        self.onCoolingCountDown(self.coolingTime, self.dateFormat(self.coolingTime));
        if (self.bSustain) {
            self.onSustainCountDown(self.sustainTime, self.dateFormat(self.sustainTime));
        }
        
    },

    onItemClick () {},

    onCoolingCountDown (time, timeStr) {}, // 冷却倒计时，参数是剩余时间
    onCoolingDone() {}, // 冷却完成
    onSustainCountDown(time, timeStr) {}, // 持续时间倒计时
    onSustainDone () {}, // 技能持续结束
    appply() {}, // 应用技能
});
