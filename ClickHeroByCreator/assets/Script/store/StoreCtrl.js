

cc.Class({
    extends: cc.Component,

    properties: {
        sv : cc.ScrollView,
        itemPrefab: cc.Prefab,
        dialogPrefab : cc.Prefab,
        lbRuby : cc.Label,
    },

    onLoad(){
        console.log("StoreCtrl:ctor");
        this.items = new Array();
        Events.on(Events.ON_GAME_START,this.onStart,this);
        Events.on(Events.ON_RUBY_CHANGE,this.showRuby,this);
        this.fullViews();
        this.showRuby();
        this.onMaxPassLavelChange()
    },

    onStart () {
        // console.log("StoreCtrl:onStart");
        Events.on(Events.ON_MAXLEVEL_UPDATE, this.onMaxPassLavelChange, this)
    },

    onDestroy (){
        Events.off(Events.ON_MAXLEVEL_UPDATE, this.onMaxPassLavelChange, this)
    },

    showRuby(){
        var ruby = DataCenter.getDataByKey(DataCenter.KeyMap.ruby)
        this.lbRuby.string = ""+ruby
    },

    fullViews(){
        try {
            let list = GoodsDatas.datas;
            // console.log(list);

            list.forEach(e => {
                this.addItem(e);
            });
        } catch (error) {
            console.error(error);
            
        }

    },

    onMaxPassLavelChange(){
        let lv = DataCenter.getDataByKey(DataCenter.KeyMap.maxPassLavel) || 0
        lv = lv + 50
        this.items.forEach(node => {
            let data = node.getComponent("GoodsItem").data
            let active = Boolean(data.unlockLv <= lv)
            if (node.active != active){
                node.active = active
            }
        });
    },

    addItem(goods) {
        var node = cc.instantiate(this.itemPrefab);
        node.parent = this.sv.content;
        node.getComponent("GoodsItem").bind(goods);
        this.items.push(node)
    },
});