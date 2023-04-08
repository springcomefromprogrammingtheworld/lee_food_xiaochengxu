// pages/address/index.js
const config   = require("../../utils/config/config.js");
const getSign  = require("../../utils/sign/sign.js");

// 获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    
  },
  //跳转
  JumpTo(e){
    wx.switchTab({
      url: e.currentTarget.dataset.url,
      success:function () {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();   //重新刷新页面
      }
    })
  },
  
})