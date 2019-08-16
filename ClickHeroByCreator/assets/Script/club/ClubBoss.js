/*
 * @Author: xj 
 * @Date: 2019-08-12 13:43:31 
 * @Last Modified by: xj
 * @Last Modified time: 2019-08-12 17:31:33
 */
var zoneCfg = require("ZoneCfg")
cc.Class({
    extends: cc.Component,

    properties: {
        lbName : cc.Label,
        lbTime : cc.Label,
        lbClick : cc.Label,
        lbDamage : cc.Label,
        spBoss : cc.Node,
        pbBlood : cc.ProgressBar,
        lbBloodProgress : cc.Label,
        clickLight : cc.Prefab,
        btnClose : cc.Node,
    },

    onLoad(){
    },

    setBoss(boss,callback){
        this.boss = boss
        this.callback = callback
        var zoneObj = zoneCfg[boss.zoneid];
        this.lbName.string = zoneObj.bossName
        CloudRes.getBossUrl(zoneObj.resNum, function (url) {
            if (url) {
                cc.loader.load({ url: url, type: 'png' }, function (err, texture) {
                    if (!err && texture && cc.isValid(this.node)) {
                        let scale = 300 / texture.height
                        texture.width = texture.width * scale
                        texture.height = texture.height * scale
                        this.spBoss.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                    }
                }.bind(this));
            }
        }.bind(this));
        this.pbBlood.progress = boss.hp / boss.thp
        this.lbBloodProgress.string = boss.hp + "/" + boss.thp
        var lv = DataCenter.getCloudDataByKey(DataCenter.KeyMap.maxPassLavel);
        this.clickDamage = lv + 1
        this.myDamage = 0
        this.endtime = Date.now() + 30*1000
        this.isEnd = false
        this.lbClick.string = "点击伤害："+this.clickDamage
        this.lbDamage.string = "我造成的伤害："+0
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
    },

    upDamge(){
        HttpUtil.request("upDamage",{damage:this.myDamage},function(b,data) {
            if (b&&data.boss&&this.callback) {
                this.callback(data.boss)
                this.callback = null
            } else {
                this.lbTime.string = "同步数据失败，请退出重试"
            }
            this.btnClose.active = true
        }.bind(this))
    },

    onTouchStart(event){
        if (this.isEnd!=false) {
            return
        }
        let pos = event.getLocation();
        this.spBoss.runAction(cc.sequence(
            cc.scaleTo(0.1,1.24,0.6),
            cc.scaleTo(0.1,0.6,1.24),
            cc.scaleTo(0.1,1.24,0.6),
            cc.scaleTo(0.1,1,1),
        ))
        this.showClickLight(pos)
        this.myDamage += this.clickDamage
        this.lbDamage.string = String("我造成的伤害："+this.myDamage)
        this.pbBlood.progress = Math.max(this.boss.hp-this.myDamage,0) / this.boss.thp
        this.lbBloodProgress.string = Math.max(this.boss.hp-this.myDamage,0) + "/" + this.boss.thp
        if (this.boss.hp<=this.myDamage) {
            this.lbTime.string = "已击败！"
            this.isEnd = true
            this.upDamge()
            return
        }
    },

    update(dt){
        if (this.isEnd!=false) {
            return
        }
        let countdown = this.endtime - Date.now()
        if (countdown<= 0) {
            this.lbTime.string = "时间到！"
            this.isEnd = true
            this.upDamge()
            return
        }
        this.lbTime.string = (countdown/1000).toFixed(2) + "秒"
    },

    showClickLight(pos){
        let light = cc.instantiate(this.clickLight)
        if (this.node) {
            light.parent = this.node
        }
        light.x = pos.x - cc.winSize.width / 2
        light.y = pos.y - cc.winSize.height / 2
        var anim = light.getComponent(cc.Animation)
        anim.play("click")
        let onStop = function() {
            anim.off('stop', onStop)
            light.removeFromParent()
        }
        anim.on('stop', onStop)
    },

    finish(){
        this.node.destroy()
    },
    onDestroy(){
    },
})