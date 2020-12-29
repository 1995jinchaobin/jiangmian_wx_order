// pages/search/home/index.js
import request from '../../../utils/request.js'
import util from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl:{
      // 订单接口
      order:'/order',
      // 获取联系人
      customer:'/customer',
      // 面料接口
      fabric:'/fabric'
    },
    userType:0,
    placeText:'公司',
    countType:0,
    // 联系人列表
    customerList:[],
    page:1,
    orderList:[],
    statusList: ['审核不通过', '待审核', '已审核', '打大货确认样', '底布进仓', '底布检验', '底布出库', '做货加工', '成品入库', '成品检验'],
    fabricList:[],
    orderSatausList:[],
    date:'2016-09-01',
    imgBaseUrl:'',
    //输入框内容
    searchInput: ''
  },
  // 点击收起键盘
  hideKey(){
    wx.hideKeyboard();
    this.setData({
      placeText: '公司名',
      countType: 0
    })
  },
  //输入框失去焦点
  setSearchInput (e) {
    this.setData({
      searchInput: e.detail.value
    })
  },
  //搜索
  getSearchList() {
    console.log(this.data.placeText)
    console.log(this.data.searchInput)
    const value = this.data.searchInput
    if (this.data.placeText=='公司') {
      wx.navigateTo({
        url: '/pages/orderPart/orderList/orderList?companyName=' + value,
      })
    }
    if (this.data.placeText == '大货订单号') {
      wx.navigateTo({
        url: '/pages/orderPart/orderList/orderList?bigOrderNum=' + value,
      })
    }
    if (this.data.placeText == '客户订单号') {
      wx.navigateTo({
        url: '/pages/orderPart/orderList/orderList?productNum=' + value,
      })
    }
    if (this.data.placeText == '订单号') {
      wx.navigateTo({
        url: '/pages/orderPart/orderList/orderList?orderId=' + value,
      })
    }
  },
  // 点击订单
  orderMsg(e){
    let role = wx.getStorageSync("userInfo").role;
    if(role == 1||role == 2||role == 0){
      let msg = JSON.stringify(e.currentTarget.dataset.msg)
      let url = this.data.imgBaseUrl;
      wx.navigateTo({
        url: '/pages/orderPart/orderMsg/index?msg=' + msg + '&url=' + url,
      })
    }
  },
  // 点击面料规格
  searchFabricType(e){
    let type = e.target.dataset.key;
    wx.navigateTo({
      url: '/pages/orderPart/orderList/orderList?key=' + type,
    })
  },
  // 点击用户
  searchUser(e){
    let userName = e.target.dataset.info.name;
    wx.navigateTo({
      url: '/pages/orderPart/orderList/orderList?key=' + userName,
    })
  },
  searchKey(e){
    let key = e.target.dataset.key;
    let type;
    switch(key){
      case '联系人':
        type = 1;
        this.getCustomerList();
        break;
      case '日期':
        
        break;
      case '面料规格':
        type = 3;
        this.getFabricList();
        break;
      case '订单状态':
        let orderStatus = [];
        type = 4;
        switch(this.data.userType){
          case 1:
            orderStatus = ['审核不通过', '待审核', '已审核', '打大货确认样', '底布进仓', '底布检验', '底布出库', '做货加工', '成品入库', '成品检验','成品出货','出货验收','客户收货','客户退货','已取消'];
            break;
          case 2:
            orderStatus = ['审核不通过', '待审核', '已审核', '打大货确认样', '底布进仓', '底布检验', '底布出库', '做货加工', '成品入库', '成品检验','成品出货','出货验收','客户收货','客户退货','已取消'];
            break;
          case 3:
            orderStatus = ['审核不通过', '待审核', '已审核', '底布进仓', '底布出库', '成品入库', '成品出货', '已取消'];
            break;
          case 4:
            orderStatus = ['底布检验','成品检验'];
            break;
          case 7:
            orderStatus = ['打大货确认样', '做货加工'];
            break;
          default:
            break;
        }
        this.setData({
          orderSatausList: orderStatus
        })
        break;
      default:
        break;        
    }
    this.setData({
      placeText: key,
      countType: type
    })
  },
  bindDateChange(e){
    this.setData({
      date: e.detail.value
    })
    wx.navigateTo({
      url: '/pages/orderPart/orderList/orderList?endTime=' + e.detail.value,
    })
  },
  // 用户点击订单状态
  orderClick(e){
    let orderStatus;
    switch (e.target.dataset.type){
      case '审核不通过':
        orderStatus = -1;
        break;
      case '待审核':
        orderStatus = 0;
        break;
      case '已审核':
        orderStatus = 1;
        break;
      case '打大货确认样':
        orderStatus = 2;
        break;
      case '底布进仓':
        orderStatus = 3;
        break;
      case '底布检验':
        orderStatus = 4;
        break;
      case '底布出库':
        orderStatus = 5;
        break;
      case '做货加工':
        orderStatus = 6;
        break;
      case '成品入库':
        orderStatus = 7;
        break;
      case '成品检验':
        orderStatus = 8;
        break;
      case '成品出货':
        orderStatus = 9;
        break;
      case '出货验收':
        orderStatus = 10;
        break;
      case '客户收货':
        orderStatus = 11;
        break;
      case '客户退货':
        orderStatus = 12;
        break;
      case '已取消':
        orderStatus = 100;
        break;
      default:
        return;
        break;
    }
    wx.navigateTo({
      url: '/pages/orderPart/orderList/orderList?orderStatus=' + orderStatus,
    })
  },
  // 用户点击搜索
  getList(e) {
    console.log(this.data.countType)
    console.log(e.detail.value)
    switch (this.data.countType) {
      case 0:
        this.getOrderList(e.detail.value)
        break;
      case 1:
        this.getCustomerList(e.detail.value);
        break;
      case 2:
        break;
      case 3:
        this.getFabricList(e.detail.value);
        break;
      case 4:
        break;
      case 5:
        this.getOrderList(e.detail.value)
      default:
        break;
    }
  },
  // 获取订单信息
  getOrderList(key){
    wx.navigateTo({
      url: '/pages/orderPart/orderList/orderList?key=' + key,
    })
  },
  // 获取联系人列表
  getCustomerList(key){
    let _this = this;
    let data = {
      page: this.data.page,
      rows: 9999
    };
    if(key){
      data.key = key
    }
    request.request(this.data.requestUrl.customer,data,'get','',(res)=>{
      // console.log(res)

      _this.setData({
        customerList: res.data.data.list
      })
    })
  },
  // 获取面料规格
  getFabricList(key) {
    let _this = this;
    let data = {
      page: this.data.page,
      rows: 999
    }
    if(key){
      data = {
        page: this.data.page,
        rows: 999,
        key: key
      }
    }
    request.request(this.data.requestUrl.fabric, data, 'get', '', (res) => {
      _this.setData({
        fabricList: res.data.data.list
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync("userInfo");
    let date = util.formaData();
    this.setData({
      date: date,
      userType: userInfo.role
    })
    if(options.key){
      let key = {
        target:{
          dataset:{
            key: options.key
          }
        }
      }
      console.log(key)
      this.searchKey(key)
    }
    if(options.msg){
      this.getOrderList(options.msg)
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