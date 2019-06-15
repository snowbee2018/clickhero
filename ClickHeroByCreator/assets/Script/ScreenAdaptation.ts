// 屏幕适配组件

const {ccclass, property} = cc._decorator;

@ccclass
export default class ScreenAdapTation extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._adaptation();
    }

    // start () {}

    // update (dt) {}

    // LOGIC

    private _adaptation() {
        let widget = this.getComponent(cc.Widget);
        if (cc.sys.platform === cc.sys.WECHAT_GAME && widget) {
            let _wx = window['wx'] as any;
            let _sysInfo = _wx.getSystemInfoSync();
            
            let _ratio = cc.winSize.height / _sysInfo.screenHeight;
            widget.top = _sysInfo.statusBarHeight * _ratio;
            let _handler: Function = null;

            _handler = (widgetComponent: cc.Widget) => {
                widgetComponent.updateAlignment();
                
                widgetComponent.node.children.forEach(node => {
                    let _wid = node.getComponent(cc.Widget);
                    if (_wid) {
                        _wid.updateAlignment();
                        _handler(_wid);
                    }
                })
            }
            try {
                _handler(widget);
            } catch (error) {
                console.error(error);
            }
        }

    }
}
