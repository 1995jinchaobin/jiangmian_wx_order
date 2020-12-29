// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  // 禁止页面滚动
  noneEnoughPeople(){},
  // 跳转到以图识图页面
  toPic(){
    wx.navigateTo({
      url: '/pages/knowLedgeCount/home/home',
    })
  },
  // 跳转到在线订单系统页面
  toOrder(){
    wx.navigateTo({
      url: '/pages/orderPart/orderIndex/index',
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