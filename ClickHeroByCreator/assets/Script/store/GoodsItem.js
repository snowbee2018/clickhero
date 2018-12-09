
cc.Class({
    extends: cc.Component,

    properties: {
        lbName : cc.Label,
        lbDesc : cc.Label,
        lbDesc2 : cc.Label,
        lbBtn : cc.Label,
    },

    start () {

    },

    bind(goods){
        this.data = goods||this.data
        this.lbName.string = this.data.name
        this.lbDesc.string = this.data.desc
        this.lbDesc2.string = "desc"+this.data.id
        this.lbBtn.string = "ruby:" + this.data.ruby
    },
});
