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
        boxNode : [cc.Node],
        sprArr : [cc.Sprite],
        itemArr : [cc.SpriteFrame],// 
        noBoxNode : cc.Node,
    },



    start () {
        this._boxData = DataCenter.getDataByKey(DataCenter.KeyMap.tree).boxList
        console.log(this._boxData)
        this._index = 0
        this.setView()
    },

    setNoBox(){
        this.noBoxNode.active = true
        for (let index = 0; index < 3; index++) {
            this.boxNode[index].active = false
    }
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
        var str1 = ["点击宝箱，花费100桃子","击宝箱，花费1000桃子","击宝箱，花费10000桃子"]
        this.pirceLab.string = str1[data.boxType]
        for (let index = 0; index < 3; index++) {
                this.boxNode[index].active = index == data.boxType
        }
    },

    clickNext(){
        if(this._boxData.length == 0){
            this.setNoBox()
            return
        }
        this._isopen = false
        this.stopAllAction()
        this._index = this._index >= this._boxData.length - 1 ? 0 : this._index + 1 
        console.log("this._index"+ this._index)   
        console.log(this._boxData)     
        this.setView()
    },
    clickPre(){
        if(this._boxData.length == 0){
            this.setNoBox()
            return
        }
        this._isopen = false
        this.stopAllAction()
        this._index = this._index <= 0 ? this._boxData.length - 1 : this._index- 1  
        console.log("this._index"+ this._index)      
        console.log(this._boxData) 
        this.setView()
    },
    stopAllAction(){
        for (let index = 0; index < 3; index++) {
            // this.boxNode[index].stopAllAction()
            var anim = this.boxNode[index].getComponent(cc.Animation);
            var name = "openBox" + (index + 1)
            anim.resume(name);
            anim.setCurrentTime(0, name);
        }   
    },
    clickBox()
    {
        if(this._isopen) return
        var data = this._boxData[this._index]
        const count = [100,1000,10000]
        var isCanUpgrade = DataCenter.isRubyEnough(count[data.boxType]);
        if (!isCanUpgrade) {
            PublicFunc.toast("仙桃不足")
            return
        }
        let b = this.consume(data)
        if (b) {
            this._isopen = true
            // console.log("打开宝箱获得装备")
            // PublicFunc.popGoldDialog(3,"狂战斧","获得装备",true)
            // this.sprArr[data.boxType].SpriteFrame = this.itemArr[0]
            var anim = this.boxNode[data.boxType].getComponent(cc.Animation);
            var name = "openBox" + (data.boxType + 1)
            anim.play(name);
            
        }
    },


});
