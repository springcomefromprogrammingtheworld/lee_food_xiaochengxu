//index.js
const config = require("../../utils/config/config.js");
const getSign = require("../../utils/sign/sign.js");
//获取应用实例
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          if (app.globalData.userInfo) {
            
            wx.showLoading({
              title: ''
            })
            wx.navigateBack({
              delta: 2
            })
            wx.hideLoading()            
          } else if (that.data.canIUse){
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
              
              wx.showLoading({
                title: ''
              })
              wx.navigateBack({
                delta: 2
              })
              wx.hideLoading()
            }
          } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
              success: res => {
              
                //用户已经授权过
                wx.showLoading({
                  title: ''
                })
                wx.navigateBack({
                  delta: 2
                })
                wx.hideLoading()
              }
            })
          }
        }
      }
    })
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            wx.showLoading({
              title: ''
            })
            //发起网络请求
            var data = {
              code: res.code,
              rawData: e.detail.rawData,
              signature: e.detail.signature,
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv,
              timestamp:getSign.nowtime(),
              leekey:config.signkey
            }
            var ksort = getSign.sort_ascii(data);
            var sign  = getSign.getSign(ksort);
            data.sign = sign;
            wx.request({
              url: config.config.api_base_url + 'smallmall/small_mall_login',
              data: data,
              method: "POST",
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(rs) {
                try {
                  app.globalData.userInfo = rs.data.data;
                  wx.setStorageSync('userinfo', rs.data.data)
                  wx.switchTab({
                    url: '/pages/index/index',
                    success:function () {
                      var page = getCurrentPages().pop();
                      if (page == undefined || page == null) return;
                      page.onLoad();   //重新刷新页面
                    }
                  })
                  wx.hideLoading()
                } catch (e) {

                }
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
      //授权成功后，跳转进入小程序首页
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  }
})