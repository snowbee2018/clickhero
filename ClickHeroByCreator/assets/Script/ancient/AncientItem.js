
cc.Class({
    extends: cc.Component,

    properties: {
        lbName : cc.Label,
        lbDesc : cc.Label,
        lbStatus : cc.Label,
        sp : cc.Sprite,
        lbLv : cc.Label,
        lbAddlv : cc.Label,
        lbSoul : cc.Label,
        btn : cc.Button,
        imgs : cc.SpriteAtlas,
        prefabInputLv : cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        Events.on(Events.ON_SOUL_CHANGE,this.onSoulChange,this);
        Events.on(Events.ON_ANCIENT_LVUNIT_CHANGE, this.bind, this);
        Events.on(Events.ON_BUY_GOODS, this.onBuyGoods, this);
        Events.on(Events.ON_EQUIP_UPDATE, this.onEquip, this);
    },

    onBuyGoods(event){
        if (event == 11 && this.data.id == 2) { // 购买了自动点击
            this.bind()
        }else if (event == 12 && this.data.id == 7){
            this.bind()
        }else if (event == 13 && this.data.id == 19){
            this.bind()
        }else if (event == 8){
            this.bind()
        }else if (event == 7 && (this.data.id == 24||this.data.id == 17)){
            this.bind()
        }else if((event == 4 || event == 7) && this.data.id == 21){
            this.data.refresh()
            this.bind()
        }else if (event == 17 && this.data.id == 20){
            this.bind()
        }else if (event == 18 && this.data.id == 16){
            this.bind()
        }else if (event == 19 && this.data.id == 5){
            this.bind()
        }
    },
    onEquip(){
        const v = GameData.eqAncient[this.data.id] || 0
        if (this.eqValue != v) {
            this.eqValue = v
            this.data.refresh()
            this.bind();
        }
    },

    onDestroy(){
        Events.off(Events.ON_SOUL_CHANGE,this.onSoulChange,this);
        Events.off(Events.ON_ANCIENT_LVUNIT_CHANGE, this.bind, this);
        Events.off(Events.ON_BUY_GOODS, this.onBuyGoods, this);
        Events.off(Events.ON_EQUIP_UPDATE, this.onEquip, this);
    },

    onSoulChange(){
        if (GameData.ancientLvUnit > 0) {
            let result = DataCenter.isSoulEnough(this.data.getSoul());
            this.btn.interactable = result;
        }
    },

    bind(data){
        console.log("bind ancient");
        data = data?data:this.data;
        console.log(data);
        this.data = data;
        this.sp.spriteFrame = this.imgs.getSpriteFrame("ancient_" + data.id)
        this.lbName.string = data.name;
        this.lbLv.string = "等级"+PublicFunc.numToStr(data.level)
        const addlv = data.getAddLevel() 
        this.lbAddlv.string = addlv ? '(+'+addlv+')' : ''
        this.lbSoul.string = GameData.ancientLvUnit?""+Formulas.formatBigNumber(data.getSoul()):"手动输入"
        // 这个要根据不同的 id和等级 写描述
        this.lbDesc.string = data.getDesc();
        this.onSoulChange();
        let statusStr = ""
        if (data.id == 2) {
            statusStr = "实际妖王概率：" + (GameData.getPrimalBossOdds()*100).toFixed(4) + "%"
        } else if (data.id == 9){
            statusStr = "实际葫芦概率：" + (GameData.getTreasureOdds()*100).toFixed(4) + "%"
        } else if (data.id == 5){
            statusStr = "游戏每500关Boss会+4%生命值"
        } else if (data.id == 16){
            statusStr = "游戏每500关会增加0.1个小怪"
        } else if (data.id == 7){
            statusStr = "游戏每500关会-2秒Boss计时器时长"
        }
        this.lbStatus.string = statusStr
    },

    onUpgradeClick(){
        const self = this
        // 这里要判断下 unit 是不是-1 是的话 就是手动输入了
        if (GameData.ancientLvUnit > 0) {
            let result = this.data.upgrade();
            if (result) {
                this.bind();
            }
        } else {
            let node = cc.instantiate(this.prefabInputLv)
            var InputLvDialog = node.getComponent("InputLvDialog")
            var curScene = cc.director.getScene();
            node.parent = curScene;
            node.x = cc.winSize.width/2;
            node.y = cc.winSize.height/2;
            InputLvDialog.setCallback(function(num) {
                let result = self.data.upgrade(num);
                if (result) {
                    self.bind();
                }
                return result
            })
        }
        AudioMgr.playBtn();
    },
});
