// pages/login/login.js
import request from "../../../utils/request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
    screenHeight: wx.getSystemInfoSync().screenHeight,
    chooseAccount: false,
    choosePassword: false,
    account:'',
    password:''
  },
  chooseAccountMethod() {
    this.setData({
      chooseAccount: true
    })
  },
  notChooseAccountMethod() {
    this.setData({
      chooseAccount: false
    })
  },
  bindAccountInput(e) {
    this.setData({
      account: e.detail.value
    })
  },
  choosePasswordMethod() {
    this.setData({
      choosePassword: true
    })
  },
  notChoosePasswordMethod() {
    this.setData({
      choosePassword: false
    })
  },
  bindPasswordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },
  clickForgetPwd(){
    wx.showToast({
      title: '请联系管理员重置密码',
      icon:none,
      duration:2000
    })
  },
  login(){
    wx.showLoading({
      mask: true
    })
    let _this = this;
    //验证
    if (!_this.data.account) {
      wx.showToast({
        title: '请填写账号',
        icon: 'none'
      })
    } else if (!_this.data.password) {
      wx.showToast({
        title: '请填写密码',
        icon: 'none'
      })
    } else {
      wx.hideLoading();
      let obj = {
        account: _this.data.account,
        password: _this.data.password
      };
      request.request('/user/token', obj, 'POST', 'orderPart', (res) => {
        wx.setStorageSync("token", res.data.data.token)
        let userInfo = res.data.data
        //判断是否绑定过微信
        wx.login({
          success(resWxLogin) {
            if (resWxLogin.code) {
              //发起网络请求
              request.request('/wxBindJudge', { "wxcode": resWxLogin.code}, 'POST', 'orderPart', (resJudge) => {
                //如果绑定过，则继续
                if (resJudge.data.code==0){
                  //存储用户信息
                  wx.setStorageSync('userInfo', userInfo);
                  wx.setStorageSync('loginInfo', obj);
                  wx.hideLoading();
                  wx.redirectTo({
                    url: '/pages/orderPart/orderIndex/index'
                  });
                } else if (resJudge.data.code==100){
                  //如果没有绑定过，则进行绑定
                  wx.showModal({
                    title: '提示',
                    content: '请问是否要绑定当前微信，一旦绑定不能修改',
                    success(res) {
                      if (res.confirm) {
                        wx.login({
                          success(resLogin) {
                            if (resLogin.code) {
                              //发起网络请求
                              request.request('/wxBind', { "wxcode": resLogin.code }, 'POST', 'orderPart', (res) => {
                                //如果绑定成功，则继续
                                //存储用户信息
                                wx.setStorageSync('userInfo', userInfo);
                                wx.hideLoading();
                                wx.redirectTo({
                                  url: '/pages/orderPart/orderIndex/index'
                                });
                              })
                            } else {
                            }
                          }
                        })
                      }
                    }
                  })
                }
              }, (err) => { })
            } else {
            }
          }
        })
      }, (err) => { })
    }
  },
  //判断是否绑定过微信
  wxBindJudge(){

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.getStorage({
      key: 'loginInfo',
      success(res) {
        if (res.data) {
          _this.setData({
            'account': res.data.account
          })
          _this.setData({
            'password': res.data.password
          })
        }
      }
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