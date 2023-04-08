// index.js
const config  = require("../../utils/config/config.js");
const getSign = require("../../utils/sign/sign.js");
const citys   = require("../../utils/address/citys.js");
const util    = require("../../utils/util/util.js");
// 获取应用实例
const app = getApp()
Page({
  data: {
    orderpayData:[],
    iscartsdata:[],
    Totalamount:0,
    Totalquantity:0,
    stop:true,
    nickname:'',
    avatar_url:'',
    addressData:[],//地址列表
    openAddress:-1,//显示或者隐藏地址列表
    cityData:citys.cityData,
    opencity:-1,//显示或者隐藏填写地址信息
    cityproper:-1,//显示或者隐藏选择省市区
    provincenav:1,
    citynav:-1,
    areanav:-1,
    cityselectnext:-1,
    cityselectprev:-1,
    placeinfo:'',
    provinces:[],
    citys:[],
    countys:[],
    province:'',
    city:'',
    county:'',
    addreID:'',
    addreIndex:'',
    personal:'',
    phone:'',
    detailed:'',
    value: [0, 0, 0],
    page:1,
    rows:6,
    count:0,
    menticon:-1,
    takeicon:-1,
    small_contract:'',
    small_tel:'',
    small_address:''
  },
  onLoad(e){
    citys.init(this);
    var userinfo = wx.getStorageSync('userinfo');
    if(userinfo.small_openid != undefined){
      this.cartlistHandle(userinfo.small_openid);
      this.addresslistHandle();
      this.setData({
        nickname:userinfo.nickname,
        avatar_url:userinfo.avatar_url
      })
    }
  },
  //获取购物车数据
  cartlistHandle(openid){
    let that  = this;
    if(openid != ''){
      var data  = {
        small_openid:openid,
        timestamp:getSign.nowtime(),
        leekey:config.signkey
      }
      var ksort = getSign.sort_ascii(data);
      var sign  = getSign.getSign(ksort);
      data.sign = sign;
      wx.request({
        url: config.config.api_base_url + 'smallmall/small_mall_cartlist',
        data: data,
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(rs) {
          if(rs.data.status == 0){
            var quantity = [];
            var cartsData = rs.data.data.carts;
            for(var i = 0 ; i < cartsData.length ; i++){
              quantity.push(parseInt(cartsData[i].small_count))
              if(cartsData[i].attr_object != ''){
                cartsData[i].attr_object = JSON.parse(cartsData[i].attr_object);
              }
            }
            
            that.setData({
              iscartsdata:rs.data.data.iscarts,
              orderpayData:cartsData,
              Totalamount:rs.data.data.total_price,
              Totalquantity:util.sum(quantity)
            })
          }
        }
      })
    }
  },
  //外卖
  takeoutHandle(e){
    var takeicon = this.data.takeicon;
    if(takeicon != -1){
      this.setData({
        takeicon:-1,
        menticon:1,
        openAddress:-1
      })
    }else{
      this.setData({
        takeicon:1,
        menticon:-1,
        openAddress:1
      })
    }
  },
  //自提
  selfmentionHandle(e){
    var menticon = this.data.menticon;
    if(menticon != -1){
      this.setData({
        takeicon:1,
        menticon:-1
      })
    }else{
      this.setData({
        menticon:1,
        takeicon:-1
      })
    }
  },
  //选择地址
  addresschoiceHandle(e){
    var contract = e.currentTarget.dataset.contract;
    var tel      = e.currentTarget.dataset.tel;
    var address  = e.currentTarget.dataset.address;
    this.setData({
      openAddress:-1,
      small_contract:contract,
      small_tel:tel,
      small_address:address
    })
  },
  //显示或者隐藏地址列表
  addressHandle(e){
    this.setData({
      openAddress:1,
    })
  },
  //显示添加地址
  addressTo(e){
    this.setData({
      opencity:1
    })
  },
  //隐藏添加地址
  addressCloseHandle(){
    this.setData({
      opencity:-1,//显示或者隐藏填写地址信息
      cityproper:-1,//显示或者隐藏选择省市区
      provincenav:1,
      citynav:-1,
      areanav:-1,
      cityselectnext:-1,
      cityselectprev:-1,
      placeinfo:'',
      provinces:[],
      citys:[],
      countys:[],
      province:'',
      city:'',
      county:'',
      addreID:'',
      addreIndex:'',
      personal:'',
      phone:'',
      detailed:'',
      value: [0, 0, 0]
    })
  },
  //显示选择省市区
  placehandle(e){
    var cityData  = this.data.cityData;
    var provinces = []; 
    for(var i = 0 ; i < cityData.length ; i++){
      provinces.push(cityData[i]);
    }
    this.setData({
      cityproper:1,
      provinces:provinces
    })
  },
  //重选省市区
  cityselectnav(e){
    var index  = e.currentTarget.dataset.index;
    if(index == 1){
      this.setData({
        provincenav:1,
        citynav:-1,
        areanav:-1,
      })
    }else if(index == 2){
      this.setData({
        provincenav:-1,
        citynav:1,
        areanav:-1,
        cityselectprev:1,
        cityselectnext:-1
      })
    }else if(index == 3){
      this.setData({
        provincenav:-1,
        citynav:-1,
        areanav:1,
        cityselectprev:-1,
        cityselectnext:1
      })
    }
  },
  //选择省
  choiceprovince(e){
    var index = e.currentTarget.dataset.index;
    var name  = e.currentTarget.dataset.name;
    var sub   = e.currentTarget.dataset.sub;
    this.setData({
      citys:sub,
      province:name,
      provincenav:-1,
      citynav:1,
      areanav:-1,
      value:[index,0,0]
    })
  },
  //选择市
  choicecity(e){
    var index = e.currentTarget.dataset.index;
    var name  = e.currentTarget.dataset.name;
    var sub   = e.currentTarget.dataset.sub;
    var vaule = this.data.value;
    vaule[1]  = index;
    this.setData({
      countys:sub,
      city:name,
      provincenav:-1,
      citynav:-1,
      areanav:1,
      cityselectnext:1,
      vaule:vaule
    })
  },
  //选择区
  choicearea(e){
    var index    = e.currentTarget.dataset.index;
    var name     = e.currentTarget.dataset.name;
    var province = this.data.province;
    var city     = this.data.city;
    var vaule    = this.data.value;
    vaule[2]     = index;
    this.setData({
      county:name,
      cityproper:-1,
      placeinfo:province + '-' + city + '-' + name,
      vaule:vaule
    })
  },
  //输入input
  bindKeyInput(e){
    var name  = e.currentTarget.dataset.name;
    var value = e.detail.value;
    this.setData({
      [name]:value
    })
  },
  //修改地址信息
  updateHandle(e){
    var index     = e.currentTarget.dataset.index;
    var id        = e.currentTarget.dataset.id;
    var contract  = e.currentTarget.dataset.contract;
    var tel       = e.currentTarget.dataset.tel;
    var address   = e.currentTarget.dataset.address;
    var provinces = this.data.provinces;
    var cityData  = this.data.cityData;
    var provinces = []; 
    var citys     = [];
    var countys   = [];
    address       = address.split("-");
    for(var i = 0 ; i < cityData.length ; i++){
      provinces.push(cityData[i]);
    }
    for(var i = 0 ; i < provinces.length ; i++){
      if(provinces[i].name === address[0]){
        citys = provinces[i].sub;
      }
    }
    for(var i = 0 ; i < citys.length ; i++){
      if(citys[i].name === address[1]){
        countys = citys[i].sub;
      }
    }
    
    this.setData({
      addreID:id,
      addreIndex:index,
      personal:contract,
      phone:tel,
      placeinfo:address[0] + '-' + address[1] + '-' + address[2],
      detailed:address[3],
      province:address[0],
      provinces:provinces,
      citys:citys,
      countys:countys,
      city:address[1],
      county:address[2],
      cityselectnext:1,
      provincenav:-1,
      citynav:-1,
      areanav:1,
      opencity:1
    })
  },
  //提交地址
  submitToHandle(e){
    var personal    = this.data.personal;
    var phone       = this.data.phone;
    var detailed    = this.data.detailed;
    var placeinfo   = this.data.placeinfo;
    var addreID     = this.data.addreID;
    var addreIndex  = this.data.addreIndex;
    var userinfo    = wx.getStorageSync('userinfo');
    if(userinfo.small_openid != undefined){
      if(addreID != ''){
        var data  = {
          small_addressid:addreID,
          small_openid:userinfo.small_openid,
          small_contract:personal,
          small_tel:phone,
          small_address:placeinfo + '-' + detailed,
          timestamp:getSign.nowtime(),
          leekey:config.signkey
        }
        this.updateAddressHandle(data,addreIndex);
      }else{
        var data  = {
          small_openid:userinfo.small_openid,
          small_contract:personal,
          small_tel:phone,
          small_address:placeinfo + '-' + detailed,
          timestamp:getSign.nowtime(),
          leekey:config.signkey
        }
        this.addAddressHandle(data);
      }
    }
  },
  //获取地址数据
  addresslistHandle(){
    let that  = this;
    var userinfo = wx.getStorageSync('userinfo');
    if(userinfo.small_openid != undefined){
      var data  = {
        page:this.data.page,
        rows:this.data.rows,
        small_openid:userinfo.small_openid,
        timestamp:getSign.nowtime(),
        leekey:config.signkey
      }
      var ksort = getSign.sort_ascii(data);
      var sign  = getSign.getSign(ksort);
      data.sign = sign;
      wx.request({
        url: config.config.api_base_url + 'smallmall/address_list',
        data: data,
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(rs) {
          if(rs.data.status == 0){
            var addressData = that.data.addressData;
            var record      = rs.data.data.rows;
            for(var i = 0 ; i < record.length ; i++ ){
              addressData.push(record[i])
            }
            that.setData({
              addressData:addressData,
              count:rs.data.data.count
            })
          }
        }
      })
    }
  },
  //滚动获取地址
  scroll(){
    var addressData = this.data.addressData;
    var count       = this.data.count;
    if(parseInt(addressData.length) === parseInt(count)){
    }else{
      var page = this.data.page;
      this.setData({
        page:parseInt(page) + 1
      },function(rs){
        that.addresslistHandle()
      })
    }
  },
  //添加地址
  addAddressHandle(data){
    let that  = this;
    var ksort = getSign.sort_ascii(data);
    var sign  = getSign.getSign(ksort);
    data.sign = sign;
    wx.request({
      url: config.config.api_base_url + 'smallmall/add_address',
      data: data,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(rs) {
        if(rs.data.status == 0){
          var addressData = that.data.addressData;
          addressData.push(rs.data.data);
          that.setData({
            addressData:addressData,
            opencity:-1,//显示或者隐藏填写地址信息
            cityproper:-1,//显示或者隐藏选择省市区
            provincenav:1,
            citynav:-1,
            areanav:-1,
            cityselectnext:-1,
            cityselectprev:-1,
            placeinfo:'',
            citys:[],
            countys:[],
            province:'',
            city:'',
            county:'',
            addreID:'',
            addreIndex:'',
            personal:'',
            phone:'',
            detailed:'',
            value: [0, 0, 0]
          })
        }
      }
    })
  },
  //修改地址
  updateAddressHandle(data,index){
    let that  = this;
    var ksort = getSign.sort_ascii(data);
    var sign  = getSign.getSign(ksort);
    data.sign = sign;
    wx.request({
      url: config.config.api_base_url + 'smallmall/update_address',
      data: data,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(rs) {
        if(rs.data.status == 0){
          var addressData = that.data.addressData;
          addressData[index].small_contract = data.small_contract;
          addressData[index].small_tel      = data.small_tel;
          addressData[index].small_address  = data.small_address;
          that.setData({
            addressData:addressData,
            opencity:-1,//显示或者隐藏填写地址信息
            cityproper:-1,//显示或者隐藏选择省市区
            provincenav:1,
            citynav:-1,
            areanav:-1,
            cityselectnext:-1,
            cityselectprev:-1,
            placeinfo:'',
            citys:[],
            countys:[],
            province:'',
            city:'',
            county:'',
            addreID:'',
            addreIndex:'',
            personal:'',
            phone:'',
            detailed:'',
            value: [0, 0, 0]
          })
        }
      }
    })
  },
  //删除地址
  delAddressHandle(e){
    let that  = this;
    var index    = e.currentTarget.dataset.index;
    var id       = e.currentTarget.dataset.id;
    var contract = e.currentTarget.dataset.contract;
    var tel      = e.currentTarget.dataset.tel;
    var address  = e.currentTarget.dataset.address;
    var userinfo = wx.getStorageSync('userinfo');
    if(userinfo.small_openid != undefined){
      var data   = {
        small_addressid:id,
        timestamp:getSign.nowtime(),
        leekey:config.signkey
      }
      var ksort  = getSign.sort_ascii(data);
      var sign   = getSign.getSign(ksort);
      data.sign  = sign;
      wx.request({
        url: config.config.api_base_url + 'smallmall/del_address',
        data: data,
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(rs) {
          if(rs.data.status == 0){
            var addressData = that.data.addressData;
            addressData.splice(index , 1);
            that.setData({
              addressData:addressData
            })
          }
        }
      })
    }
  },
  //设置默认值
  setdefaultAddressHandle(e){
    let that     = this;
    var index    = e.currentTarget.dataset.index;
    var id       = e.currentTarget.dataset.id;
    var contract = e.currentTarget.dataset.contract;
    var tel      = e.currentTarget.dataset.tel;
    var address  = e.currentTarget.dataset.address;
    var userinfo = wx.getStorageSync('userinfo');
    if(userinfo.small_openid != undefined){
      var data   = {
        small_openid:userinfo.small_openid,
        small_addressid:id,
        timestamp:getSign.nowtime(),
        leekey:config.signkey
      }
      var ksort  = getSign.sort_ascii(data);
      var sign   = getSign.getSign(ksort);
      data.sign  = sign;
      wx.request({
        url: config.config.api_base_url + 'smallmall/set_default_address',
        data: data,
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(rs) {
          if(rs.data.status == 0){
            var addressData = that.data.addressData;
            addressData[index].default = 1;
            that.setData({
              addressData:addressData
            })
          }
        }
      })
    }
  },
  //微信支付
  wechat(e){
    let that = this;
    if(this.data.stop){
      this.setData({
        stop:false
      },function(){
        var userinfo     = wx.getStorageSync('userinfo');
        var orderpayData = that.data.orderpayData;
        var nickname     = that.data.nickname;
        var avatar_url   = that.data.avatar_url;
        var small_contract= that.data.small_contract;
        var small_tel    = that.data.small_tel;
        var small_address= that.data.small_address;
        var cartdata     = [];
        for(var i = 0 ; i < orderpayData.length ; i++){
          if(orderpayData[i].attr_object.length > 0){
            cartdata[i] = {
              smallproductid: orderpayData[i].smallproductid,
              small_count: orderpayData[i].small_count,
              small_product_name: orderpayData[i].small_product_name,
              order_pay_type: "微信支付", 
              retail_price: orderpayData[i].retail_price,
              attr_object: orderpayData[i].attr_object,
              attrid:orderpayData[i].attrid.split(',')
            }
          }else{
            cartdata[i] = {
              smallproductid: orderpayData[i].smallproductid,
              small_count: orderpayData[i].small_count,
              small_product_name: orderpayData[i].small_product_name,
              order_pay_type: "微信支付", 
              retail_price: orderpayData[i].retail_price,
              attr_object: '',
              attrid:''
            }
          }
        }
      
        wx.showLoading({
          title: ''
        })
        var data = {
          pros:cartdata,
          small_openid:userinfo.small_openid,
          nickname:nickname,
          avatar_url:avatar_url,
          small_contract:small_contract,
          small_tel:small_tel,
          small_address:small_address,
          timestamp:getSign.nowtime(),
          leekey:config.signkey
        }
        var ksort = getSign.sort_ascii(data);
        var sign  = getSign.getSign(ksort);
        data.sign = sign;
        wx.request({
          url: config.config.api_base_url + 'smallmall/cart_checkout',
          data: data,
          method: "POST",
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(rs) {
            wx.hideLoading() 
            if(rs.data.status == -1){
              wx.showModal({
                content: rs.data.msg,
                showCancel: false,
                confirmText: '知道了',
                success: function (res) {
                  if (res.confirm) {
                    console.log(res)
                  }
                }
              })
            }else{
              wx.requestPayment({
                'timeStamp': rs.data.data.pay_info.timeStamp,
                'nonceStr': rs.data.data.pay_info.nonceStr,
                'package': rs.data.data.pay_info.package,
                'signType': rs.data.data.pay_info.signType,
                'paySign': rs.data.data.pay_info.paySign, 
                'success':function(res){
                  if(res.errMsg == "requestPayment:ok"){
                    wx.showLoading({
                      title: '耐心等待',
                      success:function(rs){
                        wx.switchTab({
                          url: '../order/index',
                          success:function () {
                            var page = getCurrentPages().pop();
                            if (page == undefined || page == null) return;
                            page.onLoad();   //重新刷新页面
                            that.setData({
                              orderpayData:[],
                              iscartsdata:[],
                              Totalamount:0,
                              Totalquantity:0
                            })
                          }
                        })
                      }
                    })
                  }
                },
                'fail':function(res){
                  if(res.errMsg == "requestPayment:fail"){
                    console.log(res)
                  }
                },
                'complete':function(res){
                  console.log(res)
                } 
              })
            }
          }
        })
      })
    }else{
      wx.showModal({
        content: '不能重复点击支付',
        showCancel: false,
        confirmText: '知道了',
        success: function (res) {
          if (res.confirm) {
            console.log(res)
          }
        }
      })
    }
  }
})