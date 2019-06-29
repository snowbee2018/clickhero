const self = {}

self.test = function() {
    var datas = {_id:"zhwwaaaaaa",registerTime:1.558077800538e+12,_openid:"newopenid",WeChatUserInfo:{gender:1.0,language:"zh_CN",city:"长春",province:"吉林",country:"中国",nickName:"东军"},gamedata:{}}
    PublicFunc.httpRequest({
        url : "https://www.magicfun.xyz/update",
                    handler : function (event, response) {
            console.info("http请求返回");
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
        uploadData : JSON.stringify({doc:"UserGameData",_id:"zhwwaaaaaa",data:datas}),
    });
}



















module.exports = self