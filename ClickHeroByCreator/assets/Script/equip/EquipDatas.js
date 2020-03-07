// 管理装备的数据源
// 下一步 去掉GameData里的默认值 ，从这里初始化。接着可以弄界面了
var self = {}

self.isZone2 = function(){
    return DataCenter.getUserZone() === 2
}

self.init = function() {
    self.resolveChips = [1,8,64,256]
    // 图鉴
    self.equips = [
        [],[],[],[]
    ]
    // 普通品质
    let arr0 = self.equips[0]
    // 技能id:0,1,2,3,6 猴子猴孙 +10*v,三头六臂 +1x*v,暴击风暴 +1%*x,火眼金睛 +1x*v,如意金箍 +1x*v
    // 古神id:2,3,5,6,7,8,9,10,11,13,15,16,23,25,26 
    // 商品id:1,14,2,3,4,100 苦海，聚宝，金币，伤害，自动点击，仙丹
    arr0.push({id:0,type:0,name:'name0',level:1,
        eqSkill : [{id:0,v:2},{id:1,v:2},], // 技能效果加成 id表示第几个技能，v为效果 每个技能有不同
        eqAncient : [{id:2,v:6},{id:3,v:6},{id:5,v:6,},{id:6,v:6,},{id:7,v:6,},{id:8,v:6,},{id:9,v:6,},{id:10,v:6,},], // 古神lv加成 id 对应古神id v为加成的lv
        eqGoods : [{id:1,v:2},{id:14,v:3},{id:2,v:5},], // 商店lv加成 id 对应GoodsId v为加成lv
    })
    let arr1 = self.equips[1]
    let arr2 = self.equips[2]
    let arr3 = self.equips[3]
    self.alls = arr0.concat(arr1,arr2,arr3)
    // 读取玩家的装备数据
    var cloudInfo = DataCenter.getCloudDataByKey(DataCenter.KeyMap.myEquips);
    self.mys = cloudInfo || {on:[],off:[],chip:0} // on 在身上的 off 不在身上的 chip 碎片
    self.refresh()
}

self.refresh = function(){
    GameData.eqSkill = []
    GameData.eqAncient = []
    GameData.eqGoods = []
    self.mys.on.forEach(e => {
        // skill
        e.eqSkill.forEach(k => {
            GameData.eqSkill[k.id] = k.v + (GameData.eqSkill[k.id]||0)
        });
        // ancient
        e.eqAncient.forEach(k => {
            GameData.eqAncient[k.id] = k.v + (GameData.eqAncient[k.id]||0)
        });
        // goods
        e.eqGoods.forEach(k => {
            GameData.eqGoods[k.id] = k.v + (GameData.eqGoods[k.id]||0)
        });
    });
    console.log(GameData.eqSkill)
    console.log(GameData.eqAncient)
    console.log(GameData.eqGoods)
    Events.emit(Events.ON_EQUIP_UPDATE)
    GameData.refresh(true)
}
// 
self.get = function(id) {
    for (let i = 0; i < self.alls.length; i++) {
        const e = self.alls[i];
        if (e.id == id) {
            return e
        }
    }
}
// 随机增加装备
self.roll = function(type) {
    console.log("xxj roll");
    
    const arr = self.equips[type]
    const i = Math.floor(Math.random()*arr.length)
    let item = arr[i]
    self.mys.off.push(item)
    console.log('self.mys.off');
    console.log(self.mys.off);
    return item
}
// 佩戴装备 index:off中的第几个。 -2不能重复 -1装备满了 0没有这个装备 1成功
self.puton = function(index) {
    if (self.mys.on.length >= 4) {
        return -1
    }
    let item = self.mys.off[index]
    if (!item) {
        return 0
    }
    // for (let i = 0; i < self.mys.on.length; i++) {
    //     const e = self.mys.on[i];
    //     if (e.id == item.id) {
    //         return -2
    //     }
    // }
    self.mys.off.splice(index,1)
    self.mys.on.push(item)
    console.log('self.mys.on');
    console.log(self.mys.on);
    self.refresh()
    return 1
}
// 脱下装备 index:on中的第几个
self.putoff = function(index) {
    let item = self.mys.on[index]
    if (!item) {
        return false
    }
    self.mys.on.splice(index,1)
    self.mys.off.push(item)
    self.refresh()
    return true
}
// 分解成chip ，index:off中的第几个
self.resolve = function(index) {
    let item = self.mys.off[index]
    if (!item) {
        return false
    }
    self.mys.off.splice(index,1)
    const tpye = item.type
    return true
}

self.resetGame = function() {
    let ruby = 0
    return ruby
}

module.exports = self