// pages/main/main.js
const app = getApp();
var QR = require("../../utils/qrcode.js");
var encryptcode = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ifmotai:false,
    ifcanvas:true
  },
  //跳转到未支付页面
  bindnopay:function(){
    wx.switchTab({
      url: '../nopay/nopay',
    })
  },
  //获取适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 /600;//600不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  getCodesuccess:function(res){
    if(res.data.code=='401'){//未登录


    } else if (res.data.data.tcode == '200'){//显示二维码
      this.setData({ ifcanvas: true });
      this.setData({ ifmotai: false });
      var size = this.setCanvasSize();
      encryptcode = res.data.data.code;
      console.log('执行绘画1');
      QR.qrApi.draw(encryptcode, "mycanvas", size.w, size.h);
      
    } else if (res.data.data.tcode == '201'){//未支付账单
      this.setData({ ifcanvas: false });
      this.setData({ifmotai:true});
    }
  },
  //刷新二维码
  reset:function(){
    console.log(123243);
    this.getCode();
  },
  //请求二维码
  getCode:function(){
    var that = this;
    var token = wx.getStorageSync('token');
    var authorizationId = token.authorizationId;
    console.log('encryptcode');
    console.log(encryptcode);
    wx.request({
      url: 'http://dev.wetripay.com:8001/c1st/api/credential/getCode',
      data: {
        encryptcode: encryptcode
      },
      header: {
        //'content-type': 'application/json' // 默认值
        'content-type': 'application/x-www-form-urlencoded',
        'authorization': authorizationId
      },
      method: 'POST',
      success: function (res) {
        //成功，获取登录参数
        console.log("得到二维码");
        console.log(res);
        that.getCodesuccess(res);
      },
      fail: function (res) {
        //失败，重登录
        app.myfail(res)
      }
    })
  },
  //判断是否签约
  judge:function(){
    var that = this;
    var token = wx.getStorageSync('token');
    var authorizationId = token.authorizationId;
    var userid = token.userid;
    //判断是否签约
    wx.request({
      url: 'https://www.wetripay.com/xcxApp/api/wxnopass/query',
      method: 'POST',
      data: {
        'userid':userid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'authorization': authorizationId,
      },
      success: function (res) {
        console.log(res);
      //200用户已签约，201用户解除
        that.judgesuccess(res);
      },
      fail: function (res) {
        //失败，重登录
        app.myfail(res)
      }
    })
  },
  //成功
  judgesuccess:function(res){
    //200用户已签约，201用户解除
    var that = this;
    var token = wx.getStorageSync('token');
    var authorizationId = token.authorizationId;
    if(res.data.code=="201"){
      //开通签约
      //请求的参数
      var system = wx.getSystemInfoSync().system;
      wx.request({
        url: 'https://www.wetripay.com/xcxApp/api/wxnopass/sign',
        method: 'POST',
        data: {
          'type': system
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'authorization': authorizationId,
        },
        fail:function(res){
          //失败，重登录
          app.myfail(res)
        },
        success: function (res) {
          console.log('签约参数信息');
          console.log(res);
          var extraData = {
            appid: res.data.data.appid,
            contract_code: res.data.data.contract_code,
            contract_display_account: res.data.data.contract_display_account,
            mch_id: res.data.data.mch_id,
            notify_url: res.data.data.newNotify_url,
            plan_id: res.data.data.plan_id,
            request_serial: res.data.data.request_serial,
            timestamp: res.data.data.timestamp,
            sign: res.data.data.sign,
          };
          console.log(extraData);
          //跳转到签约小程序
          wx.navigateToMiniProgram({
            appId: 'wxbd687630cd02ce1d',
            path: 'pages/index/index',
            extraData: {
              appid: res.data.data.appid,
              contract_code: res.data.data.contract_code,
              contract_display_account: res.data.data.contract_display_account,
              mch_id: res.data.data.mch_id,
              notify_url: res.data.data.newNotify_url,
              plan_id: res.data.data.plan_id,
              request_serial: res.data.data.request_serial,
              timestamp: res.data.data.timestamp,
              sign: res.data.data.sign
            },
            success(res) {
              console.log('签名成功');
              console.log(res);
            }
          })
        }
      })
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
    this.getCode();//请求二维码
    //判断是否签约免密支付，如果无，签约
    
    
  
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