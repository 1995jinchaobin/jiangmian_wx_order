// pages/masks/orderMask.js
import request from "../../../utils/request.js";
import util from "../../../utils/util.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseCompanyName:false,
    chooseContacts: false,
    choosePhone:false,
    chooseAddress:false,
    chooseRemark: false,
    //公司名
    companyName:'',
    //联系人
    contacts:'',
    //联系电话
    phone:'',
    //地址
    address:'',
    userId:0,
    //备注
    remark:'',
    role:0,
    codeNum:0,
    actions:{
      orderMask:'/new/apply/addApplyXCX',
      judgeTodayApply:'/new/apply/judgeTodayApply',
      getOwnApply:'/new/apply/getOwnApply'
    },
    formToken:'',
    // 用于判断是否为订单页面跳转
    getClient:false
  },
  chooseCompanyNameMethod(){
    this.setData({
      chooseCompanyName:true
    })
  },
  notChooseCompanyNameMethod() {
    this.setData({
      chooseCompanyName: false
    })
  },
  chooseContactsMethod() {
    this.setData({
      chooseContacts: true
    })
  },
  notChooseContactsMethod() {
    this.setData({
      chooseContacts: false
    })
  },
  choosePhoneMethod() {
    this.setData({
      choosePhone: true
    })
  },
  notChoosePhoneMethod() {
    this.setData({
      choosePhone: false
    })
  },
  chooseAddressMethod() {
    this.setData({
      chooseAddress: true
    })
  },
  notChooseAddressMethod() {
    this.setData({
      chooseAddress: false
    })
  },
  chooseRemarkMethod() {
    this.setData({
      chooseRemark: true
    })
  },
  notChooseRemarkMethod() {
    this.setData({
      chooseRemark: false
    })
  },
  //点击立即创建按钮
  sureSubmit(){
    wx.showLoading({
      mask: true
    })
    let _this = this;
    //验证
    if (!_this.data.companyName) {
      wx.showToast({
        title: '请填写公司名',
        icon: 'none'
      })
    }else if (!_this.data.contacts) {
      wx.showToast({
        title:'请填写联系人',
        icon:'none'
      })
    } else if (!_this.data.phone) {
      wx.showToast({
        title: '请填写联系电话',
        icon: 'none'
      })
    } else if (!util.isPhoneAvailable(_this.data.phone)) {
      wx.showToast({
        title: '请填写正确的手机号码',
        icon: 'none'
      })
    } else if (!_this.data.address) {
      wx.showToast({
        title: '请填写详细收货地址',
        icon: 'none'
      })
    } else {
      wx.hideLoading();
      _this.submitOrder();
    }
  },
  submitOrder(){
    let _this = this;
    wx.showLoading({
      title: '正在创建客户',
      mask: true
    })
    let obj = {
      account: _this.data.phone,
      password: '123456',
      name: _this.data.contacts,
      remark: _this.data.remark,
      companyName: _this.data.companyName,
      contacts: _this.data.contacts,
      phone: _this.data.phone,
      address: _this.data.address,
      //如果创建客户的用户角色是业务员，则自动与该业务员绑定
      bindUserId: _this.data.role==1?_this.data.userId:0
    };
    request.request('/customer', obj, 'POST', 'orderPart', (res) => {
      wx.hideLoading();
      if(_this.data.getClient){
        wx.navigateBack({
          delta: 2
        })
      }else{
        wx.redirectTo({
          url: '/pages/client/clientList/index'
        });
      }
    }, (err) => { })
  },
  toMyOrders() {
    wx.reLaunch({
      url: '/pages/orderList/orderList',
    })
  },
  bindCompanyNameInput(e) {
    this.setData({
      companyName: e.detail.value
    })
  },
  bindContactsInput(e){
    this.setData({
      contacts: e.detail.value
    })
  },
  bindPhoneInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindAddressInput(e) {
    this.setData({
      address: e.detail.value
    })
  },
  bindRemarkInput(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  back() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("getClient", function (data) {
      _this.setData({
        getClient: data.getClient
      })
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
    let _this = this;
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        if (res.data) {
          _this.setData({
            'userId': res.data.id
          })
          _this.setData({
            'role': res.data.role
          })
        }
      }
    })
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