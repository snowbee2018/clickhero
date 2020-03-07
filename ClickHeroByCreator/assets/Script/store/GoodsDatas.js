// 管理商店物品的数据源
var Goods = require("Goods");
var ASGoods = require("ASGoods");

var Datas = {}

Datas.isZone2 = function(){
    return DataCenter.getUserZone() === 2
}

Datas.init = function(reset) {
    if (!reset) {
        var cloudInfo = DataCenter.getCloudDataByKey(DataCenter.KeyMap.goodsList);
        // 购买次数，永久效果的商品需要记录并持久化
        Datas.buyCounts = cloudInfo || []
        cloudInfo = DataCenter.getCloudDataByKey(DataCenter.KeyMap.ASCounts);
        Datas.ASCounts = cloudInfo || []
    }
    if (Datas.isZone2()) {
        Datas.datas = [
            new Goods().init(16),
            new Goods().init(0),
            new Goods().init(14),
            new Goods().init(1),
            new Goods().init(6),
            new Goods().init(2), // 特殊
            new Goods().init(3), // 特殊
            new Goods().init(4),
            new Goods().init(5),
            new Goods().init(100), // 特殊
        ]
        Datas.ASDatas = [
            new ASGoods().init(9),
            new ASGoods().init(7),
            new ASGoods().init(15),
            new ASGoods().init(8),
            new ASGoods().init(11),
            new ASGoods().init(12),
            new ASGoods().init(13),
            new ASGoods().init(18),
            new ASGoods().init(19),
        ]
    } else {
        Datas.datas = [
            new Goods().init(16),
            new Goods().init(0),
            new Goods().init(14),
            new Goods().init(1),
            new Goods().init(6),
            new Goods().init(2),
            new Goods().init(3),
            new Goods().init(4),
            new Goods().init(5),
            new Goods().init(9),
            new Goods().init(10),
            new Goods().init(7),
            new Goods().init(8),
            new Goods().init(15),
            new Goods().init(11),
            new Goods().init(12),
            new Goods().init(13),
            new Goods().init(17),
            new Goods().init(18),
            new Goods().init(19),
        ];
    }
    Datas.refresh()
}

Datas.refresh = function(){
    Datas.buyCounts.forEach(e => {
        let add = GameData.eqGoods[e.id] || 0
        add = e.count ? add : 0 // 0个 不给加
        var count = e.count + add
        if (e.id == 1) {
            GameData.gdDayDPSTimes = Math.pow(1.2,count)
        } else if (e.id == 14) {
            GameData.gdDayGoldTimes = Math.pow(1.2,count)
        } else if (e.id == 2) { // 特殊
            GameData.gdDoubleGold = PublicFunc.get10TimesByCount(count,1.07)/10+1
        } else if (e.id == 3) { // 特殊
            GameData.gdDoubleDPS = PublicFunc.get10TimesByCount(count,1.07)/10+1
        } else if (e.id == 4) {
            GameData.gdAutoClick = count
        } else if (e.id == 7) {
            GameData.gdLeaveTimes = 1 + PublicFunc.get10TimesByCount(count)/20
        } else if (e.id == 8) {
            GameData.gdAncientSale = Math.pow(0.95,count)
        } else if (e.id == 9) {
            GameData.gdDPSTimes = 1 + PublicFunc.get10TimesByCount(count)/10
        } else if (e.id == 10) {
            GameData.gdGoldTimes = 1 + PublicFunc.get10TimesByCount(count)
        } else if (e.id == 15) {
            GameData.gdSoulTimes = 1 + PublicFunc.get10TimesByCount(count)
        } else if (e.id == 11) {
            GameData.gdPBossTimes = count*0.25 + 1
        } else if (e.id == 12) {
            GameData.gdPBossTSTimes = count*0.75 + 1
        } else if (e.id == 13) {
            GameData.gdTreasureTimes = PublicFunc.get10TimesByCount(count,1.15)/10 + 1
        } else if (e.id == 17) {
            GameData.gdSoulDPSTimes = count*0.25 + 1
        } else if (e.id == 18) {
            GameData.gdMinusMonsterNumTimes = count*0.125 + 1
        } else if (e.id == 19) {
            GameData.gdMinusBoosLifeTimes = count*0.5 + 1
        } else if (e.id == 100) { // 特殊
            // +100% 仙丹
            GameData.ngdSoulTimes = PublicFunc.get10TimesByCount(count,1.07)/10 + 1
        }
    });
    const childDatas = DataCenter.readChildUserData() || []
    console.log("childDatas.length"+childDatas.length);
    GameData.gdShareDPSTimes = childDatas.length * 0.3 + 1
    Datas.refreshAS()
}

Datas.refreshAS = function() {
    if (Datas.isZone2()) {
        Datas.ASCounts.forEach(e => {
            var count = e.count
            if (e.id == 7) {
                GameData.gdLeaveTimes = Math.pow(1.5,count)
            } else if (e.id == 8) {
                GameData.gdAncientSale = Math.pow(0.95,count)
            } else if (e.id == 9) {
                GameData.gdDPSTimes = 1 + count
            } else if (e.id == 15) {
                GameData.gdSoulTimes = 1 + Math.pow(count,2) * 10
            } else if (e.id == 11) {
                GameData.gdPBossTimes = count*0.25 + 1
            } else if (e.id == 12) {
                GameData.gdPBossTSTimes = count*0.75 + 1
            } else if (e.id == 13) {
                GameData.gdTreasureTimes = 1 + count
            } else if (e.id == 18) {
                GameData.gdMinusMonsterNumTimes = count*0.125 + 1
            } else if (e.id == 19) {
                GameData.gdMinusBoosLifeTimes = count*0.5 + 1
            }
        });
    }
}

Datas.addBuyCount = function(id) {
    var bc
    Datas.buyCounts.forEach(e => {
        if (e.id == id) {
            bc = e
        }
    })
    if (!bc) {
        bc = {id : id,count : 0}
        Datas.buyCounts.push(bc)
    }
    bc.count ++
    bc.lastBuyDate = Datas.getTodayStr()
    Datas.refresh()
}

Datas.getBuyCount = function(id){
    var count = 0
    Datas.buyCounts.forEach(e => {
        if (e.id == id) {
            count = e.count
        }
    })
    return count
}
Datas.addASCount = function(id) {
    var bc
    Datas.ASCounts.forEach(e => {
        if (e.id == id) {
            bc = e
        }
    })
    if (!bc) {
        bc = {id : id,count : 0}
        Datas.ASCounts.push(bc)
    }
    bc.count ++
    bc.lastBuyDate = Datas.getTodayStr()
    Datas.refresh()
}

Datas.getASCount = function(id){
    var count = 0
    Datas.ASCounts.forEach(e => {
        if (e.id == id) {
            count = e.count
        }
    })
    return count
}
Datas.todayHasBuy = function(id){
    console.log("todayHasBuy"+id);
    let result = false
    Datas.buyCounts.forEach(e => {
        if (e.id == id) {
            console.log(e);
            console.log(String(e.lastBuyDate) +" " + Datas.getTodayStr());
            result = Datas.getTodayStr() == String(e.lastBuyDate)
        }
    })
    console.log("result:"+result);
    return result
}
Datas.getTodayStr = function(){
    let date = new Date()
    let str = date.getFullYear() +"-"+ date.getMonth() +"-"+ date.getDate()
    return str
}

Datas.getTotalRuby = function(){
    let ruby = 0
    Datas.datas.forEach(e => {
        ruby +=e.getTotalRuby()
    })
    return ruby
}

Datas.resetAS = function() {
    Datas.ASCounts.forEach(e => {
        e.lastBuyDate = ""
        e.count = 0
    })
    Datas.init(true)
}

Datas.resetGame = function() {
    let ruby = 0
    Datas.datas.forEach(e => {
        ruby +=e.getTotalRuby()
    });
    Datas.buyCounts.forEach(e => {
        e.lastBuyDate = ""
        e.count = 0
    })
    Datas.ASCounts.forEach(e => {
        e.lastBuyDate = ""
        e.count = 0
    })
    Datas.init(true)
    // Datas.refresh()
    return ruby
}

module.exports = Datas