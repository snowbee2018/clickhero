/*
 * @Author: xj 
 * @Date: 2019-05-19
 * @Last Modified by: xj
 * @Last Modified time: 2019-06-23 21:53:20
 */
 
cc.Class({
    extends: cc.Component,

    properties: {
        lbName : cc.Label,
        lbUnit : cc.Label,
    },

    onLoad(){
        this.refresh()
    },

    refresh(){
        const z2 = DataCenter.getUserZone() === 2
        const g = GameData
        const arr = []
        const push = function(k,v,u) {
            if (!k) {
                arr.push({})
                return
            }
            u = u || '倍'
            if (v === null || v === undefined) {
                v = ' '
            }else{
                v = PublicFunc.numToStr(v) + u
            }
            arr.push({k:k,v:v})
        }
        // 暴击 概率
        push('暴击倍数',g.critTimes)
        push('暴击概率',g.critOdds*100,'%')
        push()
        push('*DPS*')
        push('呼朋唤友',g.gdShareDPSTimes)
        push('苦海无涯',g.gdDayDPSTimes)
        push('仙丹&玉净瓶',g.soulDPSTimes)
        push('英雄技能效果',g.heroGlobalDPSTimes)
        const sk6 = DataCenter.getSkill6Data()
        push('阿弥陀佛次数',sk6.count,'次')
        push('阿弥陀佛效果',Math.pow(1.05,sk6.count))
        push('挂机效果',g.idleTimes)
        push('连击效果',g.comboDPSTimes)
        push(z2?'DPS加持':'伤害高又高',g.gdDPSTimes)
        push(z2?'伤害高又高':'双倍DPS',g.gdDoubleDPS)
        push('总DPS倍数',g.globalDPSTimes)
        push()
        push('*金币*')
        push('英雄技能效果',g.heroGoldTimes)
        push('挂机效果',g.idleGoldTimes)
        push('聚宝盆',g.gdDayGoldTimes)
        push(z2?'金币多又多':'双倍金币',g.gdDoubleGold)
        push('昆仑镜',g.addGoldTimes)
        if (!z2) {
            push('金币多又多',g.gdGoldTimes)
        }
        push('总金币倍数',g.globalGoldTimes)
        push()
        push('*仙丹*')
        if (z2) {
            push('仙丹多又多',g.ngdSoulTimes)
        }
        push(z2?'炼丹炉':'仙丹多又多',g.gdSoulTimes)

        console.log(arr);

        let strName = ''
        let strUnit = ''
        arr.forEach(e => {
            if (e.k) {
                strName += e.k +'\n'
                strUnit += e.v+'\n'
            } else {
                strName += '\n'
                strUnit += '\n'
            }
        });
        this.lbName.string = strName
        this.lbUnit.string = strUnit
    },

    finish(){
        this.node.destroy()
    },

});
