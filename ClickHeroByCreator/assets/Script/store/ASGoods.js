
cc.Class({
    properties: {
        id : 0,
        name : "",
        desc : "",
        state : "",
        ruby : 0,
    },
    init(id){
        this.id = (id === undefined)? this.id : id;
        let name = ""
        let desc = ""
        let state = ""
        let ruby = 0
        let count = this.getCount();
        switch (this.id) {
            case 9:
                name = "伤害高又高" + (count>0? " Lv" + count:"")
                desc = "购买+100%的DPS"
                state = "DPS增加:+" + count*100+"%"
                ruby = 300 
                break;
            case 7:
                name = "一动不动是萌萌" + (count>0? " Lv" + count:"")
                desc = "购买+50%的挂机型神器效果"
                state = "挂机效果增加:+" + count*50+"%"
                ruby = 300
                break;
            case 15:
                name = "仙丹多又多" + (count>0? " Lv" + count:"")
                desc = "购买+1000%的仙丹加成" // 这里是根据等级改变的
                state = "仙丹加成:+" + count*1000+"%"
                ruby = 600 + (DataCenter.getUserZone()==1? 600:0)
                break;
            case 8:
                name = "神器打个折" + (count>0? " Lv" + count:"")
                desc = "每次购买-5%的上古神器费用，上限150次"
                var num = ((1 - Math.pow(0.95,this.getCount())) * 100).toFixed(4)
                state = "上古神器升级费用:-" + num +"%" 
                ruby = 300
                break;
            case 11:
                name = "催泪铃加持" + (count>0? " Lv" + count:"")
                desc = "每次购买+25%的催泪铃的效果"
                state = "催泪铃效力增加:+" + (this.getCount()*25)+"%"
                ruby = Math.min(300 + 200 * count,2000) 
                break;
            case 12:
                name = "昊天塔加持" + (count>0? " Lv" + count:"")
                desc = "每次购买增加+75%昊天塔效果"
                state = "昊天塔效力增加:+" + (this.getCount()*75)+"%"
                ruby = Math.min(300 + 200 * count,2000) 
                break;
            case 13:
                name = "崆峒印加持" + (count>0? " Lv" + count:"")
                desc = "每次购买+100%崆峒印效果"
                state = "崆峒印效力增加:+" + PublicFunc.numToStr(count*100)+"%"
                ruby =  Math.min(300 + 200 * count,2000)  
                break;
            case 18:
                name = "太虚神甲加持" + (count>0? " Lv" + count:"")
                desc = "购买+12.5%太虚神甲效果"
                state = "太虚神甲效力增加:+" + (this.getCount()*12.5)+"%"
                ruby =  Math.min(300 + 100 * count,2000)   
                break;
            case 19:
                name = "照妖镜加持" + (count>0? " Lv" + count:"")
                desc = "购买+50%照妖镜效果"
                state = "照妖镜效力增加:+" + (this.getCount()*50)+"%"
                ruby =  Math.min(300 + 100 * count,2000)   
                break;
        }
        this.name = name
        this.desc = desc
        this.state = state
        this.ruby = ruby
        return this
    },

    getCount(){
        return GoodsDatas.getASCount(this.id)
    },

    buy(){
        var isCanBy = DataCenter.isRubyEnough(this.ruby)
        //神器打个折上限
        if(this.id== 8 && this.getCount() >= 150)
        {
            return false
        }
        if (isCanBy) {
            DataCenter.consumeRuby(this.ruby)
            GoodsDatas.addASCount(this.id)
            this.init()
            GoodsDatas.refreshAS()
            GameData.refresh()
            Events.emit(Events.ON_BUY_GOODS,this.id) // 只是为了刷新古神
            return true
        } else {
            return false
        }
    },

})