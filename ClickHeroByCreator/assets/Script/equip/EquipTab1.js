// 先写on装备的填充
cc.Class({
    extends: cc.Component,

    properties: {
        ndOff : cc.Node,
        lbDesc : cc.Label,
        pfEquip : cc.Prefab,
    },

    onLoad(){
        this.refresh()
    },
    refresh(){
        const datas = EquipDatas.alls
        console.log(datas);
        
        this.items = this.items || []
        for (let i = 0; i < datas.length; i++) {
            const e = datas[i];
            let c = this.items[i]
            if (!c) {
                c = cc.instantiate(this.pfEquip).getComponent('Equip')
                c.node.parent = this.ndOff
                this.items[i] = c
            }
            c.setData(e,this.onSelOnItem.bind(this))
        }
        this.clearSel()
    },
    clearSel(){
        if (this.cur) {
            this.cur.setSel(false)
        }
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
            this.cur = c
            const data = c.data
            this.lbDesc.string = EquipDatas.getDesc(data)
        } else {
            this.clearSel()
        }
    },
})