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
    extends: require("UserSkillBase"),

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const self = this;
        self._isBuy = true; // 是否已经购买
        // self._lastTimestamp = 0, // 上次使用技能的时间
        self._isActive = true; // 是否已经冷却完成
        self.gray.active = !self._isActive;
        self._isSustainFinish = true; // 技能持续是否结束
    },

    start () {
        const self = this;
        self._super()
    },

    // update (dt) {},

    onItemClick() {
        const self = this;
        console.log("onItemClick");
        self.releaseSkill();
    },

    onCoolingCountDown(sec, timeStr) {
        const self = this;
        console.log("onCoolingCountDown, timeStr = " + timeStr);
        self.timeLab.string = timeStr;
    }, // 冷却倒计时，参数是剩余时间

    onCoolingDone() {
        const self = this;
        console.log("onCoolingDone");
        self.timeLab.string = "";
        self.gray.active = !self._isActive;
    }, // 冷却完成

    onSustainCountDown(sec, timeStr) {
        const self = this;
        console.log("onSustainCountDown, timeStr = " + timeStr);
        
    }, // 持续时间倒计时

    onSustainDone() {
        const self = this;
        console.log("onSustainDone");
    }, // 技能持续结束

    appply() {
        const self = this;
        console.log("appply");
        self.gray.active = !self._isActive;
    }, // 应用技能
});
