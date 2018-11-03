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
        baseValue: 1, // 加成数值
        coolingTime: 0, // 冷却时间，秒
        bSustain: false, // 是否是持续技能
        sustainTime: 0, // 持续时间
        cost: "",
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

    // start () {},

    // update (dt) {},

    isCanUse () {
        const self = this;
        // console.log("self._isBuy = " + self._isBuy);
        // console.log("self._isActive = " + self._isActive);
        // console.log("self.bSustain = " + self.bSustain);
        // console.log("self._isSustainFinish = " + self._isSustainFinish);
        var result = self._isBuy && self._isActive && ((self.bSustain && self._isSustainFinish) || !self.bSustain);
        result = result && DataCenter.isGoldEnough(new BigNumber(self.cost));
        return result;
    },

    getSkillDesStr () {
        return "";
    },

    setSkillDes () {
        const self = this;
        self.describeLab.string = self.getSkillDesStr();
    },

    initUserSkill () {
        const self = this;
        // 初始化UI
        self.skillNameLab.string = self.skillName;
        self.setSkillDes();
        self.timeLab.string = "";

        // 读取本地存档初始化
        self._isBuy = true; // 是否已经购买
        self._lastTimestamp = 0; // 上次使用技能的时间

        // 计算技能当前的状态
        var nowTime = Date.parse(new Date());
        var timeCooling = 1000 * self.coolingTime - nowTime + self._lastTimestamp;
        if (timeCooling > 0) { // 技能还在冷却过程中
            self._isActive = false;
            var timeStr = self.dateFormat(timeCooling / 1000);
            self.onCoolingCountDown(timeCooling / 1000, timeStr);
        } else { // 技能已经冷却
            self._isActive = true;
        }
        if (self.bSustain) {
            var timeSustain = 1000 * self.sustainTime - nowTime + self._lastTimestamp;
            if (timeSustain > 0) { // 技能还在持续过程中
                self._isSustainFinish = false;
                self.appply();
                var timeStr = self.dateFormat(timeSustain / 1000);
                self.onSustainCountDown(timeSustain / 1000, timeStr);
            } else {
                self._isSustainFinish = true;
            }
        } else {
            self._isSustainFinish = true;
        }
        self.gray.active = !self.isCanUse();

        self.schedule(function () {
            if (!self._isBuy) return;
            if (self._isActive) {

            } else {
                var nowTime = Date.parse(new Date());
                var timeCooling = 1000 * self.coolingTime - nowTime + self._lastTimestamp;
                if (timeCooling > 0) {
                    var timeStr = self.dateFormat(timeCooling / 1000);
                    self.onCoolingCountDown(timeCooling / 1000, timeStr);
                } else {
                    self._isActive = true;
                    self.onCoolingDone();
                }
                self.gray.active = !self.isCanUse();
            }

            if (self.bSustain) {
                if (self._isSustainFinish) {

                } else {
                    var nowTime = Date.parse(new Date());
                    var timeSustain = 1000 * self.sustainTime - nowTime + self._lastTimestamp;
                    if (timeSustain > 0) {
                        var timeStr = self.dateFormat(timeSustain / 1000);
                        self.onSustainCountDown(timeSustain / 1000, timeStr);
                    } else {
                        self._isSustainFinish = true;
                        self.onSustainDone();
                    }
                    self.gray.active = !self.isCanUse();
                }
            }
            
        }, 0.1);
        Events.on(Events.ON_GOLD_CHANGE, self.onGoldChange, self);
        Events.on(Events.ON_USER_SKILL_UNLOCK, self.onSkillUnlock, self);
    },

    onGoldChange () {
        const self = this;
        self.gray.active = !self.isCanUse();
    },

    onSkillUnlock(skillInfo) {
        const self = this;
        if (skillInfo.heroID == self.heroID) {
            if (skillInfo.skillID == self.skillID) {
                self._isBuy = true;
                self.gray.active = !self.isCanUse();
            }
        }
    },

    dateFormat (second) {
        const self = this;
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
            result += dd + "天";
        }
        //小时
        hh = second / 3600 | 0;
        if (hh > 0) {
            second = Math.round(second) - hh * 3600;
            result += hh + "小时";
        }
        //分
        mm = second / 60 | 0;
        if (mm > 0) {
            second = Math.round(second) - mm * 60;
            result += mm + "分钟";
        }
        //秒
        ss = Math.round(second);
        if (ss > 0) {
            // ss = Math.round(second) - mm * 60;
            result += ss + "秒";
        }
        
        return result;
    },

    releaseSkill () { // 释放技能
        const self = this;
        if (!self.isCanUse()) return;
        self._lastTimestamp = Date.parse(new Date());
        // console.log("self._lastTimestamp = " + self._lastTimestamp);
        
        self._isActive = false;
        if (self.bSustain) {
            self._isSustainFinish = false;
        }
        self.appply();
        self.onCoolingCountDown(self.coolingTime, self.dateFormat(self.coolingTime));
        if (self.bSustain) {
            self.onSustainCountDown(self.sustainTime, self.dateFormat(self.sustainTime));
        }
        DataCenter.consumeGold(new BigNumber(self.cost));
    },

    onCoolingCountDown(time, timeStr) {
        const self = this;
        // console.log("onCoolingCountDown, timeStr = " + timeStr);
        self.timeLab.string = timeStr;
    }, // 冷却倒计时，参数是剩余时间

    onSustainCountDown(time, timeStr) {
        // pass
    }, // 持续时间倒计时

    onItemClick() {
        const self = this;
        self.releaseSkill();
    },

    onCoolingDone() {
        const self = this;
        self.timeLab.string = "";
    }, // 冷却完成

    onSustainDone () {
        const self = this;
        self.backout();
    }, // 技能持续结束

    appply() { }, // 应用技能
    backout() { }, // 撤销技能效果
});
