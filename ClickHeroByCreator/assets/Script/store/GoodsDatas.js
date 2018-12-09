// 管理商店物品的数据源
var Goods = require("Goods");

var Datas = {}

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



module.exports = Datas