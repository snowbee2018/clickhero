// 装备
cc.Class({
    properties: {
        id : 0,
        name : "",
        desc : "",
        level : 0,
        effectSkill : [],
        effectAncient : [],
        effectGoods : [],
    },
    init(data){
        this.id = data.id
        this.name = data.name
        this.desc = data.desc
        this.level = data.level
        this.effectSkill = data.effectSkill
        this.effectAncient = data.effectAncient
        this.effectGoods = data.effectGoods
        return this
    },

    getDesc(){
        return ''
    },

})
