// pages/orderPart/flaw/index.js
import request from '../../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
    screenHeight: wx.getSystemInfoSync().screenHeight,
    num:'',
    flawName:'',
    flawList:[{id:0,name:'请选择疵点类型'}],
    // 瑕疵类型索引
    flawIndex:0,
    flawInfoList:[
      { pishu: 1, xiaci: []}
    ],
    orderId:0,
    flawCountNum:0,
    // showFlawSelectArea:false,
    // 当前匹数
    piNum:1,
    flawRollList:[],
    // 输入合格米数和不合格米数弹框
    showInputPishu: false,
    // 合格米数
    okMeter:'',
    // 次品米数
    badMeter:'',
    arrIndex:0,
  },
  //疵点米数
  numChange(e){
    this.setData({
      num:e.detail.value
    })
  },
  //疵点类型
  bindIndexChange(e){
    this.setData({
      flawIndex: e.detail.value
    })
  },
  // 获取瑕疵列表
  getFlawList() {
    let _this = this;
    let data = {
      page: 1,
      rows: 999
    }
    request.request('/flaw', data, 'get', '', (res) => {
      if (res.data.data.list.length > 0) {
        // console.log(res.data.data.list)
        const arr = this.data.flawList
        const hebingarr = arr.concat(res.data.data.list)
        // console.log(hebingarr)
        _this.setData({
          flawList: hebingarr
        })
      }
    })
  },
  // 选择瑕疵类型
  bindPickerChange(e) {
    this.setData({
      flawIndex: e.detail.value
    })
    // console.log(e.detail.value)
  },
  //点击提交疵点
  addFlaw(e){
    if(this.data.num==''){
      wx.showToast({
        title: '请填写疵点米数',
        icon: 'none',
        success() {
        }
      })
    } else if (!parseFloat(this.data.num)){
      wx.showToast({
        title: '请输入正确的疵点米数格式',
        icon: 'none',
        success() {
        }
      })
    } else if (this.data.flawList[this.data.flawIndex].name =='请选择疵点类型'){
      wx.showToast({
        title: '请选择疵点类型',
        icon: 'none',
        success() {
        }
      })
    } else {
      let flawInfo = {
        fkFlawId: this.data.flawList[this.data.flawIndex].id,
        flawName: this.data.flawList[this.data.flawIndex].name,
        num: this.data.num,
        reduceScore: this.data.flawList[this.data.flawIndex].num
      }
      this.setData({
        flawCountNum: parseFloat(this.data.flawCountNum) + parseFloat(flawInfo.reduceScore)
      })
      let beforListXiaci = this.data.flawInfoList[this.data.arrIndex].xiaci
      // console.log(beforListXiaci)
      // console.log(flawInfo)
      beforListXiaci.push(flawInfo)
      const addListXiaci = this.data.flawInfoList
      addListXiaci[this.data.arrIndex].xiaci = beforListXiaci
      this.setData({
        flawInfoList: addListXiaci,
        num:''
      })
    }
  },
  // 当前匹数完成按钮
  pishuFinish () {
    this.setData({
      showInputPishu: true
    })
  },
  // 合格米数输入框
  bindOkMeterInput(e) {
    this.setData({
      okMeter: e.detail.value
    })
  },
  // 不合格米数输入框
  bindBadMeterInput(e) {
    this.setData({
      badMeter: e.detail.value
    })
  },
  // 米数输入框取消按钮
  cancelCheck() {
    this.setData({
      okMeter: '',
      badMeter: '',
      showInputPishu: false,
    })
  },
  // 合格米数输入确定按钮
  sureCheck(){
    const xiaciLength = this.data.flawInfoList[this.data.arrIndex].xiaci.length
    if (xiaciLength > 0){
      const arr = this.data.flawInfoList[this.data.arrIndex].xiaci
      let flawStr = ""
      for (let i = 0; i < arr.length; i++) {
        flawStr += arr[i].fkFlawId + "&"
          + arr[i].flawName + "&"
          + arr[i].num + "&"
          + arr[i].reduceScore + "&"
          + this.data.piNum + ";"
        }
      const data = {
        id: this.data.orderId,
        flawStr: flawStr
      }
      //请求
      request.request('/order/flaw', data, 'POST', '', (res) => {
      })
    }
    if (this.data.badMeter===''){
      this.setData({
        badMeter:0
      })
    }
    if (this.data.okMeter === ''){
      wx.showToast({
        title: '请输入合格米数',
        icon: 'none'
      })
      return
    }
    request.request('/flow/' + this.data.orderId, {
      type: 6,
      id: this.data.orderId,
      okMeter: this.data.okMeter,
      badMeter: this.data.badMeter
    },
      'POST', '', (res) => {
        // console.log(res)
        if (res.data.code === 0) {
          const afterPinum = this.data.piNum + 1
          const aftreArrIndex = this.data.arrIndex + 1
          // { pishu: 1, xiaci: [] }
          let arr = this.data.flawInfoList
          arr.push({
            pishu: afterPinum,
            xiaci: []
          })
          this.setData({
            okMeter: '',
            badMeter: '',
            piNum: afterPinum,
            showInputPishu: false,
            flawInfoList: arr,
            num: '',
            arrIndex: aftreArrIndex
          })
        }
      }
    )
  },
  // 检验完成
  orderPost(){
    // const data = {
    //   id:this.data.orderId,
    //   type: 12
    // }
    // console.log(data)
    //请求
    request.request('/flow/' + this.data.orderId,{
      type: 12
      // id: this.data.orderId,
    } ,'POST', '',(res) => {
      // console.log(res)
      wx.navigateTo({
        url: '/pages/orderPart/orderList/orderList',
      })
    })
  },
  selectFlaw(e){
    this.setData({
      flawIndex:e.currentTarget.dataset.index
    })
  },
  // showFlawSelectArea(){
  //   this.setData({
  //     showFlawSelectArea: true
  //   })
  // },
  // 获取检测匹数
  getRollNum (a) {
    // console.log(a)
    request.request('/inventory/out/xcx', {fkOrderId:a}, 'get', '', (res) => {
      // if (!res) return
      // console.log(1)
      // console.log(res)
      const arr = this.data.flawInfoList
      arr[0].pishu = res.data.data.rollNum + 1
      this.setData({
        piNum: res.data.data.rollNum + 1,
        flawInfoList: arr
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    // console.log(options.orderId)
    if (options.orderId != undefined && options.orderId!=''){
      _this.setData({
        orderId: options.orderId
      })
    }
    this.getRollNum(this.data.orderId)
    this.getFlawList();
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