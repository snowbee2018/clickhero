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
        _soul: 0, // 当前英魂
        _isTreasureChest: false, // 是否是宝箱怪
        _monsterName: "怪物名字",
        _isBoss: false,
        _isPrimalBoss: false,

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
        self._soul = new BigNumber(0);
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
                self._onMonsterDestroy(self._lv, self._gold, self._isBoss, self._soul);
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

    setMonsterByLv(lv, monsterCloudInfo, onMonsterDestroy, hpChangeCallBack, clickHertCallBack) {
        const self = this;
        self._lv = lv;
        self._totalHP = Formulas.getMonsterHP(lv);
        self._curHP = new BigNumber(self._totalHP);
        if (monsterCloudInfo) {
            self._isTreasureChest = !!monsterCloudInfo.isTreasureChest;
            if (self._isTreasureChest) self._monsterName = "宝箱";
            self._isBoss = !!monsterCloudInfo.isBoss;
            self._isPrimalBoss = !!monsterCloudInfo.isPrimalBoss;
            if (monsterCloudInfo.gold) {
                self._gold = monsterCloudInfo.gold;
            } else {
                self._gold = Formulas.getMonsterGold(lv, self._totalHP);
                if (self._isTreasureChest) {
                    self._gold = self._gold.times(10 * GameData.addTreasureTimes);
                }
                if (!self._isBoss) { // 非Boss怪有一定概率金币翻10倍,基础概率是0
                    if (Formulas.isHitRandom(GameData.addTenfoldGoldOdds * 100)) {
                        self._gold = self._gold.times(10);
                    }
                }
            }
            if (monsterCloudInfo.soul) {
                self._soul = monsterCloudInfo.soul;
            } else {
                if (self._isPrimalBoss) {
                    self._soul = Formulas.getPrimalBossSoul(self._lv);
                }
            }
        } else {
            self._isBoss = self._lv % 5 == 0;
            if (!self._isBoss) {
                var odds = Math.min((1 + GameData.addTreasureOdds * 100), 100);
                self._isTreasureChest = Formulas.isHitRandom(odds);
            } else {
                if (lv >= 100 && !DataCenter.isLevelPassed(lv)) { // 生成远古BOSS
                    var baseOdds = 0.25;
                    var realOdds = Math.min((baseOdds + addPrimalBossOdds), 1);
                    self._isPrimalBoss = Formulas.isHitRandom(realOdds * 100);
                    if (self._isPrimalBoss) {
                        self._soul = Formulas.getPrimalBossSoul(self._lv);
                    }
                }
            }
            self._gold = Formulas.getMonsterGold(lv, self._totalHP);
            if (self._isTreasureChest) {
                self._gold = self._gold.times(10 * GameData.addTreasureTimes);
                self._monsterName = "宝箱";
            }
            if (!self._isBoss) { // 非Boss怪有一定概率金币翻10倍,基础概率是0
                if (Formulas.isHitRandom(GameData.addTenfoldGoldOdds * 100)) {
                    self._gold = self._gold.times(10);
                }
            }
        }

        self.getComponent(cc.Sprite).spriteFrame = self.monsterSprf[parseInt(Math.random() * 10)];

        self._onMonsterDestroy = onMonsterDestroy;
        self._hpChangeCallBack = hpChangeCallBack;
        self._clickHertCallBack = clickHertCallBack;
        self.onHpChange();
    },

    // setMonsterByData(lv, curHP, onMonsterDestroy, hpChangeCallBack) {
    //     const self = this;
    //     self._lv = lv;
    //     if (self._lv%5 != 0) {
    //         self._isTreasureChest = Formulas.isHitRandom(1);
    //     }
    //     self._isBoss = self._lv % 5 == 0;
    //     self._totalHP = Formulas.getMonsterHP(lv);;
    //     self._curHP = new BigNumber(curHP);
    //     self._gold = Formulas.getMonsterGold(lv, self._totalHP);
    //     if (self._isTreasureChest) {
    //         self._gold = self._gold.times(10);
    //     }
    //     self._onMonsterDestroy = onMonsterDestroy;
    //     self._hpChangeCallBack = hpChangeCallBack;
    //     self.onHpChange();
    // },

    recoverHP () {
        const self = this;
        self._curHP = self._totalHP;
    },

    playDamage(damage, bCrit) {
        const self = this;
        var damageNode = cc.instantiate(self.damageAnim);
        damageNode.parent = self.node.parent;
        damageNode.zIndex = 100;
        damageNode.x = 100;
        damageNode.y = 100;
        damageNode.getComponent("DamageAnim").setDamage(damage, bCrit);
    },

    hurt(damage, bDPS, bCrit) { // 受伤(播放受伤动画)
        const self = this;
        if (!self._alive) return;
        if (!self._curHP.isZero()) {
            if (damage.isZero()) return;
            if (!bDPS) {
                self.playAnim("Hurt");
                self.playDamage(Formulas.formatBigNumber(damage), bCrit);
                if (self._clickHertCallBack) {
                    self._clickHertCallBack(self._lv, self._gold, self._isBoss);
                }
            }
        }
    },

    bleed(damage) { // 流血(血量减少)
        const self = this;
        if (!self._alive) return;
        if (!self._curHP.isZero()) {
            if (damage.isZero()) return;
            // console.log("hurt : damage = " + damage.toString());
            // bDPS = bDPS ? true : false;
            if (self._curHP.isGreaterThan(damage)) {
                self._curHP = self._curHP.minus(damage);
                // if (bDPS) {

                // } else {
                //     self.playAnim("Hurt");
                //     self.playDamage(Formulas.formatBigNumber(damage), bCrit);
                //     if (self._clickHertCallBack) {
                //         self._clickHertCallBack(self._lv, self._gold, self._isBoss);
                //     }
                // }
            } else {
                self._curHP = new BigNumber(0);
                // if (!bDPS) {
                //     self.playDamage(Formulas.formatBigNumber(damage), bCrit);
                //     if (self._clickHertCallBack) {
                //         self._clickHertCallBack(self._lv, self._gold, self._isBoss);
                //     }
                // }
                // self.goDie();
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
