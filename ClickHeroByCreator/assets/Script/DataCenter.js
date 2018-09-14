cc.Class({
    ctor () {
        const self = this;
        self.ContentData = {}
        self.DataMap = {
            WXUserInfo: "WXUserInfo", // 当前用户微信信息
        }

        // 本地数据库存储的数据
        self.LocalStorageDataMap = {
            lastTime: "lastEnterGameTime", // 最近一次保存数据的时间
            // 所有当前必须要保存的数据，用于恢复现场
            curLever: "curLever", // 当前所在关卡
            curDiamond: "curDiamond", // 当前钻石数量
            curCoin: "curCoin", // 当前金币数量
            curSoul: "curSoul", // 当前英魂数量
            additionalSoul: "additionalSoul", // 由雇佣兵完成任务而附加的英魂数量，英雄等级加成的英魂不在此列
            enemyNumber: "enemyNumber", // 打到当前关卡的第几只怪
            remainderBlood: "remainderBlood", // 当前怪物的剩余血量
            heroList: "heroList", // 用户所有英雄的状态，用json存起来
            skillList: "skillList", // 所有用户技能的状态，同样存json,主要是要记录技能是否激活的和最后使用的时间，以便确定何时冷却完毕
            achievementList: "achievementList", // 成就列表，存json，转生次数也在这里
            equipmentList: "equipmentList", // 装备列表，存json，圣遗物和神器都存这里
            shopList: "shopList", // 钻石商店商品列表，存json，用户的购买状态也存里面
            lansquenetList: "lansquenetList", // 雇佣兵列表，存json，任务的完成状态也存里面

            curSetting: "curSetting", // 当前设置信息
        }
        // question : 大佬们好，我想问一下，用 cc.sys.localStorage.setItem 这个保存的数据 正常 访问微信小游戏时没有问题，
        // 但是在小游戏更新后，之前保存的数据就没有了，请问这个问题该如何解决。
        // answer : 如果是微信小游戏的话, 可以考虑使用微信小游戏的文件管理方法, 把每次需要保存的数据写入到小游戏自己的文件夹下, 
        // 用.txt或者.json的格式保存, 按照官方的说法, 这个文件夹不会被轻易的清理掉, 
        // 另外, 自测也发现, 更新版本并不会清理这个文件夹.如果数据比较重要, 可以考虑加密以后保存
    },



    setDataByKey (key, params) {
        const self = this;
        // console.info("key = " + key);
        if (params && key) {
            self.ContentData[key] = params;
        }
    },

    getDataByKey (key) {
        const self = this;
        // console.info("key = " + key);
        if (key) {
            return self.ContentData[key];
        }
    },

});