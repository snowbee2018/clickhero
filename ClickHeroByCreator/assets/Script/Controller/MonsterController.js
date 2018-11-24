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
        hpBar: cc.ProgressBar,
        monsterName: cc.Label,
        hpLabel: cc.Label,
        timeLabel: cc.Label,
        toggle: cc.Toggle,

        _autoNext: false,
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const self = this;
        self.gameController = self.getComponent("GameController");
        self.zoneInfo = self.zoneInfoNode.getComponent("ZoneInfo");
    },

    start () {

    },

    update (dt) {
        const self = this;
        if (self._countdown) {
            self._countdown -= dt;
            if (self._countdown <= 0) {
                delete self._countdown;
                self.setTimeLabel("");
                self.onCountdownFinish();
            } else {
                self.setTimeLabel(self._countdown);
            }
        } else {
            delete self._countdown;
        }
    },

    init () {
        const self = this;
        // 获取存档，初始化关卡和怪物
        var map = DataCenter.KeyMap;
        var monsterCloudInfo = DataCenter.getCloudDataByKey(map.monsterInfo);
        console.log(monsterCloudInfo);
        
        if (monsterCloudInfo) {
            // 云端有数据
            monsterCloudInfo.lv = monsterCloudInfo.lv?parseInt(monsterCloudInfo.lv):1;
            monsterCloudInfo.gold = monsterCloudInfo.gold ? (new BigNumber(monsterCloudInfo.gold)) : false;
            monsterCloudInfo.soul = monsterCloudInfo.soul ? (new BigNumber(monsterCloudInfo.soul)) : false;
            self.killCount = monsterCloudInfo.killCount ? monsterCloudInfo.killCount : 0;
            self.toggle.isChecked = monsterCloudInfo.autoNext ? true : false;
            self._autoNext = self.toggle.isChecked;
            self.makeMonster(monsterCloudInfo.lv, monsterCloudInfo);
        } else {
            // 云端无数据
            self.makeMonster(1);
        }
    },

    formatMonsterInfo() { // 格式化存档数据，用于存储到云端和从云端恢复数据
        const self = this;
        var monsterInfo = self.getCurMonsterInfo();
        var obj = {}
        obj.lv = monsterInfo.lv;
        obj.isTreasureChest = monsterInfo.isTreasureChest;
        obj.isBoss = monsterInfo.isBoss;
        obj.isPrimalBoss = monsterInfo.isPrimalBoss;
        obj.gold = monsterInfo.gold.toExponential(4);
        obj.soul = monsterInfo.soul.toExponential(4);

        obj.killCount = self.killCount;
        obj.autoNext = self.toggle.isChecked;
        return obj;
    },

    goldClick (bGoldClick, goldClickValue) {
        const self = this;
        self._bGoldClick = bGoldClick;
        self._goldClickValue = goldClickValue;
    },

    onCountdownFinish () {
        const self = this;
        if (self.curMonster._isBoss) {
            if (self.curMonster._curHP.gt(0)) {
                WeChatUtil.showToast("打Boss失败了");
                if (DataCenter.isLevelPassed(self.curMonster._lv)) {
                    self.curMonster.recoverHP();
                    self._countdown = 30 + GameData.addBossTimerSecond;
                    self.setTimeLabel(self._countdown);
                } else {
                    self.goToLastLevel();
                    self._autoNext = false;
                    self.toggle.isChecked = self._autoNext;
                }
            }
        }
    },

    onToggleEvent(toggle, customEventData) {
        const self = this;
        // console.log("toggle.isChecked = " + toggle.isChecked);
        self._autoNext = toggle.isChecked;
    },

    setTimeLabel (str) {
        const self = this;
        str = new String(str);
        str = str.substring(0, 4)
        if (str.length > 0) {
            str += "S";
        }
        self.timeLabel.string = str;
    },

    makeMonster(lv, cloudMonsterInfo) {
        const self = this;
        let monsterNode = cc.instantiate(self.monsterPrefab);
        monsterNode.parent = self.monsterPos;
        self.curMonster = monsterNode.getComponent("Monster");
        self.curMonster.setMonsterByLv(
            lv, cloudMonsterInfo,
            self.onCurMonsterDestroy.bind(self),
            self.onHpChange.bind(self),
            self.onClickHert.bind(self)
        );
        self.gameController.updataMonsterInfoDisplay();
        self.setTimeLabel("");
        if (!DataCenter.isLevelPassed(lv)) {
            if (!self.killCount) {
                self.killCount = 1;
            }
        }
        if (self.curMonster._isBoss) { // 开始倒计时
            self._countdown = 30 + GameData.addBossTimerSecond;
            self.setTimeLabel(self._countdown);
        }
        self.zoneInfo.setZonrInfo(lv, self.killCount, self.curMonster._isBoss);
    },

    hit(damage, bDPS, bCrit) {
        const self = this;
        if (cc.isValid(self.curMonster)) {
            self.curMonster.hurt(damage, bDPS, bCrit);
            self.gameController.updataMonsterInfoDisplay();
        }
    },

    onClickHert(lv, gold, isBoss) {
        const self = this;
        if (self._bGoldClick == true) {
            // "3.2e+16"
            self.gameController.onMonsterGold(gold.times(self._goldClickValue));
        }
    },

    onHpChange (name, totalHp, curHp) {
        const self = this;
        self.monsterName.string = name;
        var percent = curHp.div(totalHp).toNumber();
        // console.log("FFFFFFFFFFFFFFFFFFFF");
        // console.log("percent = " + percent);
        self.hpLabel.string = Formulas.formatBigNumber(curHp) + " / " + Formulas.formatBigNumber(totalHp);
        self.hpBar.progress = percent;
    },

    onCurMonsterDestroy (lv, gold, isBoss) {
        const self = this;
        if (!DataCenter.isLevelPassed(lv)) {
            if (isBoss) {
                DataCenter.passLevel(lv);
                if (self._autoNext) {
                    self.goToNextLevel();
                } else {
                    self.makeMonster(lv);
                }
            } else {
                if (self.killCount >= 10) {
                    DataCenter.passLevel(lv);
                    if (self._autoNext) {
                        self.goToNextLevel();
                    } else {
                        self.makeMonster(lv);
                    }
                } else {
                    self.killCount++;
                    self.makeMonster(lv);
                }
            }
        } else {
            if (self._autoNext) {
                self.goToNextLevel();
            } else {
                self.makeMonster(lv);
            }
        }
        
        self.gameController.onMonsterGold(gold);
    },

    getCurMonsterInfo () {
        const self = this;
        return {
            lv: self.curMonster._lv,
            hp: self.curMonster._curHP,
            gold: self.curMonster._gold,
            soul: self.curMonster._soul,
            isTreasureChest: self.curMonster._isTreasureChest,
            isBoss: self.curMonster._isBoss,
            isPrimalBoss: self.curMonster._isPrimalBoss,
        }
    },

    goToLastLevel () {
        const self = this;
        if (self.curMonster._lv > 1) {
            delete self.killCount;
            delete self._countdown;
            var targetLv = self.curMonster._lv - 1;
            self.curMonster.byebye();
            self.makeMonster(targetLv);
        }
    },

    goToNextLevel () {
        const self = this;
        if (DataCenter.isLevelPassed(self.curMonster._lv)) {
            delete self.killCount;
            delete self._countdown;
            var targetLv = self.curMonster._lv + 1;
            self.curMonster.byebye();
            self.makeMonster(targetLv);
        }
    },
});
