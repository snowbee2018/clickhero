print("hello ClickHeroData")

local Json = require "json"
local file = io.open("data190519.json")
local datas = {}
local t
for line in file:lines() do
    -- print(line)
    t = Json.decode(line)
    table.insert( datas, t )
end

function getDatasByLv(lv,toLv)
    local temp = {}
    for i,v in ipairs(datas) do
        if v and v.gamedata and v.gamedata.maxPassLavel and v.gamedata.maxPassLavel >= lv and v.gamedata.maxPassLavel < toLv then
            table.insert( temp, v )
        end
    end
    return temp
end
function printGtLv(lv,toLv)
    print(""..lv.."~"..toLv.."："..#getDatasByLv(lv,toLv))
end
function printDatasLv(arr)
    for i,v in ipairs(arr) do
        print(v.WeChatUserInfo.nickName .."_"..v.gamedata.ruby .. "_" .. v.gamedata.maxPassLavel)
    end
end

print("总用户数："..#datas)
printGtLv(100,9000)
printGtLv(50,100)
printGtLv(30,50)
printGtLv(10,30)

printDatasLv(getDatasByLv(300,2000))
print("finish!")
-- print(v.WeChatUserInfo.nickName .." "..v.gamedata.ruby .. " " .. v.gamedata.maxPassLavel)
-- print(t.gamedata.curSoul)