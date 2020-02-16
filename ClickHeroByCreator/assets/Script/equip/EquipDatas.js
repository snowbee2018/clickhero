// 管理装备的数据源

var Datas = {}

Datas.isZone2 = function(){
    return DataCenter.getUserZone() === 2
}

Datas.init = function() {
    // 图鉴
    Datas.equips = [
        [],[],[],[]
    ]
    // 普通品质
    let arr = Datas.equips[0]
    arr.push({id:0,type:0,name:'name0',level:1,
        efSkill : [{id:0,v:2},], // 技能效果加成 id表示第几个技能，v为效果 每个技能有不同
        efAncient : [{id:0,v:1},], // 古神lv加成 id 对应古神id v为加成的lv
        efGoods : [{id:0,v:1},], // 商店lv加成 id 对应GoodsId v为加成lv
    })
    // 读取玩家的装备数据
    var cloudInfo = DataCenter.getCloudDataByKey(DataCenter.KeyMap.myEquips);
    Datas.myEquips = cloudInfo || {wear:[],bag:[]}
    Datas.refresh()
}

Datas.refresh = function(){
    Datas.buyCounts.forEach(e => {
    });
    const childDatas = DataCenter.readChildUserData() || []
    console.log("childDatas.length"+childDatas.length);
    GameData.gdShareDPSTimes = childDatas.length * 0.3 + 1
    Datas.refreshAS()
}

Datas.addEquip = function(id) {
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