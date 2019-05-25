
cc.Class({
    extends: require('ListView'),

    properties: {
    },

    start(){
        // this.refreshView()
        CloudDB.getChildUserData(this.onChildData.bind(this),true)
    },

    refreshView(){
        // 这里从DataCenter拿到datas
        // 模拟数据
        this.datas = DataCenter.getDataByKey("ChildUserArr") || []
        for (let i = 0; i < this.datas.length-1; i++) {
            for (let j = 0; j < this.datas.length-1-i; j++) {
                const ele = this.datas[j];
                if (ele.registerTime>this.datas[j+1].registerTime) {
                    this.datas[j] = this.datas[j+1]
                    this.datas[j+1] = ele
                }
            }
        }
        this.refresh()
    },

    onChildData(){
        if (this.node.isValid) {
            this.refreshView()
        }
    },

    getItemCount () {
        return 500;
    },

    onBindView (view, index) {
        view.getComponent('ShareItem').bind(index,this.datas[index])
    },


    finish(){
        this.node.destroy()
    },
})

        // this.datas = [{
        //         isRebirth : false,
        //         registerTime : 123,
        //         weChatUserInfo : {
        //             avatarUrl:"https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=431073994,2205225190&fm=26&gp=0.jpg",
        //             nickName : "张三"
        //         }
        //     },{
        //         isRebirth : true,
        //         registerTime : 124,
        //         weChatUserInfo : {
        //             avatarUrl:"https://v1.qzone.cc/avatar/201903/01/18/21/5c7907be2793c787.jpg!180x180.jpg",
        //             nickName : "李四"
        //         }
        //     },{
        //         isRebirth : false,
        //         registerTime : 121,
        //         weChatUserInfo : {
        //             avatarUrl:"https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=4100951152,202319376&fm=26&gp=0.jpg",
        //             nickName : "哈哈哈"
        //         }
        //     },
        // ]