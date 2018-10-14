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
        _lv: 0, // 怪物等级
        _gold: 0, // 掉落金币 bignumber
        _totalHP: 0, // 总血量 bignumber
        _curHP: 0, // 当前血量 bignumber
        _isTreasureChest: false, // 是否是宝箱怪
        _monsterName: "怪物名字",

        damageAnim: cc.Prefab,
        monsterSprf: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    ctor () {
        const self = this;
        
    },

    onLoad () {
        const self = this;
        self._gold = new BigNumber(0);
        self._totalHP = new BigNumber(0);
        self._curHP = new BigNumber(0);
        self.anim = self.getComponent(cc.Animation);
    },

    start () {
        const self = this;
        self.playAnim("ComeOn");
        self._alive = true;
    },

    playAnim (name) {
        const self = this;
        self.anim.stop();
        self.node.x = 0;
        self.node.y = 0;
        self.node.scaleX = 1;
        self.node.scaleY = 1;
        self.anim.play(name);
    },

    onDestroy () {
        const self = this;
        if (!self._isByeBye) {
            if (self._onMonsterDestroy) {
                self._onMonsterDestroy(self._lv, self._gold, self._isBoss);
            }
        }
    },

    // update (dt) {},

    onHpChange () {
        const self = this;
        if (self._hpChangeCallBack) {
            self._hpChangeCallBack(self._monsterName, self._totalHP, self._curHP);
        }
    },

    setMonsterByLv(lv, onMonsterDestroy, hpChangeCallBack) {
        const self = this;
        self._lv = lv;
        if (self._lv%5 != 0) {
            self._isTreasureChest = Formulas.isHitRandom(1);
        }
        self._isBoss = self._lv % 5 == 0;
        self._totalHP = Formulas.getMonsterHP(lv);
        self._curHP = new BigNumber(self._totalHP);
        self.getComponent(cc.Sprite).spriteFrame = self.monsterSprf[parseInt(Math.random() * 10)];
        self._gold = Formulas.getMonsterGold(lv, self._totalHP);
        if (self._isTreasureChest) {
            self._gold = self._gold.times(10);
        }
        
        self._onMonsterDestroy = onMonsterDestroy;
        self._hpChangeCallBack = hpChangeCallBack;
        self.onHpChange();
    },

    setMonsterByData(lv, curHP, onMonsterDestroy, hpChangeCallBack) {
        const self = this;
        self._lv = lv;
        if (self._lv%5 != 0) {
            self._isTreasureChest = Formulas.isHitRandom(1);
        }
        self._isBoss = self._lv % 5 == 0;
        self._totalHP = Formulas.getMonsterHP(lv);;
        self._curHP = new BigNumber(curHP);
        self._gold = Formulas.getMonsterGold(lv, self._totalHP);
        if (self._isTreasureChest) {
            self._gold = self._gold.times(10);
        }
        self._onMonsterDestroy = onMonsterDestroy;
        self._hpChangeCallBack = hpChangeCallBack;
        self.onHpChange();
    },

    playDamage (damage) {
        const self = this;
        var damageNode = cc.instantiate(self.damageAnim);
        damageNode.parent = self.node.parent;
        damageNode.zIndex = 100;
        damageNode.x = 100;
        damageNode.y = 100;
        damageNode.getComponent("DamageAnim").setDamage(damage);
    },

    hurt (damage, bDPS) {
        const self = this;
        if (!self._alive) return;
        if (!self._curHP.isZero()) {
            if (damage.isZero()) return;
            // console.log("hurt : damage = " + damage.toString());
            bDPS = bDPS ? true : false;
            if (self._curHP.isGreaterThan(damage)) {
                self._curHP = self._curHP.minus(damage);
                if (bDPS) {
                    
                } else {
                    self.playAnim("Hurt");
                    self.playDamage(Formulas.formatBigNumber(damage));
                }
            } else {
                self._curHP = new BigNumber(0);
                self.playDamage(Formulas.formatBigNumber(damage));
                self.goDie();
            }
            // console.log("cur hp : " + self._curHP.toString());
            self.onHpChange();
        } else {
            self.goDie();
        }
        
    },

    goDie () {
        const self = this;
        // console.log("Die");
        self._alive = false;
        self.playAnim("Dieing");

    },

    onDieAnimEnd () {
        const self = this;
        self.node.destroy();
    },

    byebye () { // 上一关下一关调用的，不回调
        const self= this;
        self._isByeBye = true;
        self.node.destroy();
    },
});
