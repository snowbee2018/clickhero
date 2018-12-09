

cc.Class({
    extends: cc.Component,

    properties: {
        sv : cc.ScrollView,
        itemPrefab: cc.Prefab,
        dialogPrefab : cc.Prefab,
    },

    start () {
        this.fullViews();
    },

    fullViews(){
        let list = GoodsDatas.datas;
        console.log(list);
        
        list.forEach(e => {
            this.addItem(e);
        });
    },

    addItem(goods) {
        var node = cc.instantiate(this.itemPrefab);
        node.parent = this.sv.content;
        node.getComponent("GoodsItem").bind(goods);
    },
});