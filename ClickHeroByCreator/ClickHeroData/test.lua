
local time = os.time()
local interval = time - math.floor("155791013711" / 100)
local yearTime = 60 * 60 * 24 * 365
local monthTime = 60 * 60 * 24 * 30
local dayTime = 60 * 60 * 24
local hourTime = 60 * 60
local minTime = 60
local str
if interval >= yearTime then
    str = math.floor(interval / yearTime) .. "年前"
elseif interval >= monthTime then
    str = math.floor(interval / monthTime) .. "年前"
elseif interval >= dayTime then
    str = math.floor(interval / dayTime) .. "天前"
elseif interval > hourTime then
    str = math.floor(interval / hourTime) .. "小时前"
elseif interval > minTime * 5 then
    str = math.floor(interval / minTime) .. "分钟前"
else
    str = "刚刚"
end
print(str)

-- 1557911438
-- 1557910137202