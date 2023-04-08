const config = require("/utils/config/config.js");
//app.js
App({
  onLoad: function (options) {
    // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    const scene = decodeURIComponent(options.scene)
    
  },
  onLaunch: function () {
    //隐藏系统tabbar
    wx.hideTabBar();
    //获取设备信息
    this.getSystemInfo();
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //插入登录的用户的相关信息到数据库
    wx.checkSession({
      success(res) {
        //session_key 未过期，并且在本生命周期一直有效
        
      },
      fail() {
        
      }
    })
    //授权成功后，跳转进入小程序首页
  },
  onShow: function () {
    //隐藏系统tabbar
    wx.hideTabBar();
  },
  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.systemInfo = res;
      }
    });
  },
  editTabbar: function () {
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  globalData: { 
    systemInfo: null,//客户端设备信息
    userInfo: null,
    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#979795",
      "selectedColor": "#1c1c1b",
      "list": [
        {
          "pagePath": "/pages/index/index",
          "iconPath": "",
          "selectedIconPath": "",
          "text": "点单"
        },
        {
          "pagePath": "/pages/order/index",
          "iconPath": "",
          "selectedIconPath": "",
          "text": "订单"
        },
        {
          "pagePath": "/pages/my/index",
          "iconPath": "",
          "selectedIconPath": "",
          "text": "我的"
        }
      ]
    }
  }
})