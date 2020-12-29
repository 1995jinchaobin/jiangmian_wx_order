// pages/client/clientList/index.js
import request from '../../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl:{
      // 客户列表
      customer:'/customer',
    },
    clientList: [],
    page: 1,
    getClient:false,
    search:''
  },
  // 获取客户列表
  getClientList(key){
    let _this = this;
    let data = {
      page: this.data.page,
      rows: 40
    }
    if(key){
      data.key = key
    }
    request.request(this.data.requestUrl.customer,data,'get','',(res)=>{
      _this.setData({
        clientList: res.data.data.list
      })
    })
  },
  // 客户列表点击
  toClient(e) {
    if(this.data.getClient){
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit("getClientInfo", { clientInfo: JSON.stringify(e.target.dataset.info) })
      wx.navigateBack({
      })
    }else{
      let info = JSON.stringify(e.target.dataset.info);
      wx.navigateTo({
        url: '/pages/client/clientMsg/index?info=' + info,
      })
    }
  },
  // 输入框输入
  adInputChange(a) {
    this.setData({
      search: a.detail.value,
    })
  },
  // 点击搜索
  hideKey() {
    this.getClientList(this.data.search)
  },
  // 点击新建客户
  toCreate(){
    if(this.data.getClient){
      wx.navigateTo({
        url: '/pages/orderPart/addUser/addUser',
        success:function(res){
          res.eventChannel.emit("getClient", { getClient: true })
        }
      })
    }else{
      wx.redirectTo({
        url:'/pages/orderPart/addUser/addUser'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    this.getClientList();
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("getClient",function(data){
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