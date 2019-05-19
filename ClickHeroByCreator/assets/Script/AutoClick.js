// 自动点击有两种，一种是主动技能猴子猴孙，一种是仙桃购买的自动点击

cc.Class({
    extends: cc.Component,

    properties: {
        btnNode: cc.Node,
        btnLabel: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // update (dt) {},

    onBuyGoods (event) {
        const self = this;
        if (event == 4) { // 购买了自动点击
            self.showAutoBtn(true);
        }
    },

    applyAutoClick () {
        const self = this;
        if (GameData.gdAutoClick && GameData.gdAutoClick > 0) {
            for (let i = 0; i < GameData.gdAutoClick; i++) {
                self.getComponent("GameController").clickHit(true);
            }
        }
    },

    applyClickStorm () {
        const self = this;
        // console.log("applyClickStorm");
        self.getComponent("GameController").clickHit(true);
    },

    onAutoClickBtnClick () {
        const self = this;
        if (self.bAutoClickOpen) { // 当前是开启的状态
            self.destroyAutoClick();
        } else {
            self.createAutoClick();
        }
        self.showAutoBtn(true);
    },

    showAutoBtn (bShow) {
        const self = this;
        bShow = !!bShow;
        self.btnNode.active = bShow;
        if (bShow) {
            self.btnLabel.string = "×" + GameData.gdAutoClick + (!!self.bAutoClickOpen ? "开启" : "关闭");
        }
    },

    init () {
        const self = this;
        // 读取配置，是否购买自动点击，以及点击的频率
        self.bAutoClickOpen = DataCenter.getCloudDataByKey(DataCenter.KeyMap.bAutoClickOpen) == true;
        if (self.bAutoClickOpen) {
            self.createAutoClick();
        }
        self.showAutoBtn(GameData.gdAutoClick > 0);
        Events.on(Events.ON_BUY_GOODS, self.onBuyGoods, self);
    },

    createAutoClick() {
        const self = this;
        self.unschedule(self.applyAutoClick);
        self.schedule(self.applyAutoClick, 0.1);
        self.bAutoClickOpen = true;
    },

    destroyAutoClick () {
        const self = this;
        self.unschedule(self.applyAutoClick);
        self.bAutoClickOpen = false;
    },

    createClickStorm(clickCount) {
        const self = this;
        self.unschedule(self.applyClickStorm);
        var time;
        time = 1 / clickCount;
        self.schedule(self.applyClickStorm, time);
    },

    destroyClickStorm () {
        const self = this;
        self.unschedule(self.applyClickStorm);
    },
});
