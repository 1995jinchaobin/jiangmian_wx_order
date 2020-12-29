// pages/orderPart/orderIndex/index.js
import util from "../../../utils/util.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2016-09-01',
    role:-1
  },
  // 前往以图识图页面
  toPic(){
    wx.navigateTo({
      url: '/pages/knowLedgeCount/home/home',
    })
  },
  // 前往搜索页面
  toSearch(e){
    wx.navigateTo({
      url: '/pages/search/home/index?msg=' + e.detail.value,
    })
  },
  // 前往订单创建/我的面料页面
  toCreatedOrder(){
    if (wx.getStorageSync("userInfo")){
      let role = wx.getStorageSync("userInfo").role;
      if(role == 1 || role== 2){
        wx.navigateTo({
          url: '/pages/order/order',
        })
      } else if (role == 0) {
        wx.navigateTo({
          url: '/pages/orderPart/fabricList/fabricList',
        })
      }else{
        wx.showToast({
          title: '您没有权限新建订单！',
          icon:'none'
        })
      }
    }else{
      wx.showToast({
        title: '您还未登录',
        icon:"none",
        success(res){
          setTimeout(function(){
            wx.navigateTo({
              url: '/pages/orderPart/login/login'
            })
          },500)
        }
      })
    }
  },
  // 前往搜索页面
  toSearchKey(e){
    wx.navigateTo({
      url: '/pages/search/home/index?key=' + e.currentTarget.dataset.key,
    })
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
    wx.navigateTo({
      url: '/pages/orderPart/orderList/orderList?endTime=' + e.detail.value,
    })
  },
  // 前往订单列表页面; 0---查看所有订单，1---查看待处理订单
  toOrderList(e){
    if(wx.getStorageSync("userInfo")){
      wx.navigateTo({
        url: '/pages/orderPart/orderList/orderList?type=' + e.currentTarget.dataset.type,
      })
    }else{
      wx.showToast({
        title: '您还未登录',
        icon: "none",
        success(res) {
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/orderPart/login/login'
            })
          }, 500)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = util.formaData();
    this.setData({
      date: date
    })
    if (wx.getStorageSync("userInfo")) {
      let role = wx.getStorageSync("userInfo").role;
      this.setData({
        role:role
      })
    } else {
      wx.showToast({
        title: '您还未登录',
        icon: "none",
        success(res) {
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/orderPart/login/login'
            })
          }, 500)
        }
      })
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