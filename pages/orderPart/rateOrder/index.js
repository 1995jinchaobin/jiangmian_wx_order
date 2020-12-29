// pages/orderPart/rateOrder/index.js
import request from "../../../utils/request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    note: '',
    picList:[],
    wwwFileBaseUrl: ''
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
        title: '请填写反馈信息',
        icon: 'none'
      })
    } else {
      wx.hideLoading();
      _this.submitOrder();
    }
  },
  submitOrder() {
    let _this = this;
    let urls = '';
    if (_this.data.picList.length>0){
      for (let i = 0 ;i<_this.data.picList.length;i++) {
        urls += _this.data.picList[i].customContent + ';'
      }
      urls = urls.substr(0, urls.length - 1);
    }
    wx.showLoading({
      title: '正在提交',
      mask: true
    })
    let obj = {
      comment: _this.data.note,
      id: _this.data.id,
      urls: urls
    };
    request.request('/order/comment', obj, 'POST', 'orderPart', (res) => {
      wx.hideLoading();
      wx.showToast({
        title: res.data.message,
        duration: 2000,
        complete: () => {
          wx.redirectTo({
            url: '/pages/orderPart/orderList/orderList'
          });
        }
      })
    }, (err) => { })
  },
  // 删除已传图片
  deletePic(e) {
    let newList = this.data.picList;
    newList.splice(e.target.id, 1);
    this.setData({
      picList: newList
    })
  },
  // 点击添加图片
  addPicList() {
    let _this = this;
    wx.chooseImage({
      success(res) {
        let requserImgUrl = res.tempFilePaths[0];
        wx.uploadFile({
          url: request.baseUrl + '/file',
          filePath: requserImgUrl,
          name: 'file',
          header: {
            "token": wx.getStorageSync("token")
          },
          formData: {
            type: 0
          },
          success(res) {
            let result = JSON.parse(res.data);
            if (result.code == 0) {
              _this.setData({
                fabricList: list,
                wwwFileBaseUrl: result.wwwFileBaseUrl
              })
              let list = {
                productId: Math.ceil(Math.random() * 10) + Math.ceil(Math.random() * 10),
                customContent: result.data
              }
              let picList = _this.data.picList;
              picList.push(list);
              _this.setData({
                picList: picList
              })
            } else if (result.code == -1) {
              wx.showToast({
                title: result.message,
                icon: 'none',
                success() {
                  setTimeout(function () {
                    wx.clearStorageSync('token');
                    wx.clearStorageSync('userInfo');
                    wx.navigateTo({
                      url: '/pages/knowLedgeCount/login/login'
                    })
                  }, 1500)
                }
              })
            } else {
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
    let _this = this;
    _this.setData({
      id: options.orderId
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