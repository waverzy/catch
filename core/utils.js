/**
 * Created by waver on 2017/5/5.
 */
var utils = {};

utils.charToNum = function charToNum (charStr) {
    return charStr.charCodeAt(0)-50;
};

utils.strToNum = function (str) {
    for(var i=0; i<str.length; i++)
    {
        var char = str.charAt(i)
        if(char < '0' || char > '9' )
        {
            // var reg = new RegExp(char,"g");
            str = str.replace(char, this.charToNum(char).toString());
        }
    }
    return parseInt(str);
};

/**
 * [binarySearch 二分查找]
 * @param   value      [查找元素]
 * @param   arr        [数组]
 * @param   startIndex [开始索引]
 * @param   endIndex   [结束索引]
 * @return  {boolean}   [返回是否存在]
 */
utils.binarySearch = function binarySearch (value, arr, startIndex, endIndex) {
    if(!value|| !(arr instanceof Array))  return false;
    var len        = arr.length,
        startIndex = typeof startIndex === "number" ? startIndex : 0,
        endIndex   = typeof endIndex   === "number" ? endIndex   : len-1,
        midIndex   = Math.floor((startIndex + endIndex) / 2),
        midval     = arr[midIndex];

    if(startIndex > endIndex) return false;

    if(midval === value){
        return true;
    }else if (midval > value) {
        return binarySearch(value, arr, startIndex, midIndex - 1);
    }else {
        return binarySearch(value, arr, midIndex + 1, endIndex);
    }
}

module.exports = utils;