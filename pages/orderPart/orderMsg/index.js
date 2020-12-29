// pages/orderPart/orderMsg/index.js
import request from '../../../utils/request.js'
import util from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
    screenHeight: wx.getSystemInfoSync().screenHeight,
    requestUrl:{
      order:'/order/cancel/'
    },
    orderInfo:[],
    flowerList:[],
    baseUrl:'',
    maxImgShow: false,
    maxImgUrl:'',
    maxFlowerName:'',
    role:0,
    statusList: ['审核不通过', '下单', '审核通过', '大货确认', '底布进仓', '底布检验', '底布出库', '做货加工', '成品入库', '成品检验', '码单确认','成品出货','客户收货','客户退货'],
    wwwFileBaseUrl:'',
    danWeiList: ['元','码'],
    changeDate: '',
    changeDateShow: false,
    timeId: null
  },
  clickImg(e){
    let item = e.target.dataset.item;
    let _this = this;
    let imgUrl="";
    wx.getStorage({
      key: 'imgUrl',
      success: function (res) {
        imgUrl=res.data;
        _this.setData({
          maxImgUrl: imgUrl + item.flowerUrl,
          maxImgShow: true,
          maxFlowerName: item.flowerName
        })
      },
    })
  },
  clickImgMadan (e) {
    console.log(e.target.dataset.item)
    console.log(e.target.dataset)
    this.setData({
      maxImgUrl: this.data.baseUrl + e.target.dataset.item,
      maxImgShow: true
    })
  },
  clickRateImg(e) {
    let url = e.target.dataset.url;
    let _this = this;
    let imgUrl = "";
    _this.setData({
      maxImgUrl: url,
      maxImgShow: true,
      maxFlowerName: ''
    })
  },
  cancelOrder(){
    let _this = this;
    wx.showModal({
      title: '订单取消',
      content: '是否要取消订单',
      success(res){
        if (res.confirm){
          let id = _this.data.orderInfo.orderDetails[0].fkOrderId
          request.request(_this.data.requestUrl.order + id,'','get','',function(res){
            wx.showToast({
              title: res.data.message,
              success(){
                setTimeout(function(){
                  wx.redirectTo({
                    url: '/pages/orderPart/orderList/orderList?type=0',
                  })
                },1000)
              }
            })
          })
        }
      }
    })

  },
  againOrder(){
    let orderInfo = JSON.stringify(this.data.orderInfo);
    wx.showModal({
      title: '再次下单',
      content: '是否要再次下单',
      success(res){
        if (res.confirm){
          wx.navigateTo({
            url: '/pages/order/order?again=' + orderInfo,
          })
        }
      }
    })

  },
  maxImgShow(){
    this.setData({
      maxImgUrl:'',
      maxImgShow: false
    })
  },
  //厂长修改交货时间
  changeDeliveryTime (e) {
    console.log(e.currentTarget.dataset.time)
    this.setData({
      changeDate:e.currentTarget.dataset.time,
      changeDateShow:true,
      timeId:e.currentTarget.dataset.timeid
    })
  },
  // 取消
  jiaohuoCancel() {
    this.setData({
      changeDate:'',
      changeDateShow:false
    })
  },
  // 修改时间
  bindDateChange(e){
    this.setData({
      changeDate: e.detail.value + ' 23:59:59'
    })
  },
  // 确认
  jiaohuoSureBtn() {
    const obj = {
      deliveryTime:this.data.changeDate
    }
    console.log(obj)
    request.requestPut('/order/'+this.data.timeId, obj, '', (res) => {
      // wx.hideLoading()
      console.log(res)
      // this.getYujingList()
      wx.showToast({
        title: res.data.message,
        duration: 1500,
        success: () => {
        }
      })
      this.setData({
        changeDateShow:false,
      })
      if(res.data.code==0){
        setTimeout(()=>{
          wx.navigateTo({
            url: '/pages/orderPart/orderList/orderList'
          })
        },1500)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '订单信息'
    })
    this.setData({
      role: wx.getStorageSync("userInfo").role
    })
    // console.log(options)
    if(options.msg){
      // console.log(options.msg)
      let msg = JSON.parse(options.msg);
      console.log(msg)
      const startTime = msg.deliveryTime
      const endTime = msg.deliveryTimeStart
      msg.startTime = startTime.substring(0, startTime.indexOf(' '))
      msg.endTime = endTime.substring(0, endTime.indexOf(' '))
      msg.orderOperations = msg.orderOperations.reverse();
      for (let i = 0;i< msg.orderOperations.length;i++){
        msg.orderOperations[i].createTime = util.formatTime3(msg.orderOperations[i].createTime);
      }
      let url = options.url;
      this.setData({
        orderInfo: msg,
        flowerList: msg.orderDetails,
        baseUrl: url
      })
    }else{
      wx.showToast({
        title: '错误',
        icon:'none',
        success(res){
          wx.navigateBack({})
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