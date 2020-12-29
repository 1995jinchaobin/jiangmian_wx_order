// pages/user/revisePhone/index.js
import request from '../../../utils/request.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl: {
      password: '/customer/phone'
    },
    oldPassword: false,
    newPassword: false,
    avtPassword: false,
    oldPasswordValue: '',
    newPasswordValue: '',
  },
  oldInputHidd() {
    this.setData({
      oldPassword: true
    })
  },
  oldInputShow(e) {
    let value = e.detail.value;
    if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(value))) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      })
      this.setData({
        oldPassword: false
      })
      return;
    }
    this.setData({
      oldPassword: false,
      oldPasswordValue: value
    })
  },
  newInputHidd() {
    this.setData({
      newPassword: true
    })
  },
  newInputShow(e) {
    let value = e.detail.value;
    if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(value))) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      })
      this.setData({
        newPassword: false
      })
      return;
    }
    this.setData({
      newPassword: false,
      newPhone: value
    })
  },
  actInputHidd() {
    this.setData({
      actPassword: true
    })
  },
  revisePassword() {
    let _this = this;
    let data = {
      phone: this.data.newPhone
    }
    request.requestPut(this.data.requestUrl.password, data, '', (res) => {
      wx.showToast({
        title: '修改成功',
        icon: 'none',
        success() {
          setTimeout(function () {
            wx.navigateBack({
              
            })
          }, 1000)
        }
      })
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