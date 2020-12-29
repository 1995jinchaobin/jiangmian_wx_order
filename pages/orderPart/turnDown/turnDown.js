// pages/orderPart/turnDown/turnDown.js
import request from "../../../utils/request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    note:''
  },
  bindNoteInput(e) {
    this.setData({
      note: e.detail.value
    })
  },

  //点击立即创建按钮
  sureSubmit() {
    wx.showLoading({
      mask: true
    })
    let _this = this;
    //验证
    if (!_this.data.note) {
      wx.showToast({
        title: '请填写驳回理由',
        icon: 'none'
      })
    } else {
      wx.hideLoading();
      _this.submitOrder();
    }
  },
  submitOrder() {
    let _this = this;
    wx.showLoading({
      title: '正在提交',
      mask: true
    })
    let obj = {
      type: -1,
      note: _this.data.note,
      meter: 0,
      okMeter: 0,
      badMeter: 0,
      expressNumber: '',
      id: _this.data.id
    };
    request.request('/flow/' + _this.data.id, obj, 'POST', 'orderPart', (res) => {
      wx.hideLoading();
      wx.showToast({
        title: res.data.message,
        duration: 2000,
        complete:()=>{
          wx.redirectTo({
            url: '/pages/orderPart/orderList/orderList'
          });
        }
      })
    }, (err) => { })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      id:options.id
    })
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