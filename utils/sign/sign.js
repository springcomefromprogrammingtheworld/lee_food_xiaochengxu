var hsha256 = require('../sha256/sha256.js');
var config = require('../config/config.js');
var base64 = require('../base64/base64.js');
/**
 * 返回当前按unix时间戳
 * @returns {number}
 */
function nowtime(){
  return  Math.round(new Date() / 1000);
};

/**
 * 对象进行ascii排序
 * @param obj
 */
function sort_ascii(obj){
  var arr = new Array();
  var num = 0;
  for (var i in obj) {
    arr[num] = i;
    num++;
  }
  var sortArr = arr.sort();
  var sortObj = {};
  for (var i in sortArr) {
    sortObj[sortArr[i]] = obj[sortArr[i]];
  }
  return sortObj;
};

/**
* 生成签名。
*/	
function getSign(arr) {
  var signPars = "";
  for(var key in arr) {
    if("sign" != key && "" != arr[key] && null!=arr[key]&&typeof arr[key]!="object") {
      signPars += key + "=" + arr[key] + "&";
    }
  }
  signPars += config.signkey;
  
  var sign = hsha256.sha256(base64.encode(signPars));
  return sign;	
}

module.exports = {
  nowtime: nowtime,
  sort_ascii: sort_ascii,
  getSign: getSign
}
