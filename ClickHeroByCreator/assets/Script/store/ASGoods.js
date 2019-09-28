
cc.Class({
    properties: {
        id : 0,
        name : "",
        desc : "",
        state : "",
        AS : 0,
    },
    init(id){
        this.id = (id === undefined)? this.id : id;
        let name = ""
        let desc = ""
        let state = ""
        let AS = 0
        let count = this.getCount();
        switch (this.id) {
            case 9:
                name = "DPS加持" + (count>0? " Lv" + count:"")
                desc = "升级+100%的DPS"
                state = "DPS增加:+" + count*100+"%"
                AS = 1
                break;
            case 7:
                name = "挂机加持" + (count>0? " Lv" + count:"")
                desc = "升级+"+((Math.pow(1.5,count+1)-Math.pow(1.5,count))*100).toFixed(2)+"%的挂机型神器效果"
                state = "挂机效果增加:+" + ((Math.pow(1.5,count)-1)*100).toFixed(2)+"%"
                AS = 1 + count
                break;
            case 15:
                name = "炼丹炉" + (count>0? " Lv" + count:"")
                desc = "升级+"+((Math.pow(count+1,2)-Math.pow(count,2))*1000)+"%的仙丹加成" // 这里是根据等级改变的
                state = "仙丹加成:+" + Math.pow(count,2)*1000+"%"
                AS = 1 + count
                break;
            case 8:
                name = "神器打个折" + (count>0? " Lv" + count:"")
                desc = "每次升级-5%的上古神器费用，上限150次"
                var num = ((1 - Math.pow(0.95,this.getCount())) * 100).toFixed(4)
                state = "上古神器升级费用:-" + num +"%" 
                AS = 1 + count
                break;
            case 11:
                name = "催泪铃加持" + (count>0? " Lv" + count:"")
                desc = "每次升级+25%的催泪铃的效果"
                state = "催泪铃效力增加:+" + (this.getCount()*25)+"%"
                AS = 1 + count
                break;
            case 12:
                name = "昊天塔加持" + (count>0? " Lv" + count:"")
                desc = "每次升级+75%昊天塔效果"
                state = "昊天塔效力增加:+" + (this.getCount()*75)+"%"
                AS = 1 + count
                break;
            case 13:
                name = "崆峒印加持" + (count>0? " Lv" + count:"")
                desc = "每次升级+100%崆峒印效果"
                state = "崆峒印效力增加:+" + PublicFunc.numToStr(count*100)+"%"
                AS = 1 + count
                break;
            case 18:
                name = "太虚神甲加持" + (count>0? " Lv" + count:"")
                desc = "升级+12.5%太虚神甲效果"
                state = "太虚神甲效力增加:+" + (this.getCount()*12.5)+"%"
                AS = 1 + count
                break;
            case 19:
                name = "照妖镜加持" + (count>0? " Lv" + count:"")
                desc = "升级+50%照妖镜效果"
                state = "照妖镜效力增加:+" + (this.getCount()*50)+"%"
                AS = 1 + count
                break;
        }
        this.name = name
        this.desc = desc
        this.state = state
        this.AS = AS
        return this
    },

    getCount(){
        return GoodsDatas.getASCount(this.id)
    },

    buy(){
        var isCanBy = DataCenter.isASEnough(this.AS)
        //神器打个折上限
        if(this.id== 8 && this.getCount() >= 150)
        {
            return false
        }
        if (isCanBy) {
            DataCenter.consumeAS(this.AS)
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