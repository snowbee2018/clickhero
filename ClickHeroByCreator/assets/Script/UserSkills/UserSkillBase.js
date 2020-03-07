
cc.Class({
    extends: cc.Component,

    properties: {
        id : 0,
        skillName: "", // 技能名称
        baseValue: 1, // 加成数值
        coolingTime: 0, // 冷却时间，秒
        bSustain: false, // 是否是持续技能
        sustainTime: 0, // 持续时间
        cost: "",
        heroID: 0,
        skillID: 0,

        lock:cc.Node,
        gray: cc.Node,
        skillNameLab: cc.Label,
        describeLab: cc.Label,
        timeLab: cc.Label,
        icon: cc.Sprite,
        bgDuration : cc.Node,
        lbDuration : cc.Label,
        
        _isBuy: false, // 是否已经购买
        _lastTimestamp: 0, // 上次使用技能的时间
        _isActive: true, // 是否已经冷却完成
        _isSustainFinish: true, // 技能持续是否结束
        _coolingCurtail: 0, // 时光穿越技能曹成的冷却缩减
        // _sustainAdd: 0, // 增加的持续时间
    },

    setData(id,skillName,baseValue,coolingTime,bSustain,sustainTime,cost,heroID,skillID,sfIcon){
        this.id = id
        this.skillName = skillName
        this.baseValue = baseValue
        this.coolingTime = coolingTime
        this.bSustain = bSustain
        this.sustainTime = sustainTime
        this.cost = cost
        this.heroID = heroID
        this.skillID = skillID
        console.log("fuck !!!!");
        
        console.log(sfIcon);
        
        this.icon.spriteFrame = sfIcon
    },

    onLoad () {
        const self = this;
        // CloudRes.getSkillIconUrl(self.heroID, self.skillID, function (url) {
        //     if (url) {
        //         cc.loader.load({ url: url, type: 'png' }, function (err, texture) {
        //             if (!err && texture) {
        //                 self.icon.spriteFrame = new cc.SpriteFrame(texture);
        //             }
        //         });
        //     }
        // });
    },

    // start () {},

    // update (dt) {},

    isCanUse () {
        const self = this;
        // console.log("self._isBuy = " + self._isBuy);
        // console.log("self._isActive = " + self._isActive);
        // console.log("self.bSustain = " + self.bSustain);
        // console.log("self._isSustainFinish = " + self._isSustainFinish);
        var result = self._isBuy && self._isActive && ((self.bSustain && self._isSustainFinish) || !self.bSustain);
        // result = result && DataCenter.isGoldEnough(new BigNumber(self.cost));
        return result;
    },

    getSkillDesStr () {
        return "";
    },

    setSkillDes () {
        const self = this;
        self.describeLab.string = self.getSkillDesStr();
    },

    formatUserSkillInfo () {
        const self = this;
        return {
            heroID: self.heroID,
            skillID: self.skillID,
            lastTimestamp: self._lastTimestamp,
            coolingCurtail: self._coolingCurtail
        }
    },

    initUserSkill(cloudSkillInfo) {
        const self = this;
        // 初始化UI
        self.skillNameLab.string = self.skillName;
        self.setSkillDes();
        self.timeLab.string = "";

        if (cloudSkillInfo) {
            // 用存档初始化
            self._isBuy = true; // 是否已经购买
            self._coolingCurtail = cloudSkillInfo.coolingCurtail;
            self._lastTimestamp = cloudSkillInfo.lastTimestamp ? parseInt(cloudSkillInfo.lastTimestamp) : 0; // 上次使用技能的时间            
        } else {
            console.log(HeroDatas.getHero(20).skills[4]);
            
            if (this.skillName=="如意金箍" && HeroDatas.getHero(20).skills[4].isBuy) {
                self._isBuy = true;
                self._coolingCurtail = 0;
                self._lastTimestamp = 0;
            }else if (this.skillName=="观音赐福" && HeroDatas.getHero(22).skills[3].isBuy){
                self._isBuy = true;
                self._coolingCurtail = 0;
                self._lastTimestamp = 0;
            }else if (this.skillName=="筋斗云" && HeroDatas.getHero(23).skills[4].isBuy){
                self._isBuy = true;
                self._coolingCurtail = 0;
                self._lastTimestamp = 0;
            }else{
                self._isBuy = false;
                self._lastTimestamp = 0;
            }
        }

        if (self._isBuy) {
            // 计算技能当前的状态
            var nowTime = Date.parse(new Date());
            // self._isBuy = true;
            // self._lastTimestamp = nowTime;
            var realCoolingTime = self.coolingTime * (1 - self.getCoolingTimeReduction());
            var timeCooling = 1000 * realCoolingTime - nowTime + self._lastTimestamp;
            if (timeCooling - self._coolingCurtail > 0) { // 技能还在冷却过程中
                self._isActive = false;
                // var timeStr = self.dateFormat(timeCooling / 1000);
                // self.onCoolingCountDown(timeCooling / 1000, timeStr);
                this._scheCallback = self.skillScheduleCallBack.bind(this)
                PublicFunc.schedule(this._scheCallback, 0.5);
            } else { // 技能已经冷却
                self._isActive = true;
                self._coolingCurtail = 0;
                self.onCoolingDone();
            }
        } else {
            self._isActive = true;
            self._coolingCurtail = 0;
        }

        // 重新打开游戏的时候默认技能持续已经结束，不保留技能使用效果
        self._isSustainFinish = true;
        // self.gray.active = !self.isCanUse();
        this.setLock()

        // Events.on(Events.ON_GOLD_CHANGE, self.onGoldChange, self);
        Events.on(Events.ON_USER_SKILL_UNLOCK, self.onSkillUnlock, self);
        Events.on(Events.ON_UPGRADE_ANCIENT, self.onUpgrandAncient, self);
        Events.on(Events.ON_EQUIP_UPDATE, self.onEquip, self);
    },

    skillScheduleCallBack () {
        const self = this;
        if (!self._isBuy) return;
        if (self._isActive) {
            // PublicFunc.unschedule(this._scheCallback);
        } else {
            var nowTime = Date.parse(new Date());
            var realCoolingTime = self.coolingTime * (1 - self.getCoolingTimeReduction());
            var timeCooling = 1000 * realCoolingTime - nowTime + self._lastTimestamp;
            if (timeCooling - self._coolingCurtail > 0) {
                var timeStr = self.dateFormat((timeCooling-self._coolingCurtail) / 1000);
                // console.log("timeStr = " + timeStr);
                self.onCoolingCountDown((timeCooling-self._coolingCurtail) / 1000, timeStr);
            } else {
                self._isActive = true;
                self._coolingCurtail = 0;
                self.onCoolingDone();
                // self.gray.active = !self.isCanUse();
                this.setLock()
                if (!self.gray.active) {
                    PublicFunc.unschedule(this._scheCallback);
                }
            }
        }

        if (self.bSustain) {
            if (self._isSustainFinish) {
            } else {
                var nowTime = Date.parse(new Date());
                var realSustainTime = self.sustainTime + self.getSustainTimeAdded();
                var timeSustain = 1000 * realSustainTime - nowTime + self._lastTimestamp;
                if (timeSustain > 0) {
                    this.bgDuration.active = true
                    this.lbDuration.string = (timeSustain / 1000)+'s'
                    // var timeStr = self.dateFormat(timeSustain / 1000);
                    // self.onSustainCountDown(timeSustain / 1000, timeStr);
                } else {
                    this.bgDuration.active = false
                    self._isSustainFinish = true;
                    self.backout();
                    // self.gray.active = !self.isCanUse();
                    this.setLock()
                }
            }
        } else {
            this.setLock()
        }
    },

    onUpgrandAncient(id) {
        const self = this;
        switch (true) {
            case (id == 6 && self.heroID == 0 && self.skillID == 1): // 猴子猴孙
            case (id == 3 && self.heroID == 2 && self.skillID == 3): // 三头六臂
            case (id == 25 && self.heroID == 9 && self.skillID == 4): // 暴击风暴(暴击风暴)
            case (id == 10 && self.heroID == 13 && self.skillID == 4): // 金属(金币)探测器
            case (id == 15 && self.heroID == 15 && self.skillID == 4): // 点石成金(点金手)
            case (id == 22 && self.heroID == 15 && self.skillID == 4): // 点石成金倍数
            case (id == 13 && self.heroID == 20 && self.skillID == 4): // 如意金箍
            case (id == 26): // 技能冷却减少
                self.setSkillDes();
                break;
            default:
                break;
        }
    },

    onEquip(){
        const v = GameData.eqSkill[this.id] || 0
        if (this.eqValue != v) {
            this.eqValue = v
            this.setSkillDes();
        }
    },

    // onGoldChange () {
    //     const self = this;
    //     self.gray.active = !self.isCanUse();
    // },

    onSkillUnlock(skillInfo) {
        console.log("onSkillUnlock");
        console.log(skillInfo);
        console.log(this.heroID + " " + this.skillID);
        
        const self = this;        
        if (skillInfo.heroID == self.heroID) {
            if (skillInfo.skillID == self.skillID) {
                self._isBuy = true;
                if (self.heroID == 17 && self.skillID == 3&&this._lastTimestamp && this._lastTimestamp > 0) {
                    console.log("_lastTimestamp:"+this._lastTimestamp);
                    // 计算技能当前的状态
                    var nowTime = Date.parse(new Date());
                    // self._isBuy = true;
                    // self._lastTimestamp = nowTime;
                    var realCoolingTime = self.coolingTime * (1 - self.getCoolingTimeReduction());
                    var timeCooling = 1000 * realCoolingTime - nowTime + self._lastTimestamp;
                    if (timeCooling - self._coolingCurtail > 0) { // 技能还在冷却过程中
                        self._isActive = false;
                        this._scheCallback = self.skillScheduleCallBack.bind(this)
                        PublicFunc.schedule(this._scheCallback, 0.5);
                    } else { // 技能已经冷却
                        self._isActive = true;
                        self._coolingCurtail = 0;
                        self.onCoolingDone();
                    }
                }
                this.setLock()
            }
        }
    },
    setLock(){
        this.gray.active = !this.isCanUse();
        this.lock.active = !this._isBuy
    },

    dateFormat (second) {
        const self = this;
        var dd, hh, mm, ss;
        second = typeof second === 'string' ? parseInt(second) : second;
        if (!second || second < 0) {
            return;
        }
        var result = "";
        //天
        dd = second / (24 * 3600) | 0;
        if (dd > 0) {
            second = Math.round(second) - dd * 3600;
            result += dd + "天";
        }
        //小时
        hh = second / 3600 | 0;
        if (hh > 0) {
            second = Math.round(second) - hh * 3600;
            result += hh + "时";
        }
        //分
        mm = second / 60 | 0;
        if (mm > 0) {
            second = Math.round(second) - mm * 60;
            result += mm + "分";
        }
        //秒
        ss = Math.round(second);
        if (ss > 0) {
            // ss = Math.round(second) - mm * 60;
            result += ss + "秒";
        }
        
        return result;
    },

    setCoolingCurtail (value) {
        const self = this;
        if (value > 0) {
            self._coolingCurtail = value;
        }
    },

    getSustainTimeAdded() { // 获取技能持续附加时间
        const self = this;
        switch (true) {
            case (self.heroID == 0 && self.skillID == 1): // 猴子猴孙
                return GameData.addClickstormSecond;
            case (self.heroID == 2 && self.skillID == 3): // 三头六臂
                return GameData.addPowersurgeSecond;
            case (self.heroID == 9 && self.skillID == 4): // 暴击风暴(暴击风暴)
                return GameData.addCritStormSecond;
            case (self.heroID == 13 && self.skillID == 4): // 金属(金币)探测器
                return GameData.addMetalDetectorSecond;
            case (self.heroID == 15 && self.skillID == 4): // 点石成金(点金手)
                return GameData.addGoldClickSecond;
            case (self.heroID == 20 && self.skillID == 4): // 如意金箍
                return GameData.addSuperClickSecond;
            default:
                return 0;
        }
    },

    getCoolingTimeReduction () { // 获取技能冷却附加时间
        return GameData.addSkillCoolReduction;
    },

    releaseSkill () { // 释放技能
        const self = this;
        if (!self.isCanUse()) return;
        self._isActive = false;
        if (self.bSustain) {
            self._isSustainFinish = false;
        }
        self._coolingCurtail = 0;
        self.appply();
        self._lastTimestamp = Date.parse(new Date());
        // console.log("self._lastTimestamp = " + self._lastTimestamp);
        self.onCoolingCountDown(self.coolingTime, self.dateFormat(self.coolingTime));
        if (self.bSustain) {
            self.onSustainCountDown(self.sustainTime, self.dateFormat(self.sustainTime));
        }
        // DataCenter.consumeGold(new BigNumber(self.cost));
        this._scheCallback = self.skillScheduleCallBack.bind(this)
        PublicFunc.schedule(this._scheCallback, 0.5);
    },

    onCoolingCountDown(time, timeStr) {
        const self = this;
        // console.log("onCoolingCountDown, timeStr = " + timeStr);
        self.timeLab.string = timeStr;
    }, // 冷却倒计时，参数是剩余时间

    onSustainCountDown(time, timeStr) {
        // pass
    }, // 持续时间倒计时

    onItemClick() {
        const self = this;
        AudioMgr.playBtn();
        self.releaseSkill();
    },

    onCoolingDone() {
        const self = this;
        self.timeLab.string = "";
    }, // 冷却完成

    appply() { }, // 应用技能
    backout() { }, // 撤销技能效果

    rebirth(isReset) {
        PublicFunc.unscheduleAllCallbacks();
        if (this.bSustain && !this._isSustainFinish) this.backout();
        this.onCoolingDone();
        Events.off(Events.ON_USER_SKILL_UNLOCK, this.onSkillUnlock, this);
        Events.off(Events.ON_UPGRADE_ANCIENT, this.onUpgrandAncient, this);
        Events.off(Events.ON_EQUIP_UPDATE, this.onEquip, this);
        let time = this._lastTimestamp
        let cooltime = this._coolingCurtail
        this.initUserSkill();
        if (!isReset && this.heroID == 17 && this.skillID == 3) {
            this._lastTimestamp = time
            this._coolingCurtail = cooltime
        }
    },
});
