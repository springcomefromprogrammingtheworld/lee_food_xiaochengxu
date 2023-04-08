// index.js
const config  = require("../../utils/config/config.js");
const getSign = require("../../utils/sign/sign.js");
// 获取应用实例
const app = getApp()
Page({
  data: {
    module0: config.config.api_base_url + 'beverages/t6.jpg',
    module1: config.config.api_base_url + 'beverages/tx1.png',
  },
})
