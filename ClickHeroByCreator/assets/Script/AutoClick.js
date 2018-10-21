// 自动点击有两种，一种是主动技能点击风暴，一种是红宝石购买的自动点击

cc.Class({
    extends: cc.Component,

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

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    applyAutoClick () {

    },

    applyClickStorm () {
        const self = this;
        // console.log("applyClickStorm");
        self.getComponent("GameController").clickHit();
        
    },

    init () {
        const self = this;
        // 读取配置，是否购买自动点击，以及点击的频率  
        var bAutoClick = false;
        var clickCount = 10; // 每秒点击的次数
        if (bAutoClick) {
            self.createAutoClick(clickCount);
        }
    },

    createAutoClick(clickCount) {
        const self = this;
        self.unschedule(self.applyAutoClick);
        var time = 1/clickCount;
        self.schedule(self.applyAutoClick, time);
    },

    createClickStorm (bDouble) {
        const self = this;
        self.unschedule(self.applyClickStorm);
        var time;
        if (bDouble) {
            time = 1/20;
        } else {
            time = 1/10;
        }
        self.schedule(self.applyClickStorm, time);
    },

    destroyClickStorm () {
        const self = this;
        self.unschedule(self.applyClickStorm);
    },
});
