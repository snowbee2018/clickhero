cc.Class({
    extends: cc.Component,

    properties: {
        bg : cc.Node,
        spEq : cc.Sprite,
        spBox : cc.Sprite,
        sfBox : [cc.SpriteFrame],
    },

    onLoad(){
        this.bSel = false
    },

    setData(data,callback){
        this.data = data
        if (data) {
            this.spEq.node.active = true
            this.setBox(data.type)
            // xiezheli  填充spEq
            cc.loader.loadRes("equip/eq"+data.id, cc.SpriteFrame, function (err, frame) {
                if (!err && frame && cc.isValid(this.node)) {
                    this.spEq.spriteFrame = frame;
                } else {
                    console.error(err);
                }
            }.bind(this));
        } else {
            this.spEq.node.active = false
            this.setBox(0)
        }
        this.setSel(false)
        this.callback = callback
    },
    sel(){
        this.bSel = false
        this.onClick()
    },
    onClick(){
        if (this.data) {
            this.setSel(!this.bSel)
            if (this.callback) {
                this.callback(this.bSel,this)
            }
        }
    },
    setSel(b){
        this.bSel = b
        this.bg.scale = b?1.15:1
    },
    setBox(type){
        console.log("setBox " +type);
        
        this.spBox.spriteFrame = this.sfBox[type]
    },
})