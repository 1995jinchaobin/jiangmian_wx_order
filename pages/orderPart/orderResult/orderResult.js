import request from "../../../utils/request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:0,
    orderId:0,
    appId:'',
    nonceStr:'',
    package:'',
    paySign:'',
    signType:'',
    timeStamp:'',
    showFlag:true,
    code:0,
    failMessage:'',
    orderInfo:{},
    id:0,
    contacts:'',
    companyName:'',
    phone:'',
    address:'',
    remark:''
  },
  toMyOrders(){
    wx.reLaunch({
      url: '/pages/orderPart/orderList/orderList',
    })
  },
  goHome(){
    wx.reLaunch({
      url: '/pages/orderPart/orderIndex/index',
    })
  },
  back() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  updateOrder(e){
    wx.navigateTo({
      url: '/pages/order/order?orderUpdate=true'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getList();
    let _this = this;
    // const eventChannel = this.getOpenerEventChannel();
    // eventChannel.on('resultCode', function (data) {
    //   _this.setData({
    //     code: data.code
    //   })
    // })
    if(options){
      _this.setData({
        code: options.code
      })
      if (options.failMessage){
        _this.setData({
          failMessage: options.failMessage
        })
      }
    }
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