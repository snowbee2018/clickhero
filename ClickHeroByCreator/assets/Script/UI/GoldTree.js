
cc.Class({
    extends: cc.Component,

    properties: {
        lbName : cc.Label,
        lbTime : cc.Label,
        spTree : cc.Node,
        clickLight : cc.Prefab,
        btnClose : cc.Node,
        sfArr : [cc.SpriteFrame],// 2种图片
        ndImgs : cc.Node,
    },

    onLoad(){
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.isEnd=false
        this.poptime = 0
        this.interval = 0
        this.endtime = Date.now() + 30*1000
        // 生成一个奖励列表
        this.tickets = []
        this.createTickets()
    },

    createTickets(){
        const rubys0 = [500,1000,2000,3000]
        const rubys1 = [5000,10000,24000,50000,100000]
        let ruby
        const r0 = Math.random()
        if (r0<=0.4) {
            ruby = rubys0[0]
        } else if (r0<=0.8) {
            ruby = rubys0[1]
        } else if (r0 <= 0.9) {
            ruby = rubys0[2]
        } else {
            ruby = rubys0[3]
        }
        this.tickets[0] = {
            index : Math.ceil(Math.random()*20),
            ruby : ruby
        }
        const r1 = Math.random()
        if (r1<=0.4) {
            ruby = rubys0[0]
        } else if (r1<=0.8) {
            ruby = rubys0[1]
        } else if (r1 <= 0.9) {
            ruby = rubys0[2]
        } else {
            ruby = rubys0[3]
        }
        this.tickets[1] = {
            index : Math.ceil(Math.random()*20+20),
            ruby : ruby
        }
        const r2 = Math.random()
        if (r2<=0.4) {
            ruby = rubys1[0]
        } else if (r2<=0.8) {
            ruby = rubys1[1]
        } else if (r2 <= 0.9) {
            ruby = rubys1[2]
        } else if (r2 <= 0.97) {
            ruby = rubys1[3]
        } else {
            ruby = rubys1[4]
        }
        this.tickets[2] = {
            index : Math.ceil(Math.random()*10+25),
            ruby : ruby
        }
        console.log(this.tickets);
        
    },

    onTouchStart(event){
        if (this.isEnd!=false) {
            return
        }
        let pos = event.getLocation();
        this.spTree.runAction(cc.sequence(
            cc.scaleTo(0.1,1.24,0.6),
            cc.scaleTo(0.1,0.6,1.24),
            cc.scaleTo(0.1,1.24,0.6),
            cc.scaleTo(0.1,1,1),
        ))
        this.showClickLight(pos)
        this.popGift()
    },

    popGift(){
        const now  = Date.now()
        if (now < this.poptime + this.interval) {
            return
        }
        this.poptime = now
        this.interval = Math.random() * 2000
        console.log("弹出礼物！");
        
    },

    update(dt){
        if (this.isEnd!=false) {
            return
        }
        let countdown = this.endtime - Date.now()
        if (countdown<= 0) {
            this.lbTime.string = "圣诞快乐哦！"
            this.isEnd = true
            this.btnClose.active = true
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