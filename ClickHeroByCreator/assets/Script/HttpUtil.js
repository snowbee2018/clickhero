const self = {}

self.HOST = "https://www.magicfun.xyz"

self.URL_ADD = self.HOST + "/add"
self.URL_UPDATE = self.HOST + "/update"
self.URL_WHERE = self.HOST + "/where"

self.addGameData = function(data) {
    console.log("httpUtil addGameData");
    // delete data.ChildUsers
    // data.gamedata = {}
    data.gamedata.heroList = null
     data.gamedata.ancientList = null
     data.gamedata.monsterInfo = null
     data.gamedata.goodsList = {"null":"jkj法国大沙发沙发上伏尔塔热风暗示法萨尔gas感染给人尴尬生日歌kh"}
    
     data.gamedata.skillList = null
     data.gamedata.taskTargets = null
     data.gamedata.shareReceiveData = null

    //  data.gamedata.curGold = null
    //  data.gamedata.curSoul = null
    //  data.gamedata.historyTotalGold = null
    //  data.gamedata.rebirthSoul = null
    //  data.gamedata.totalSoul = null
    //  data.gamedata.skill6Data = null
     
    console.log(data);
    // console.log(JSON.stringify({doc:"UserGameData",_id:data._id,data:data}));
    
    PublicFunc.httpRequest({
        url : self.URL_ADD,handler : function (event, response) {
            console.info("http add请求返回");
            console.info(event);
            console.info(response);
            if (event == "success") {
                
            } else if (event == "error") {
                // 
            } else if (event == "timeout") {
                // 
            }
        }.bind(this),
        method : "POST",
        uploadData : JSON.stringify({doc:"UserGameData",_id:data._id,data:data}),
    });
}

self.updateGameData = function(data) {
    PublicFunc.httpRequest({
        url : self.URL_UPDATE,handler : function (event, response) {
            console.info("http update请求返回");
            console.info(event);
            console.info(response);
            if (event == "success") {
                
            } else if (event == "error") {
                // 
            } else if (event == "timeout") {
                // 
            }
        }.bind(this),
        method : "POST",
        uploadData : JSON.stringify({doc:"UserGameData",_id:data._id,data:data}),
    });
}


self.getGameData = function(id) {
    PublicFunc.httpRequest({
        url : self.URL_WHERE,handler : function (event, response) {
            console.info("http where请求返回");
            console.info(event);
            console.info(response);
            if (event == "success") {
                
            } else if (event == "error") {
                // 
            } else if (event == "timeout") {
                // 
            }
        }.bind(this),
        method : "POST",
        uploadData : JSON.stringify({doc:"UserGameData",data:{_openid:id}}),
    });
}













module.exports = self