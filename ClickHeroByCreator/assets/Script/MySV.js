
cc.Class({
    extends: cc.Component,
    
    properties: {
        scrollView:cc.ScrollView,
    },

    pushItem(item){
        this.items = this.items || []
        this.items.push(item)
    },
    
    update (dt) {
        // this._dtt = this._dtt || 0
        // this._dtt += dt
        // if (this._dtt < 1) {
        //     return
        // }
        // console.log("xxxj start -------");
        
        // this._dtt = 0
        let childs = this.items
        if (!childs || childs.length == 0) {
            return
        }
        this._t = this._t >= 0 ? this._t : -1
        this._b = this._b >= 0 ? this._b : -1
        if (this._t < 0) {
            childs[0].active = true
            // console.log("add 0 第一个哦");
            this._t = 0
            this._b = 0
            return
        }
        let h = this.scrollView.node.height
        let tv = childs[this._t]
        let ty = this.getPositionInView(tv);
        
        if (this._b > 3 && ty > h / 2 + 140) {
            tv.active = false
            // console.log("del t "+this._t);
            tv = null
            this._t ++
        }
        let bv = childs[this._b]
        let by = this.getPositionInView(bv);
        if (this._b > 3 && by < -h / 2 - 140) {
            bv.active = false
            // console.log("del b "+this._b);
            bv = null
            this._b --
        }
        if (tv && this._t > 0) {
            let ti = this._t - 1
            tv = childs[ti]
            ty = this.getPositionInView(tv);
            if (ty < h / 2 + 140) {
                tv.active = true
                this._t = ti
                // console.log("add t "+this._t);
            }
        }
        if (bv && this._b < childs.length-1) {
            let bi = this._b + 1
            bv = childs[bi]
            by = this.getPositionInView(bv);
            if (by > -h / 2 - 140) {
                bv.active = true
                this._b = bi
                // console.log("add b "+this._b);
            }
        }
    },
    // 计算View在ScrollView中的位置
    getPositionInView (view) {
        let worldPos = view.parent.convertToWorldSpaceAR(view.position);
        let viewPos = this.heroList.node.convertToNodeSpaceAR(worldPos);
        return viewPos.y;
    },

})
