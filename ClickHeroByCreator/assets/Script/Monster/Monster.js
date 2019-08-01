// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var zoneCfg = require("ZoneCfg")
var bossFlag = {}

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
    },

    // LIFE-CYCLE CALLBACKS:

    ctor () {
        const self = this;
        this.scale = 1
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
        self.node.scaleX = this.scale;
        self.node.scaleY = this.scale;
        self.anim.play(name);
    },

    onDestroy () {
        // const self = this;
        // if (!self._isByeBye) {
        //     if (self._onMonsterDestroy) {
        //         self._onMonsterDestroy(self._lv, self._gold, self._isBoss, self._soul);
        //     }
        // }
    },

    // update (dt) {},

    onHpChange () {
        const self = this;
        if (self._hpChangeCallBack) {
            self._hpChangeCallBack(self._monsterName, self._totalHP, self._curHP);
        }
    },

    getBossFlag(){
        return bossFlag
    },

    setMonsterByLv(lv, monsterCloudInfo, onMonsterDestroy, hpChangeCallBack, clickHertCallBack, onMonsterTalk) {
        const self = this;
        self._lv = lv;
        self._totalHP = Formulas.getMonsterHP(lv).times(GameData.getMonsterHpTimes(lv));
        self._curHP = new BigNumber(self._totalHP);
        if (monsterCloudInfo) {
            self._isTreasureChest = !!monsterCloudInfo.isTreasureChest;
            if (self._isTreasureChest) self._monsterName = "葫芦";
            self._isBoss = !!monsterCloudInfo.isBoss;
            self._isPrimalBoss = !!monsterCloudInfo.isPrimalBoss;
            if (monsterCloudInfo.gold) {
                self._gold = monsterCloudInfo.gold;
            } else {
                self._gold = Formulas.getMonsterGold(lv, self._totalHP);
                if (self._isTreasureChest) {
                    self._gold = self._gold.times(10 * GameData.getTreasureTimes());
                }
                // if (!self._isBoss) { // 非Boss怪有一定概率金币翻10倍,基础概率是0
                //     if (Formulas.isHitRandom(GameData.addTenfoldGoldOdds)) {
                //         self._gold = self._gold.times(10);
                //     }
                // }
            }
            if (monsterCloudInfo.soul) {
                self._soul = monsterCloudInfo.soul;
            } else {
                if (self._isPrimalBoss) {
                    self._soul = Formulas.getPrimalBossSoul(self._lv);
                }
            }
            bossFlag = monsterCloudInfo.bossFlag || {}
        } else {
            self._isBoss = self._lv % 5 == 0;
            if (!self._isBoss) {
                var odds = GameData.getTreasureOdds()
                self._isTreasureChest = Formulas.isHitRandom(odds);
            } else {
                if (lv >= 100 && !DataCenter.isLevelPassed(lv)) { // 生成远古BOSS
                    var realOdds =  GameData.getPrimalBossOdds()
                    if (lv <= 100 && lv % 100 == 0) {
                        self._isPrimalBoss = true; // 百夫长
                    } else if (lv >= 110 && lv <= 130 && lv%10 == 0) {
                        self._isPrimalBoss = true; // 百夫长
                    } else {
                        if (bossFlag.lv == lv) {
                            self._isPrimalBoss = bossFlag.isPrimalBoss
                        }else{
                            console.log("百夫长odds:" + realOdds);
                            self._isPrimalBoss = Formulas.isHitRandom(realOdds);
                            bossFlag.lv = lv
                            bossFlag.isPrimalBoss = self._isPrimalBoss
                        }
                    }
                    if (self._isPrimalBoss) {
                        self._soul = Formulas.getPrimalBossSoul(self._lv);
                    } else {
                        self._soul = new BigNumber(1)
                    }
                }
            }
            self._gold = Formulas.getMonsterGold(lv, self._totalHP);
            if (self._isTreasureChest) {
                self._gold = self._gold.times(10 * GameData.getTreasureTimes());
                self._monsterName = "葫芦";
            }
            // if (!self._isBoss) { // 非Boss怪有一定概率金币翻10倍,基础概率是0
            // }
            // 有一定概率金币翻10倍,基础概率是0
            if (Formulas.isHitRandom(GameData.addTenfoldGoldOdds)) {
                self._gold = self._gold.times(10);
            }
        }

        var len = zoneCfg.length;
        var lv = self._lv;
        var inedx = parseInt((lv - 1) / 5);
        var flag = inedx < len;
        inedx = inedx % len;
        var zoneObj = zoneCfg[inedx];
        if (self._isBoss) {
            if (self._isPrimalBoss) {
                self._monsterName = "[妖王]" + zoneObj.bossName
            }else{
                self._monsterName = zoneObj.bossName;
            }
            CloudRes.getBossUrl(zoneObj.resNum, function (url) {
                if (url) {
                    cc.loader.load({ url: url, type: 'png' }, function (err, texture) {
                        if (!err && texture && cc.isValid(self.node)) {
                            let scale = 360 / texture.height
                            texture.width = texture.width * scale
                            texture.height = texture.height * scale
                            self.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                        }
                    });
                }
            });
            if (flag && zoneObj.des.length > 0) {
                // 放剧情
                // zoneObj.des
                // console.log('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
                // console.log(zoneObj);
                
                // console.log(zoneObj.des);
                
                onMonsterTalk(zoneObj.des);
            }
        } else {
            // self._isTreasureChest
            if (!self._isTreasureChest) {
                self._monsterName = zoneObj.zone + "小妖";
            }
            if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                CloudRes.getMonsterRes(function (err, texture) {
                    if (!err && texture && cc.isValid(self.node)) {
                        let scale = 350 / texture.height
                        texture.width = texture.width * scale
                        texture.height = texture.height * scale
                        self.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                    }
                },self._isTreasureChest);
                if (lv % 5 == 4) {
                    let i = parseInt((lv + 1) / 5)
                    CloudRes.preloadBoosRes(i);
                }
            }
            
        }

        
        // zoneCfg

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
        const curtime = new Date().getTime();
        this.lastCheckTime = this.lastCheckTime || 0
        if (curtime - this.lastCheckTime < 30) {
            return;
        }
        this.lastCheckTime = curtime;

        const self = this;
        var damageNode = cc.instantiate(self.damageAnim);
        damageNode.parent = self.node.parent;
        damageNode.zIndex = 100;
        damageNode.x = Math.random() * 100 - 50;
        damageNode.y = Math.random() * 100 - 50;
        damageNode.getComponent("DamageAnim").setDamage(damage, bCrit);
    },

    hurt(damage, bDPS, bCrit,isAuto) { // 受伤(播放受伤动画)
        const self = this;
        if (!self._alive) return;
        if (!self._curHP.isZero()) {
            if (damage.isZero()) return;
            if (!bDPS) {
                if (!isAuto||AudioMgr.tgClickEffect) {
                    self.playAnim("Hurt");
                    if (self._curHP.isGreaterThan(damage)) {
                        self.playDamage(Formulas.formatBigNumber(damage), bCrit);
                    } else {
                        self.playDamage(Formulas.formatBigNumber(self._curHP), bCrit);
                    }
                    if (bCrit) {
                        AudioMgr.playBigHit();
                    } else {
                        AudioMgr.playHit();
                    }
                }
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
        self._alive = false;
        self.playAnim("Dieing");
        const func = self._onMonsterDestroy
        const lv = self._lv
        const gold = this._gold
        const isBoss = this._isBoss
        const soul = this._soul
        setTimeout(function() {
            if (!self._isByeBye) {
                if (func) {
                    func(lv, gold, isBoss, soul);
                }
            }
        },150)
    },

    onDieAnimEnd () {
        if (cc.isValid(this.node)) {
            this.node.destroy();
        }
    },

    byebye () { // 上一关下一关调用的，不回调
        this._isByeBye = true;
        if (cc.isValid(this.node)) {
            this.node.destroy();
        }
    },
});
