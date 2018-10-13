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
        zoneInfoNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const self = this;
        self.gameController = self.getComponent("GameController");
        self.zoneInfo = self.zoneInfoNode.getComponent("ZoneInfo");
    },

    start () {

    },

    // update (dt) {},

    formatMonsterInfo () {
        const self = this;
        var map = DataCenter.KeyMap;
        var monsterInfo = self.getCurMonsterInfo();
        var obj = {}
        obj.lv = monsterInfo.lv;
        obj.hp = monsterInfo.hp.toExponential(4);
        return JSON.stringify(obj);
    },

    makeMonster (lv) {
        const self = this;
        let monsterNode = cc.instantiate(self.monsterPrefab);
        monsterNode.parent = self.monsterPos;
        self.curMonster = monsterNode.getComponent("Monster");
        self.curMonster.setMonsterByLv(lv, self.onCurMonsterDestroy.bind(self));
        self.gameController.updataMonsterInfoDisplay();
        if (!DataCenter.isLevelPassed(lv)) {
            if (!self.killCount) {
                self.killCount = 0;
            }
        }
        self.zoneInfo.setZonrInfo(lv, self.killCount, self.curMonster._isBoss);
    },

    hit (damage, bDPS) {
        const self = this;
        if (cc.isValid(self.curMonster)) {
            self.curMonster.hurt(damage, bDPS);
            self.gameController.updataMonsterInfoDisplay();
        }
    },

    onCurMonsterDestroy (lv, gold, isBoss) {
        const self = this;
        if (!DataCenter.isLevelPassed(lv)) {
            if (isBoss) {
                DataCenter.passLevel(lv);
                delete self.killCount;
            } else {
                if (self.killCount + 1 >= 10) {
                    DataCenter.passLevel(lv);
                    delete self.killCount;
                } else {
                    self.killCount++;
                }
            }
        }
        self.makeMonster(lv);
        self.gameController.onMonsterGold(gold);
    },

    getCurMonsterInfo () {
        const self = this;
        return {
            lv: self.curMonster._lv,
            hp: self.curMonster._curHP,
            gold: self.curMonster._gold,
        }
    },

    goToLastLevel () {
        const self = this;
        if (self.curMonster._lv > 1) {
            var targetLv = self.curMonster._lv - 1;
            self.curMonster.byebye();
            self.makeMonster(targetLv);
        }
    },

    goToNextLevel () {
        const self = this;
        if (DataCenter.isLevelPassed(self.curMonster._lv)) {
            var targetLv = self.curMonster._lv + 1;
            self.curMonster.byebye();
            self.makeMonster(targetLv);
        }
    },
});
