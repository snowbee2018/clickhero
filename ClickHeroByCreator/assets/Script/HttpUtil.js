const self = {}

self.HOST = "https://www.magicfun.xyz"
// self.HOST = "https://localhost"

self.URL_ADD = self.HOST + "/add"
self.URL_UPDATE = self.HOST + "/update"
self.URL_WHERE = self.HOST + "/where"
self.URL_ORDERBY = self.HOST + "/orderBy"
self.URL_RANK = self.HOST + "/rank"
self.URL_CHILD = self.HOST + "/child"
self.URL_KEYCODE = self.HOST + "/keycode1"
self.URL_MYADDRUBY = self.HOST + "/myAddRuby"

self.setGameDataID = function(_id) {
    self.gameDataID = _id
    setTimeout(() => {
        if (!_id) {
            self.getID()
        }
    }, 100);
}

self.getID = function() {
    if (self.openid)
    PublicFunc.httpRequest({
        url : self.HOST + "/getID",handler : function (event, response) {
            console.info("http add请求返回");
            console.info(event);
            console.info(response);
            //{"code":0,"message":"SUCCESS","data":{"_id":"5d2eccce3035e7640648f16b"}}
            if (event == "success") {
                let resp = JSON.parse(response)
                if (resp.code == 0 && resp.message == "SUCCESS" && resp.data) {
                    let _id = resp.data._id
                    console.log("http getID success.");
                    console.log(_id);
                    self.setGameDataID(_id)
                    DataCenter.getCloudData()._id = _id
                }
            }
        }.bind(this),
        method : "POST",
        uploadData : encodeURIComponent(JSON.stringify({openid:self.openid})),
    });
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
    data.maxLv = data.gamedata.maxPassLavel + 1
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
    const userData = DataCenter.readGameData()
    if (userData&&userData.gamedata) {
        const time = userData.gamedata.lastEnterGameTime
        console.log("数据时间差值：" + (Date.now() - time));
        
        // if (Date.now() - time < 1 * 86400000) {
            console.log("使用本地UserData数据");
            callback(true, [userData]);
            return
        // }
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
                    console.log("http getGameData success.");
                    console.log(data);
                    // 比较数据
                    if (userData&&userData.gamedata&&data.length > 0) {
                        console.log("xxxj 比较本地数据和服务器数据，取最新的");
                        const time0 = userData.gamedata.lastEnterGameTime
                        const time1 = data[0].gamedata.lastEnterGameTime
                        console.log("本地："+time0);
                        console.log("云端："+time1);
                        console.log("实际使用数据："+(time0 > time1 ? "本地" : "云端"));
                        let d = time0 > time1 ? [userData] : data
                        callback(true,d)
                    }else {
                        callback(true,data)
                    }
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
    let maxLv = DataCenter.getDataByKey(DataCenter.KeyMap.maxPassLavel)+1||1;
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
        uploadData : JSON.stringify({doc:"UserGameData",_id:self.gameDataID,data:{maxLv:maxLv,openid:self.openid}}),
    });
}

self.getRankUsers = function(registerTime,offset,callback) {
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
        uploadData : JSON.stringify({skip:offset, registerTime:registerTime}
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

self.myAddRuby = function(callback) {
    PublicFunc.httpRequest({
        url : self.URL_MYADDRUBY,handler : function (event, response) {
            if (event == "success") {
                let resp = JSON.parse(response)
                if (resp.code == 0 && resp.message == "SUCCESS" && resp.data) {
                    let data = resp.data
                    console.log("http myAddRuby success.");
                    console.log(data);
                    callback(data);
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

// ============== Club ===============
self.club = function(callback) {
    PublicFunc.httpRequest({
        url : self.HOST + "/club",handler : function (event, response) {
            console.info("http club 请求返回");
            console.info(event);
            console.info(response);
            if (event == "success") {
                let resp = JSON.parse(response)
                if (resp.code == 0 && resp.message == "SUCCESS" && resp.data) {
                    let data = resp.data
                    console.log("http club success.");
                    console.log(data);
                    callback(true,data);
                    return
                }
            }
            if (callback) {
                callback(false);
            }
        }.bind(this),
        method : "POST",
        uploadData : encodeURIComponent(JSON.stringify({openid:self.openid})),
    });
}
self.createClub = function(name,callback) {
    PublicFunc.httpRequest({
        url : self.HOST + "/createClub",handler : function (event, response) {
            console.info("http createClub 请求返回");
            console.info(event);
            console.info(response);
            if (event == "success") {
                let resp = JSON.parse(response)
                if (resp.code == 0 && resp.message == "SUCCESS" && resp.data) {
                    let data = resp.data
                    console.log("http createClub success.");
                    console.log(data);
                    callback(true,data);
                    return
                }
            }
            if (callback) {
                callback(false);
            }
        }.bind(this),
        method : "POST",
        uploadData : encodeURIComponent(JSON.stringify({openid:self.openid,name:name})),
    });
}
self.searchClub = function(name,callback) {
    PublicFunc.httpRequest({
        url : self.HOST + "/searchClub",handler : function (event, response) {
            console.info("http searchClub 请求返回");
            console.info(event);
            console.info(response);
            if (event == "success") {
                let resp = JSON.parse(response)
                if (resp.code == 0 && resp.message == "SUCCESS" && resp.data) {
                    let data = resp.data
                    console.log("http searchClub success.");
                    console.log(data);
                    callback(true,data);
                    return
                }
            }
            if (callback) {
                callback(false);
            }
        }.bind(this),
        method : "POST",
        uploadData : encodeURIComponent(JSON.stringify({openid:self.openid,name:name})),
    });
}
self.joinClub = function(clubid,callback) {
    PublicFunc.httpRequest({
        url : self.HOST + "/joinClub",handler : function (event, response) {
            console.info("http joinClub 请求返回");
            console.info(event);
            console.info(response);
            if (event == "success") {
                let resp = JSON.parse(response)
                if (resp.code == 0 && resp.message == "SUCCESS" && resp.data) {
                    let data = resp.data
                    console.log("http joinClub success.");
                    console.log(data);
                    callback(true,data);
                    return
                }
            }
            if (callback) {
                callback(false);
            }
        }.bind(this),
        method : "POST",
        uploadData : encodeURIComponent(JSON.stringify({openid:self.openid,clubid:clubid})),
    });
}
self.randomClub = function(callback) {
    PublicFunc.httpRequest({
        url : self.HOST + "/randomClub",handler : function (event, response) {
            console.info("http randomClub 请求返回");
            console.info(event);
            console.info(response);
            if (event == "success") {
                let resp = JSON.parse(response)
                if (resp.code == 0 && resp.message == "SUCCESS" && resp.data) {
                    let data = resp.data
                    console.log("http randomClub success.");
                    console.log(data);
                    callback(true,data);
                    return
                }
            }
            if (callback) {
                callback(false);
            }
        }.bind(this),
        method : "POST",
        uploadData : encodeURIComponent(JSON.stringify({openid:self.openid})),
    });
}
self.request = function(fname,updata,callback) {
    updata = updata || {}
    updata.openid = updata.openid || self.openid
    PublicFunc.httpRequest({
        url : self.HOST + "/" + fname,handler : function (event, response) {
            console.info("http "+fname+" 请求返回");
            console.info(event);
            console.info(response);
            if (event == "success") {
                let resp = JSON.parse(response)
                if (resp.code == 0 && resp.message == "SUCCESS" && resp.data) {
                    let data = resp.data
                    console.log("http "+fname+" success.");
                    console.log(data);
                    callback(true,data);
                    return
                }
            }
            if (callback) {
                callback(false);
            }
        }.bind(this),
        method : "POST",
        uploadData : encodeURIComponent(JSON.stringify(updata)),
    });
}

module.exports = self