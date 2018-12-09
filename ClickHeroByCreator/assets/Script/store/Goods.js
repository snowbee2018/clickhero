// 古神

cc.Class({
    properties: {
        id : 0,
        name : "",
        desc : "",
        ruby : 0,
        only : false, // 是否不可以反复购买
        cd : 0, // 冷却时间
    },
    init(id){
        let name = ""
        let desc = ""
        let ruby = 0
        let only = false
        let cd = 0
        switch (id) {
            case 0:
                name = "妖丹"
                desc = ""
                ruby = 50
                break;
            case 1:
                name = "大开杀戒"
                desc = "+10倍DPS伤害，持续60秒"
                ruby = 30
                cd = 60*10
                break;
            case 2:
                name = "双倍妖丹"
                desc = "永久双倍妖丹"
                ruby = 500
                break;
            case 3:
                name = "双倍DPS"
                desc = "永久双倍DPS"
                ruby = 700
                break;
            case 4:
                name = "自动点击"
                desc = "(+10每秒轻击)"
                ruby = 1000 // + 已拥有数*500
                break;
            case 5:
                name = "平行时空"
                desc = ""
                ruby = 300
                break;
            case 6:
                name = "回到未来"
                desc = ""
                ruby = 300
                break;
            // 下面是超越了
            case 7:
                name = "一动不动是萌萌"
                desc = "每次购买+50%的闲置型上古神器收益"
                ruby = 200
                break;
            case 8:
                name = "神器打个折"
                desc = "每次购买-5%的上古神器费用"
                ruby = 200
                break;
            case 9:
                name = "伤害高又高"
                desc = "每次购买+100%的DPS"
                ruby = 200
                break;
            case 9:
                name = "仙丹多又多"
                desc = "每次购买+1000%的仙丹加成"
                ruby = 200
                break;
            // case 9:
            //     name = "仙丹多又多"
            //     desc = "每次购买-5%的上古神器费用"
            //     ruby = 200
            //     break;
            // case 9:
            //     name = "伤害加深"
            //     desc = "每次购买-5%的上古神器费用"
            //     ruby = 200
            //     break;
            // case 9:
            //     name = "伤害加深"
            //     desc = "每次购买-5%的上古神器费用"
            //     ruby = 200
            //     break;
        }
        this.id = id
        this.name = name
        this.desc = desc
        this.ruby = ruby
        this.only = only // 是否不可以反复购买
        this.cd = cd
        return this
    },
})
