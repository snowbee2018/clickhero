// 先写on装备的填充
cc.Class({
    extends: cc.Component,

    properties: {
        lbRuby : cc.Label,
        lbChip : cc.Label,
        lbResolveChip : cc.Label,
        lbUpgradeChip : cc.Label,
        lbUpgradeRuby : cc.Label,
        rtDesc : cc.RichText,
        lbDesc : cc.Label,
        ndOn : cc.Node,
        ndOff : cc.Node,
        ndAct : cc.Node,
        lbBtn : cc.Label,// 装备按钮的文字
        pfEquip : cc.Prefab,
        tabBtns : [cc.Button],
        tabs : [cc.Node],
    },

    onLoad(){
        this.mys = EquipDatas.mys
        this.ndAct.active = false
        Events.on(Events.ON_RUBY_CHANGE,this.showRuby,this);
        this.showRuby()
        // 先填充4个on装备
        this.refresh()
        this.onTab(null,0)
    },
    refresh(){
        this.onItems = this.onItems || []
        for (let i = 0; i < 4; i++) {
            const e = this.mys.on[i];
            let c = this.onItems[i]
            if (!c) {
                c = cc.instantiate(this.pfEquip).getComponent('Equip')
                c.tag = i // 标记下
                c.flag = 1 // 1表示装备上了
                c.node.parent = this.ndOn
                this.onItems[i] = c
            }
            c.setData(e,this.onSelOnItem.bind(this))
        }
        this.offItems = this.offItems || []
        const len = Math.max(this.mys.off.length,this.offItems.length)
        for (let i = 0; i < len; i++) {
            let c = this.offItems[i]
            if (!c) {
                c = cc.instantiate(this.pfEquip).getComponent('Equip')
                c.tag = i // 标记下
                c.flag = 0 // 0表示在包裹
                c.node.parent = this.ndOff
                this.offItems[i] = c
            }
            const e = this.mys.off[i];
            if (!e) {
                c.node.active = false
            } else {
                c.node.active = true
                c.setData(e,this.onSelOffItem.bind(this))
            }
        }
        this.clearSel()
        this.showChip()
    },
    clearSel(){
        if (this.cur) {
            this.cur.setSel(false)
        }
        this.ndAct.active = false
        this.cur = null
        this.lbDesc.string = ''
    },
    onSelOnItem(b,c){
        // b 是否选中 c.data装备数据
        console.log(b+" "+c.data.id);
        if (this.cur != c&&this.cur) {
            this.cur.setSel(false)
        }
        if (b) {
            this.lbBtn.string = "卸下"
            this.ndAct.active = true
            this.cur = c
            const data = c.data
            this.lbResolveChip.string = '+'+EquipDatas.getResolveChip(data)
            this.lbUpgradeChip.string = '-'+EquipDatas.getUpgradeChip(data)
            this.lbUpgradeRuby.string = '-'+EquipDatas.getUpgradeRuby(data)
            this.lbDesc.string = EquipDatas.getDesc(data)
        } else {
            this.clearSel()
        }
        // lbUpgradeRuby.. lbResolveChip
    },
    onSelOffItem(b,c){
        // b 是否选中 data装备数据
        console.log(b+" "+c.data.id);
        this.onSelOnItem(b,c)
        if (b) {
            this.lbBtn.string = "装备"
        }
    },
    onBtnClick(){
        const c = this.cur
        if (!c) {
            return
        }
        const data = c.data
        if (c.flag == 0) { // 装备
            const code = EquipDatas.puton(data)//-2不能重复 -1装备满了 0没有这个装备 1成功
            if (code <= 0) {
                const tips = ['装备失败','装备满了','不能重复']
                PublicFunc.toast(tips[-code])
                return
            }
        } else { // 卸下
            const b = EquipDatas.putoff(data)
            if (!b) {
                console.log("失败");
                return
            }
        }
        this.refresh()
    },
    onClickResolve(){
        if (!this.cur) {
            return
        }
        const data = this.cur.data
        // 加个dialog确认
        PublicFunc.popDialog({
            contentStr: "你确定要分解该装备吗？",
            btnStrs: {
                left: '是 的',
                right: '不，谢谢'
            },
            onTap: function (dialog, bSure) {
                const b = EquipDatas.resolve(data)
                console.log(b);
                this.refresh()
            }.bind(this)
        });
    },
    onClickUpgrade(){
        if (!this.cur) {
            return
        }
        const data = this.cur.data
        // 加个dialog确认
        PublicFunc.popDialog({
            contentStr: "你确定要升级该装备吗？",
            btnStrs: {
                left: '是 的',
                right: '不，谢谢'
            },
            onTap: function (dialog, bSure) {
                const code = EquipDatas.upgrade(data)
                if (code == 1) {
                    let c = this.cur
                    this.refresh()
                    c.sel()
                } else if (code == -1) {
                    PublicFunc.toast("晶石不够")
                } else {
                    PublicFunc.toast("仙桃不够")
                }
            }.bind(this)
        });
    },
    onTab(e,i){
        i = Number(i)
        this.tab = i
        const j = (i+1)%2
        console.log(i + " " + j);
        
        this.tabBtns[i].interactable = false
        this.tabBtns[j].interactable = true
        this.tabs[j].active = false
        this.tabs[i].active = true
    },
    finish(){
        this.node.destroy()
    },
    onDestroy(){
        Events.off(Events.ON_RUBY_CHANGE,this.showRuby,this);
    },
    showRuby(){
        var ruby = DataCenter.getDataByKey(DataCenter.KeyMap.ruby);
        this.lbRuby.string = ""+ruby
    },
    showChip(){
        this.lbChip.string = this.mys.chip
    },
})