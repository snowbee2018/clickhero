// 管理装备的数据源
var self = {}

self.isZone2 = function(){
    return DataCenter.getUserZone() >= 2
}

self.init = function() {
    self.resolveChips = [1,8,64,256]
    self.upgradeChips = [2,12,72,256]
    self.buyRubys = [150,1500,15000]
    self.upgradeRubys = [100,1000,10000,100000]
    self.upgradeAddRubys = [100,800,6400,25600]
    // 图鉴
    self.equips = [
        [],[],[],[]
    ]
    // 普通品质
    let arr0 = self.equips[0]
    // 技能id:0,1,2,3,6 猴子猴孙 +10*v,三头六臂 +1x*v,暴击风暴 +1%*x,火眼金睛 +1x*v,如意金箍 +1x*v
    // 古神id:2,3,5,6,7,8,9,10,11,13,15,16,23,25,26 
    // 商品id:1苦海,14聚宝,2金币,3伤害,4自动点击,100仙丹 ，，，，，
    arr0.push({id:0,type:0,name:'name0',level:1,
        eqSkill : [], // 技能效果加成 id表示第几个技能，v为效果 每个技能有不同
        eqAncient : [], // 古神lv加成 id 对应古神id v为加成的lv
        eqGoods : [{id:3,v:1},], // 商店lv加成 id 对应GoodsId v为加成lv
    })
    arr0.push({id:1,type:0,name:'name0',level:1,
        eqSkill : [],
        eqAncient : [],
        eqGoods : [{id:2,v:2},],
    })
    arr0.push({id:2,type:0,name:'name0',level:1,
        eqSkill : [],
        eqAncient : [],
        eqGoods : [{id:14,v:1},],
    })
    arr0.push({id:3,type:0,name:'name0',level:1,
        eqSkill : [],
        eqAncient : [],
        eqGoods : [{id:1,v:1},],
    })
    arr0.push({id:4,type:0,name:'name0',level:1,
        eqSkill : [{id:0,v:5},{id:1,v:1},],
        eqAncient : [],
        eqGoods : [],
    })
    arr0.push({id:5,type:0,name:'name0',level:1,
        eqSkill : [{id:3,v:1},{id:6,v:2},],
        eqAncient : [],
        eqGoods : [],
    })
    let arr1 = self.equips[1]
    arr1.push({id:8,type:1,name:'name0',level:1,
        eqSkill : [],
        eqAncient : [],
        eqGoods : [{id:14,v:2},{id:1,v:2},],
    })
    arr1.push({id:9,type:1,name:'name0',level:1,
        eqSkill : [],
        eqAncient : [],
        eqGoods : [{id:2,v:6},{id:3,v:3},],
    })
    arr1.push({id:10,type:1,name:'name0',level:1,
        eqSkill : [],
        eqAncient : [],
        eqGoods : [{id:100,v:2}],
    })
    arr1.push({id:11,type:1,name:'name0',level:1,
        eqSkill : [{id:0,v:10}],
        eqAncient : [],
        eqGoods : [{id:4,v:2}],
    })
    arr1.push({id:12,type:1,name:'name0',level:1,
        eqSkill : [{id:1,v:1},{id:6,v:2},],
        eqAncient : [],
        eqGoods : [{id:4,v:1},{id:3,v:2},],
    })
    let arr2 = self.equips[2]
    arr2.push({id:16,type:2,name:'',level:1,
        eqSkill : [],
        eqAncient : [{id:2,v:2},{id:3,v:2},{id:5,v:2},],
        eqGoods : [{id:14,v:8},{id:1,v:8},],
    })
    arr2.push({id:17,type:2,name:'',level:1,
        eqSkill : [],
        eqAncient : [{id:6,v:2},{id:7,v:2},{id:8,v:2},],
        eqGoods : [{id:2,v:32},{id:3,v:16},],
    })
    arr2.push({id:18,type:2,name:'',level:1,
        eqSkill : [{id:0,v:10}],
        eqAncient : [{id:9,v:2},{id:10,v:2},{id:11,v:2},],
        eqGoods : [{id:100,v:7},{id:4,v:4},],
    })
    arr2.push({id:19,type:2,name:'',level:1,
        eqSkill : [{id:0,v:40},{id:1,v:3},],
        eqAncient : [{id:13,v:2},{id:15,v:2},{id:16,v:2},],
        eqGoods : [{id:4,v:10},],
    })
    arr2.push({id:20,type:2,name:'',level:1,
        eqSkill : [{id:3,v:4},{id:6,v:4},],
        eqAncient : [{id:25,v:2},{id:26,v:2},],
        eqGoods : [{id:2,v:24},{id:14,v:8},],
    })
    let arr3 = self.equips[3]
    const acv = 3
    arr3.push({id:24,type:3,name:'',level:1,
        eqSkill : [{id:0,v:60},{id:1,v:6},],
        eqAncient : [{id:2,v:acv},{id:3,v:acv},{id:5,v:acv},{id:6,v:acv},{id:7,v:acv},],
        eqGoods : [{id:1,v:36},{id:14,v:36},{id:4,v:8},],
    })
    arr3.push({id:25,type:3,name:'',level:1,
        eqSkill : [{id:3,v:6},{id:6,v:6},],
        eqAncient : [{id:8,v:acv},{id:9,v:acv},{id:10,v:acv},{id:11,v:acv},{id:13,v:acv},],
        eqGoods : [{id:2,v:144},{id:3,v:72},{id:1,v:5},{id:14,v:5},],
    })
    arr3.push({id:26,type:3,name:'',level:1,
        eqSkill : [{id:2,v:0.5},],
        eqAncient : [{id:15,v:acv},{id:16,v:acv},{id:25,v:acv},{id:26,v:acv},],
        eqGoods : [{id:100,v:40},{id:4,v:10},],
    })
    // 技能id:0,1,2,3,6 猴子猴孙 +10*v,三头六臂 +1x*v,暴击风暴 +1%*x,火眼金睛 +1x*v,如意金箍 +1x*v
    // 古神id:2,3,5,6,7,8,9,10,11,13,15,16,25,26 
    // 商品id:1苦海,14聚宝,2金币,3伤害,4自动点击,100仙丹 ，，，，，
    self.alls = arr0.concat(arr1,arr2,arr3)
    // 读取玩家的装备数据
        console.log("xxxxj init 1");
    var cloudInfo = DataCenter.getCloudDataByKey(DataCenter.KeyMap.myEquips);
    self.mys = cloudInfo || {on:[],off:[],chip:0} // on 在身上的 off 不在身上的 chip 碎片
    self.refresh()
}

self.refresh = function(){
    GameData.eqSkill = []
    GameData.eqAncient = []
    GameData.eqGoods = []
    self.mys.on.forEach(e => {
        const lv = e.level
        // skill
        e.eqSkill.forEach(k => {
            GameData.eqSkill[k.id] = k.v*lv + (GameData.eqSkill[k.id]||0)
        });
        // ancient
        e.eqAncient.forEach(k => {
            GameData.eqAncient[k.id] = k.v*lv + (GameData.eqAncient[k.id]||0)
        });
        // goods
        e.eqGoods.forEach(k => {
            GameData.eqGoods[k.id] = k.v*lv + (GameData.eqGoods[k.id]||0)
        });
    });
    Events.emit(Events.ON_EQUIP_UPDATE)
    GoodsDatas.refresh()
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
    const bUp = Math.random()>0.92
    type = bUp? type + 1 : type
    const arr = self.equips[type]
    const i = Math.floor(Math.random()*arr.length)
    let e = arr[i]
    let item = {
        id:e.id,type:e.type,name:e.name,level:e.level,
        eqSkill:e.eqSkill,eqAncient:e.eqAncient,eqGoods:e.eqGoods,
    }
    self.mys.off.push(item)
    return item
}
// 佩戴装备  -2不能重复 -1装备满了 0没有这个装备 1成功
self.puton = function(data) {
    if (self.mys.on.length >= 4) {
        return -1
    }
    const index = self.mys.off.indexOf(data)
    if (!index < 0) {
        return 0
    }
    for (let i = 0; i < self.mys.on.length; i++) {
        const e = self.mys.on[i];
        if (e.id == data.id) {
            return -2
        }
    }
    self.mys.off.splice(index,1)
    self.mys.on.push(data)
    console.log('self.mys.on');
    console.log(self.mys.on);
    self.refresh()
    return 1
}
// 脱下装备
self.putoff = function(data) {
    const index = self.mys.on.indexOf(data)
    if (!index < 0) {
        return false
    }
    self.mys.on.splice(index,1)
    self.mys.off.push(data)
    self.refresh()
    return true
}
// 分解成chip
self.resolve = function(data) {
    const index0 = self.mys.on.indexOf(data)
    if (index0 >= 0) {
        self.mys.on.splice(index0,1)
        self.mys.chip += self.getResolveChip(data)
        self.refresh()
        return true
    }
    const index1 = self.mys.off.indexOf(data)
    if (index1 >= 0) {
        self.mys.off.splice(index1,1)
        self.mys.chip += self.getResolveChip(data)
        self.refresh()
        return true
    }
    return false
}
// -1矿石不够 -2仙桃不够
self.upgrade = function(data) {
    const ruby = self.getUpgradeRuby(data)
    const chip = self.getUpgradeChip(data)
    if (self.mys.chip < chip) {
        return -1
    }
    if (!DataCenter.isRubyEnough(ruby)) {
        return -2
    }
    self.mys.chip -= chip
    DataCenter.consumeRuby(ruby)
    data.level ++
    self.refresh()
    return 1
}
self.getResolveChip = function(data) {
    const type = data.type
    let chip = self.resolveChips[type] * data.level
    return chip
}
self.getUpgradeChip = function(data) {
    const type = data.type
    let chip = self.upgradeChips[type]
    return chip
}
self.getUpgradeRuby = function(data) {
    const type = data.type
    const lv = data.level
    let ruby = self.upgradeRubys[type] + self.upgradeAddRubys[type]*(lv-1)
    return ruby
}

self.resetGame = function() {
    let ruby = 0
    return ruby
}
self.getDesc = function(data){
    const names = ['魔法石','石锤','魔力法杖','生命石','断剑','魔法披风','木棍','木甲',
        '熔岩斧','红色法杖','幽魂碎片','幽魂之刃','幽魂宝石','','','',
        '狼牙棒','雷电之锤','邪能法杖','飞云枪','巫术法杖','魔晶权杖','魔晶利刃','符文战刃',
        '战神权杖','雷神之锤','永恒遗物','邪神权杖','战神斧','魔龙之心','战神枪','战神之戟',]
    const types = ['普通','稀有','史诗','传说']
    const tcolors = ['666666','363CC0','862CCC','C2A822',]
    // <color=#00ff00>Rich</c><color=#0fffff>Text</color>
    let s = ""
    const id = data.id
    const type = data.type
    const lv = data.level
    // 名字 lv 品质
    let sname = names[id]+"    ["+types[type]+"]\n"
    s += sname
    let slv = "等级:"+lv+"\n"
    s += slv
    // 技能
    const eqSkill = data.eqSkill || []
    if (eqSkill.length>0) {
        s += "[技能]\n"
    }
    const skNames = ['猴子猴孙','三头六臂','暴击风暴','火眼金睛','','','如意金箍','','',]
    let sskill = ''
    eqSkill.forEach(e => {
        const n = skNames[e.id]
        const v = e.v * lv
        let str = ''
        switch (e.id) {
            case 0:
                str = '+'+v+'次每秒点击'
                break;
            case 1:
                str = '+'+v+'倍DPS伤害'
                break;
            case 2:
                str = '+'+(v*100)+'%暴击概率'
                break;
            case 3:
                str = '+'+v+'倍金币获取'
                break;
            case 6:
                str = '+'+v+'倍点击伤害'
                break;
        }
        sskill += n+" "+str+"\n"
    });
    s+=sskill
    // 商品
    let sgoods = ''
    const eqGoods = data.eqGoods || []
    if (eqGoods.length>0) {
        s += "[商店]\n"
    }
    eqGoods.forEach(e => {
        const g = GoodsDatas.getGoods(e.id)
        sgoods += g.name +' +'+(e.v*lv)+'级\n'
    });
    s+=sgoods
    // 神器
    let sancient = ''
    const eqAncient = data.eqAncient || []
    if (eqAncient.length>0) {
        s += "[古神]\n"
    }
    eqAncient.forEach(e => {
        const a = HeroDatas.getAncient(e.id)
        sancient += a.name +' +'+(e.v*lv)+'级\n'
    });
    s+=sancient
    return s
}
// self.getDesc = function(data){
//     const names = ['魔法石','石锤','魔力法杖','生命石','断剑','魔法披风','木棍','木甲',
//         '熔岩斧','红色法杖','幽魂碎片','幽魂之刃','幽魂宝石','','','',
//         '符文战刃','狼牙棒','雷电之锤','邪能法杖','飞云枪','巫术法杖','魔晶权杖','魔晶利刃',
//         '战神之戟','战神权杖','雷神之锤','永恒遗物','邪神权杖','战神斧','魔龙之心','战神枪',]
//     const types = ['普通','稀有','史诗','传说']
//     const tcolors = ['666666','363CC0','862CCC','C2A822',]
//     // <color=#00ff00>Rich</c><color=#0fffff>Text</color>
//     let s = ""
//     const id = data.id
//     const type = data.type
//     const lv = data.level
//     // 名字 lv 品质
//     let sname = "<color=#000000>"+names[id]+"</c>"+"    <color=#"+tcolors[type]+">"+types[type]+"</c>\n"
//     s += sname
//     let slv = "<color=#1F6B10>等级:"+lv+"</c>\n"
//     s += slv
//     // 技能
//     const eqSkill = data.eqSkill || []
//     if (eqSkill.length>0) {
//         s += "<color=#666688>[技能]</c>\n"
//     }
//     const skNames = ['猴子猴孙','三头六臂','暴击风暴','火眼金睛','','','如意金箍','','',]
//     let sskill = ''
//     eqSkill.forEach(e => {
//         const n = skNames[e.id]
//         const v = e.v * lv
//         let str = ''
//         switch (e.id) {
//             case 0:
//                 str = '+'+v+'次每秒点击'
//                 break;
//             case 1:
//                 str = '+'+v+'倍DPS伤害'
//                 break;
//             case 2:
//                 str = '+'+(v*100)+'%暴击概率'
//                 break;
//             case 3:
//                 str = '+'+v+'倍金币获取'
//                 break;
//             case 6:
//                 str = '+'+v+'倍点击伤害'
//                 break;
//         }
//         sskill += n+" "+str+"\n"
//     });
//     s+=sskill
//     // 商品
//     let sgoods = ''
//     const eqGoods = data.eqGoods || []
//     if (eqGoods.length>0) {
//         s += "<color=#668866>[商店]</c>\n"
//     }
//     eqGoods.forEach(e => {
//         const g = GoodsDatas.getGoods(e.id)
//         sgoods += g.name +' +'+(e.v*lv)+'级\n'
//     });
//     s+=sgoods
//     // 神器
//     let sancient = ''
//     const eqAncient = data.eqAncient || []
//     if (eqAncient.length>0) {
//         s += "<color=#886666>[古神]</c>\n"
//     }
//     eqAncient.forEach(e => {
//         const a = HeroDatas.getAncient(e.id)
//         sancient += a.name +' +'+(e.v*lv)+'级\n'
//     });
//     s+=sancient
//     return s
// }

module.exports = self