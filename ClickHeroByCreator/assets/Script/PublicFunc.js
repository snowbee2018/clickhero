// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        dialog: cc.Prefab,
    },

    // params = {
    //     contentStr,
    //     leftBtnStr,
    //     rightStr,
    //     onTap,
    // }
    popDialog (params) {
        const self = this;
        try {
            var dialogNode = cc.instantiate(self.dialog);
            var curScene = cc.director.getScene();
            dialogNode.parent = curScene;
            var dialogComponent = dialogNode.getComponent("Dialog");
            dialogComponent.setDesc(params.contentStr);
            dialogComponent.setBtnText(params.leftBtnStr, params.rightStr);
            dialogComponent.setCallback(params.onTap);
        } catch (error) {
            console.error(error);
        }
        
    },

    rebirth () {
        const self = this;
        DataCenter.rebirth();
        HeroDatas.rebirth();
        self.getComponent("HeroListControl").rebirth();
        self.getComponent("MonsterController").rebirth();
        GameData.refresh();
        self.getComponent("UserSkillController").rebirth();
        Events.emit(Events.ON_GOLD_CHANGE);
        Events.emit(Events.ON_SOUL_CHANGE);
        WeChatUtils.onHide();
    },
});
