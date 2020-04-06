// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        pirceLab : cc.Label,
        boxDes : cc.Label,
        spBox : cc.Sprite,
        // boxNode : [cc.Node],
        // sprArr : [cc.Sprite],
        sfs : [cc.SpriteFrame],
        noBoxNode : cc.Node,
        pfEquip : cc.Prefab,
    },



    start () {
        this._boxData = DataCenter.getDataByKey(DataCenter.KeyMap.tree).boxList
        console.log(this._boxData)
        this._index = 0
        this.setView()
    },

    setNoBox(){
        this.noBoxNode.active = true
        this.spBox.node.active = false
    },

    onBtnClose() {
        this.node.destroy()
    },

    consume(data){
        console.log(data)
        // console.log(this._boxData)
        for (let i = 0; i < this._boxData.length; i++) {
            if (data == this._boxData[i]) {
                this._boxData.splice(i,1)
                return true
            }
        }
        return false
    },

    setView()
    {
        if(this._boxData.length == 0){
            this.setNoBox()
            return
        }
        var data = this._boxData[this._index]
        var str = ["打开铜箱子，必定获得普通及以上品质的装备","打开银箱子，必定获得稀有及以上品质的装备","打开金箱子，必定获得史诗及以上品质的装备"]
        this.boxDes.string = str[data.boxType]
        this.pirceLab.string = "点击宝箱，花费"+EquipDatas.buyRubys[data.boxType]+"桃子"
        this.spBox.node.active = true
        this.spBox.spriteFrame = this.sfs[data.boxType]
    },

    clickNext(){
        if (this.ndEquip) {
            this.ndEquip.destroy()
            this.ndEquip = null
        }
        if(this._boxData.length == 0){
            this.setNoBox()
            return
        }
        this._isopen = false
        // this.stopAllAction()
        this._index = this._index >= this._boxData.length - 1 ? 0 : this._index + 1 
        console.log("this._index"+ this._index)   
        console.log(this._boxData)     
        this.setView()
    },
    clickPre(){
        if (this.ndEquip) {
            this.ndEquip.destroy()
            this.ndEquip = null
        }
        if(this._boxData.length == 0){
            this.setNoBox()
            return
        }
        this._isopen = false
        // this.stopAllAction()
        this._index = this._index <= 0 ? this._boxData.length - 1 : this._index- 1  
        console.log("this._index"+ this._index)      
        console.log(this._boxData) 
        this.setView()
    },
    // stopAllAction(){
    //     for (let index = 0; index < 3; index++) {
    //         // this.boxNode[index].stopAllAction()
    //         var anim = this.boxNode[index].getComponent(cc.Animation);
    //         var name = "openBox" + (index + 1)
    //         anim.resume(name);
    //         anim.setCurrentTime(0, name);
    //     }   
    // },
    clickBox() {
        if(this._isopen) return
        var data = this._boxData[this._index]
        const ruby = EquipDatas.buyRubys[data.boxType]
        PublicFunc.popDialog({
            contentStr: "你确定要花费"+ruby+"仙桃开启装备箱吗？",
            btnStrs: {
                left: '是 的',
                right: '不，谢谢'
            },
            onTap: function (dialog, bSure) {
                var b = DataCenter.isRubyEnough(ruby);
                if (!b) {
                    PublicFunc.toast("仙桃不足")
                    return
                }
                DataCenter.consumeRuby(ruby)
                b = this.consume(data)
                if (b) {
                    this._isopen = true
                    this.spBox.node.active = false
                    const e = EquipDatas.roll(data.boxType)
                    const eq = cc.instantiate(this.pfEquip).getComponent('Equip')
                    eq.node.parent = this.node
                    eq.node.scale = 2
                    eq.setData(e)
                    this.ndEquip = eq.node
                }
            }.bind(this)
        });

    },
    toEquipDialog(){
        PublicFunc.showEquipDialog()
    },

});
