// pages/person/person.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  //获取用户信息
  userinfo:function(){
    var that = this;
    wx.getUserInfo({
      success:function(res){
        console.log(res);
        var nickName = res.userInfo.nickName;
        var avatarUrl = res.userInfo.avatarUrl;
        var gender = res.userInfo.gender;
        var province = res.userInfo.province;
        var city = res.userInfo.city;
        console.log(nickName);
        console.log(avatarUrl);
        console.log(gender);
        console.log(province);
        that.setData({ name: nickName });
        that.setData({ headimg: avatarUrl});
        that.setData({ province: province });
        that.setData({ city: city });
        if(gender ==0){
          that.setData({ seximg: 0 });
        }else if(gender == 1){
          that.setData({ seximg: "../images/sex@2x.png" });
        }else if (gender == 2) {
          that.setData({ seximg: "../images/female@2x.png" });
        }
      }
    })
  },
  //拨打客服电话
  telephone:function(){
    wx.makePhoneCall({
      phoneNumber: '18877828871'
    })
  },
  //跳转到账单页面
  alreadypay:function(){
    wx.navigateTo({
      url: '../alreadypay/alreadypay',
    })
  },
  //跳转到about页面
  about:function(){
    wx.navigateTo({
      url: '../about/about',
    })
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
    this.userinfo();
  
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