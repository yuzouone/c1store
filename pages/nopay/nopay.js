// pages/nopay/nopay.js
var orderNo ="";
var value = "";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allsum:'0',
    allcost:'￥0'
  },
  //点击支付
  bindpay:function(){
    var that = this;
    var token = wx.getStorageSync('token');
    var authorizationId = token.authorizationId;
    var userid = token.userid;
    if (orderNo != "" && value != ""){
      xcxpay();
    }
    function xcxpay(){
      console.log('订单号');
      console.log(orderNo);
      wx.login({
        success: function (res) {
          wx.request({
            url: 'http://dev.wetripay.com:8001/c1st/api/weixinpay/xcxpay',
            data: {
              value: 0.01,
              orderNo: orderNo,
              code: res.code
            },
            header: {
              //'content-type': 'application/json' // 默认值
              'content-type': 'application/x-www-form-urlencoded',
              'authorization': authorizationId
            },
            method: 'POST',
            success: function (res) {
              //成功，获取登录参数
              console.log("下单成功");
              console.log(res);
              if (res.data.success ==true){
                that.xcxpaysuccess(res);
              } else if (res.data.success == false){
                wx.showModal({
                  title: '提示',
                  content: '请求异常，请重新登录',
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定');
                      wx.redirectTo({
                        url: '../index/index',
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              }

            },
            fail: function (res) {
              //失败，重登录
              app.myfail(res)
            }
          })
        },
        fail: function () { }
      })
    }
  },
  //调用密码支付
  xcxpaysuccess:function(res){
    var data = res.data.data.weixinPayDetail;
    var signType = data.signType;
    var nonceStr = data.nonceStr;
    var timeStamp = data.timeStamp;
    var package2 = data.package;
    var paySign = data.paySign;
    //调用微信支付
    wx.requestPayment({
      'timeStamp': timeStamp,
      'nonceStr': nonceStr,
      'package': package2,
      'signType': signType,
      'paySign': paySign,
      'success': function (res) {
        console.log('支付成功回调');
        console.log(res);
        wx.switchTab({
          url: '../main/main',
        })
      },
      'fail': function (res) {
        wx.showModal({
          title: '提示',
          content: '支付失败，请重新发起支付',
        });

      },
    });
    //调用微信支付
  },
  //免密支付
  nopasswordpay:function(){
    //进行免密支付
    wx.request({
      url: 'https://www.wetripay.com/xcxApp/api/wxnopass/Pay',
      data: {
        'value': that.data.cost,
        'billingid': billingid,
        'uid': userId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'authorization': app.globalData.authorization,
        'version': '5000',
        'platform': 'xcx'
      },
      success: function (res) {
        console.log('免密支付成功');
        console.log(res);
        console.log('免密支付成功');
              //进行免密支付
      }
    })
  },
  
  //获取未支付账单
  nopay:function(){
    var that = this;
    var token = wx.getStorageSync('token');
    var authorizationId = token.authorizationId;
    var userid = token.userid;
    console.log(token);
    console.log(authorizationId);
    console.log(userid);
    wx.request({
      url: 'http://dev.wetripay.com:8001/c1st/api/userOrder?unifiedUnpayOrder',
      data: {
        userid:userid
      },
      header: {
        //'content-type': 'application/json' // 默认值
        'content-type': 'application/x-www-form-urlencoded',
        'authorization': authorizationId
      },
      method: 'POST',
      success: function (res) {
        //成功，获取登录参数
        console.log("得到未支付订单");
        console.log(res);
        wx.hideLoading();
        that.nopaysuccess(res);
      },
      fail: function (res) {
        //失败，重登录
        app.myfail(res)
      }
    })
  },
  //时间
  add0: function (m) { return m < 10 ? '0' + m : m },
  getDate: function (shijianchuo) {
    //shijianchuo是整数，否则要parseInt转换  
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
  },
  //成功
  nopaysuccess: function (res) {
    if (res.data.data.orderList.length != 0) {
      //获取头部标题
      wx.setNavigationBarTitle({
        title: res.data.data.shop
      });
      //获取订单号,钱
      orderNo = res.data.data.orderNo;
      value = res.data.data.sumAmount;
      //页面数据
      var orderList = res.data.data.orderList;
      var mydate = res.data.timestamp; sumAmount
      var sum = res.data.data.sumQuantity;
      mydate = this.getDate(mydate);
      console.log(mydate);
      var sumAmount = "￥" + res.data.data.sumAmount;
      this.setData({ 'nopayarr': orderList, 'date': mydate, 'allcost': sumAmount, 'allsum': sum });
    } else if (res.data.code == '401') {
      //登录过期
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.nopay();
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title:'加载中...'
    });
    wx.stopPullDownRefresh();
    this.nopay();
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})