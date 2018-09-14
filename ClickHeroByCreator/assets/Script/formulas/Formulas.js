
cc.Class({
    statics: {
        // 计算DPS
        getDPS(baseDPS,lv){
            // let DPS = baseDPS * lv;
            let DPS = baseDPS * lv * this.getDPSTimes();
            return DPS;
        },
        // 升级点击怪金币
        getClickHeroCost(lv){
            if(lv <= 15){
                return Math.floor((5 + lv) * Math.pow(1.07,lv - 1));
            }else if (lv >= 16){
                return Math.floor(20 * Math.pow(1.07,lv - 1));
            }
        },
        // 升级DPS怪金币
        getHeroCost(baseCost,lv){
            return Math.floor(baseCost * Math.pow(1.07,lv - 1));
        },
        // 计算怪物HP
        getMonsterHP(lv){
            var boss = lv % 5 == 0 ? 10 : 1;
            var hp;
            if (lv <= 140){
                hp = 10 * (lv - 1 + Math.pow(1.55,lv-1)) * boss;
            } else if(lv <= 500){
                hp = 10*(139+Math.pow(1.55,139)*Math.pow(1.145,lv-140))*boss
            } else if(lv <= 200000){
                var P = 1;
                for (var i = 501;i < lv;i++){
                    P *= (1.145 + 0.001* Math.floor((i-1)/500))
                }
                hp = 10 * (139 + Math.pow(1.55,139) * Math.pow(1.145,360)*P)*boss
            } else {
                hp = (Math.pow(1.545,lv-200001)*1.24*Math.pow(10,25409)+(lv - 1)*10)
            }
            return Math.ceil(hp);
        },
        // 计算怪物金币
        // hp = getMonsterHP(lv);
        getMonsterGold(lv,hp){
            return Math.ceil(hp / 15 * Math.min(3,Math.pow(1.025,lv)) * this.getGoldTimes());
        },
        // 计算DPS倍数
        getDPSTimes(){
            return 1;
        },
        // 计算金币倍数
        getGoldTimes(){
            return 1;
        },
    },
});
