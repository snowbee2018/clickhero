// example
// var a = new BigNumber("1111111111");
// var b = new BigNumber("11111");
// console.log(a.Add(b).formatDisplayStr());

var checkStr = function (str) {
    if (!str) throw Error('null str');
    if (str.length == 0) throw Error('empty str');
    for (let index = 0; index < str.length; index++) {
        const char = str[index];
        if (! /0|1|2|3|4|5|6|7|8|9/.test(char)) {
            throw Error('Contains non-numeric characters');
            break;
        }
    }
    // 去掉前面的0
    var startIndex = -1;
    for (let index = 0; index < str.length; index++) {
        const char = str[index];
        // console.log("char = " + char);        
        if (char != "0") {
            startIndex = index;
            break;
        }
    }
    if (startIndex >= 0) {
        return str.substring(startIndex);
    } else {
        return "0";
    }
}

var unitCfg = {
    4 : "a",
    7 : "A",
    10 : "b",
    13 : "B",
    16 : "c",
    19 : "C",
    22 : "d",
    25 : "D",
    28 : "e",
    31 : "E",
    34 : "f",
    37 : "F",
    40 : "g",
    43 : "G",
    46 : "h",
    49 : "H",
    52 : "i",
    55 : "I",
    58 : "j",
    61 : "J",
    64 : "k",
    67 : "K",
    70 : "l",
    73 : "L",
    76 : "m",
    79 : "M",
    82 : "n",
    85 : "N",
    88 : "o",
    71 : "O",
    74 : "p",
    77 : "P",
    80 : "q",
    83 : "Q",
    86 : "r",
    89 : "R",
    92 : "s",
    95 : "S",
    98 : "t",
    101 : "T",
    104 : "u",
    107 : "U",
    110 : "v",
    113 : "V",
    116 : "w",
    119 : "W",
    122 : "x",
    125 : "X",
    128 : "y",
    131 : "Y",
    134 : "z",
    137 : "Z",
}
var unitLimitCfg = [4,7,10,13,16,19,22,25,28,31,34,37,40,43,46,49,52,55,58,61,64,67,70,73,76,79,82,85,88,71,74,77,80,
                83,86,89,92,95,98,101,104,107,110,113,116,119,122,125,128,131,134,137];

var getLimitIndex = function (length) {
    if (length > 4) {
        for (let index = unitLimitCfg.length - 1; index >= 0; index--) {
            const element = unitLimitCfg[index];
            if (length > element) {
                return element;
            }
        }
    }
}
var getUnit = function (length) {
    if (length > 4) {
        var index = getLimitIndex(length);
        if (index) {
            return {
                unitStr : unitCfg[index],
                limitIndex : index,
            }
        } else {
            return {
                unitStr : "e" + (length - 3),
                limitIndex : length - 2,
            };
        }
    }
}

class BigNumber {
    content = "0";

    constructor(_content) {
		if(_content) this.content = checkStr(_content);
    }
    
    Add = (b) => {
        const a = this;
        if (b instanceof BigNumber) {
            var aStr = a.content, bStr = b.content;
            var res = '', c = 0;
            aStr = aStr.split('');
            bStr = bStr.split('');
            while (aStr.length || bStr.length || c){
                c += ~~aStr.pop() + ~~bStr.pop();
                res = c % 10 + res;
                c = c > 9;
            }
            res = res.replace(/^0+/,'');
            if (res === ''){
                res = "0";
            } else if (res[0] == "-") {
                res = "0";
            }
            return new BigNumber(res);
        } else {
            throw Error('operatorAdd, typeErr');
        }
    }

    Sub = (b) => {
        const a = this;
        if (b instanceof BigNumber) {
            var aStr = a.content, bStr = b.content;

            //将字符串a和b补全成同等长度
            while (aStr.length < bStr.length){
                aStr = '0' + a;
            }
            while (bStr.length < a.length){
                bStr = '0' + bStr;
            }
            //res保存结果，c用来标识有无借位的情况
            var res='', c=0;
            aStr = aStr.split('');
            bStr = bStr.split('');
            while (aStr.length) {
                var num1 = ~~aStr.pop();
                var num2 = ~~bStr.pop();
                if (num1 >= num2){
                    c = num1 - num2 - c;
                    res = c + res;
                    c = false;
                } else {
                    c = num1 + 10 - num2 - c;
                    res = c + res;
                    c = true
                }
                //判断最高位有无借位，若有借位，则说明结果为负数
                if (aStr.length === 0 && c){
                    res = '-' + res
                }
            }
            res = res.replace(/^0+/,'');
            //判断最后的结果是否为0
            if (res === ''){
                res = "0";
            } else if (res[0] == "-") {
                res = "0";
            }

            return new BigNumber(res);
        } else {
            throw Error('operatorSub, typeErr');
        }
    }

    toString = () => {
        return this.content;
    }

    formatDisplayStr = () => {
        if (this.content.length <= 4) {
            return this.content;
        } else {
            var obj = getUnit(this.content.length);
            if (obj) {
                var end = this.content.length - (obj.limitIndex - 1);
                var z = this.content.substring(0, end);
                var x = this.content.substring(end, end + 2);
                return z + "." + x + obj.unitStr;
            }
        }
    }
};

module.exports = BigNumber;