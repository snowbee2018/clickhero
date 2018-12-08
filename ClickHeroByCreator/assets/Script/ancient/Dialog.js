

cc.Class({
    extends: cc.Component,

    properties: {
        desc : cc.Label,
        lbConfirm : cc.Label,
        lbCancel : cc.Label,
    },

    setDesc(str){
        this.desc.string = str;
    },

    setBtnText(txt0,txt1){
        if (txt0) {
            this.lbConfirm.string = txt0
        }
        if (txt1) {
            this.lbCancel.string = txt1
        }
    },

    setCallback(callback){
        this.callback = callback;
    },

    confirm(){
        if (this.callback) {
            this.callback(true);
        }
        this.node.destroy();
    },

    cancel(){
        if (this.callback) {
            this.callback(false);
        }
        this.node.destroy();
    },
})