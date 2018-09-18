// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var BigNumber = require("BigNumber");
var Formulas = require("Formulas");
cc.Class({
    extends: cc.Component,

    properties: {
        _lv: 0, // 怪物等级
        _num: 0, // 怪物在当前等级的序号，0 ~ 9
        _cost: 0, // 掉落金币 bignumber
        _totalHP: 0, // 总血量 bignumber
        _curHP: 0, // 当前血量 bignumber

        lvLab: cc.Label,
        numLab: cc.Label,
        hpLab: cc.Label,
        costLab: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    ctor () {
        const self = this;
        self._cost = new BigNumber(0);
        self._totalHP = new BigNumber(0);
        self._curHP = new BigNumber(0);
    },

    // onLoad () {},

    start () {

    },

    onDestroy () {
        const self = this;
        if (self._onMonsterDestroy) {
            self._onMonsterDestroy(self._lv, self._num, self._cost);
        }
    },

    // update (dt) {},

    setMonsterByLv (lv, num, onMonsterDestroy) {
        const self = this;
        self._lv = lv;
        self._num = num;
        self._totalHP = Formulas.getMonsterHP(lv);
        self._curHP = new BigNumber(self._totalHP);
        
        
        self._cost = Formulas.getMonsterGold(lv, self._totalHP);
        self._onMonsterDestroy = onMonsterDestroy;
        // self._totalHP.toString(10);
        console.log("self._totalHP.toString(10) = " + self._totalHP.toString(10));
        console.log("self._cost.toString(10) = " + self._cost.toString(10));
        

        self.lvLab.string = self._lv;
        self.numLab.string = self._num;
        self.hpLab.string = self._curHP.toString(10);
        self.costLab.string = self._cost.toString(10);
    },

    setMonsterByData(lv, num, totalHP, curHP, cost) {
        const self = this;
        self._lv = lv;
        self._num = num;
        self._totalHP = new BigNumber(totalHP);
        self._curHP = new BigNumber(curHP);
        self._cost = new BigNumber(cost);
        self._onMonsterDestroy = onMonsterDestroy;
        
        self.lvLab.string = self._lv;
        self.numLab.string = self._num;
        self.hpLab.string = self._curHP.toString(10);
        self.costLab.string = self._cost.toString(10);
    },

    hurt (damage) {
        const self = this;
        if (!self._curHP.isZero()) {
            console.log("hurt : damage = " + damage.toString(10));
            if (self._curHP.isGreaterThan(damage)) {
                self._curHP = self._curHP.minus(damage);
            } else {
                self._curHP = new BigNumber(0);
                self.goDie();
            }
            console.log("cur hp : " + self._curHP.toString(10));
            self.hpLab.string = self._curHP.toString(10);
        }
        
    },

    goDie () {
        const self = this;
        console.log("Die");
        self.node.destroy();
    },
});
