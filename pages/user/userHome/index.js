// pages/userHome/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:'',
    yujingNum: 0,
    role: null
  },
  toPassword(){
    wx.navigateTo({
      url: '/pages/user/revisePassword/index',
    })
  },
  toPhone(){
    wx.navigateTo({
      url: '/pages/user/revisePhone/index',
    })
  },
  toCountPage(){
    wx.navigateTo({
      url: '/pages/user/count/count',
    })
  },
  toDayFive () {
    wx.navigateTo({
      url: '/pages/orderPart/orderList/orderList?five=5',
    })
  },
  // 退出登录
  quit(){
    wx.removeStorageSync("userInfo");
    wx.removeStorageSync("token");
    wx.reLaunch({
      url:'/pages/orderPart/login/login'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   yujingNum: wx.getStorageSync("yujingNum")
    // })
    this.setData({
      role: wx.getStorageSync("userInfo").role
    })
    if (wx.getStorageSync("userInfo")){
      let role;
      let phone;
      let info = wx.getStorageSync("userInfo");
      switch (info.role){
        case 0:
          role = '客户';
          break;
        case 1:
          role = '业务员';
          break;
        case 2:
          role = '厂长';
          break;
        case 3:
          role = '仓库管理员';
          break;
        case 4:
          role = '检验员';
          break;
        case 7:
          role = '跟单员';
          break;
        default:
          break;
      }
      let reg = /(\d{3})\d{4}(\d{4})/;
      info.account = info.account.replace(reg, "$1****$2");
      info.role = role;
      this.setData({
        userInfo: info
      })
    }else{
      wx.showToast({
        title: '您还未登录，请先登录！',
        icon:'none',
        success(res){
          setTimeout(function(){
            wx.redirectTo({
              url: '/pages/orderPart/login/login',
            })
          },1000)
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      yujingNum: wx.getStorageSync("yujingNum")
    })
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