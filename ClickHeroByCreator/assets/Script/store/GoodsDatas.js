// 管理商店物品的数据源
var Goods = require("Goods");

var Datas = {}

Datas.init = function() {
    var cloudInfo = DataCenter.getCloudDataByKey(DataCenter.KeyMap.goodsList);
    // 购买次数，永久效果的商品需要记录并持久化
    Datas.buyCounts = cloudInfo || []
    Datas.datas = [
        new Goods().init(0),
        new Goods().init(1),
        new Goods().init(2),
        new Goods().init(3),
        new Goods().init(4),
        new Goods().init(5),
        new Goods().init(6),
        new Goods().init(7),
        new Goods().init(8),
        new Goods().init(9),
    ]
}

Datas.addBuyCount = function(id) {
    var goods
    Datas.myGoods.forEach(e => {
        if (i.id == id) {
            goods = e
            break
        }
    })
    if (!goods) {
        goods = {id : id,count : 0}
        Datas.myGoods.push(goods)
    }
    goods.count ++
}

Datas.getBuyCount = function(id){
    Datas.myGoods.forEach(e => {
        if (i.id == id) {
            return e.count
        }
    })
    return 0
}

module.exports = Datas