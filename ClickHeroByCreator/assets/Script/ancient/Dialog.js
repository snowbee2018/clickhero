

cc.Class({
    extends: cc.Component,

    properties: {
        desc : cc.Label,
        btnConfirm: cc.Node,
        lbConfirm : cc.Label,
        btnCancel: cc.Node,
        lbCancel : cc.Label,
        btnOK: cc.Node,
        lbOK: cc.Label,
        toggle: cc.Toggle,
        togLab: cc.Label,
    },

    setDesc(str){
        this.desc.string = str;
    },

    setBtnText(btnStrs) {
        if (btnStrs.left) {
            this.btnConfirm.active = true;
            this.lbConfirm.string = btnStrs.left;
        } else {
            this.btnConfirm.active = false;
        }
        if (btnStrs.mid) {
            this.btnOK.active = true;
            this.lbOK.string = btnStrs.mid;
        } else {
            this.btnOK.active = false;
        }
        if (btnStrs.right) {
            this.btnCancel.active = true;
            this.lbCancel.string = btnStrs.right;
        } else {
            this.btnCancel.active = false;
        }
    },

    setCallback(callback){
        this.callback = callback;
    },

    confirm(){
        AudioMgr.playBtn();
        if (this.callback) {
            this.callback(this, true);
        }
        this.node.destroy();
    },

    cancel(){
        AudioMgr.playBtn();
        if (this.callback) {
            this.callback(this, false);
        }
        this.node.destroy();
    },

    setToggle(bShow, str, checked) {
        this.toggle.node.active = !!bShow;
        this.toggle.isChecked = !!checked;
        this.togLab.node.active = !!bShow;
        this.togLab.string = str;
    },
})