const self = {}

self.HOST = "https://www.magicfun.xyz"
// self.HOST = "https://localhost:443"

self.URL_ADD = self.HOST + "/add"
self.URL_UPDATE = self.HOST + "/update"
self.URL_WHERE = self.HOST + "/where"
self.URL_ORDERBY = self.HOST + "/orderBy"
self.URL_RANK = self.HOST + "/rank"
self.URL_CHILD = self.HOST + "/child"
self.URL_KEYCODE = self.HOST + "/keycode"

self.setGameDataID = function(_id) {
    self.gameDataID = _id
}

self.setOpenID = function(openid) {
    self.openid = openid
}

self.addGameData = function(data,callback) {
    console.log("httpUtil addGameData");
    console.log(data);
    // data._id = self.openid
    PublicFunc.httpRequest({
        url : self.URL_ADD,handler : function (event, response) {
            console.info("http add请求返回");
            console.info(event);
            console.info(response);
            //{"code":0,"message":"SUCCESS","data":{"_id":"5d2eccce3035e7640648f16b"}}
            if (event == "success") {
                let resp = JSON.parse(response)
                if (resp.code == 0 && resp.message == "SUCCESS" && resp.data) {
                    let _id = resp.data._id
                    console.log("http add success.");
                    console.log(_id);
                    self.setGameDataID(_id)
                    callback(true,_id)
                }
            } else if (event == "error") {
                // 
            } else if (event == "timeout") {
                // 
            }
            callback(false)
        }.bind(this),
        method : "POST",
        uploadData : encodeURIComponent(JSON.stringify({doc:"UserGameData",data:data})),
    });
}

self.updateGameData = function(data) {
    console.log("httpUtil updateGameData");
    console.log(data);
    data = DataCenter.readGameData()
    delete data._id
    data.maxLv = data.gamedata.maxPassLavel
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
        uploadData : encodeURIComponent(JSON.stringify({doc:"UserGameData",_id:self.gameDataID,data:data})),
    });
}


self.getGameData = function(id,callback) {
    let userData = DataCenter.readGameData()
    if (userData) {
        console.log("使用本地UserData数据");
        callback(true, [userData]);
        return
    } 
    PublicFunc.httpRequest({
        url : self.URL_WHERE,handler : function (event, response) {
            console.info("http get请求返回");
            console.info(event);
            console.info(response);
            if (event == "success") {
                let resp = JSON.parse(response)
                if (resp.code == 0 && resp.message == "SUCCESS" && resp.data) {
                    let data = resp.data
                    console.log("http get success.");
                    console.log(data);
                    callback(true,data)
                    return
                }
            } else if (event == "error") {
            } else if (event == "timeout") {
            }
            callback(false)
        }.bind(this),
        method : "POST",
        uploadData : encodeURIComponent(JSON.stringify({doc:"UserGameData",data:{_openid:self.openid}})),
    });
}

self.updateMaxLv = function() {
    console.log("httpUtil updateMaxLv");
    let maxPassLavel = DataCenter.getDataByKey(DataCenter.KeyMap.maxPassLavel)||0;
    PublicFunc.httpRequest({
        url : self.URL_UPDATE,handler : function (event, response) {
            console.info("http updateMaxLv 请求返回");
            console.info(event);
            console.info(response);
            if (event == "success") {
            } else if (event == "error") {
            } else if (event == "timeout") {
            }
        }.bind(this),
        method : "POST",
        uploadData : JSON.stringify({doc:"UserGameData",_id:self.gameDataID,data:{maxLv:maxPassLavel}}),
    });
}

self.getRankUsers = function(isNew,offset,callback) {
    PublicFunc.httpRequest({
        url : self.URL_RANK,handler : function (event, response) {
            console.info("http rank 请求返回");
            console.info(event);
            console.info(response);
            if (event == "success") {
                let resp = JSON.parse(response)
                if (resp.code == 0 && resp.message == "SUCCESS" && resp.data) {
                    let data = resp.data
                    console.log("http rank success.");
                    console.log(data);
                    if (callback) {
                        callback(data)
                    }
                    return
                }
            } else if (event == "error") {
            } else if (event == "timeout") {
            }
            if (callback) {
                callback([]);
            }
        }.bind(this),
        method : "POST",
        uploadData : JSON.stringify({skip:offset, isNew:isNew}
            // ,data:{maxLv:lv}}
        ),
    });
}

self.getChildUsers = function(callback) {
    PublicFunc.httpRequest({
        url : self.URL_CHILD,handler : function (event, response) {
            console.info("http child 请求返回");
            console.log(JSON.stringify({openid:self.openid}));
            
            console.info(event);
            console.info(response);
            if (event == "success") {
                let resp = JSON.parse(response)
                if (resp.code == 0 && resp.message == "SUCCESS" && resp.data) {
                    let data = resp.data
                    console.log("http child success.");
                    console.log(data);
                    DataCenter.saveChildUserData(data)
                    // callBack(false, data);
                    Events.emit(Events.ON_BUY_GOODS,16)
                    if (callback) {
                        callback(true,data)
                    }
                    return
                }
            } else if (event == "error") {
            } else if (event == "timeout") {
            }
            if (callback) {
                callback(false);
            }
        }.bind(this),
        method : "POST",
        uploadData : encodeURIComponent(JSON.stringify({openid:self.openid})),
    });
}

self.keycode = function(key,callback) {
    PublicFunc.httpRequest({
        url : self.URL_KEYCODE,handler : function (event, response) {
            console.info("http keycode 请求返回");
            console.log(JSON.stringify({openid:self.openid}));
            
            console.info(event);
            console.info(response);
            if (event == "success") {
                let resp = JSON.parse(response)
                if (resp.code == 0 && resp.message == "SUCCESS" && resp.data) {
                    let data = resp.data
                    console.log("http keycode success.");
                    console.log(data);
                    callback(true,data);
                    return
                }
            } else if (event == "error") {
            } else if (event == "timeout") {
            }
            if (callback) {
                callback(false);
            }
        }.bind(this),
        method : "POST",
        uploadData : encodeURIComponent(JSON.stringify({keycode:key,openid:self.openid})),
    });
}

module.exports = self