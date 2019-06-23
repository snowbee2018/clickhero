
cc.Class({
    extends: cc.Component,

    properties: {
        sv : cc.ScrollView,
        itemPrefab : cc.Prefab,
    },

    onLoad(){
        console.log("xxxj task onload");
        Events.on(Events.ON_RESETGAME, this.resetGame, this);
        this.fullViews()
    },

    fullViews(){
        this.items = []
        try {
            this.addItem(-1)
            for (let i = 0; i < TaskDatas.targets.length; i++) {
                this.addItem(i)
            }
        } catch (error) {
            console.error(error);
        }
    },

    onDestroy(){
        Events.off(Events.ON_RESETGAME, this.resetGame, this);
    },

    addItem(i) {
        console.log("xxxj additem" + i);
        
        var node = cc.instantiate(this.itemPrefab);
        node.parent = this.sv.content;
        node.getComponent("TaskItem").bind(i);
        this.items[i] = node
    },

    resetGame(){
        TaskDatas.resetGame()
        this.sv.content.removeAllChildren()
        // this.items.forEach(e => {
        //     e.removeFromParent()
        // });
        this.fullViews()
    },
})

/**19.3.2
 * 分享框，模拟子用户列表数据
 * 模拟 已领取子用户列表数据
 * bind ShareItem
 * --200后每25级*4 1000级*10
 * --
 */

/**签到：
 * 需要一个签到框，显示7天
 * 持久化：连续签到次数，最后签到日期
 * 判断上次日期是否为本周，不为本周归零次数
 * 是本周就显示已领取，下一个可领取显示出来，点了能加数值
 */
//      感觉需要一个心跳去检测，对于没有事件的会发出来的
 /**邀请：
  * 持久化 分享数量 最后分享时间，
  * 当切换到任务tab、分享回调 去计算最后时间是否超过1小时，超过就更新数量
  * 1.分享回调里，扣除分享剩余数量，成功就获得仙桃
  * 
  * 邀请奖励框部分
  * 2.云数据下来后，会有子用户表，领取表，通过它们可以用来bind邀请奖励框
  *     持久化 已领取的openID 已领取的转生openID
  *     通过它们来展示dialog
  * 
  * 游戏进度部分：
  * 1.获得妖丹数量达到（5e6,12,18,24，30，36，42，48，54，60次方），分别获得25钻
  *     这个就是一个任务进度  一个领取按钮，达到了 就领取，从小往大领
  * 2.获得英雄（10个，20个，30个，40个，50个）分别奖励50钻
  *     进度条，领取按钮
  * 3.升级英雄（100次，200次，500次，1000次，5000次，20000次，50000次）分别奖励25钻
  *     进度条，领取按钮
  * 4.达到关数（10，25，50，100，150，200，1000，1500，2000，2500，3000，5000，10000，15000，20000，30000，50000）分别得到25钻
  *     一样的
  * 5.使用月光宝盒（1次，5次，15次，25次，50次）分别获得25钻
  * 
  * 
  */