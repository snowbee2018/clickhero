
cc.Class({
    extends: cc.Component,

    properties: {
        lbGold : cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var lastTime = DataCenter.getDataByKey(DataCenter.KeyMap.lastTime)
        if (lastTime) {
            var diff = Date.now() - Number(lastTime)
            console.log("离线时间："+diff);
            var totalDamage = GameData.dpsDamage.times(diff/1000)
            console.log("离线伤害："+Formulas.formatBigNumber(totalDamage));
            var lv = DataCenter.getDataByKey(DataCenter.KeyMap.passLavel)
            var gold = Formulas.getMonsterGold(lv,totalDamage)
            console.log("离线收益："+Formulas.formatBigNumber(gold));
            this.lbGold.string = Formulas.formatBigNumber(gold)
            this.gold = gold
        } else {
            this.node.destroy()
        }
    },

    onClick(){
        DataCenter.addGold(this.gold)
        this.node.destroy()
    },

    // update (dt) {},
});
