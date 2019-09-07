/*
 * @Author: xj 
 * @Date: 2019-06-12 14:57:51 
 * @Last Modified by: xj
 * @Last Modified time: 2019-06-12 15:48:52
 */

cc.Class({
    properties: {
        id : 0,
        name : "",
        progress : "",
        ruby : 0,
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
            case 0:
                name = "累计获得金币"
                var gold = this.getBagGold()
                var str = Formulas.formatBigNumber(gold)
                desc = "立即获得"+str+"金币" // 封装个方法去获取数量
                state = ""
                ruby = 30
                break;
            case 1:
                break;
            case 6:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
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

})