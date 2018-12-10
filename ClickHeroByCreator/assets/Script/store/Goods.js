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
                name = "一袋妖丹"
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
                only = true;
                break;
            case 3:
                name = "双倍DPS"
                desc = "永久双倍DPS"
                ruby = 700
                only = true;
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
            case 10:
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

    buy(){
        var isCanBy = DataCenter.isRubyEnough(this.ruby)
        if (isCanBy) {
            DataCenter.consumeRuby(this.ruby)
            GoodsDatas.addBuyCount(this.id)
            this.onBuy()
            Events.emit(Events.ON_BUY_GOODS,this.id)
            return true
        } else {
            return false
        }
    },

    onBuy(){
        if (this.id == 0) {
            var gold = new BigNumber(1000000) // 这里要找家恒要当前关卡数 计算 10个Boss金币
            // 然后 要个动画 在点击回调里调用 播放
            DataCenter.addGold(gold)
        } else if(this.id == 1){
            // 大开杀戒 搞个计时器 改变GameData 数值
        } else if(this.id == 2){
            // 双倍金币 GameData 提供支持 改变值 就改变数值了
        } else if(this.id == 3){
            // 双倍伤害 GameData 这个要GoodsDatas去刷新
        } else if(this.id == 4){
            // 家恒支持，让他能获取到count就行
        } else if(this.id == 5){
            // 平行时空 立即拿到括号里的英魂 为什么比括号多还不晓得
        } else if(this.id == 6){
            // 回到未来 得到8个小时后的数值
        } else if(this.id == 7){
            // 挂机加强 GameData里提供个支持数值 GoodsDatas刷新
        } else if(this.id == 8){
            // 打折 GameData里提供个支持数值 GoodsDatas刷新
        } else if(this.id == 9){
            // 伤害加加 GameData里提供个支持数值 GoodsDatas刷新
        } else if(this.id == 7){
            // 仙丹多多 GameData里提供个支持数值 GoodsDatas刷新
        }
    },
})
// 商店页面 顶上要加当前拥有的仙丹 paddingTop 在content同级加个显示就行
// 点击购买按钮后 调buy 为true时 要改变相应的数值和UI
