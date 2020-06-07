
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
        btn : cc.Node,
        pfDialog : cc.Prefab,
    },

    onLoad(){
        // if (Date.now() > 1581350400000) {
        //     this.lbTime.string = "活动已结束"
        //     this.btnClose.active = true
        //     this.btn.active = true
        //     return
        // }
        this.treedata = DataCenter.getDataByKey(DataCenter.KeyMap.tree)
        if (this.isToday(this.treedata.date)) {
            this.lbTime.string = "开心每一天😄，明天再来！"
            this.btnClose.active = true
            this.btn.active = true
        } else {
            this.treedata.date = new Date().toLocaleDateString()
            this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
            this.isEnd=false
            this.poptime = 0
            this.interval = 0
            this.giftIndex = 0
            this.endtime = Date.now() + 30*1000
            // 生成一个奖励列表
            this.tickets = []
            // this.createTickets()
            this.boxs = []
            this.createBoxs()
        }
    },
    isToday(d){
        let date = this.strToDate(d)
        let b = date && date.toLocaleDateString() == new Date().toLocaleDateString()
        return b
    },
    strToDate(value){
        if (value){
            return (new Date(Date.parse(value.replace(/-/g, "/"))));
        }
        return value;
    },
    createBoxs(){
        let lv = DataCenter.getDataByKey(DataCenter.KeyMap.maxPassLavel);
        const b = lv > 2000
        this.boxs[0] = {
            index : Math.ceil(Math.random()*10+15),
            type : 0
        }
        this.boxs[1] = {
            index : Math.floor(Math.random()*20+20),
            type : 1
        }
        this.boxs[2] = {
            index : Math.floor(Math.random()*20+22),
            type : b ? 2:1
        }
        this.boxs[3] = {
            index : Math.floor(Math.random()*20+16),
            type : 0
        }
    },
    createTickets(){
        const rubys0 = [1000,2000,3000,5000,10000]
        const rubys1 = [10000,24000,50000,100000,150000,240000]
        let ruby
        const r0 = Math.random()
        if (r0<=0.3) {
            ruby = rubys0[0]
        } else if (r0<=0.6) {
            ruby = rubys0[1]
        } else if (r0 <= 0.8) {
            ruby = rubys0[2]
        } else {
            ruby = rubys0[3]
        }
        this.tickets[0] = {
            index : Math.ceil(Math.random()*20),
            ruby : ruby
        }
        const r1 = Math.random()
        if (r1<=0.2) {
            ruby = rubys0[0]
        } else if (r1<=0.5) {
            ruby = rubys0[1]
        } else if (r1 <= 0.7) {
            ruby = rubys0[2]
        } else if (r1 <= 0.8) {
            ruby = rubys0[3]
        } else {
            ruby = rubys0[4]
        }
        this.tickets[1] = {
            index : Math.floor(Math.random()*20+17),
            ruby : ruby
        }
        const r2 = Math.random()
        if (r2<=0.35) {
            ruby = rubys1[0]
        } else if (r2<=0.7) {
            ruby = rubys1[1]
        } else if (r2 <= 0.82) {
            ruby = rubys1[2]
        } else if (r2 <= 0.9) {
            ruby = rubys1[3]
        } else if (r2 <= 0.95) {
            ruby = rubys1[4]
        } else {
            ruby = rubys1[5]
        }
        this.tickets[2] = {
            index : Math.floor(Math.random()*10+26),
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
            cc.scaleTo(0.1,1.22,0.8),
            cc.scaleTo(0.1,0.8,1.22),
            cc.scaleTo(0.1,1.22,0.8),
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
        this.popGold()
        // this.popBox()
        this.tickets.forEach(t => {
            if (this.giftIndex == t.index) {
                t.b = true
                this.popTicket(t.ruby)
            }
        });
        this.boxs.forEach(e => {
            if (this.giftIndex == e.index) {
                e.b = true
                this.popBox(e.type)
            }
        });
        this.giftIndex++
    },

    popGold(){
        let x = (Math.random() - 0.5) * 400
        let y = Math.random() * -100 - 120
        // x += x > 0? 100 : -100
        let pos = cc.v2(x,y)
        let node = new cc.Node()
        let sp = node.addComponent(cc.Sprite)
        sp.spriteFrame = this.sfArr[0]
        node.parent = this.ndImgs
        let h = Math.random() * 100 + 350
        let r = (Math.random()-0.5)*1280
        node.runAction(cc.spawn(cc.jumpTo(0.8,pos,h,2),cc.rotateBy(0.8,r)))
    },

    popTicket(ruby){
        console.log("popTicket ruby:" + ruby);
        let x = (Math.random() - 0.5) * 400
        let y = Math.random() * +100 + 120
        // x += x > 0? 100 : -100
        let pos = cc.v2(x,y)
        let node = new cc.Node()
        let sp = node.addComponent(cc.Sprite)
        sp.spriteFrame = this.sfArr[1]
        node.parent = this.ndImgs
        let h = Math.random() * 100 + 200
        let r = (Math.random()-0.5)*720
        node.runAction(cc.spawn(cc.jumpTo(0.8,pos,h,2),cc.rotateBy(0.8,r)))
        
    },

    popBox (type) {
        this.treedata.boxList.unshift({
            isnew : true,
            time : Date.now(),
            boxType : type,
        })
        let x = (Math.random() - 0.5) * 600
        let y = Math.random() * +100 + 120
        let pos = cc.v2(x,y)
        let node = new cc.Node()
        node._localZOrder = 100
        let sp = node.addComponent(cc.Sprite)
        var sfId = type + 2
        sp.spriteFrame = this.sfArr[sfId]
        node.parent = this.ndImgs
        let h = Math.random() * 100 + 200
        let r = (Math.random()-0.5)*720
        node.runAction(cc.spawn(cc.jumpTo(0.8,pos,h,2),cc.rotateBy(0.8,r)))   
    },

    showResult(){
        this.ndImgs.children.forEach(e => {
            e.stopAllActions()
            e.runAction(cc.sequence(cc.moveTo(0.4,0,0),cc.hide()))
        });
        setTimeout(() => {
            this.btnClose.active = true
            this.btn.active = true
            console.log("pop gold " + this.giftIndex);
            // 把翻倍放进包里
            // ruby time isnew
            this.tickets.forEach(t => {
                if (t.b) {
                    this.treedata.tickets.unshift({
                        isnew : true,
                        time : Date.now(),
                        ruby : t.ruby,
                    })
                }
            });
            console.log(this.treedata);
            // this.showTicketView()
            // 弹出获得的金币
            if (this.giftIndex > 0) {
                const gold = PublicFunc.getBagGold().times(this.giftIndex/2)
                PublicFunc.popGoldDialog(0,gold)
            }
        }, 600);
    },

    showTicketView(){
        const node = cc.instantiate(this.pfDialog)
        node.parent = cc.director.getScene();
        node.x = cc.winSize.width / 2;
        node.y = cc.winSize.height / 2;
    },

    onClick(){
        PublicFunc.showBoxDialog()
    },

    update(dt){
        if (this.isEnd!=false) {
            return
        }
        let countdown = this.endtime - Date.now()
        if (countdown<= 0) {
            this.isEnd = true
            this.lbTime.string = "开心每一天😄，明天再来！"
            this.showResult()
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