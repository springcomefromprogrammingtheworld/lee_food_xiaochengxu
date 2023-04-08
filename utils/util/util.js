const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function formatTimeTwo(number, format) {
 
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

//获取当前时间戳
function timest() {
  var tmp = Date.parse( new Date() ).toString();
  tmp = tmp.substr(0,10);
  return tmp;
}

//获取当今天的0时0分0秒时间戳
function toLocale() {
  var tmp = Date.parse( new Date(new Date(new Date().getTime()).setHours(0,0,0,0))).toString();
  tmp = tmp.substr(0,10);
  return tmp;
}

/**
 * 保留n位小数逢五进一
 * @author spring
 * @Email 466232689@qq.com
 * @param Decimal 浮点数
 * @param number  四舍五入保留的小数位
 * @return rs 返回处理后的浮点数
 * 修改于2018/11/01
 */
function sround(Decimal, number) {
  var rs;
  var numstr;
  if (isNaN(Decimal)) {
    rs = "非数字";
    return rs;
  }

  if (Decimal == parseInt(Decimal)) { //如果是整数
    rs = Decimal;
  } else {
    numstr = Decimal.toString();
    var lNumStr = "";
    var rNumStr = "";
    var pointstr = "";
    for (var i = 0; i < numstr.length; i++) {
      if (numstr[i] != '.' && pointstr != '.') {
        lNumStr += numstr[i];
      } else if (numstr[i] == '.') {
        pointstr = numstr[i];
      } else {
        rNumStr += numstr[i];
      }
    }
    var rnumres = Cdecimal(rNumStr, number);
    if (rnumres == "1") {
      rs = parseInt(lNumStr) + 1;
    } else {
      rs = lNumStr + pointstr + rnumres;
      rs = parseFloat(rs);
    }
  }
  return rs;
}

/**
 * @author spring
 * @Email 466232689@qq.com
 * @param rNumStr 浮点数右边小数
 * @param number  保留的小数位
 * @returns {string} 以字符串的形式返回小数
 * 修改于2018/11/01
 */
function Cdecimal(rNumStr, number) {
  var tmprNumStr = "";
  var tmpnum = "";
  if (rNumStr.length == 1 && number == 1) { //小数长度等于1，并且要保留的小数长度也等于1（不进行四舍五入）
    tmprNumStr = rNumStr;
  } else if (rNumStr.length == number) {//小数长度等于要保留的小数长度（不进行四舍五入）
    tmprNumStr = rNumStr;
  } else if (rNumStr.length > number) { //小数长度大于要保留的小数长度，保留number长度的小数并进行四舍五入
    for (var j = 0; j < rNumStr.length; j++) {
      if (j == number) {
        tmpnum = parseInt(rNumStr[j]);
        break;
      } else {
        tmprNumStr += rNumStr[j];
      }
    }
    if (tmpnum >= 5) { //进行四舍五入
      var and_one;
      if (tmprNumStr[number - 1] == 9 && tmprNumStr[number - 2] == 9) {
        tmprNumStr = replacePos(tmprNumStr, number, 0);
        tmprNumStr = replacePos(tmprNumStr, number - 1, 0);
        if (tmprNumStr.length >= 3) {
          var count = number - 2;//初始替换位置
          var forcount = count;//循环计数器
          var count2 = number - 3;//对比小数初始位置
          for (var i = 0; i < forcount; i++) {
            if (tmprNumStr[count2] == 9) {    //检查小数点是9处理逻辑
              tmprNumStr = replacePos(tmprNumStr, count, 0);
              count -= 1;
              count2 -= 1;
            } else {     //小数点不是9处理完后中断处理逻辑
              and_one = (parseInt(tmprNumStr[count - 1]) + 1).toString();
              tmprNumStr = replacePos(tmprNumStr, count, and_one);
              break;
            }
          }
        }
        if (tmprNumStr == 0) { //如果小数点都是9那么四舍五入后小数点全是0，这时直接返回1
          tmprNumStr = 1;
        }

      } else {
        var res = parseInt(tmprNumStr[number - 1]) + 1;
        if (res == 10) {
          and_one = "0";
          tmprNumStr = replacePos(tmprNumStr, number, and_one);
          tmprNumStr = replacePos(tmprNumStr, number - 1, (parseInt(tmprNumStr[number - 2]) + 1).toString());
        } else {
          and_one = (parseInt(tmprNumStr[number - 1]) + 1).toString();
          tmprNumStr = replacePos(tmprNumStr, number, and_one);
        }

      }
    }
  } else if (rNumStr.length < number) { //小数长度小于要保留的小数长度，循环补0
    tmprNumStr = rNumStr;
    for (var k = 0; k < number - rNumStr.length; k++) {
      tmprNumStr += "0";
    }
  }
  return tmprNumStr;
}

/**
 * 来源第三方
 * @param strObj 字符串源目标
 * @param pos    替换的位置从1开始算起
 * @param replacetext 目标字符串
 * @returns {string|*}
 */
function replacePos(strObj, pos, replacetext) {
  var str = strObj.substr(0, pos - 1);  // 取左边到指定位置的字符串
  str += replacetext;   // 与目标字符串相连
  str += strObj.substring(pos, strObj.length);   // 取指定位置到右边的字符串
  // 现在可以知道这三行的意思为: 在指定位置添加目标字符串
  return str;    // 返回新的字符串
}

//数组求和
function sum(arr) {
  let that = this;
  var len  = arr.length;
  if(len == 0){
    return 0;
  } else if (len == 1){
    return sround(arr[0] , 2);
  } else {
    return sround(arr[0] + sum(arr.slice(1)) , 2);
  }
}

//判断是否包含某个字符串
function defineIndexOf(str, val) {
  return str.indexOf(val);
}

//判断数组是否包含某个字符串
function defineArrIndexOf(arr, val) {
  var arrnew = [];
  for(var i = 0 ; i < arr.length ; i++){
    arrnew.push(arr[i].comparison);
  }
  
  if(defineIndexOf(arrnew , val) !== -1 ){
    return false
  }else{
    return true
  }
}
//两个数组结合成，如下
// [
//   {
//     name:'优惠活动',
//     category:[
//       {
//         id:3,
//         img:config.config.api_base_url + 'beverages/3.jpg',
//         title:'热恋蜜瓜气泡美式',
//         price:15,
//         cancelPrice:50,
//         quantity:0,
//         attribute:[
//           {
//             name:'味道',
//             attr:[
//               '蜜瓜'
//             ]
//           },
//           {
//             name:'口味',
//             attr:[
//               '牛奶',
//               '加糖',
//               '奶昔',
//               '原味'
//             ]
//           }
//         ]
//       }
//     ]
//   },
//   {
//     name:'今日推荐',
//     category:[
//       {
//         id:6,
//         img:config.config.api_base_url + 'beverages/6.jpg',
//         title:'黑金气泡美式',
//         price:22,
//         cancelPrice:35,
//         quantity:0,
//       }
//     ]
//   }
// ]  
function combinationHandle(arr , arr2 , iscartarr){
  var arrnew = [];
  for(var i = 0 ; i < arr.length ; i++){
    var arrvla       = {}
    arrvla.category  = [];
    for(var j = 0 ; j < arr2.length ; j++){
      if(arr[i].small_ptypeid === arr2[j].small_ptypeid){
        arrvla.name      = arr[i].small_typename;
        arrvla.small_img = arr[i].small_img;
        //判断购物车是否商品
        if(iscartarr[arr2[j].small_product_name] !== undefined){
          //判断商品是否有商品属性
          if(iscartarr[arr2[j].small_product_name].attr_object !== '' ){
            //判断购物车有多少个相同有商品属性的商品
            if(iscartarr[arr2[j].small_product_name].same_spn_count !== undefined){
              arr2[j].small_count = iscartarr[arr2[j].small_product_name].same_spn_count;
            }else{
              arr2[j].small_count = iscartarr[arr2[j].small_product_name].small_count;
            }
          }else{
            arr2[j].small_count = iscartarr[arr2[j].small_product_name].small_count;
          }
        }else{
          arr2[j].small_count = 0;
        }
        arr2[j].attr_group = this.attributeHandle(arr2[j].attr_group)
        arrvla.category.push(arr2[j]);
      }
    }
    arrnew.push(arrvla)
  }

  return arrnew;
}
//  {
//    name:'味道',
//    attr:[
//      '蜜瓜'
//    ]
//  },
//  {
//    name:'口味',
//    attr:[
//      '牛奶',
//      '加糖',
//      '奶昔',
//      '原味'
//    ]
//  }
function attributeHandle(arr){
  var arrnews = [];
  var arrsub  = arr.small_attrname.reverse();
  var arrsub2 = arr.small_attrvalue.reverse();
  
  if(arrsub[0] !== null){
    for(var i = 0 ; i < arrsub.length ; i++){
      var sub = {}
      sub.name = arrsub[i];
      sub.attr = arrsub2[i];
      arrnews.push(sub)
    }
  }
  return arrnews;
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  formatTimeTwo:formatTimeTwo,
  sround: sround,
  timest:timest,
  toLocale:toLocale,
  sum:sum,
  defineIndexOf:defineIndexOf,
  defineArrIndexOf:defineArrIndexOf,
  combinationHandle:combinationHandle,
  attributeHandle:attributeHandle
}
