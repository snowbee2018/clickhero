/**
 * 用于ScrollView的滚动列表组件基类
 * 子类继承后必须重写 onBindView、getItemCount
 * 如果prefab模版有多个，要重写getType
 * 如果用其它方式创建view 可以重写onCreateView&&(getHeightByIndex||getWidthByIndex)
 * 调用refresh方法，刷新列表
 * 使用示例：ListViewDemo场景、ExampleListView
 * 
 * 注意：
 * 1.itemView的锚点必须在中间(0.5,0.5)
 * 2.onPullDown回调只有设置了pullDownRange才能生效
 * xj
 */

cc.Class({
    extends: cc.Component,

    properties: {
        prefabs:{
            default : [],
            type : [cc.Prefab],
        },
        scrollView:{ //获取scrollview组件
            type:cc.ScrollView,
            default:null,
        },
        pullDownRange:0,//下拉触发onPullDown需要的距离，0表示不使用
        // bHorizontal : false,
        // hideOutView : false, // 超出屏幕的View active会先设为false，仅对每个item等高适用
    },

    /*---------子类重写---------*/
    getType (index) { //type对应prefabs
        return 0;
    },

    getItemCount () {
        return 0;
    },

    onBindView (view, index) {

    },
    onBindFatView (view, index) {

    },
    onPullDown () {// 下拉回调
        
    },
    onScrollToBottom () { // 滚动到底部的回调

    },
    /*--------------------------*/
    onLoad () {
        // console.log("BaseListView onLoad");
        this.content = this.scrollView.content;
        this.views = [];//正在显示的Views
        this.cacheViews = [];//额外缓存的Views
        if (!this._itemsSize) this._itemsSize = {};
        this.width = this.scrollView.node.width;
        this.height = this.scrollView.node.height;
        this.addPullDownListenter();
        this.addScrollToBottomListener();
        // // 频繁销毁和创建节点对性能消耗很大，加入对象池
        // this.nodePools = {}
        // for (let index = 0; index < this.prefabs.length; index++) {
        //     this.nodePools[index] = new cc.NodePool();
        // }
        if (this.scrollView.brake < 0.95) {
            this.scrollView.brake = 0.95;//限速
        }

        this.lastBindTime = 0;
        this.bindInterval = 200;//延迟加载间隔毫秒

        this.bHorizontal = this.scrollView.horizontal

        this.hideOutView = false
    },

    refreshSize () {
        this.bHorizontal ? this.calContentWidth() : this.calContentHeight();
    },

    saveItemSize (index, width, height) {
        const self = this;
        var flag = false;
        if (!self._itemsSize[index]) {
            self._itemsSize[index] = {
                width : width,
                height : height,
            }
            flag = true;
        } else if (self._itemsSize[index].width != width || self._itemsSize[index].height != height) {
            self._itemsSize[index] = {
                width : width,
                height : height,
            }
            flag = true;
        }
        if (flag) {
            self.refreshSize();
        }
    },

    getHeightByIndex (index) {
        let type = this.getType(index);
        return this._itemsSize[index] ? this._itemsSize[index].height : this.prefabs[type].data.height;
    },
    getWidthByIndex (index) {
        const self = this;
        let type = self.getType(index);
        return self._itemsSize[index] ? self._itemsSize[index].width : self.prefabs[type].data.width;
    },

    getView(type, index) {
        
        let len = this.cacheViews.length;
        var view = null;
        for(let i = 0;i<len;i++){
            if(this.cacheViews[i].type == type){
                view = this.cacheViews.splice(i,1)[0];
                view.active = true
                break;
            }
        }
        if(!view){
            view = this.onCreateView(type);
            this.content.addChild(view);
        }

        // // console.log("getView");
        // const self = this;
        // var view;
        // var pool = self.nodePools[type];
        // if (pool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
        //     view = pool.get();
        // } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
        //     view = self.onCreateView(type,index);
        // }
        this.lastBindTime = new Date().getTime();
        view.isBindFinish = false;
        view.curIndex = index;
        return view;
    },
    onCreateView(type){
        let view =  cc.instantiate(this.prefabs[type]);
        view.type = type;
        return view;
    },

    onDestroy () {
    },

    getViewByIndex(index){
        for (let i = 0; i < this.views.length; i++) {
            const v = this.views[i];
            if (v.index == index) {
                return v;
            }
        }
        return null;
    },

    // 计算View在ScrollView中的位置
    getPositionInView (view) {
        let worldPos = view.parent.convertToWorldSpaceAR(view.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    /*------------水平滚动 by tjh--------------*/
    // 检查是否需要移除或添加View
    checkeLeftAndRight () {
        const self = this;
        if (self.views.length < 3) {
            return;  //当总item不超过2个，不使用这种复用机制
        }
        // var lx = Math.abs(self.content.position.x);
        // if (lx <= self.scrollView.node.width/2 || lx >= (self.content.width - self.scrollView.node.width/2)) {
        //     return;
        // }
        // console.log("self.views.length = " + self.views.length);
        
        
        let hasChanged = false;
        let leftView = self.views[0];
        let leftView1 = self.views[1];
        let p1 = self.getPositionInView(leftView);
        if (Math.abs(p1.x) >= self.scrollView.node.width/2 + leftView1.width + leftView.width/2) {
            // remove leftView
            self.removeLeftView();
            leftView = null;
            hasChanged = true;
        }
        let rightView = self.views[self.views.length - 1];
        let view2 = self.views[self.views.length - 2];
        let p2 = self.getPositionInView(rightView);
        if (Math.abs(p2.x) >= self.scrollView.node.width/2 + view2.width + rightView.width/2) {
            // remove rightView
            self.removeRightView();
            rightView = null;
            hasChanged = true;
        }
        //然后把添加View的逻辑搞进来 应该可以加到上面吧
        if(leftView && Math.abs(p1.x) < self.scrollView.node.width/2 + leftView.width/2 && leftView.index != 0){
            self.addLeftView();
            hasChanged = true;
        }
        
        if (rightView && Math.abs(p2.x) < self.scrollView.node.width/2 + rightView.width/2 && rightView.index != self.getItemCount() - 1) {
            self.addRightView();
            hasChanged = true;
        }
        return hasChanged;
    },

    removeLeftView () {
        const self = this;
        // console.log("removeLeft");
        let view = self.views.shift();
        this.cacheViews.push(view)
        view.active = false
        // self.nodePools[view.type].put(view);
    },

    removeRightView () {
        const self = this;
        // console.log("removeRight");
        let view = self.views.pop();
        this.cacheViews.push(view)
        view.active = false
        // self.nodePools[view.type].put(view);
    },

    addLeftView () {
        const self = this;
        let index = self.views.length == 0 ? 0 : self.views[0].index - 1;
        let type = self.getType(index);
        var view = self.getView(type,index);
        // view.parent = self.content;
        self.onBindView(view, index);
        let x = self.views.length == 0 ? view.width / 2 : self.views[0].position.x - self.views[0].width/2 - view.width/2;
        view.setPosition(x, 0);
        self.views.unshift(view);
        view.index = index;
        this.saveItemSize(index, view.width, view.height);
    },

    addRightView (i, px) {
        const self = this;
        let index = i ? i : (self.views.length == 0 ? 0 : self.views[self.views.length - 1].index + 1);
        let type = self.getType(index);
        var view = self.getView(type,index);
        // view.parent = self.content;
        self.onBindView(view, index);

        
        var v = 0;
        for (let j = 0; j < index; j++) v += self.getWidthByIndex(j);

        let x = i ? v - view.width/2 : (self.views.length == 0 ? view.width/2 : self.views[self.views.length - 1].position.x + self.views[self.views.length - 1].width/2 + view.width/2);
        view.setPosition(x, 0);
        self.views.push(view);
        view.index = index;
        this.saveItemSize(index, view.width, view.height);
        return view;
    },

    refreshH () {
        const self = this;
        let len = self.views.length;
        for(let i = 0; i < len; i++){
            let view = self.views.pop();
            this.cacheViews.push(view);
            view.active = false
            // self.nodePools[view.type].put(view);
        }
        self.refreshSize();
        let x = Math.abs(self.content.position.x) - self.scrollView.node.width/2;
        let v = 0;
        len = self.getItemCount();
        for (let i = 0; i < len; i++) {
            let w = self.getWidthByIndex(i);
            v += w;
            if (v >= x - w/2) {
                // let view = self.views.length == 0 ? self.addRightView(i, v - w/2) : self.addRightView();
                let view = self.views.length == 0 ? self.addRightView(i) : self.addRightView();
                let p = self.getPositionInView(view);
                if (p.x > self.scrollView.node.width/2 + view.width/2) {
                    break;
                }
            }
        }
        self.refreshSize();
    },

    calContentWidth () {
        const self = this;
        let count = self.getItemCount();
        let contentWidth = 0;
        for(let i = 0; i < count; i++){
            contentWidth += self.getWidthByIndex(i);
        }

        self.content.width = Math.max(contentWidth, self.scrollView.node.width);
        // self.content.width = contentWidth;
    },

    /*------------垂直滚动 by xj--------------*/
    // 检查是否需要移除或添加View
    checkeTopAndBottom () {
        const self = this;
        if (self.views.length < 3) {
            return;//当总item不超过3个，不使用这种复用机制
        }
        // var ly = self.content.position.y;
        // if (ly <= self.scrollView.node.height/2 || ly >= (self.content.height - self.scrollView.node.height/2)) {
        //     return;
        // }
        
        let hasChanged = false;
        let topView = self.views[0];
        let topView1 = self.views[1];
        let p1 = self.getPositionInView(topView);
        if (self.views.length>3&&p1.y > self.scrollView.node.height/2 + topView1.height + topView.height/2) {
            self.removeTopView();
            topView = null;
            hasChanged = true;
        }

        let bottomView = self.views[self.views.length - 1];
        let bottomView1 = self.views[self.views.length - 2];
        let p2 = self.getPositionInView(bottomView);
        if (self.views.length>3&&Math.abs(p2.y) > self.scrollView.node.height/2 + bottomView1.height + bottomView.height/2) {
            // remove bottomView
            self.removeBottomView();
            bottomView = null;
            hasChanged = true;
        }
        //然后把添加View的逻辑搞进来 应该可以加到上面吧
        if (topView &&  
((Math.abs(p1.y) < self.scrollView.node.height/2 + topView.height/2 )||(p1.y < 0))
        && topView.index != 0) {
            self.addTopView();
            hasChanged = true;
        }
        if (bottomView && 
((Math.abs(p2.y) < self.scrollView.node.height/2 + bottomView.height/2)|| (p2.y > 0))
            && bottomView.index != self.getItemCount() - 1) {
            self.addBottomView();
            hasChanged = true;
        }
        if (this.hideOutView&&hasChanged) {
            this.checkOutView()
        }
        return hasChanged;
    },
    // 检查所有item 超出屏幕隐藏 在屏幕内 显示
    checkOutView(){
        let hideCount = 0;
        for (let i = 0; i < this.views.length; i++) {
            const view = this.views[i];
            let p = this.getPositionInView(view);
            if (p.y >= this.scrollView.node.height/2 + view.height/2
                || p.y <= -this.scrollView.node.height/2 - view.height/2) {
                view.active = false
                hideCount++;
            } else {
                view.active = true
            }
        }
        // console.log("hideCount:" + hideCount);
    },

    refresh () {
        const self = this;
        if (self.bHorizontal) {
            self.refreshH();
        } else {
            self.refreshV();
        }
    },

    refreshV () {
        const self = this;

        let len = self.views.length;
        for(let i = 0;i < len; i++){
            let view = self.views.pop();
            this.cacheViews.push(view);
            view.active = false
            // self.nodePools[view.type].put(view);
        }
        self.refreshSize();
        let y = self.content.position.y - self.scrollView.node.height / 2;
        // console.log("content y = "+y);
        let v = 0;
        len = self.getItemCount();
        for(let i = 0;i < len;i++){
            let h = self.getHeightByIndex(i);
            v += h;
            if (v >= y - h/2) {
                // let view = self.views.length==0?self.addBottomView(i,-v + h/2): self.addBottomView();
                let view = self.views.length == 0 ? self.addBottomView(i) : self.addBottomView();
                let p = self.getPositionInView(view);
                if( p.y < (-self.scrollView.node.height /2) - view.height/2 && i > 2) {
                    break;
                }
            }
        }
        // self.calContentHeight();
        self.refreshSize();
    },
    addTopView(){
        let index = this.views.length == 0 ? 0 : this.views[0].index - 1;
        let type = this.getType(index);
        var view = this.getView(type,index);
        // view.parent = this.content;
        this.onBindView(view,index);
        this.saveItemSize(index, view.width, view.height);
        let y = this.views.length == 0 ? -view.height / 2 : view.height / 2 + this.views[0].position.y + this.views[0].height / 2;
        view.setPosition(0, y);
        this.views.unshift(view);
        view.index = index;
        
    },
    addBottomView(i){
        let index = i ? i : (this.views.length == 0 ? 0 : this.views[this.views.length - 1].index + 1);
        let type = this.getType(index);
        var view = this.getView(type,index);
        // view.parent = this.content;
        this.onBindView(view, index);
        this.saveItemSize(index, view.width, view.height);

        var v = 0;
        for (let j = 0; j <= index; j++) v += this.getHeightByIndex(j);
        
        let y = i ? (-v + view.height/2) : (this.views.length == 0 ? -view.height / 2 : this.views[this.views.length-1].position.y - this.views[this.views.length-1].height / 2 - view.height / 2);
        view.setPosition(0, y);
        this.views.push(view);
        view.index = index;
        
        return view;
    },
    removeTopView(){
        const self = this;
        // console.log("removeTop");
        let view = this.views.shift();
        this.cacheViews.push(view);
        view.active = false
        // self.nodePools[view.type].put(view);
    },
    removeBottomView(){
        const self = this;
        // console.log("removeBottom");
        let view = this.views.pop();
        this.cacheViews.push(view);
        view.active = false
        // self.nodePools[view.type].put(view);
    },
    // 计算滚动内容的总高度
    calContentHeight(){
        let count = this.getItemCount();
        let contentHeight = 0;
        for(let i = 0; i< count;i++){
            contentHeight += this.getHeightByIndex(i);
        }
        this.content.height = Math.max(contentHeight, this.scrollView.node.height);
        // console.log("calContentHeight:"+this.content.height);
    },

    goTop () {
        const self = this;
        self.scrollView.scrollToTop(0.1);
    },

    // 延迟加载部分耗性能的View
    checkBindFatView(){
        const curtime = new Date().getTime();
        if (curtime - this.lastCheckTime < 100) {
            return;
        }
        this.lastCheckTime = curtime;
        // if (this.scrollView.isScrolling() || this.scrollView.isAutoScrolling()) {
        //     //滚动中 
        //     if (curtime - this.lastBindTime > this.bindInterval) {
        //         this.bindFatView();
        //     }
        // } else {
        //     this.bindFatView();
        // }
        if (curtime - this.lastBindTime > this.bindInterval) {
            this.bindFatView();
        }
    },

    bindFatView(){
        var hasMore = false;
        for (let i = 0; i < this.views.length; i++) {
            const v = this.views[i];
            if (v.isBindFinish) {
                continue;
            }
            this.onBindFatView(v,v.index);
            v.isBindFinish = true;
            hasMore = i < this.views.length - 1;
            break;
        }
        this.lastBindTime = new Date().getTime();
        return hasMore;
    },

    addPullDownListenter(){
        if(this.pullDownRange<=0){
            return;
        }
        const self = this;
        // 添加一个文本到顶上
        var node = new cc.Node("lbTips");
        node.setPosition(cc.v2(20,50));
        node.color = new cc.Color(0x66,0x66,0x66);
        var label = node.addComponent(cc.Label);
        label.fontSize = 30;
        self.content.addChild(node);
        label.string = "下拉刷新";
        // console.log("add label")
        self.scrollView.node.on('bounce-top' , function (event) {
            if (self.content.position.y <= self.scrollView.node.height/2 - self.pullDownRange) {
                // self.loadingTxt.string = "正在刷新";
                // self.loadingTxt.x = 20;
                // self.loadingSp.active = true;
                self.onPullDown();
            }
        }, self.scrollView);
        // 加一个菊花到顶上
        var spNode = new cc.Node("spLoading");
        spNode.color = new cc.Color(0x66,0x66,0x66);
        const sp = spNode.addComponent(cc.Sprite);
        WWGlobal.PublicFunc.loadRes({
            path: "textures/plaza/plaza_imgs",
            type: cc.SpriteAtlas,
            callBack: function (err, atlas) {
                if (!cc.isValid(this.node)) return;
                // console.log(err);
                // console.log(atlas);
                var frame = atlas.getSpriteFrame('Icon_loading2');
                sp.spriteFrame = frame;
            }.bind(this),
        });
        spNode.setPosition(cc.v2(-60,50));
        // spNode.active = false;
        self.content.addChild(spNode);
        this.loadingTxt = node;
        this.loadingSp = spNode;
    },
    loadingFinish(){
        // if (!this.loadingTxt) {
        //     return;
        // }
        // this.loadingTxt.string = "下拉刷新";
        // this.loadingTxt.x = 0;
        // this.loadingSp.active = false;
    },
    addScrollToBottomListener(){
        // 额外加个 滚动到底部的回调
        const self = this;
        self.scrollView.node.on('bounce-bottom' , function (event) {
            self.onScrollToBottom();
        }, self.scrollView);
    },
    
    update (dt) {
        const self = this;
        if (self.bHorizontal) {
            this.checkeLeftAndRight();
        } else {
            while (this.checkeTopAndBottom()) {
                
            }
            // let result = this.checkeTopAndBottom();
            // console.log("result:" + result);
        }
        //增加延迟bind view的逻辑
        this.checkBindFatView();
    },
//=======下面是一些辅助功能========
    //指定index的Item回调一次onBindView
    refreshItem(index){
        console.log("refreshItem " + index);
        let v = this.getViewByIndex(index);
        if(v){
            this.onBindView(v,index);
            this.updatePosition(index);
            // this.saveItemSize(index, v.width, v.height);
        }
    },
    /**
     * 调整位置
     * 当一个item onBindView回调完成之后，还需要改变item大小，调此方法
     * 例如：onBindFatView里改变了item大小
     * 记得之前要updateLayout
     */
    updatePosition(index){
        console.log("updatePosition "+index);
        let v = this.getViewByIndex(index);
        if (!v) {
            return;
        }
        let offset = {x:0,y:0};
        if (this.bHorizontal) {
            let width = this.getWidthByIndex(index);
            offset.x = width - v.width;
        } else {
            let height = this.getHeightByIndex(index);
            offset.y = height - v.height;
        }
        this.saveItemSize(index, v.width, v.height);
        v.x += offset.x / 2;
        v.y += offset.y / 2;
        for (let i = index + 1; i < this.views.length; i++) {
            let view = this.views[i];
            view.x += offset.x;
            view.y += offset.y;
        }
    },
//===========end============
});