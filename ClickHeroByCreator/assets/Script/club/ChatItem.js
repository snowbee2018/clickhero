
cc.Class({
    extends: cc.Component,

    properties: {
        lbName : cc.Label,
        lbContent : cc.Label,
    },

    bind(data){
        let d = new Date(data.time)
        // let date = (d.getMonth()+1) + "-" + d.getDate() + " " + d.getHours() +":" + d.getMinutes()
        this.lbName.string = data.nickname + "    " + d.format("MM/dd hh:mm")
        this.lbContent.string = data.msg
    },

})