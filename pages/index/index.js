// index.js
const config  = require("../../utils/config/config.js");
const getSign = require("../../utils/sign/sign.js");
const util    = require("../../utils/util/util.js");
// 获取应用实例
const app = getApp()
Page({
  data: {
    module0: config.config.api_base_url + 'smallmall/Q6BaSGN7yHR6X.jpg',
    module1: config.config.api_base_url + 'smallmall/aEPXQn6zCwiB6.jpg',
    categoryType:0,
    categoryTitle:'',
    tabbar: {},//底部菜单
    cartOpen:-1,//显示或者隐藏购物车
    cartlistOpen:-1,//显示或者隐藏购物车列表
    detailOpen:-1,//显示或者隐藏商品详情
    detailCartOpen:-1,//显示或者隐藏商品详情底部购物车
    choiceopen:-1,//显示或者隐藏商品属性
    choiceindex:'',
    choicedata:[],//商品属性数据
    iscartsdata:[],
    cartdata:[],//购物车数据
    attribute:[],//商品属性值
    attrid:[],//商品属性ID
    attrname:[],//商品属性名称
    rowView:"",//滚动到某个元素位置
    scrollTop:0,//滚动离顶部距离
    Totalamount:0,//总金额
    Totalquantity:0,//总数量
    productsData:[],
    productstypeData:[],
    categoryData:[],
    detailData:[],//商品详情
    detailImg:'',//商品详情图片
    detailindex:'',
    detailcgindex:''
  },
  onLoad(e){
    //获取底部导航栏
    app.editTabbar();
    var that = this
    var userinfo = wx.getStorageSync('userinfo');
    // this.authorized_login(userinfo);
    that.obtainproductsHandle();
    if(userinfo.small_openid != undefined){
      that.cartlistHandle(userinfo.small_openid)
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow (e) {
    var userinfo = wx.getStorageSync('userinfo');
    if(userinfo.small_openid != undefined){
      this.cartlistHandle(userinfo.small_openid);
    }
  },
  //判断是否授权登录
  authorized_login:function(userinfo){
    if(userinfo !== ''){
      
    }else{
      wx.showModal({
        title: '温馨提示',
        content: '为您提供更好服务，请点击确定',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/index',
            })
          }
        }
      })
    }
  },
  //跳转
  JumpTo(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  //显示商品详情
  ProductdetailTo(e){
    var index      = e.currentTarget.dataset.index;
    var cgindex    = e.currentTarget.dataset.cgindex
    var category   = this.data.categoryData
    var detailData = category[index].category[cgindex];
    this.setData({
      detailOpen:1,
      detailCartOpen:1,
      cartOpen:-1,
      detailindex:index,
      detailcgindex:cgindex,
      detailData:detailData,
      detailImg:config.config.api_base_url + 'smallmall/' + detailData.small_product_img
    })
  },
  //关闭商品详情
  detailhomeHandle(e){
    var cartData = this.data.cartdata;
    if(cartData.length > 0){
      this.setData({
        cartOpen:1,
        detailOpen:-1,
        detailCartOpen:-1,
        detailData:[],
        detailImg:'',
        detailindex:'',
        detailcgindex:'',
      })
    }else{
      this.setData({
        detailOpen:-1,
        detailCartOpen:-1,
        detailData:[],
        detailImg:'',
        detailindex:'',
        detailcgindex:'',
      })
    }
  },
  //获取商品
  obtainproductsHandle(){
    let that  = this;
    var data  = {
      page:1,
      rows:25,
      small_ptypeid:'',
      timestamp:getSign.nowtime(),
      leekey:config.signkey
    }
    var ksort = getSign.sort_ascii(data);
    var sign  = getSign.getSign(ksort);
    data.sign = sign;
    wx.request({
      url: config.config.api_base_url + 'smallmall/get_small_mall_products',
      data: data,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(rs) {
        if(rs.data.status == 0){
          var reverse = rs.data.data.products;
          reverse     = reverse.reverse();
          that.setData({
            categoryTitle:reverse[0]['small_typename'],
            productsData:reverse
          },function(){
            that.obtainproductstypeHandle();
          })
        }
      }
    })
  },
  //获取商品分类
  obtainproductstypeHandle(){
    let that  = this;
    var data  = {
      timestamp:getSign.nowtime(),
      leekey:config.signkey
    }
    var ksort = getSign.sort_ascii(data);
    var sign  = getSign.getSign(ksort);
    data.sign = sign;
    wx.request({
      url: config.config.api_base_url + 'smallmall/all_ptype_info',
      data: data,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(rs) {
        if(rs.data.status == 0){
          var reverse = rs.data.data.rows;
          reverse     = reverse.reverse()
          that.setData({
            productstypeData:reverse,
            categoryTitle:reverse[0].small_typename
          },function(){
            var cartlen = that.data.cartdata;
            var arrvla  = util.combinationHandle(that.data.productstypeData , that.data.productsData , that.data.iscartsdata);
            if(cartlen.length > 0){
              that.setData({
                categoryData:arrvla,
                cartOpen:1
              })
            }else{
              that.setData({
                categoryData:arrvla,
              })
            }
          })
        }
      }
    })
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
            if(cartsData.length == 0){
              that.setData({
                cartOpen:-1,
                iscartsdata:rs.data.data.iscarts,
                cartdata:cartsData,
                Totalamount:rs.data.data.total_price,
                Totalquantity:util.sum(quantity)
              })
            }else{
              that.setData({
                iscartsdata:rs.data.data.iscarts,
                cartdata:cartsData,
                Totalamount:rs.data.data.total_price,
                Totalquantity:util.sum(quantity)
              })
            }
          }
        }
      })
    }
  },
  //滚动
  scroll(e) {
    var category    = this.data.categoryData;
    var categorynew = [];
    var value       = 0;
    var title       = '';
    for(var i = 0 ; i < category.length ; i++){
      categorynew[i] = category[i].name;
    }
    if(e.detail.scrollTop <= 10){
      value = 0;
      title = categorynew[0];
    }else if(e.detail.scrollTop <= 393){
      value = 1;
      title = categorynew[1];
    }else if(e.detail.scrollTop <= 661){
      value = 2;
      title = categorynew[2];
    }else if(e.detail.scrollTop <= 929){
      value = 3;
      title = categorynew[3];
    }else if(e.detail.scrollTop <= 1309){
      value = 4;
      title = categorynew[4];
    }else if(e.detail.scrollTop <= 1689){
      value = 5;
      title = categorynew[5];
    }else if(e.detail.scrollTop <= 2069){
      value = 6;
      title = categorynew[6];
    }else if(e.detail.scrollTop <= 2561){
      value = 7;
      title = categorynew[7];
    }else if(e.detail.scrollTop <= 2755){
      value = 8;
      title = categorynew[8];
    }
    this.setData({
      categoryType:value,
      categoryTitle:title
    })
  },
  pointclick(e){
    var value = e.currentTarget.dataset.value;
    var title = e.currentTarget.dataset.title;
    this.setData({
      categoryType:value,
      categoryTitle:title,
      rowView: 'J_categoryBlock' + value
    })
  },
  //显示商品属性
  marketingBtn(e){
    var index    = e.currentTarget.dataset.index;
    var cgindex  = e.currentTarget.dataset.cgindex;
    var category = this.data.categoryData;
    this.setData({
      choiceopen:1,
      choiceindex:index + ',' + cgindex,
      choicedata:category[index].category[cgindex]
    })
  },
  //关闭商品属性
  closeattribute(e){
    this.setData({
      choiceopen:-1,
      choicedata:[]
    })
  },
  //把商品列表的商品放进购物车
  addto(e){
    let that     = this;
    var index    = e.currentTarget.dataset.index;
    var cgindex  = e.currentTarget.dataset.cgindex;
    var type     = e.currentTarget.dataset.type;
    var category = this.data.categoryData;
    var iscart   = this.data.iscartsdata;
    var count    = category[index].category[cgindex].count;
    if(parseInt(count) > 0){
      var userinfo = wx.getStorageSync('userinfo');
      if(userinfo.small_openid != undefined){
        //判断购物车是否相同商品，有相同商品增加数量，否则重新把商品添加购物车
        if(iscart[category[index].category[cgindex].small_product_name] !== undefined){
          var data = {
            small_cartid: iscart[category[index].category[cgindex].small_product_name].small_cartid,
            small_openid: userinfo.small_openid,
            type: 1,
            smallproductid:category[index].category[cgindex].smallproductid,
            timestamp:getSign.nowtime(),
            leekey:config.signkey
          }
          that.cartbuynumberHandle(data,type);
        }else{
          var data = {
            small_openid: userinfo.small_openid,
            smallproductid: category[index].category[cgindex].smallproductid,
            small_product_name: category[index].category[cgindex].small_product_name,
            small_count: 1,
            attr_object: '', //产品属性对象
            attrid:'',
            timestamp:getSign.nowtime(),
            leekey:config.signkey
          }
          that.addcartHandle(data,index,cgindex,type,category[index].category[cgindex].retail_price);
        }
      }else{
        that.authorized_login(userinfo)
      }
    }else{
      wx.showModal({
        title: '提示',
        content: '温馨提示，此商品已售完!!!',
        showCancel: false,
        confirmText: '确认',
        success: function (res) {
          console.log(res)
        }
      })
    }
  },
  //在购物车增加商品数量
  cartAddto(e){
    var index       = e.currentTarget.dataset.index;
    var cartid      = e.currentTarget.dataset.cartid;
    var id          = e.currentTarget.dataset.id;
    var userinfo    = wx.getStorageSync('userinfo');
    if(userinfo.small_openid != undefined){
      var data = {
        small_cartid: cartid,
        small_openid: userinfo.small_openid,
        type: 1,
        smallproductid:id,
        timestamp:getSign.nowtime(),
        leekey:config.signkey
      }
      this.cartbuynumberHandle(data , 1);
    }else{
      this.authorized_login(userinfo)
    }
  },
  //在商品列表减少商品数量
  reduce(e){
    var index         = e.currentTarget.dataset.index;
    var cgindex       = e.currentTarget.dataset.cgindex;
    var type          = e.currentTarget.dataset.type;
    var category      = this.data.categoryData;
    var iscart        = this.data.iscartsdata;
    var userinfo      = wx.getStorageSync('userinfo');
    if(userinfo.small_openid != undefined){
      var num         = category[index].category[cgindex].small_count;
      if(parseInt(num) == 1){
        var data = {
          small_cartid: iscart[category[index].category[cgindex].small_product_name].small_cartid,
          timestamp:getSign.nowtime(),
          leekey:config.signkey
        }
        this.delcartHandle(data , category[index].category[cgindex].small_product_name , iscart[category[index].category[cgindex].small_product_name].small_cartid);
      }else{
        var data = {
          small_cartid: iscart[category[index].category[cgindex].small_product_name].small_cartid,
          small_openid: userinfo.small_openid,
          type: 2,
          smallproductid:category[index].category[cgindex].smallproductid,
          timestamp:getSign.nowtime(),
          leekey:config.signkey
        }
        this.cartbuynumberHandle(data,type);
      }
    }else{
      this.authorized_login(userinfo)
    }
  },
  //在购物车减少商品数量
  cartReduce(e){
    var index         = e.currentTarget.dataset.index;
    var cartid        = e.currentTarget.dataset.cartid;
    var id            = e.currentTarget.dataset.id;
    var cartdata      = this.data.cartdata;
    var userinfo      = wx.getStorageSync('userinfo');
    if(userinfo.small_openid != undefined){
      var num         = cartdata[index].small_count;
      if(parseInt(num) == 1){
        var data = {
          small_cartid: cartid,
          timestamp:getSign.nowtime(),
          leekey:config.signkey
        }
        this.delcartHandle(data , cartdata[index].small_product_name , cartid);
      }else{
        var data = {
          small_cartid: cartid,
          small_openid: userinfo.small_openid,
          type: 2,
          smallproductid:id,
          timestamp:getSign.nowtime(),
          leekey:config.signkey
        }
        this.cartbuynumberHandle(data , 1);
      }
    }else{
      this.authorized_login(userinfo)
    }
  },
  //显示购物车列表
  showCartlist(e){
    this.setData({
      cartlistOpen:1
    })
  },
  //关闭购物车列表
  closeCartlist(e){
    this.setData({
      cartlistOpen:-1
    })
  },
  //清空购物车
  emptyCart(e){
    let that = this;
    wx.showModal({
      title: '温馨提示',
      content: '确认清空购物车吗？',
      success: function(res) {
        if (res.confirm) {
          var arrnew = [];
          var cartdata = that.data.cartdata;
          for(var i = 0 ; i < cartdata.length ; i++){
            arrnew.push(cartdata[i].small_cartid)
          }
          var data  = {
            small_cartid: arrnew,
            timestamp:getSign.nowtime(),
            leekey:config.signkey
          }
          var ksort = getSign.sort_ascii(data);
          var sign  = getSign.getSign(ksort);
          data.sign = sign;
          wx.request({
            url: config.config.api_base_url + 'smallmall/small_mall_delcart',
            data: data,
            method: "POST",
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(rs) {
              if(rs.data.status == 0){
                var category = that.data.categoryData;
                for(var i = 0 ; i < category.length ; i++){
                  for(var j = 0 ; j < category[i].category.length ; j++){
                    category[i].category[j].small_count = 0;
                  }
                }
                that.setData({
                  categoryData:category,
                  cartdata:[],
                  iscartsdata:[],
                  cartOpen:-1,
                  cartlistOpen:-1,
                  Totalamount:0,
                  Totalquantity:0
                })
              }
            }
          })
        }
      }
    })
  },
  //获取商品属性
  AddtoAttribute(e){
    var index        = e.currentTarget.dataset.index;
    var value        = e.currentTarget.dataset.value;
    var name         = e.currentTarget.dataset.name;
    var attrid       = e.currentTarget.dataset.attrid;
    var attribute    = this.data.attribute;
    var attridArr    = this.data.attrid;
    var attrname     = this.data.attrname;
    attribute[index] = value;
    attridArr[index] = attrid;
    attrname[index]  = name;
    
    this.setData({
      attribute:attribute,//选择属性
      attrid:attridArr,
      attrname:attrname
    })
  },
  //把有属性商品加入购物车
  Addcart(e){
    var choicedata      = e.currentTarget.dataset.choicedata;
    var choiceindex     = e.currentTarget.dataset.choiceindex;
    var iscart          = this.data.iscartsdata;
    var attribute       = this.data.attribute;
    var attrid          = this.data.attrid;
    var attrname        = this.data.attrname;
    
    if(parseInt(choicedata.attr_group.length) === parseInt(attribute.length)){
      var count         = choicedata.count;
      if(parseInt(count) > 0){
        var userinfo    = wx.getStorageSync('userinfo');
        if(userinfo.small_openid != undefined){
          //判断购物车是否相同商品，有相同商品增加数量，否则重新把商品添加购物车
          if(iscart !== undefined){
            var atrvalue = [];
            for(var i = 0 ; i < attribute.length ; i++){
              atrvalue[i] = {
                small_attrname:attrname[i],
                small_attrvalue:attribute[i]
              }
            }
            var data = {
              small_openid: userinfo.small_openid,
              smallproductid: choicedata.smallproductid,
              small_product_name: choicedata.small_product_name,
              small_count: 1,
              attr_object: atrvalue, //产品属性对象
              attrid:attrid,
              timestamp:getSign.nowtime(),
              leekey:config.signkey
            }
            this.addcartAtrHandle(data,choicedata.retail_price,choiceindex);
          }else{
            var atrvalue = [];
            for(var i = 0 ; i < attribute.length ; i++){
              atrvalue[i] = {
                small_attrname:attrname[i],
                small_attrvalue:attribute[i]
              }
            }
            var data = {
              small_openid: userinfo.small_openid,
              smallproductid: choicedata.smallproductid,
              small_product_name: choicedata.small_product_name,
              small_count: 1,
              attr_object: atrvalue, //产品属性对象
              attrid:attrid,
              timestamp:getSign.nowtime(),
              leekey:config.signkey
            }
            this.addcartAtrHandle(data,choicedata.retail_price,choiceindex);
          }
        }else{
          this.authorized_login(userinfo)
        }
      }else{
        wx.showModal({
          title: '提示',
          content: '温馨提示，此商品已售完!!!',
          showCancel: false,
          confirmText: '确认',
          success: function (res) {
            console.log(res)
          }
        })
      }
    }else{
      wx.showModal({
        title: '温馨提示',
        content: '请选择商品分类',
        success: function(res) {

        }
      })
    }
  },
  /*商品放进购物车数接口
    @data : 提交数据表数据
    @index ；商品列表数组下标值
    @cgindex ：商品列表数组下标值
    @type ：1为点单页面把商品添加购物车、2为详情页面把商品添加购物车
    @retail_price：价格
  */
  addcartHandle(data,index,cgindex,type,retail_price){
    let that  = this;
    var ksort = getSign.sort_ascii(data);
    var sign  = getSign.getSign(ksort);
    data.sign = sign;
    wx.request({
      url: config.config.api_base_url + 'smallmall/small_mall_addcart',
      data: data,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(rs) {
        if(rs.data.status == 0){
          var amount        = [];
          var quantity      = [];
          var cartdata      = that.data.cartdata;
          var category      = that.data.categoryData;
          var detailData    = that.data.detailData;
          var num           = category[index].category[cgindex].small_count;
          var cart          = rs.data.data;
          cart.retail_price = retail_price;
          cart.small_product_img = category[index].category[cgindex].small_product_img;
          category[index].category[cgindex].small_count = parseInt(num) + 1;
          that.data.iscartsdata[cart.small_product_name] = cart;
          if(type == 2){
            var detailnum          = detailData.small_count;
            detailData.small_count = parseInt(detailnum) + 1;
          }
          cartdata.push(cart);
          
          //统计价格和商品数量
          for(var i = 0 ; i < cartdata.length ; i++){
            amount.push(util.sround(parseFloat(cartdata[i].retail_price) * parseInt(cartdata[i].small_count),2))
            quantity.push(parseInt(cartdata[i].small_count))
          }
          
          if(type == 1){
            that.setData({
              categoryData:category,
              cartdata:cartdata,
              iscartsdata:that.data.iscartsdata,
              cartOpen:1,
              Totalamount:util.sum(amount) ,
              Totalquantity:util.sum(quantity)
            })
          }else{
            that.setData({
              categoryData:category,
              cartdata:cartdata,
              iscartsdata:that.data.iscartsdata,
              detailData:detailData,
              Totalamount:util.sum(amount) ,
              Totalquantity:util.sum(quantity)
            })
          }
        }
      }
    })
  },
  /*商城购物车商品购买数量增减接口
    @data:提交数据表数据
    @type:1为点单页面把商品添加购物车、2为详情页面把商品添加购物车
  */
  cartbuynumberHandle(data , type){
    let that  = this;
    var ksort = getSign.sort_ascii(data);
    var sign  = getSign.getSign(ksort);
    data.sign = sign;
    wx.request({
      url: config.config.api_base_url + 'smallmall/cart_buy_number',
      data: data,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(rs) {
        if(rs.data.status == 0){
          var quantity      = [];
          var category      = that.data.categoryData;
          var iscartdata    = that.data.iscartsdata;
          var iscart        = rs.data.data.iscarts;
          var cartdata      = rs.data.data.carts;
          var detailData    = that.data.detailData;
          if(type == 2){
            var detailnum          = detailData.small_count;
            detailData.small_count = parseInt(detailnum) + 1;
          }
          //增加或者减少购物车表数据，同时更新商品列表数据
          for(var i = 0 ; i < category.length ; i++){
            for(var j = 0 ; j < category[i].category.length ; j++){
              if(iscartdata[category[i].category[j].small_product_name] !== undefined){
                //判断是否有商品属性的商品
                if(iscartdata[category[i].category[j].small_product_name].attr_object != ''){
                  category[i].category[j].small_count = iscartdata[category[i].category[j].small_product_name].same_spn_count;
                }else{
                  category[i].category[j].small_count = iscart[category[i].category[j].small_product_name].small_count;
                }
                //更新购物车列表数据
                if(iscartdata[category[i].category[j].small_product_name] !== undefined && iscart[category[i].category[j].small_product_name] !== undefined){
                  iscartdata[category[i].category[j].small_product_name].small_count = iscart[category[i].category[j].small_product_name].small_count;
                }else{
                  iscartdata[category[i].category[j].small_product_name] = iscart[category[i].category[j].small_product_name];
                }
              }
            }
          }
          //统计商品数量
          for(var i = 0 ; i < cartdata.length ; i++){
            quantity.push(parseInt(cartdata[i].small_count));
            if(cartdata[i].attr_object != ''){
              cartdata[i].attr_object = JSON.parse(cartdata[i].attr_object);
            }
          }
          if(type == 1){
            that.setData({
              categoryData:category,
              cartdata:cartdata,
              iscartsdata:iscartdata,
              Totalamount:rs.data.data.total_price,
              Totalquantity:util.sum(quantity)
            })
          }else{
            that.setData({
              categoryData:category,
              cartdata:cartdata,
              detailData:detailData,
              iscartsdata:iscartdata,
              Totalamount:rs.data.data.total_price,
              Totalquantity:util.sum(quantity)
            })
          }
        }
      }
    })
  },
  /*删除商品接口
    @data:提交数据表数据
    @product_name:商品名称
    @cart_id:购物车ID
  */
  delcartHandle(data , product_name , cart_id){
    let that  = this;
    var ksort = getSign.sort_ascii(data);
    var sign  = getSign.getSign(ksort);
    data.sign = sign;
    wx.request({
      url: config.config.api_base_url + 'smallmall/small_mall_delcart',
      data: data,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(rs) {
        if(rs.data.status == 0){
          var amount        = [];
          var quantity      = [];
          var cartdata      = that.data.cartdata;
          var iscartdata    = that.data.iscartsdata;
          var category      = that.data.categoryData;
          //删除相对对象
          for(let key  in iscartdata){
            //判断是否有商品属性的商品
            if(iscartdata[product_name].attr_object != ''){
              if(iscartdata[product_name].same_spn_count === 1){
                delete iscartdata[product_name];
                break;
              }else{
                var len = iscartdata[product_name].same_spn_count;
                iscartdata[product_name].same_spn_count = parseInt(len) - 1;
                break;
              }
            }else{
              delete iscartdata[product_name];
              break;
            }
          }
          //更新商品列表数据
          for(var i = 0 ; i < category.length ; i++){
            for(var j = 0 ; j < category[i].category.length ; j++){
              if(category[i].category[j].small_product_name === product_name){
                if(iscartdata[product_name] != undefined){
                  if(iscartdata[product_name].attr_object != ''){
                    category[i].category[j].small_count = iscartdata[product_name].same_spn_count;
                  }else{
                    category[i].category[j].small_count = 0;
                  }
                }else{
                  category[i].category[j].small_count = 0;
                }
              }
            }
          }
          //删除相对元素
          for(var i = 0 ; i < cartdata.length ; i++){
            if(cartdata[i].small_cartid === cart_id){
              cartdata.splice(i , 1);
              break;
            }
          }
          //统计价格和商品数量
          for(var i = 0 ; i < cartdata.length ; i++){
            amount.push(util.sround(parseFloat(cartdata[i].retail_price) * parseInt(cartdata[i].small_count),2))
            quantity.push(parseInt(cartdata[i].small_count))
          }
          if(cartdata.length > 0){
            that.setData({
              categoryData:category,
              cartdata:cartdata,
              iscartsdata:iscartdata,
              Totalamount:util.sum(amount),
              Totalquantity:util.sum(quantity)
            })
          }else{
            that.setData({
              categoryData:category,
              cartdata:cartdata,
              iscartsdata:iscartdata,
              cartOpen:-1,
              cartlistOpen:-1,
              Totalamount:util.sum(amount),
              Totalquantity:util.sum(quantity)
            })
          }
        }
      }
    })
  },
  /*
    把有属性的商品加入购物车
    @data:提交数据表数据
    @retail_price:商品金额
    @choiceindex:商品列表下标值
  */
  addcartAtrHandle(data , retail_price , choiceindex){
    let that  = this;
    var ksort = getSign.sort_ascii(data);
    var sign  = getSign.getSign(ksort);
    data.sign = sign;
    wx.request({
      url: config.config.api_base_url + 'smallmall/small_mall_addcart',
      data: data,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(rs) {
        if(rs.data.status == 0){
          var amount        = [];
          var quantity      = [];
          var cartdata      = that.data.cartdata;
          var category      = that.data.categoryData;
          var iscartsdata   = that.data.iscartsdata;
          var detailData    = that.data.detailData;
          choiceindex       = choiceindex.split(',')
          var num           = category[choiceindex[0]].category[choiceindex[1]].small_count;
          var cart          = rs.data.data;
          var detailOpen    = that.data.detailOpen;
          cart.retail_price = retail_price;
          cart.small_product_img = category[choiceindex[0]].category[choiceindex[1]].small_product_img;
          category[choiceindex[0]].category[choiceindex[1]].small_count = parseInt(num) + 1;
          if(cart.attr_object != ''){
            cart.attr_object = JSON.parse(cart.attr_object);
          }
          //判断购物车是否有这个商品，有增加数量，否则添加一个对象
          if(iscartsdata[cart.small_product_name] !== undefined){
            var len = iscartsdata[cart.small_product_name].same_spn_count;
            iscartsdata[cart.small_product_name].same_spn_count = parseInt(len) + 1;
          }else{
            iscartsdata[cart.small_product_name] = cart;
            iscartsdata[cart.small_product_name].same_spn_count = 1;
          }
          console.log(iscartsdata)
          //判断是否在商品详情页面把商品放进购物车
          if(detailOpen == 1){
            var detailnum          = detailData.small_count;
            detailData.small_count = parseInt(detailnum) + 1;
          }
          cartdata.push(cart);
          //统计价格和商品数量
          for(var i = 0 ; i < cartdata.length ; i++){
            amount.push(util.sround(parseFloat(cartdata[i].retail_price) * parseInt(cartdata[i].small_count),2))
            quantity.push(cartdata[i].small_count)
          }
          
          if(detailOpen == 1){
            that.setData({
              detailData:detailData,
              categoryData:category,
              iscartsdata:that.data.iscartsdata,
              cartdata:cartdata,
              choiceopen:-1,
              attribute:[],//选择属性
              attrid:[],
              attrname:[],
              Totalamount:util.sum(amount) ,
              Totalquantity:util.sum(quantity)
            })
          }else{
            that.setData({
              categoryData:category,
              cartdata:cartdata,
              iscartsdata:that.data.iscartsdata,
              cartOpen:1,
              choiceopen:-1,
              attribute:[],//选择属性
              attrid:[],
              attrname:[],
              Totalamount:util.sum(amount) ,
              Totalquantity:util.sum(quantity)
            })
          }
        }
      }
    })
  },
  /*
    把有属性的商品增加数量
    @data
  */
  addcartnumberAtrHandle(data){
    let that  = this;
    var ksort = getSign.sort_ascii(data);
    var sign  = getSign.getSign(ksort);
    data.sign = sign;
    wx.request({
      url: config.config.api_base_url + 'smallmall/cart_buy_number',
      data: data,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(rs) {
        if(rs.data.status == 0){
          var quantity      = [];
          var category      = that.data.categoryData;
          var iscartdata    = rs.data.data.iscarts;
          var cartdata      = rs.data.data.carts;
          var detailData    = that.data.detailData;
          var detailOpen    = that.data.detailOpen;
          if(detailOpen == 1){
            var detailnum          = detailData.small_count;
            detailData.small_count = parseInt(detailnum) + 1;
          }
          //增加或者减少购物车表数据，同时更新商品列表数据
          for(var i = 0 ; i < category.length ; i++){
            for(var j = 0 ; j < category[i].category.length ; j++){
              if(iscartdata[category[i].category[j].small_product_name] !== undefined){
                category[i].category[j].small_count = iscartdata[category[i].category[j].small_product_name].small_count;
              }
            }
          }
          //统计商品数量
          for(var i = 0 ; i < cartdata.length ; i++){
            quantity.push(parseInt(cartdata[i].small_count))
          }
          if(detailOpen == 1){
            that.setData({
              detailData:detailData,
              categoryData:category,
              iscartsdata:that.data.iscartsdata,
              cartdata:cart,
              choiceopen:-1,
              attribute:[],//选择属性
              attrid:[],
              attrname:[],
              Totalamount:util.sum(amount) ,
              Totalquantity:util.sum(quantity)
            })
          }else{
            that.setData({
              categoryData:category,
              cartdata:cart,
              iscartsdata:that.data.iscartsdata,
              cartOpen:1,
              choiceopen:-1,
              attribute:[],//选择属性
              attrid:[],
              attrname:[],
              Totalamount:util.sum(amount) ,
              Totalquantity:util.sum(quantity)
            })
          }
        }
      }
    })
  },
  
})
