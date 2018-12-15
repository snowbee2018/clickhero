

cc.Class({
    extends: cc.Component,

    properties: {
        sv : cc.ScrollView,
        itemPrefab: cc.Prefab,
        dialogPrefab : cc.Prefab,
        lbRuby : cc.Label,
    },

    onLoad(){
        Events.on(Events.ON_GAME_START,this.onStart,this);
    },

    onStart () {
        Events.on(Events.ON_RUBY_CHANGE,this.showRuby,this);
        this.fullViews();
        this.showRuby();
    },

    showRuby(){
        var ruby = DataCenter.getDataByKey(DataCenter.KeyMap.ruby)
        this.lbRuby.string = "蟠桃："+ruby
    },

    fullViews(){
        try {
            let list = GoodsDatas.datas;
            console.log(list);

            list.forEach(e => {
                this.addItem(e);
            });
        } catch (error) {
            console.error(error);
            
        }

    },

    addItem(goods) {
        var node = cc.instantiate(this.itemPrefab);
        node.parent = this.sv.content;
        node.getComponent("GoodsItem").bind(goods);
    },
});