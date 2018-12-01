

cc.Class({
    extends: cc.Component,

    properties: {
        desc : cc.Label,
    },

    setDesc(str){
        this.desc.string = str;
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