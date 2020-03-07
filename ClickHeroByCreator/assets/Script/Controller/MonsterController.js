
cc.Class({
    extends: cc.Component,

    properties: {
        monsterPos: cc.Node,
        monsterPrefab: cc.Prefab,
        zoneInfoNode: cc.Node,
        hpBar: cc.ProgressBar,
        monsterName: cc.Label,
        monsterSoul: cc.Label,
        hpLabel: cc.Label,
        timeLabel: cc.Label,
        toggle: cc.Toggle,

        _autoNext: true,
        goldAnimFb: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const self = this;
        self.gameController = self.getComponent("GameController");
        self.zoneInfo = self.zoneInfoNode.getComponent("ZoneInfo");
        this.nodePool = [] // 对象池
    },

    playGoldAnim(numStr) {
        const self = this;
        var node = cc.instantiate(self.goldAnimFb);
        node.parent = self.monsterPos;
        node.zIndex = 100;
        node.x = Math.random() * 100 - 50;
        node.y = Math.random() * 200;
        node.getComponent("GoldAnim").setNum(numStr);
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
            monsterCloudInfo.gold = monsterCloudInfo.gold ? (newBigNumber(monsterCloudInfo.gold)) : false;
            monsterCloudInfo.soul = monsterCloudInfo.soul ? (newBigNumber(monsterCloudInfo.soul)) : false;
            self.killCount = monsterCloudInfo.killCount ? monsterCloudInfo.killCount : 0;
            self.monsterCount = monsterCloudInfo.monsterCount ? monsterCloudInfo.monsterCount : 10;
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
        obj.lv = monsterInfo.lv || DataCenter.getDataByKey(DataCenter.KeyMap.passLavel)
        obj.isTreasureChest = monsterInfo.isTreasureChest;
        obj.isBoss = monsterInfo.isBoss;
        obj.isPrimalBoss = monsterInfo.isPrimalBoss;
        obj.bossFlag = monsterInfo.bossFlag
        try {
            obj.gold = monsterInfo.gold.toExponential(4);
            obj.soul = monsterInfo.soul.toExponential(4);
        } catch (error) {
            console.error(error);
        }

        obj.killCount = self.killCount;
        obj.monsterCount = self.monsterCount;
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
                // WeChatUtil.showToast("打Boss失败了");
                if (!this.noMoreReminders) {
                    // 弹出对话框
                    PublicFunc.popDialog({
                        contentStr: '温馨提示，你未在时限内击败妖怪，回到之前的关卡，打小怪，得金币，升级你的英雄，提高他们的攻击力，再回来挑战Boss吧。',
                        btnStrs: {
                            mid: '确 定',
                        },
                        toggle: {
                            bShow: true,
                            str: '不再提醒',
                            checked: false,
                        },
                        onTap: function (dialog, bSure) {
                            let isChecked = dialog.toggle.isChecked;
                            console.log('isChecked = ' + isChecked);
                            this.noMoreReminders = isChecked;
                        }.bind(this),
                    });
                }
                
                if (DataCenter.isLevelPassed(self.curMonster._lv)) {
                    self.curMonster.recoverHP();
                    self._countdown = GameData.getBossTimerSecond()
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
        // 搞个对象池
        let monsterNode
        if (this.nodePool.length > 0) {
            monsterNode = this.nodePool.pop()
        } else {
            monsterNode = cc.instantiate(self.monsterPrefab);
        }
        // if (this.monsterPos.childrenCount > 2) {
        //     this.monsterPos.removeAllChildren()
        // }
        monsterNode.parent = self.monsterPos;
        self.hideTalkBubble();

        self.curMonster = monsterNode.getComponent("Monster");
        this.curMonster.setCtrl(this)
        self.curMonster.setMonsterByLv(
            lv, cloudMonsterInfo,
            self.onCurMonsterDestroy.bind(self),
            self.onHpChange.bind(self),
            self.onClickHert.bind(self),
            self.talk.bind(self)
        );
        self.gameController.updataMonsterInfoDisplay();
        self.setTimeLabel("");
        if (!DataCenter.isLevelPassed(lv)) {
            if (!self.killCount) {
                self.killCount = 1;
            }
        }
        if (self.curMonster._isBoss) { // 开始倒计时
            self._countdown = GameData.getBossTimerSecond()
            self.setTimeLabel(self._countdown);
        }
        self.monsterCount = GameData.getZoneMonsterCount(lv);
        
        self.zoneInfo.setZonrInfo(lv, self.killCount,this.monsterCount, self.curMonster._isBoss);
        if (self.curMonster._isBoss) {
            self.monsterPos.scale = 1.2;
        } else {
            self.monsterPos.scale = 1;
        }
        if (!self.lastMonsterType) {
            if (self.curMonster._isBoss) {
                AudioMgr.playBoss();
            } else {
                AudioMgr.playBG();
            }
        } else {
            if (self.lastMonsterType == 'boss' && !self.curMonster._isBoss) {
                AudioMgr.playBG();
            } else if (self.lastMonsterType == 'normal' && self.curMonster._isBoss) {
                AudioMgr.playBoss();
            }
        }
        if (self.curMonster._isPrimalBoss) {
            this.monsterSoul.node.active = true
            this.monsterSoul.string = Formulas.formatBigNumber(this.curMonster._soul)+"仙丹"
        } else if(self.curMonster._isTreasureChest){
            this.monsterSoul.node.active = true
            this.monsterSoul.string = PublicFunc.numToStr(10 * GameData.getTreasureTimes()) + "倍金币"
        } else {
            this.monsterSoul.node.active = false
        }
        self.lastMonsterType = self.curMonster._isBoss ? 'boss' : 'normal';
        self.lastMakeTime = Date.now()
    },

    onMonsterOut(node){
        node.active = false
        node.parent = null
        this.nodePool.push(node)
    },

    hit(damage, bDPS, bCrit, isAuto) {
        const self = this;
        if (cc.isValid(self.curMonster)) {
            self.curMonster.hurt(damage, bDPS, bCrit , isAuto);
            // self.gameController.updataMonsterInfoDisplay();
        }
    },

    bleed (damage) {
        const self = this;
        if (cc.isValid(self.curMonster)) {
            self.curMonster.bleed(damage);
            self.gameController.updataMonsterInfoDisplay();
        }
    },

    onClickHert(lv, gold, isBoss) {
        const self = this;
        if (self._bGoldClick == true) {
            // "3.2e+16"
            // if (isBoss) {
            //     gold = gold.div(10)
            // }
            self.gameController.onMonsterGold(gold.times(self._goldClickValue));
        }
    },

    onHpChange (name, totalHp, curHp) {
        const self = this;
        self.monsterName.string = name;
        var percent = curHp.div(totalHp).toNumber();
        self.hpLabel.string = Formulas.formatBigNumber(curHp) + " / " + Formulas.formatBigNumber(totalHp);
        self.hpBar.progress = percent;
    },

    onCurMonsterDestroy (lv, gold, isBoss, soul,isGolden) {
        const self = this;
        if (!DataCenter.isLevelPassed(lv)) {
            if (isBoss) {
                DataCenter.passLevel(lv);
                if (self._autoNext) {
                    self.autoNextLevel();
                } else {
                    self.makeMonster(lv);
                }
            } else {
                if (self.killCount >= this.monsterCount) {
                    DataCenter.passLevel(lv);
                    if (self._autoNext) {
                        self.autoNextLevel();
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
                self.autoNextLevel();
            } else {
                self.makeMonster(lv);
            }
        }
        
        self.gameController.onMonsterGold(gold);
        
        if (soul && soul.isGreaterThan(0)) {
            self.gameController.onMonsterSoul(soul);
        }
        if (isGolden) {
            self.gameController.addRandomGolden()
        }
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
            bossFlag : self.curMonster.getBossFlag()
        }
    },

    goToLastLevel () {
        const self = this;
        AudioMgr.playBtn();
        if (self.curMonster._lv > 1) {
            delete self.killCount;
            delete self._countdown;
            const lv = DataCenter.getDataByKey(DataCenter.KeyMap.passLavel) + 1
            var targetLv = 1
            if (self.curMonster._lv > lv) {
                targetLv = lv
                this.monsterPos.removeAllChildren()
            } else {
                targetLv = self.curMonster._lv - 1;
            }
            self.curMonster.byebye();
            self.makeMonster(targetLv);
        }
    },

    autoNextLevel(){
        const self = this;
        // 如果秒杀 要判断 是否跳关，根据maxpasslevel
        console.log(self.lastMakeTime );
        
        if (self.lastMakeTime && Date.now() - self.lastMakeTime < 1000) {
            let maxlv = DataCenter.getDataByKey(DataCenter.KeyMap.maxLvNew);
            let lv = self.curMonster._lv
            if (maxlv >= 1000 && lv<= maxlv / 4) {
                lv += 5 - (lv % 5)
                delete self.killCount;
                delete self.monsterCount;
                delete self._countdown;
                var targetLv = lv
                self.curMonster.byebye();
                self.makeMonster(targetLv);
                return
            }
        }
        this.goToNextLevel()
    },

    goToNextLevel () {
        const self = this;
        AudioMgr.playBtn();
        if (DataCenter.isLevelPassed(self.curMonster._lv)) {
            delete self.killCount;
            delete self.monsterCount;
            delete self._countdown;
            var targetLv = self.curMonster._lv + 1;
            self.curMonster.byebye();
            self.makeMonster(targetLv);
        }
    },

    rebirth() {
        const self = this;
        delete self.killCount;
        delete self.monsterCount;
        delete self._countdown;
        self.curMonster.byebye();
        self.makeMonster(1);
    },

    moveUp () {
        const self = this;
        if (cc.isValid(self.monsterPos)) {
            self.monsterPos.parent.stopAllActions();
            self.monsterPos.parent.runAction(cc.moveTo(0.15, cc.v2(0, 0)));
        }
    },

    moveDown() {
        const self = this;
        if (cc.isValid(self.monsterPos)) {
            self.monsterPos.parent.stopAllActions();
            self.monsterPos.parent.runAction(cc.moveTo(0.15, cc.v2(0, -220)));
        }
    },

    talk (contentStr) {
        const self = this;
        var arr = contentStr.split(" ");
        var lStr = arr[1];
        var rStr = arr[0];
        if(!lStr || !rStr)  
        {

        }
        var bubbleLeft = self.monsterPos.parent.getChildByName('BubbleLeft');
        var contentLabLeft = bubbleLeft.getChildByName('contentLab');
        contentLabLeft.getComponent(cc.Label).string = lStr;
        var bubbleRight = self.monsterPos.parent.getChildByName('BubbleRight');
        var contentLabRight = bubbleRight.getChildByName('contentLab');
        contentLabRight.getComponent(cc.Label).string = rStr;

        bubbleLeft.stopAllActions();
        bubbleRight.stopAllActions();
        bubbleLeft.active = true;
        bubbleLeft.scale = 0;
        bubbleRight.active = true;
        bubbleRight.scale = 0;
        bubbleLeft.runAction(cc.sequence(
            cc.delayTime(0.2),
            cc.scaleTo(0.15, 1),
            cc.delayTime(4),
            cc.scaleTo(0.15, 0),
            cc.callFunc(function () {
                self.hideTalkBubble();
            })
        ));
        bubbleRight.runAction(cc.sequence(
            cc.scaleTo(0.15, 1),
            cc.delayTime(4),
            cc.scaleTo(0.15, 0),
            cc.callFunc(function () {
                self.hideTalkBubble();
            })
        ));
    },

    hideTalkBubble () {
        const self = this;
        let bubbleLeft = self.monsterPos.parent.getChildByName('BubbleLeft');
        var bubbleRight = self.monsterPos.parent.getChildByName('BubbleRight');
        bubbleLeft.active = false;
        bubbleRight.active = false;
    },
});
