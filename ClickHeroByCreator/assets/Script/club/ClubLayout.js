/*
 * @Author: xj 
 * @Date: 2019-08-06 23:23:15 
 * @Last Modified by: xj
 * @Last Modified time: 2019-08-14 23:46:32
 */
var zoneCfg = require("ZoneCfg")
cc.Class({
    extends: cc.Component,

    properties: {
        spHead : cc.Sprite,
        lbName : cc.Label,
        pbExp : cc.ProgressBar,
        lbExpProgress : cc.Label,
        btnSignin : cc.Button,
        lbSignin : cc.Label,
        spBoss : cc.Sprite,
        pbBlood : cc.ProgressBar,
        lbBloodProgress : cc.Label,
        lbBossName : cc.Label,
        btnBoss : cc.Node,
        lbClick : cc.Label,
        lbBtnBoss : cc.Label,
        vInfo : cc.Node,
        vPreInfo : cc.Node,
        btnChat : cc.Node,
        btnMember : cc.Node,
        btnJoin : cc.Node,
        btnEdit : cc.Node,
        pfJoinList : cc.Prefab,
        pfClubChat : cc.Prefab,
        pfBoss : cc.Prefab,
        lbJoin : cc.Label,
        lbMember : cc.Label,
    },

    setClub(data){
        this.club = data
        PublicFunc.setClubLogo(this.spHead,data.logoid)
        this.bindInfo()
        let member
        data.members.forEach(e => {
            if (e._openid == HttpUtil.openid) {
                member = e
            }
        });
        if (member.signinDate == PublicFunc.getDateStr()) {
            this.lbSignin.string = "已签到"
            this.btnSignin.interactable = false
        } else {
            this.lbSignin.string = "签到"
            this.btnSignin.interactable = true
        }
        this.bindBoss()
        // vInfo
        this.bindBossInfo(true)
        this.bindBossInfo(false)
        this.refreshBtn()
        data.members.forEach(e => {
            if (e._openid == HttpUtil.openid) {
                this.isLeader = e.isLeader || false
            }
        });
        this.btnJoin.active = this.isLeader
        this.btnEdit.active = this.isLeader
    },

    refreshBtn(){
        this.lbJoin.string = "加入申请" + "("+this.club.joinList.length+")"
        this.lbMember.string = "成员" + "("+this.club.members.length+"/"+this.club.maxSeat+")"
    },

    bindBoss(){
        const self = this
        // boss
        let boss = this.club.boss
        var zoneObj = zoneCfg[boss.zoneid];
        this.lbBossName.string = zoneObj.bossName
        var clickDamage = DataCenter.getCloudDataByKey(DataCenter.KeyMap.maxPassLavel)+1
        this.lbClick.string = "点击伤害："+clickDamage
        CloudRes.getBossUrl(zoneObj.resNum, function (url) {
            if (url) {
                cc.loader.load({ url: url, type: 'png' }, function (err, texture) {
                    if (!err && texture && cc.isValid(self.node)) {
                        let scale = 240 / texture.height
                        texture.width = texture.width * scale
                        texture.height = texture.height * scale
                        self.spBoss.spriteFrame = new cc.SpriteFrame(texture);
                    }
                });
            }
        });
        this.pbBlood.progress = boss.hp / boss.thp
        this.lbBloodProgress.string = boss.hp + "/" + boss.thp
        if (boss.isDied) {
            this.btnBoss.active = false
        } else {
            this.btnBoss.active = true
            this.btnBoss.getComponent(cc.Button).interactable = true
            this.lbBtnBoss.string = "开战！"
            boss.damages.forEach(e => {
                if (e._openid == HttpUtil.openid) {
                    if (e.lastTime > Date.now() - 30 * 60 * 1000) {
                        let min = 30 - Math.floor((Date.now() - e.lastTime) / 1000 / 60)
                        this.lbBtnBoss.string = min.toFixed(0) + "分钟后再战"
                        this.btnBoss.getComponent(cc.Button).interactable = false
                    }
                }
            });
        }
    },

    bindInfo(){
        let data = this.club
        this.lbName.string = data.name + " Lv" + data.level
        this.pbExp.progress = data.exp / data.maxExp
        this.lbExpProgress.string = data.exp + "/" + data.maxExp
    },

    bindBossInfo(isToday){
        const boss = isToday ? this.club.boss : this.club.preBoss
        let v = isToday ? this.vInfo : this.vPreInfo
        let lbFinish = v.getChildByName("lbFinish")
        let lbSoul = v.getChildByName("lbSoul")
        let lbDamage = v.getChildByName("lbDamage")
        let lbMaxDamage = v.getChildByName("lbMaxDamage")
        let btnGet = v.getChildByName("btnGet")
        if (boss) {
            let str = isToday ? "今日：" : "昨天："
            str += boss.isDied? "已击败" : "未击败"
            lbFinish.getComponent(cc.Label).string = str
            let isGet = false
            for (let i = 0; i < boss.getOpenids.length; i++) {
                const openid = boss.getOpenids[i];
                if (openid == HttpUtil.openid) {
                    isGet = true
                }
            }
            if (isGet) {
                lbSoul.getComponent(cc.Label).string = "击败奖励：已领取"
                btnGet.active = false
                v.getComponent(cc.Button).interactable = false
            } else {
                let soulStr = isToday ?Formulas.formatBigNumber(PublicFunc.getBagSoul().times(0.08).integerValue().plus(1)) + "仙丹" : ""
                lbSoul.getComponent(cc.Label).string = "击败奖励："+soulStr
                btnGet.active = boss.isDied
                v.getComponent(cc.Button).interactable = boss.isDied
            }
            let thp = boss.thp
            let myDamage = 0
            let maxDamage = null
            boss.damages.forEach(e => {
                if (e._openid == HttpUtil.openid) {
                    myDamage = e.damage
                }
                if (!maxDamage||e.damage > maxDamage.damage) {
                    maxDamage = e
                    maxDamage.nickname = ""
                    this.club.members.forEach(m => {
                        if (m._openid == maxDamage._openid) {
                            maxDamage.nickname = m.nickname
                        }
                    });
                }
            });
            lbDamage.getComponent(cc.Label).string = "我造成伤害："+(myDamage / thp*100).toFixed(2) + "%"
            lbMaxDamage.getComponent(cc.Label).string = "最高伤害："+(maxDamage? maxDamage.nickname+"("+(maxDamage.damage / thp*100).toFixed(2)+"%)" : "")
        } else {
            v.getComponent(cc.Button).interactable = false
            lbFinish.getComponent(cc.Label).string = isToday ? "今日：" : "昨天："
            lbSoul.getComponent(cc.Label).string = "击败奖励："
            lbDamage.getComponent(cc.Label).string = "我造成伤害："
            lbMaxDamage.getComponent(cc.Label).string = "最高伤害："
            btnGet.active = false
        }
    },

    clickSignin(){
        HttpUtil.request("clubSignin",null,function(b,result) {
            let data = result.data
            if (b&&data) {
                PublicFunc.toast("签到成功 经验+"+data.addExp)
                this.club.exp = data.exp
                this.club.maxExp = data.maxExp
                this.club.level = data.level
                this.club.maxSeat = data.maxSeat
                this.lbMember.string = "成员" + "("+this.club.members.length+"/"+data.maxSeat+")"
                this.bindInfo()
                this.btnSignin.interactable = false
                this.lbSignin.string = "已签到"
                let i = Math.min(this.club.level-1,5)
                const ruby = [20,30,40,50,60][i]
                PublicFunc.popGoldDialog(2,ruby,"签到奖励",true)
            } else {
                PublicFunc.toast("签到失败")
            }
        }.bind(this))
    },

    clickFight(){
        const v = cc.instantiate(this.pfBoss)
        v.parent = cc.director.getScene();
        v.x = cc.winSize.width / 2;
        v.y = cc.winSize.height / 2;
        v.getComponent("ClubBoss").setBoss(this.club.boss,function(boss) {
            if (boss) {
                this.club.boss = boss
                this.bindBoss()
                this.bindBossInfo(true)
            }
        }.bind(this))
        this.btnBoss.getComponent(cc.Button).interactable = false
    },

    clickGetSoul(){
        HttpUtil.request("getBossSoul",{isToday:1},function(b,data) {
            if (b&&data.boss) {
                this.club.boss = data.boss
                this.bindBossInfo(true)
                let times = 0.08
                let soul = PublicFunc.getBagSoul().times(times).integerValue().plus(1)
                PublicFunc.popGoldDialog(1,soul,"击败Boss奖励",true)
            } else {
                this.lbTime.string = "请求失败"
            }
        }.bind(this))
    },

    clickGetPreSoul(){
        HttpUtil.request("getBossSoul",{isToday:0},function(b,data) {
            if (b&&data.boss) {
                this.club.preBoss = data.boss
                this.bindBossInfo(false)
                let times = 0.05
                let soul = PublicFunc.getBagSoul().times(times).integerValue().plus(1)
                PublicFunc.popGoldDialog(1,soul,"击败Boss奖励",true)
            } else {
                this.lbTime.string = "请求失败"
            }
        }.bind(this))
    },

    clickChat(){
        const v = cc.instantiate(this.pfClubChat)
        v.parent = cc.director.getScene();
        v.x = cc.winSize.width / 2;
        v.y = cc.winSize.height / 2;
        v.getComponent("ClubChat").setData([
            {nickname:"少时",content:"请听到逼的一声后留言"},
            {nickname:"XXXX",content:"HAHAHAHAHAH HAHAHAHA"},
            {nickname:"DAFDS",content:"THIS IS MY ALL"},
            {nickname:"MARY",content:"HERO IN THE ......"},
        ])
    },

    clickMember(){
        PublicFunc.showClubInfo(this.club,this)
    },

    clickJoin(){
        const v = cc.instantiate(this.pfJoinList)
        v.parent = cc.director.getScene();
        v.x = cc.winSize.width / 2;
        v.y = cc.winSize.height / 2;
        v.getComponent("ClubJoinList").setClub(this.club,this)
    },

    clickEdit(){
        PublicFunc.toast("功能还未开放")
    },

    onFree(){
        this.finish()
    },

    onLoad(){
        Events.on(Events.ON_CLUB_EXIT, this.onFree, this);
    },

    onDestroy(){
        Events.off(Events.ON_CLUB_EXIT, this.onFree, this);
    },

    finish(){
        this.node.destroy()
    },

})