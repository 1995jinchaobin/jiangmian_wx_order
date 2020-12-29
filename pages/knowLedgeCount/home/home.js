// pages/home/home.js
import request from "../../../utils/request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 网络请求接口列表
    actions:{
      // getImgUrl: '/pic/pic'
      getImgUrl: '/badidu/pic/pic'
    },
    userInfo:[],
    imgUrl:'',
    // 显示加载中
    loading:false,
    // 网络资源请求头
    baseUrl:'',
    src:''
  },
  // 禁止页面滚动
  noneEnoughPeople(){},
  upLoadFile(){
    let _this = this;
    let obj = {
      page: 1,
      rows: 50
    }
    wx.chooseImage({
      success(res) {
        wx.showLoading({
          title: '玩命加载中',
        })
        let requserImgUrl = res.tempFilePaths[0];
        wx.uploadFile({
          url:request.baseUrl + _this.data.actions.getImgUrl,
          filePath: requserImgUrl,
          name: 'file',
          header:{
            "token":wx.getStorageSync("token"),
            "wxType":"wxType"
          },
          formData: {
            page: 1,
            rows: 50
          },
          success(res) {
            wx.hideLoading();
            let result = JSON.parse(res.data);
            if(result.code == 0){
              let imgUrl = result.wwwFileBaseUrl + result.data.searchImgUrl;
              wx.showToast({
                title: '查询成功',
                icon: 'none',
                success:function(){
                  setTimeout(function(){
                    wx.navigateTo({
                      url: '/pages/knowLedgeCount/detail/detail',
                      success: function (res) {
                        // 通过eventChannel向被打开页面传送数据
                        res.eventChannel.emit('pushImgUrl', { imgUrl: requserImgUrl, requserImgUrl: requserImgUrl, searchImgUrl: result.wwwFileBaseUrl })
                      }
                    })
                  },1000);
                }
              })
            }else if(result.code == 9){
              wx.showToast({
                title: result.message,
                icon: 'none',
                success(){
                  setTimeout(function(){
                    wx.clearStorageSync('token');
                    wx.clearStorageSync('userInfo');
                    wx.navigateTo({
                      url: '/pages/orderPart/login/login'
                    })
                  },1500)
                }
              })
            }else{
              wx.showToast({
                title: result.message,
                icon: 'none'
              })
            }
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('userInfo') != ''){
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo
      })
    }else{
      wx.showToast({
        title: '您还未登录，请登录',
        icon: 'none',
        success(){
          setTimeout(function(){
            wx.redirectTo({
              url: '/pages/orderPart/login/login',
            })
          },1000)
        }
      })
    }
  },
  changeImg(){
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