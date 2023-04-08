// index.js
// index.js
const config  = require("../../utils/config/config.js");
const getSign = require("../../utils/sign/sign.js");
// 获取应用实例
const app = getApp()
Page({
  data: {
    tabbar: {},//底部菜单
    orderData:[],
    page:1,
    rows:6,
    count:0,
    getalldata:false//true时代表所有订单数据已经全部获取得到
  },
  //跳转
  JumpTo(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  onLoad(e){
    //获取底部导航栏
    app.editTabbar();
    this.obtainOrderHandle();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow (e) {

  },
  //获取订单数据
  obtainOrderHandle(e){
    let that  = this;
    var userinfo = wx.getStorageSync('userinfo');
    if(userinfo.small_openid != undefined){
      if(this.data.orderData.length>0&&this.data.getalldata===false){
        that.setData({
          page:this.data.page+1,
        },()=>{
          this.afterdata();
        });
      }else if(this.data.orderData.length>0&&this.data.getalldata===true){
       console.log("所有订单数据已完成接收");
      }else{
        this.afterdata();
      }
    }
  },
  afterdata(){
    let that=this;
    var userinfo = wx.getStorageSync('userinfo');
    var data  = {
      page:this.data.page,
      rows:this.data.rows,
      stime:'',
      etime:'',
      status:1,
      small_openid:userinfo.small_openid,
      timestamp:getSign.nowtime(),
      leekey:config.signkey
    }
    var ksort = getSign.sort_ascii(data);
    var sign  = getSign.getSign(ksort);
    data.sign = sign;
    wx.request({
      url: config.config.api_base_url + 'smallmall/small_mall_order_record',
      data: data,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(rs) {
        if(rs.data.status == 0&&rs.data.data.record.length>0){
          var record = rs.data.data.record;
          for(var i = 0 ; i < record.length ; i++){
            if(record[i].suborderdata.length!=0){
              for(var j = 0 ; j < record[i].suborderdata.length ; j++){
                   if(record[i].suborderdata[j].attr_object !== ''){
                    record[i].suborderdata[j].attr_object = JSON.parse(record[i].suborderdata[j].attr_object);
                   }
              }
            }
          }
          if(that.data.orderData.length==0){
            that.setData({
              orderData:record,
              count:rs.data.data.count
            })
           }else{
            var lianjie=that.data.orderData.concat(record);
            that.setData({
              orderData:lianjie,
              count:rs.data.data.count
            })
           }
        }else{
            //所有数据获取完成
            that.setData({
              getalldata:true,
              page:that.data.page-1,
            })
            console.log("全部订单数据已经获取完成！");
        }
      }
    })
  }
})