cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!',
        openDataNode : cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        const self = this;
        self.label.string = this.text;
        self.openDataNode.active = false;
    },

    // called every frame
    update: function (dt) {

    },

    onTestBtnClick () {
        const self = this;
        // GameGlobal.WeChatUtil.authorize(GameGlobal.WeChatUtil.scope.userLocation, function (result) {
        //     console.log("FFFFFFF, result = " + result);
            
        // });

        // GameGlobal.WeChatUtil.getUserInfo(function (bSuccess, userData) {
        //     console.log("bSuccess = " + bSuccess);
            
        //     console.log(userData);
            
        // });

        self.openDataNode.active = true;
    },
});
