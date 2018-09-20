// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        monsterPos: cc.Node,
        monsterPrefab: cc.Prefab,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const self = this;
        self.gameController = self.getComponent("GameController");
    },

    start () {

    },

    // update (dt) {},

    makeMonster (lv, num) {
        const self = this;
        let monsterNode = cc.instantiate(self.monsterPrefab);
        monsterNode.parent = self.monsterPos;
        self.curMonster = monsterNode.getComponent("Monster");
        self.curMonster.setMonsterByLv(lv, num, self.onCurMonsterDestroy.bind(self));
        self.gameController.updataMonsterInfoDisplay();
    },

    hit (damage) {
        const self = this;
        if (cc.isValid(self.curMonster)) {
            self.curMonster.hurt(damage);
            self.gameController.updataMonsterInfoDisplay();
        }
    },

    onCurMonsterDestroy (lv, num, cost) {
        const self = this;
        if (lv % 5 == 0) {
            self.makeMonster(lv + 1, 0);
        } else {
            self.makeMonster(num == 9 ? lv + 1 : lv, num == 9 ? 0 : num + 1);
        }
        self.gameController.onMonsterCost(cost);
    },

    getCurMonsterInfo () {
        const self = this;
        return {
            lv: self.curMonster._lv,
            num: self.curMonster._num,
            hp: self.curMonster._curHP,
            cost: self.curMonster._cost,
        }
    },
});
