// 古神

cc.Class({
    properties: {
        id : 0,
        name : "",
        desc : "",
        state : "",
        ruby : 0,
        only : false, // 是否不可以反复购买
        unlockLv : 0, // 冷却时间
    },
    init(id){
        this.id = (id === undefined)? this.id : id;
        let name = ""
        let desc = ""
        let state = ""
        let ruby = 0
        let only = false
        let cd = 0
        let unlockLv = 0
        let count = this.getCount();
        switch (this.id) {
            case 16:
                name = "呼朋唤友"
                desc = "每邀请一个好友，DPS伤害+30%，还能获得仙桃哦！"
                // 这里要取子用户数量
                const childDatas = DataCenter.readChildUserData() || []
                count = childDatas.length
                state = "邀请数量：" + count + "  当前增益：" + (count*30) +"%"
                break
            case 0:
                name = "一袋妖丹"
                var gold = this.getBagGold()
                var str = Formulas.formatBigNumber(gold)
                desc = "立即获得"+str+"妖丹" // 封装个方法去获取数量
                state = ""
                ruby = 50
                break;
            case 14:
                name = "聚宝盆"
                desc = "永久妖丹倍数×1.2，每天可购一次"
                var num = (Math.pow(1.2,count)-1)*100
                state = "等级：" + count + "  妖丹增益：" + num.toFixed(2) +"%"
                ruby = 30
                cd = 60*10
                unlockLv = 10
                break;
            case 1:
                name = "苦海无涯"
                desc = "永久DPS伤害×1.2，每天可购一次"
                var num = (Math.pow(1.2,count)-1)*100
                state = "等级：" + count + "  DPS增益：" + num.toFixed(2) +"%"
                ruby = 40
                cd = 60*10
                unlockLv = 10
                break;
            case 6:
                name = "大开杀戒"
                desc = "附加10倍DPS伤害，持续60秒，可叠加多个"
                ruby = 50
                unlockLv = 30
                break;
            case 2:
                name = "双倍妖丹"
                desc = "永久双倍妖丹"
                state = "仅可购买一次"
                ruby = 500
                only = true;
                unlockLv = 50
                break;
            case 3:
                name = "双倍DPS"
                desc = "永久双倍DPS"
                state = "仅可购买一次"
                ruby = 700
                only = true;
                unlockLv = 50
                break;
            case 4:
                name = "自动点击"
                desc = "(+10每秒点击)"
                state = "当前拥有数:" + this.getCount()
                ruby = 500 + 500 * this.getCount()// + 已拥有数*500
                unlockLv = 80
                break;
            case 5:
                name = "月光宝盒の平行时空"
                desc = "在平行时空穿梭，不需要重置游戏"
                var str = Formulas.formatBigNumber(this.getBagSoul())
                state = "穿越次数+1，立即获得" + str + "仙丹"
                ruby = 400
                unlockLv = 130
                break;
            // 下面是超越了
            case 7:
                name = "一动不动是萌萌" + (count>0? " Lv" + count:"")
                desc = "购买+"+(50*Math.pow(1.1,count)).toFixed(2)+"%的挂机型神器效果"
                state = "挂机效果增加:+" + (PublicFunc.get10TimesByCount(count)*5).toFixed(2)+"%"
                ruby = 300
                unlockLv = 300
                break;
            case 8:
                name = "神器打个折" + (count>0? " Lv" + count:"")
                desc = "每次购买-5%的上古神器费用，上限150次"
                var num = ((1 - Math.pow(0.95,this.getCount())) * 100).toFixed(4)
                state = "上古神器升级费用:-" + num +"%" 
                ruby = 300
                unlockLv = 300
                break;
            case 9:
                name = "伤害高又高" + (count>0? " Lv" + count:"")
                desc = "购买+"+(100*Math.pow(1.1,this.getCount())).toFixed(2)+"%的DPS"
                state = "DPS增加:+" + (PublicFunc.get10TimesByCount(this.getCount())*10).toFixed(2)+"%"
                ruby = 300 
                unlockLv = 200
                break;
            case 10:
                name = "妖丹多又多" + (count>0? " Lv" + count:"")
                desc = "购买+"+(1000*Math.pow(1.1,this.getCount())).toFixed(2)+"%的妖丹加成"
                state = "妖丹加成:+" + (PublicFunc.get10TimesByCount(this.getCount())*100).toFixed(2)+"%"
                ruby = 600
                unlockLv = 200
                break;
            case 15:
                name = "仙丹多又多" + (count>0? " Lv" + count:"")
                desc = "购买+"+(1000*Math.pow(1.1,this.getCount())).toFixed(2)+"%的仙丹加成"
                state = "仙丹加成:+" + (PublicFunc.get10TimesByCount(this.getCount())*100).toFixed(2)+"%"
                ruby = 600
                unlockLv = 300
                break;
            case 11:
                name = "催泪铃加持" + (count>0? " Lv" + count:"")
                desc = "每次购买+25%的催泪铃的效果"
                state = "催泪铃效力增加:+" + (this.getCount()*25)+"%"
                ruby = Math.min(300 + 200 * count,2000) 
                unlockLv = 300
                break;
            case 12:
                name = "昊天塔加持" + (count>0? " Lv" + count:"")
                desc = "每次购买增加+75%昊天塔效果"
                state = "昊天塔效力增加:+" + (this.getCount()*75)+"%"
                ruby = Math.min(300 + 200 * count,2000) 
                unlockLv = 300
                break;
            case 13:
                name = "崆峒印加持" + (count>0? " Lv" + count:"")
                desc = "每次购买+"+(100*Math.pow(1.15,this.getCount())).toFixed(2)+"%崆峒印效果"
                state = "崆峒印效力增加:+" + (PublicFunc.get10TimesByCount(count,1.15)/10*100).toFixed(2)+"%"
                ruby =  Math.min(300 + 200 * count,2000)  
                unlockLv = 300
                break;
        }
        this.name = name
        this.desc = desc
        this.state = state
        this.ruby = ruby
        this.only = only // 是否不可以反复购买
        this.cd = cd
        this.unlockLv = unlockLv
        return this
    },

    getCount(){
        return GoodsDatas.getBuyCount(this.id)
    },

    buy(){
        var isCanBy = DataCenter.isRubyEnough(this.ruby)
        if (isCanBy) {
            DataCenter.consumeRuby(this.ruby)
            GoodsDatas.addBuyCount(this.id)
            this.init()
            this.onBuy()
            Events.emit(Events.ON_BUY_GOODS,this.id)
            return true
        } else {
            return false
        }
    },

    onBuy(){
        if (this.id == 0) {
            var gold = this.getBagGold()
            PublicFunc.popGoldDialog(0,gold)
            // 然后 要个动画 在点击回调里调用 播放
            // DataCenter.addGold(gold)
        } else if(this.id == 1){
        } else if(this.id == 2){
            // 双倍金币 GameData 提供支持 改变值 就改变数值了
        } else if(this.id == 3){
            // 双倍伤害 GameData 这个要GoodsDatas去刷新
        } else if(this.id == 4){
            // 家恒支持，让他能获取到count就行
        } else if(this.id == 5){
            // 平行时空 立即拿到括号里的英魂 为什么比括号多还不晓得
            // DataCenter.addSoul(this.getBagSoul())
            PublicFunc.popGoldDialog(1,this.getBagSoul())
            DataCenter.addRebirthCount()
        } else if(this.id == 6){
            // 大开杀戒 搞个计时器 改变GameData 数值
            GameData.gd10xDpsTimes+=10
            setTimeout(function() {
                GameData.gd10xDpsTimes-=10
                GameData.gd10xDpsTimes=Math.max(GameData.gd10xDpsTimes,1)
                GameData.refresh()
            },60000)
        } else if(this.id == 7){
            // 挂机加强 GameData里提供个支持数值 GoodsDatas刷新
        } else if(this.id == 8){
            // 打折 GameData里提供个支持数值 GoodsDatas刷新
        } else if(this.id == 9){
            // 伤害加加 GameData里提供个支持数值 GoodsDatas刷新
        } else if(this.id == 7){
            // 仙丹多多 GameData里提供个支持数值 GoodsDatas刷新
        }
        GameData.refresh()
    },

    // 一袋金币的数额
    getBagGold(){
        var key = DataCenter.KeyMap.passLavel
        var lv = DataCenter.getDataByKey(key) + 1
        lv = Math.ceil(lv / 5) * 5
        let timesTreas = GameData.getTreasureTimes()*GameData.getTreasureOdds()+1
        let times10x = (10*GameData.addTenfoldGoldOdds+1)
        let times = GameData.globalGoldTimes*timesTreas*times10x
        var gold = Formulas.getMonsterGold(lv).times(100).times(times)
        return gold
    },
    // 快速转生能获得的英魂
    getBagSoul(){
        var maxlv = DataCenter.getDataByKey(DataCenter.KeyMap.maxPassLavel) + 1
        var soul = new BigNumber(0)
        for (let lv = 0; lv <= maxlv; lv++) {
            if (lv >= 100 && (lv % 5) == 0) {
                soul = soul.plus(Formulas.getPrimalBossSoul(lv))
            }
        }
        soul = soul.times(GameData.getPrimalBossOdds() + 0.25).plus(4).integerValue()
        return soul
    },

    getTotalRuby(){
        let ruby = 0
        let count = this.getCount();
        switch (this.id) {
            case 0:
            case 14:
            case 1:
            case 6:
            case 2:
            case 5:
            case 3:
            case 7:
            case 8:
            case 9:
            case 10:
            case 15:
                ruby = this.ruby * count
                break;
            case 4:
                for (let i = 0; i < count; i++) {
                    ruby += 500 + 500 * i
                }
                break;
            case 11:
            case 12:
            case 13:
                for (let i = 0; i < count; i++) {
                    ruby += 300 * (i+1)
                }
                break;
        }
        return ruby
    },
})
