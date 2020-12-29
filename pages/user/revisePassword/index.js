// pages/user/revisePhone/index.js
import request from '../../../utils/request.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl:{
      password:'/user/password'
    },
    oldPassword: false,
    newPassword: false,
    avtPassword:false,
    oldPasswordValue:'',
    newPasswordValue:'',
    passwordLock:false
  },
  oldInputHidd(){
    this.setData({
      oldPassword: true
    })
  },
  oldInputShow(e) {
    let value = e.detail.value;
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
    this.setData({
      newPassword: false,
      newPasswordValue: value
    })
  },
  actInputHidd() {
    this.setData({
      actPassword: true
    })
  },
  actInputShow(e) {
    let value = e.detail.value;
    this.setData({
      actPassword: false
    })
    if(value !== this.data.newPasswordValue){
      wx.showToast({
        title: '两次输入的密码不相同',
        icon:'none'
      })
    }else{
      this.setData({
        passwordLock: true
      })
    }
  },
  revisePassword(){
    let _this = this;

    if(this.data.oldPasswordValue == ''){
      wx.showToast({
        title: '旧密码不能为空',
        icon:'none'
      })
      return;
    }
    if (this.data.newPasswordValue == '') {
      wx.showToast({
        title: '新密码不能为空',
        icon: 'none'
      })
      return;
    }
    if (!this.data.passwordLock) {
      wx.showToast({
        title: '两次输入的密码不相同',
        icon: 'none'
      })
      return;
    }
    let data = {
      oldPassword: this.data.oldPasswordValue,
      newPassword: this.data.newPasswordValue
    }
    request.requestPut(this.data.requestUrl.password,data,'',(res)=>{
          wx.showToast({
            title: '修改成功！请重新登录。',
            icon:'none',
            success(){
              setTimeout(function(){
                wx.removeStorageSync("userInfo");
                wx.removeStorageSync("token");
                wx.reLaunch({
                  url: '/pages/orderPart/login/login'
                })
              },1000)
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