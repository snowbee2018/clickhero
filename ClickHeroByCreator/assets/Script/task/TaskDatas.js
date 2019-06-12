/*
 * @Author: xj 
 * @Date: 2019-06-12 14:25:46 
 * @Last Modified by: xj
 * @Last Modified time: 2019-06-12 21:16:24
 */

const self = {}

self.init = function() {
    var cloudInfo = DataCenter.getCloudDataByKey(DataCenter.KeyMap.taskTargets);
    // 购买次数，永久效果的商品需要记录并持久化
    self.datas = cloudInfo || [
        -1,-1,-1,-1,-1,
    ];
}

self.targets = [
    // 关卡任务
    [10,50,100,150,200,300,400,500,600,700,800,900,1000,1200,1400,1600,1800,2000,2500,3000,3500,4000,4500,5000,6000,7000,8000,9000,10000,],
    // 妖丹任务
    ["5e+4","5e+6","5e+9","5e+12","5e+18","5e+24","5e+30","5e+36","5e+42","5e+48","5e+54","5e+60","5e+66","5e+72",],
    // 手动点击次数
    [5000,10000,20000,30000,40000,50000,60000,70000,80000,90000,100000,120000,140000,160000,180000,200000,240000,280000,320000],
    // 获得英雄数
    [5,10,15,20,25,30,40,50],
    // 穿越次数
    [1,5,10,15,20,25,30,40,50,60,70,80,90,100],
]

self.titles = [
    "通关任务","妖丹任务","点击任务","英雄数任务","穿越任务",
]

self.getTitle = function(i) {
    const index = self.datas[i] + 1
    if (self.targets[i].length <= index) {
        return self.titles[i]+"全部完成！"
    }
    if (i == 0) {
        let lv = new BigNumber(self.targets[i][index])
        return "击败" + lv + "级妖怪"
    } else if (i == 1){
        let gold = new BigNumber(self.targets[i][index])
        return "累计获得" + Formulas.formatBigNumber(gold)+"妖丹"
    } else if (i == 2){
        let count = new BigNumber(self.targets[i][index])
        return "手动点击" + count + "次"
    } else if (i == 3){
        let count = new BigNumber(self.targets[i][index])
        return "拥有"+count+"个英雄"
    } else if (i == 4){
        let count = new BigNumber(self.targets[i][index])
        return "月光宝盒穿越" + count+"次"
    }
}

self.getProgress = function(i) {
    const index = self.datas[i] + 1
    let str = "进度："
    const key = DataCenter.KeyMap
    if (i == 0) {
        let count = DataCenter.getDataByKey(key.maxPassLavel);
        str += count
    } else if (i == 1) {
        let gold = DataCenter.getDataByKey(key.historyTotalGold);
        str += Formulas.formatBigNumber(gold)
    } else if (i == 2) {
        let count = DataCenter.getDataByKey(key.totalClick);
        str += count
    } else if (i == 3) {
        let count = HeroDatas.getBuyHeroCount()
        str += count
    } else if (i == 4) {
        let count = DataCenter.getDataByKey(key.rebirthCount);
        str += count
    }
    if (self.targets[i].length == index) {
        return str
    }
    if (i == 1) {
        let gold = new BigNumber(self.targets[i][index])
        str += "/" + Formulas.formatBigNumber(gold)
    } else {
        let target = self.targets[i][index]
        str += "/" + target
    }
    return str
}

self.isFinish = function(i) {
    const index = self.datas[i] + 1
    const key = DataCenter.KeyMap
    if (self.targets[i].length == index) {
        return false
    }
    let target = self.targets[i][index]
    let count
    if (i == 0) {
        count = DataCenter.getDataByKey(key.maxPassLavel);
        return count >= target
    } else if (i == 1) {
        let gold1 = DataCenter.getDataByKey(key.historyTotalGold);
        let gold2 = new BigNumber(target)
        return gold1.gte(gold2)
    } else if (i == 2) {
        count = DataCenter.getDataByKey(key.totalClick);
        return count >= target
    } else if (i == 3) {
        count = HeroDatas.getBuyHeroCount()
        return count >= target
    } else if (i == 4) {
        count = DataCenter.getDataByKey(key.rebirthCount);
    } else {
        return false
    }
    return count >= target
}

self.getRuby = function(i) {
    if (self.isFinish(i)) {
        let ruby = 30
        self.datas[i]++
        PublicFunc.popGoldDialog(2,ruby,"任务奖励")
        return true
    }
    return false
}

module.exports = self