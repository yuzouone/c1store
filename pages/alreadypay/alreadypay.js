// pages/alreadypay/alreadypay.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  //时间
  add0: function (m) { return m < 10 ? '0' + m : m },
  getDate: function (shijianchuo) {
    //shijianchuo是整数，否则要parseInt转换  
    var time = new Date(shijianchuo);
    //var y = time.getFullYear();
    var arr =[];
    var m = time.getMonth() + 1;
    var d = time.getDate();
    m = this.add0(m);
    d = this.add0(d);
    arr.push(m);
    arr.push(d);
    return arr;
    //var h = time.getHours();
    // var mm = time.getMinutes();
    //var s = time.getSeconds();
    // y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
  },   
  //成功
  gethistorysuccess:function(res){
    var orders = res.data.data.orders;
    for(var i=0;i<orders.length;i++){
      var updateTime= orders[i].updateTime;
      updateTime = this.getDate(updateTime);
      orders[i].updateTime = updateTime;
    }
    console.log('历史订单数组');
    console.log(orders);
    this.setData({ orders: orders});

  },
  //获取历史订单
  gethistory: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    var authorizationId = token.authorizationId;
    wx.request({
      url: 'http://dev.wetripay.com:8001/c1st/api/userOrder?getHistoryOrder',
      data: {
        userid:'1'
      },
      header: {
        //'content-type': 'application/json' // 默认值
        'content-type': 'application/x-www-form-urlencoded',
        'authorization': authorizationId
      },
      method: 'POST',
      success: function (res) {
        //成功，获取账单
        console.log(res);
        that.gethistorysuccess(res);
      },
      fail: function (res) {
        //失败，重登录
        app.myfail(res)
      }
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
    this.gethistory();
  
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