//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //授权函数
  authorize:function(){
    wx.authorize({
      scope: 'scope.userInfo',
      success() {
        // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
      }
    })
  },
  //跳转到说明页面
  bindViewTap: function() {
    wx.navigateTo({
      url: '../welcome/welcome'
    })
  },
  //跳转到二维码页面
  bindmain: function () {
    wx.switchTab({
      url: '../main/main'
    })
  },
  
  //登录成功
  loginsuccess: function (res) {
    var that = this;
    if (res.data.data.tcode == '200') {
      wx.setStorage({
        key: 'token',
        data: {
          "authorizationId": res.data.data.loginResult.authorizationId,
          "userid": res.data.data.loginResult.user.id
        },
        complete: function () {
          that.bindmain();
        }
      })
    } else if (res.data.data.tcode == '300') {
      //信息放缓存
      wx.setStorage({
        key: 'openid',
        data: res.data.data.openid,
      });
      wx.setStorage({
        key: 'sessionkey',
        data: res.data.data.sessionkey,
      });
      this.bindViewTap();
    }else{
      wx.showModal({
        title: '提示',
        content: res.data.data.remsg,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  //获取code失败
  loginfail:function(){
    wx.showModal({
      title: '提示',
      content: '登录异常，请稍候再使用',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //登录函数
  login:function(){
    var that = this;
    wx.login({
      success:function(res){
        console.log(res);
        //成功，请求后台
        wx.request({
          url:'http://dev.wetripay.com:8001/c1st/api/weixinlogin/xcxlogin' ,
          data: {
            code:res.code
          },
          header: {
            //'content-type': 'application/json' // 默认值
            'content-type': 'application/x-www-form-urlencoded'
          },
          method:'POST',
          success: function (res) {
            //成功，获取登录参数
            console.log(res);
            that.loginsuccess(res);
          },
          fail:function(res){
            //失败，重登录
            app.myfail();
          }
        })

      },
      fail:function(res){
        //登录失败，调用提示
        that.loginfail();
      }
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow:function(){
    this.login();//登录
    this.authorize();//获取身份信息权限
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
