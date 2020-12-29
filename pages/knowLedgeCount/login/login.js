// pages/login/login.js
import request from '../../../utils/request.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:'',
    password:'',
    actios:{
      login:'/user/token'
    }
  },
  // 禁止页面滑动
  noneEnoughPeople(){},
  getuserName(e){
    this.setData({
      userId: e.detail.value
    })
  },
  getPassword(e){
    this.setData({
      password: e.detail.value
    })
  },
  userLogin(){
    // wx.redirectTo({
    //   url: '/pages/knowLedgeCount/home/home',
    // })
    // console.log(1)
    if(this.data.userId == ''){
      wx.showToast({
        title: '账号不能为空',
        icon: 'none'
      });
      return;
    }
    if(this.data.password == ''){
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      });
      return;
    }
    let obj = {
      account: this.data.userId,
      password: this.data.password
    }
    let _this = this;
    request.request(this.data.actios.login,obj,'post','knowLedgeCount',(res)=>{
      wx.setStorageSync("token",res.data.data.token)
      wx.setStorageSync('userInfo', res.data.data);
      wx.showToast({
        title: '登录成功',
        icon: 'none',
        success:function(){
          setTimeout(function(){
            wx.redirectTo({
              url: '/pages/knowLedgeCount/home/home',
            })
          },2000)
        }
      })
    },(err)=>{

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