// globalDPS // 全局DPS加成
// clickDamage // 点击伤害加成
// gold // 金币加成
// heroDPS // 英雄DPS加成
// bjDamage // 暴击伤害加成
// bjProbability // 暴击概率加成
// unlock // 解锁主动技能
// cost // 解锁技能的花费
// level // 解锁技能的等级
// name // 技能显示的名字
// describe // 技能描述
// DPSClick // 附加DPS点击
var cfg = {
    0: [ // key : heroID
        {
            clickDamage: 2,
            level: 10,
            cost: "1e+2",
            name: "大痘痘",
            describe: "Cid具有增强点击次数的独特能力。升级她以使您的点击更强大。",
        },
        {
            unlock: "ClickStorm",
            level: 25,
            cost: "2.5e+2",
            name: "Clickstorm",
            describe: "“我也很惊讶，但事实证明我们可以进一步升级这些，”Cid说。“我怀疑你已经厌倦了点击率。也许你不需要这个？”",
        },
        {
            clickDamage: 2,
            level: 50,
            cost: "1e+3",
            name: "巨大的点击次数",
            describe: "Cid独特的能力可以增强力量，让你更难点击。",
        },
        {
            clickDamage: 2,
            level: 75,
            cost: "8e+3",
            name: "大量点击",
            describe: "“我们组建了一支优秀的团队，”Cid说。“让我们进行升级，我们将成为一个更好的团队。”",
        },
        {
            clickDamage: 2.5,
            level: 100,
            cost: "8e+4",
            name: "泰坦尼克号点击",
            describe: "Cid眺望远方并想知道，“有什么能比泰坦尼克号更大？”",
        },
        {
            clickDamage: 3,
            level: 125,
            cost: "4e+5",
            name: "巨大的点击",
            describe: "“巨大的点击量大于泰坦尼克号的点击量。我们应该得到这一点。我认为不会有更大的点击量，”Cid说。",
        },
        {
            clickDamage: 3.5,
            level: 150,
            cost: "4e+6",
            name: "巨大的点击次数",
            describe: "“最后的升级。这些点击非常大，每当你点击它们时，它们都会建造一座纪念碑来纪念它。”",
        },
    ],
    1: [ // key : heroID
        {
            heroDPS: 2,
            level: 10,
            cost: "5e+2",
            name: "肥料",
            describe: "当您考虑此升级时，Treebeast会批准批准。这将使他变得更强大。",
        },
        {
            heroDPS: 2,
            level: 25,
            cost: "1.25e+3",
            name: "荆棘",
            describe: "Treebeast的武器尖锐点，帮助切割敌人。",
        },
        {
            heroDPS: 2,
            level: 50,
            cost: "5e+3",
            name: "Megastick",
            describe: "Treebeast真的很棒。",
        },
        {
            heroDPS: 2.5,
            level: 75,
            cost: "4e+4",
            name: "Ultrastick",
            describe: "森林里最大的棍子。",
        },
        {
            DPSClick: 0.005,
            level: 100,
            cost: "4e+4",
            name: "漆",
            describe: "适用于耐用性和强度的大棒。",
        },
    ],
    2: [ // key : heroID
        {
            heroDPS: 2,
            level: 10,
            cost: "2.5e+3",
            name: "硬苹果酒",
            describe: "开胃一整夜的开胃菜。",
        },
        {
            heroDPS: 2,
            level: 25,
            cost: "6.25e+3",
            name: "一品脱啤酒",
            describe: "伊万喜欢品脱，从边缘消失。",
        },
        {
            heroDPS: 2,
            level: 50,
            cost: "2.5e+4",
            name: "投手",
            describe: "伊万把他的抑制力放在风中，他的拳头投入到脸上。",
        },
        {
            unlock: "Powersurge",
            level: 75,
            cost: "2e+5",
            name: "Powersurge",
            describe: "将你的DPS加倍，持续30秒。10分钟的冷却时间。",
        },
        {
            DPSClick: 0.005,
            level: 100,
            cost: "2e+6",
            name: "防腐液",
            describe: "在喝完镇干之后，伊万现在必须采取防腐液来防止震动。",
        },
        {
            heroDPS: 2.5,
            level: 125,
            cost: "1e+7",
            name: "品脱猪的威士忌",
            describe: "它是如此强大，如果她还没有它，它会在你的萨莉姨妈身上留下胸毛。",
        },
    ],
    3: [ // key : heroID
        {
            heroDPS: 2,
            level: 10,
            cost: "1e+4",
            name: "打击化妆",
            describe: "你怀疑她会像她应该那样用它来伪装。事实上，她可能甚至不知道什么是“伪装”的意思。",
        },
        {
            heroDPS: 2,
            level: 25,
            cost: "2.5e+4",
            name: "品牌设备",
            describe: "她说：“我不喜欢其他女孩。我永远不会喜欢带你去找花岗岩”。",
        },
        {
            heroDPS: 2,
            level: 50,
            cost: "1e+5",
            name: "Deditzification药剂",
            describe: "这种灵药的效果可能太温和，乍一看不太明显，但布列塔尼的战斗力将显着提高。",
        },
        {
            heroDPS: 2.5,
            level: 75,
            cost: "8e+5",
            name: "纯素肉",
            describe: "在大森林先知的帮助下，他对你的熟肉进行“祝福”，让他们吃素，所以布列塔尼可以吃它们。",
        },
    ],
    4: [ // key : heroID
        {
            heroDPS: 2,
            level: 10,
            cost: "4e+4",
            name: "矛训练",
            describe: "“我只用过这支长矛钓鱼。我需要学习如何在战斗中更好地使用它。”",
        },
        {
            heroDPS: 2,
            level: 25,
            cost: "1e+5",
            name: "螃蟹网",
            describe: "“我可以用很少的努力获得食物。” 你的团队会对此感激不尽......",
        },
        {
            globalDPS: 2,
            level: 50,
            cost: "4e+5",
            name: "磨石",
            describe: "我曾经有过这些。不知道发生了什么事。“如果他能够削尖他的矛，他会造成更多的伤害。",
        },
        {
            globalDPS: 1.25,
            level: 75,
            cost: "3e+6",
            name: "鱼烹饪",
            describe: "“贝蒂一直教我。我们将能为团队做饭！”",
        },
        {
            DPSClick: 0.005,
            level: 100,
            cost: "3e+7",
            name: "最先进的渔具",
            describe: "“我们应该能够购买所有这些漂亮的新装备，因为我们一直在卖掉我们不需要的所有额外的鱼。现在我们可以承受更大的负荷！”",
        },
    ],


}

module.exports = cfg;