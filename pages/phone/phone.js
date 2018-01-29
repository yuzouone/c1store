// pages/phone/phone.js
const app = getApp();
var WXBizDataCrypt = require('../../utils/RdWXBizDataCrypt.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  //事件处理函数
  bindnext: function () {
    wx.switchTab({
      url: '../main/main'
    })
  },
  //获取用户信息函数
  getuserinfo: function (e){
    var that = this;
    var nickName="";
    var avatarUrl="";
    wx.getUserInfo({
      success: function (res) {
        console.log('获取用户信息');
        console.log(res);
        nickName = res.userInfo.nickName;
        avatarUrl = res.userInfo.avatarUrl;
        console.log(nickName);
        console.log(avatarUrl);
        that.getsessionkey(e, nickName, avatarUrl);
      },
      fail:function(){
        that.getsessionkey(e, nickName, avatarUrl);
      }
    })
  },
  //请求成功
  getsessionkeysuccess:function(res){
    var that = this;
    if (res.data.data.tcode=='200'){
      wx.setStorage({
        key: 'token',
        data: {
          "authorizationId":res.data.data.loginResult.authorizationId,
          "userid": res.data.data.loginResult.user.id
          },
        complete:function(){
          that.bindnext();
        }
      })
    }else{
      console.log('wosshfdlsafhjasujgas');
    }
  },
  //确定获取微信手机号
  getsessionkey: function (e, nickName, avatarUrl){
    var that = this;
    var openid = wx.getStorageSync('openid');
    var sessionkey = wx.getStorageSync('sessionkey');
    var AppId = "wx7ca3874267495d35";
    var pc = new WXBizDataCrypt(AppId, sessionkey);
    var datas = pc.decryptData(e.detail.encryptedData, e.detail.iv);
    var purePhoneNumber = datas.purePhoneNumber;
    console.log(purePhoneNumber);
    console.log(openid);
    console.log(nickName);
    console.log(avatarUrl);
    wx.request({
      url: 'http://dev.wetripay.com:8001/c1st/api/weixinlogin/xcxbinguser',
      data: {
        phone: purePhoneNumber,
        openid:openid,
        nickname: nickName,
        imgurl: avatarUrl

      },
      header: {
        //'content-type': 'application/json' // 默认值
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        //成功，获取登录参数
        console.log(res);
        that.getsessionkeysuccess(res);
      },
      fail: function (res) {
        //失败，重登录
        app.myfail(res)
      }
    })
  },
  //获取微信手机号
  getPhoneNumber: function (e) {
    var mydata = e;
    if (e.detail.encryptedData) {
      this.getuserinfo(mydata);//成功
    } else {
      console.log(456);
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