// pages/orderPart/fabricList/fabricList.js
import request from "../../../utils/request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
    screenHeight: wx.getSystemInfoSync().screenHeight,
    fabricList:[],
    pageSize:6,
    page:1,
    total: 0
  },
  //查询列表数据
  getList() {
    wx.stopPullDownRefresh()
    wx.showLoading({
      title: '正在加载'
    })
    let _this = this;
    let obj = {
        rows: _this.data.pageSize,
        page: _this.data.page
      }
    request.request('/fabric/own', obj, 'get', 'orderPart', (res) => {
      wx.showToast({
        title: '加载完成',
        duration: 2000
      })
      _this.setData({
        fabricList: res.data.data.list,
        total: res.data.data.total
      });
    })
  },
  gotoIndex(){
    wx.navigateTo({
      url: '/pages/orderPart/orderIndex/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
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
    this.getList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.total > this.data.pageSize) {
      this.setData({
        pageSize: this.data.pageSize + 6
      })
      this.getList();
    } else {
      wx.showToast({
        title: '已全部加载完成',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})