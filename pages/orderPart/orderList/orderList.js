import request from "../../../utils/request.js";
import util from "../../../utils/util.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
    screenHeight: wx.getSystemInfoSync().screenHeight,
    request:{
      order:'/order'
    },
    typeList:['全部','待处理','已完成'],
    selectTypeIndex:0,
    page:1,
    orderList:[],
    pageSize:6,
    userId:0,
    statusList: ['审核不通过', '待审核', '已下单', '大货已确认', '底布已进仓', '底布已检验', '底布已出库', '底布已加工', '成品已入库', '已检验', '码单已确认', '成品已出货', '客户已收货', '客户退货','已发货'],
    total:0,
    role:0,
    machineList:[],
    selectMachineId:0,
    //未完成米数
    unfinishMeter:0,
    //已完成米数
    finishMeter :0,
    //完成米数
    meter:'',
    //是否显示打印米数输入弹框
    showPrintBox:false,
    orderId:0,
    //是否显示检验米数输入弹框
    showCheckBox:false,
    //正常米数
    okMeter:'',
    //次品米数
    badMeter:'',
    //是否显示快递单号输入弹框
    showSendBox:false,
    //是否显示调拨米数输入弹框
    showNextBox:false,
    //快递单号
    expressNumber:'',
    //快递公司列表
    expressCompanyList: ['自提', '顺丰快递', '韵达快递', '申通快递', '中通快递', '天天快递', '百世汇通', '邮政包裹', 'EMS'],
    companyName:'自提',
    //退货备注
    returnNote:'',
    //是否显示退货备注输入弹框
    showReturnBox:false,
    // 页面传入参数
    type:'',
    key: '',
    companyIndex:0,
    searchOrderId:-1,
    //搜索页面跳转到当前页面，传递的搜索时间
    searchEndTime:null,
    searchFkFabricId:0,
    searchCompanyName:'',
    searchContacts:'',
    searchFlowerNum:'',
    searchOrderIdN:'',
    searchBigOrderNum: '',
    searchProductNum: '',
    // 库存id
    inventoryId:'',
    // 半票仓米数
    num1:'',
    // 半票仓匹数
    rollNum:'',
    // 上浆仓米数
    num2:'',
    // 上浆调拨米数输入值
    shangjiangNum:'',
    // 打印米数
    dayinMeter:'',
    // 快递单号参数
    expressNumberAll:'',
    showSubmitCourier:false,
    expressNumberArr:[],
    //底布入库
    dibuInBtn: false,
    dibuIn: '',
    dibuFkCustomerId: '',
    dibuFkFabricId: '',
    dibuOrder: '',
    //底布出库
    dibuOutBtn: false,
    dibuOut: '',
    dibuOutFkCustomerId: '',
    dibuOutFkFabricId: '',
    dibuOutOrder: '',
    //成品入库
    chengpinInBtn: false,
    chengpinIn: '',
    chengpinFkCustomerId: '',
    chengpinFkFabricId: '',
    chengpinOrder: '',
    //成品出库
    chengpinOutBtn: false,
    chengpinOut: '',
    chengpinOutFkCustomerId: '',
    chengpinOutFkFabricId: '',
    chengpinOutOrder: '',
    //图片基础地址
    imgBaseUrl: '',
    showMadanImage: false,
    madanSrc: '',
    five: false,
    beizhuInputShow: false,
    beizhuInput: '',
    beizhuId: ''
  },
  back() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  //点击顶部分类
  changeType(e){
    this.setData({
      selectTypeIndex: e.currentTarget.dataset['index'],
      five:false
    })
    this.setData({
      pageSize:6
    })
    this.getList(e.currentTarget.dataset['index']);
  },
  //查询列表数据
  getList() {
    wx.stopPullDownRefresh()
    wx.showLoading({
      title:'正在加载'
    })
    let _this = this;
    let obj = _this.data.searchOrderId == -1 ? {
      rows: _this.data.pageSize,
      page: _this.data.page,
      type1: _this.data.selectTypeIndex,
      type: '',
      key: '',
      companyName:this.data.searchCompanyName,
      fkFabricId:this.data.searchFkFabricId,
      contacts:this.data.searchContacts,
      flowerNum:this.data.searchFlowerNum,
      orderId: this.data.searchOrderIdN,
      bigOrderNum: this.data.searchBigOrderNum,
      productNum: this.data.searchProductNum
    } : {
        rows: _this.data.pageSize,
        page: _this.data.page,
        type1: _this.data.selectTypeIndex,
        type: '',
        key: '',
        id: _this.data.searchOrderId,
        companyName: this.data.searchCompanyName,
        fkFabricId: this.data.searchFkFabricId,
        contacts: this.data.searchContacts,
        flowerNum: this.data.searchFlowerNum,
        orderId: this.data.searchOrderIdN,
        bigOrderNum: this.data.searchBigOrderNum,
        productNum: this.data.searchProductNum
      }
    if (_this.data.searchEndTime != null){
      obj.endTime = _this.data.searchEndTime+" 23:59:59";
    }
    if(this.data.type != ''){
      obj.type = this.data.type
    }
    if (this.data.key != '') {
      obj.key = this.data.key
    }
    request.request('/order', obj, 'get','orderPart', (res) => {
      wx.hideLoading()
      wx.showToast({
        title: '加载完成',
        duration:2000
      })
      let orderList = []
      if (this.data.role===5){
        const length = res.data.data.list.length
        const data = res.data.data.list
        for (let a = 0; a < length; a++) {
          data[a].jiedanBtn = true
          if (data[a].onlinePrinterIds){
            const arr = data[a].onlinePrinterIds.split(',')
            if (arr.indexOf(this.data.userId.toString()) !== -1) {
              data[a].jiedanBtn = false
            }
          }
        }
        orderList = data;
      } else {
        orderList = res.data.data.list
      }
      if(orderList.length>0){
        for (var i = 0; i < orderList.length; i++) {
          orderList[i].createTime = util.formatTime2(orderList[i].createTime)
          orderList[i].totalPrice = util.fmoney(orderList[i].totalPrice)
        }
      }
      _this.setData({
        orderList: orderList,
        imgBaseUrl: res.data.wwwFileBaseUrl,
        total: res.data.data.total
      })
    })
  },
  //点击驳回原因，跳转到审核结果页
  showResult(e){
    //存储订单信息
    wx.removeStorageSync("orderInfo")
    wx.setStorageSync("orderInfo", this.data.orderList[e.currentTarget.dataset.index])
    wx.navigateTo({
      url: '/pages/orderPart/orderResult/orderResult?code=-1&failMessage=' + e.currentTarget.dataset.message
    })
  },
  //点击审核按钮
  handlerReview(e){
    let _this = this;
    wx.showActionSheet({
      itemList: ['通过', '驳回'],
      success(res) {
        //点击通过
        if(res.tapIndex==0){
          wx.showLoading({
            title: '正在提交审核'
          })
          request.request('/flow/' + e.currentTarget.dataset.id, { 
            type: 1, 
            note: '', 
            meter: 0, 
            okMeter: 0, 
            badMeter: 0, 
            expressNumber: '', 
            machineId: 0,
            machineName: '',
            id: e.currentTarget.dataset.id },
            'POST', 'orderPart', (res) => {
              wx.hideLoading();
              wx.showToast({
                title: res.data.message,
                duration: 2000,
                success: () => {
                  //刷新列表
                  _this.getList();
                  //_this.handlerExpedite(e.currentTarget.dataset.id);
                }
              })
            })
        }else{
          //点击驳回,跳转到驳回页面
          wx.navigateTo({
            url: '/pages/orderPart/turnDown/turnDown?id=' + e.currentTarget.dataset.id
          })
        }
      },
      fail(res) {
      }
    })
  },
  //审核通过后，确认是否要加急
  handlerExpedite(id) {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '该订单要加急吗？',
      success(res) {
        if (res.confirm) {
          //点击确认加急
          wx.showLoading({
            title: '正在提交'
          })
          request.request('/order/expedite/' + id, {},
            'POST', 'orderPart', (res) => {
              wx.hideLoading();
              wx.showToast({
                title: res.data.message,
              })
              _this.getList();
            })
        } else if (res.cancel) {
          _this.getList();
        }
      }
    })
  },
  // 查看订单信息
  toOrderMsg(e){
    console.log(e)
    let role = wx.getStorageSync("userInfo").role;
    let msg = JSON.stringify(e.currentTarget.dataset.msg)
    let url = this.data.imgBaseUrl;
    wx.navigateTo({
      url: '/pages/orderPart/orderMsg/index?msg=' + msg + '&url=' + url,
    })
  },
  //底布进仓
  dibuInput (e) {
    // this.setData({
    //   dibuOrder: e.currentTarget.dataset.id,
    //   dibuFkCustomerId: e.currentTarget.dataset.dibufkcustomerid,
    //   dibuFkFabricId: e.currentTarget.dataset.dibufkfabricid,
    //   dibuInBtn: true
    // })
    request.request('/flow/' + e.currentTarget.dataset.id, {
      type: 3,
      id: e.currentTarget.dataset.id
    },
      'POST', 'orderPart', (res) => {
        wx.hideLoading()
        this.dibuCancel()
        this.getList()
      })
  },
  //底布输入框
  dibuInputChange(e) {
    this.setData({
      dibuIn: e.detail.value
    })
  },
  //底布弹框确认
  dibuSureBtn () {
    if (this.data.dibuIn == '') {
      wx.showToast({
        title: '请输入入库底布米数',
        icon: 'none'
      })
      return
    }
    if (!Number(this.data.dibuIn)) {
      wx.showToast({
        title: '请输入正确的入库底布米数',
        icon: 'none'
      })
      return
    }
    request.request('/inventory/in/add/db', {
      num: this.data.dibuIn,
      fkCustomerId: this.data.dibuFkCustomerId,
      fkFabricId: this.data.dibuFkFabricId
    },
      'POST', 'orderPart', (res) => {
        wx.hideLoading()
        request.request('/flow/' + this.data.dibuOrder, {
          type: 3,
          id: this.data.dibuOrder
        },
          'POST', 'orderPart', (res) => {
            wx.hideLoading()
            wx.showToast({
              title: res.data.message,
            })
            this.dibuCancel()
            this.getList()
          })
      })
  },
  //底布弹框关闭
  dibuCancel () {
    this.setData({
      dibuInBtn:false,
      dibuIn: '',
      dibuOrder:'',
      dibuFkCustomerId: '',
      dibuFkFabricId: ''
    })
  },
  // 底布检验
  dibuBtn (e) {
    const orderId = e.currentTarget.dataset.id
    request.request('/flow/' + orderId, {
      type: 4,
      id: orderId
    },
      'POST', 'orderPart', (res) => {
        wx.hideLoading()
        wx.showToast({
          title: res.data.message,
        })
        this.getList()
      })
  },
  //底布出库
  dibuOut(e){
    // this.setData({
    //   dibuOutOrder: e.currentTarget.dataset.id,
    //   dibuOutFkCustomerId: e.currentTarget.dataset.dibufkcustomerid,
    //   dibuOutFkFabricId: e.currentTarget.dataset.dibufkfabricid,
    //   dibuOutBtn: true
    // })
    request.request('/flow/' + e.currentTarget.dataset.id, {
      type: 5,
      id: e.currentTarget.dataset.id
    },
      'POST', 'orderPart', (res) => {
        wx.hideLoading()
        this.dibuOutCancel()
        this.getList()
      })
  },
  //底布出库输入
  dibuOutputChange(e) {
    this.setData({
      dibuOut: e.detail.value
    })
  },
   //底布出库弹框关闭
   dibuOutCancel () {
    this.setData({
      dibuOutBtn:false,
      dibuOut: '',
      dibuOutOrder:'',
      dibuOutFkCustomerId: '',
      dibuOutFkFabricId: ''
    })
  },
  //底布出库弹框确认
  dibuOutSureBtn () {
    if (this.data.dibuOut == '') {
      wx.showToast({
        title: '请输入出库底布米数',
        icon: 'none'
      })
      return
    }
    if (!Number(this.data.dibuOut)) {
      wx.showToast({
        title: '请输入正确的出库底布米数',
        icon: 'none'
      })
      return
    }
    request.request('/inventory/out/db', {
      num: this.data.dibuOut,
      fkCustomerId: this.data.dibuOutFkCustomerId,
      fkFabricId: this.data.dibuOutFkFabricId
    },
      'POST', 'orderPart', (res) => {
        wx.hideLoading()
        request.request('/flow/' + this.data.dibuOutOrder, {
          type: 5,
          id: this.data.dibuOutOrder
        },
          'POST', 'orderPart', (res) => {
            wx.hideLoading()
            wx.showToast({
              title: res.data.message,
            })
            this.dibuOutCancel()
            this.getList()
          })
      })
  },
  //底布加工
  dibuJjiagong (e) {
    const orderId = e.currentTarget.dataset.id
    request.request('/flow/' + orderId, {
      type: 6,
      id: orderId
    },
      'POST', 'orderPart', (res) => {
        wx.hideLoading()
        wx.showToast({
          title: res.data.message,
        })
        this.getList()
      })
  },
  //成品入库
  chengpinInput (e) {
    // this.setData({
    //   chengpinOrder: e.currentTarget.dataset.id,
    //   chengpinFkCustomerId: e.currentTarget.dataset.chengpinfkcustomerid,
    //   chengpinFkFabricId: e.currentTarget.dataset.chengpinfkfabricid,
    //   chengpinInBtn: true
    // })
    const orderId = e.currentTarget.dataset.id
    request.request('/flow/' + orderId, {
      type: 7,
      id: orderId
    },
      'POST', 'orderPart', (res) => {
        wx.hideLoading()
        // wx.showToast({
        //   title: res.data.message,
        // })
        // this.chengpinCancel()
        this.getList()
      })
  },
  //成品入库输入框
  chengpinInputChange(e) {
    this.setData({
      chengpinIn: e.detail.value
    })
  },
  //成品入库弹框确认
  chengpinSureBtn () {
    if (this.data.chengpinIn == '') {
      wx.showToast({
        title: '请输入成品入库米数',
        icon: 'none'
      })
      return
    }
    if (!Number(this.data.chengpinIn)) {
      wx.showToast({
        title: '请输入正确的成品入库米数',
        icon: 'none'
      })
      return
    }
    request.request('/inventory/in/add/cp', {
      num: this.data.chengpinIn,
      fkCustomerId: this.data.chengpinFkCustomerId,
      fkFabricId: this.data.chengpinFkFabricId
    },
      'POST', 'orderPart', (res) => {
        wx.hideLoading()
        request.request('/flow/' + this.data.chengpinOrder, {
          type: 7,
          id: this.data.chengpinOrder
        },
          'POST', 'orderPart', (res) => {
            wx.hideLoading()
            wx.showToast({
              title: res.data.message,
            })
            this.chengpinCancel()
            this.getList()
          })
      })
  },
  //成品入库弹框关闭
  chengpinCancel () {
    this.setData({
      chengpinInBtn:false,
      chengpinIn: '',
      chengpinOrder:'',
      chengpinFkCustomerId: '',
      chengpinFkFabricId: ''
    })
  },
  //成品检验
  chengpinJianyan (e) {
    const orderId = e.currentTarget.dataset.id
    request.request('/flow/' + orderId, {
      type: 8,
      id: orderId
    },
      'POST', 'orderPart', (res) => {
        wx.hideLoading()
        wx.showToast({
          title: res.data.message,
        })
        this.getList()
      })
  },
//成品出库
chengpinOut(e){
  this.setData({
    chengpinOutOrder: e.currentTarget.dataset.id,
    chengpinOutFkCustomerId: e.currentTarget.dataset.chengpinfkcustomerid,
    chengpinOutFkFabricId: e.currentTarget.dataset.chengpinfkfabricid,
    chengpinOutBtn: true
  })
},
//成品出库输入
chengpinOutputChange(e) {
  this.setData({
    chengpinOut: e.detail.value
  })
},
//上传码单
  filePost (e) {
    console.log(e.currentTarget.dataset.id)
    console.log(e)
    const _this = this
    wx.chooseImage({
      count: 1,
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        // const tempFilePaths = res.tempFilePaths
        console.log(res.tempFilePaths[0])
        const requserImgUrl = res.tempFilePaths[0]
        wx.uploadFile({
          url: request.baseUrl +'/file',
          filePath: requserImgUrl,
          name: 'file',
          header: {
            "token": wx.getStorageSync("token")
          },
          formData: {
            type: 4
          },
          success(res) {
            console.log(res)
            const result = JSON.parse(res.data)
            console.log(result)
            if (result.code == 0) {
              const orderPicObj = {
                url: result.data
              }
              // request.request(`/orderpic/${e.currentTarget.dataset.id}`, orderPicObj, 'put', '', (resultOrder) => {
              //   console.log(resultOrder)
              // })
              request.requestPut('/orderpic' + '/' + e.currentTarget.dataset.id, orderPicObj, '', (resultOrder) => {
                if (_this.data.five){
                  _this.getYujingList()
                }else{
                  _this.getList()
                }
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
            // if (result.code == 0) {
            //   let list = {
            //     productId: Math.ceil(Math.random() * 10) + Math.ceil(Math.random() * 10),
            //     customContent: result.data,
            //     picName: '上传产品图片'
            //   }
            //   let flowerList = _this.data.flowerList;
            //   flowerList.push(list);
            //   _this.setData({
            //     flowerList: flowerList
            //   })
            // } else if (result.code == -1) {
            //   wx.showToast({
            //     title: result.message,
            //     icon: 'none',
            //     success() {
            //       setTimeout(function () {
            //         wx.clearStorageSync('token');
            //         wx.clearStorageSync('userInfo');
            //         wx.navigateTo({
            //           url: '/pages/knowLedgeCount/login/login'
            //         })
            //       }, 1500)
            //     }
            //   })
            // } else {
            //   wx.showToast({
            //     title: result.message,
            //     icon: 'none'
            //   })
            // }
          }
        })
      }
    })
  },
  //客户查看码单
  madanShow(e){
    console.log(e.currentTarget.dataset)
    console.log(e.currentTarget.dataset.mdurl)
    if (!e.currentTarget.dataset.mdurl) {
      wx.showToast({
        title: '业务员还未上传码单',
        icon: 'none'
      })
      return
    }
    this.setData({
      madanSrc:e.currentTarget.dataset.mdurl,
      showMadanImage: true
    })
  },
  //关闭码单
  closeMadanImage() {
    this.setData({
      showMadanImage: false
    })
  },
  //确认码单
  madanSure (e) {
    if (!e.currentTarget.dataset.mdurl){
      wx.showToast({
        title: '请先上传码单',
        icon: 'none'
      })
      return
    }
    const orderId = e.currentTarget.dataset.id
    request.request('/flow/' + orderId, {
      type: 9,
      id: orderId
    },
      'POST', 'orderPart', (res) => {
        wx.hideLoading()
        if (this.data.five){
          this.getYujingList()
        } else{
          this.getList()
        }
      })
  },
  //成品出货
  chengpinChuhuo(e){
    const orderId = e.currentTarget.dataset.id
    request.request('/flow/' + orderId, {
      type: 10,
      id: orderId
    },
      'POST', 'orderPart', (res) => {
        wx.hideLoading()
        this.getList()
      })
  },
 //成品出库弹框关闭
 chengpinOutCancel () {
  this.setData({
    chengpinOutBtn:false,
    chengpinOut: '',
    chengpinOutOrder:'',
    chengpinOutFkCustomerId: '',
    chengpinOutFkFabricId: ''
  })
},
//成品出库弹框确认
chengpinOutSureBtn () {
  if (this.data.chengpinOut == '') {
    wx.showToast({
      title: '请输入出库成品米数',
      icon: 'none'
    })
    return
  }
  if (!Number(this.data.chengpinOut)) {
    wx.showToast({
      title: '请输入正确的出库成品米数',
      icon: 'none'
    })
    return
  }
  request.request('/inventory/out/cp', {
    num: this.data.chengpinOut,
    fkCustomerId: this.data.chengpinOutFkCustomerId,
    fkFabricId: this.data.chengpinOutFkFabricId
  },
    'POST', 'orderPart', (res) => {
      wx.hideLoading()
      request.request('/flow/' + this.data.chengpinOutOrder, {
        type: 9,
        id: this.data.chengpinOutOrder
      },
        'POST', 'orderPart', (res) => {
          wx.hideLoading()
          wx.showToast({
            title: res.data.message,
          })
          this.chengpinOutCancel()
          this.getList()
        })
    })
},
  //出货验收
  chengpinYanshou(e){
    const orderId = e.currentTarget.dataset.id
    request.request('/flow/' + orderId, {
      type: 10,
      id: orderId
    },
      'POST', 'orderPart', (res) => {
        wx.hideLoading()
        wx.showToast({
          title: res.data.message,
        })
        this.getList()
      })
  },
  //收货
  shouhuo (e) {
    const orderId = e.currentTarget.dataset.id
    request.request('/flow/' + orderId, {
      type: 11,
      id: orderId
    },
      'POST', 'orderPart', (res) => {
        wx.hideLoading()
        wx.showToast({
          title: res.data.message,
        })
        this.getList()
      })
  },
   //点击退货按钮显示退货备注输入框
   handlerReturn(e) {
    this.setData({
      orderId: e.currentTarget.dataset.id
    })
    this.setData({
      returnNote: ''
    })
    //显示弹框
    this.setData({
      showReturnBox: true
    })
  },
  //退货备注输入框取消按钮
  cancelReturnNote() {
    this.setData({
      showReturnBox: false
    })
  },
  //退货备注输入框确认按钮
  sureReturnNote() {
    let _this = this;
    //判断
    if (_this.data.returnNote == '') {
      wx.showToast({
        title: '请输入退货备注',
        icon: 'none'
      })
    }else {
      wx.showLoading({
        title: '正在提交'
      })
      request.request('/flow/' + _this.data.orderId, {
        type: 12,
        note: _this.data.returnNote,
        id: _this.data.orderId
      },
        'POST', 'orderPart', (res) => {
          wx.hideLoading();
          wx.showToast({
            title: res.data.message,
            duration: 2000,
            success: () => {
              _this.setData({
                showReturnBox: false
              })
              _this.getList();
            }
          })
        })
    }
  },
  bindPickerChange(e){
    let _this = this;
    wx.showLoading({
      title: '正在分配打印'
    })
    request.request('/flow/' + e.currentTarget.dataset.id, {
      type: 3,
      note: '',
      meter: 0,
      okMeter: 0,
      badMeter: 0,
      expressNumber: '',
      id: e.currentTarget.dataset.id,
      machineId:_this.data.machineList[e.detail.value].id,
      machineName: _this.data.machineList[e.detail.value].name
    },
      'POST', 'orderPart', (res) => {
        wx.hideLoading();
        wx.showToast({
          title: res.data.message,
          duration: 2000,
          success: () => {
            _this.getList();
          }
        })
      })
  },
  //点击数量输入按钮显示打印米数输入框
  handlerHavePrint(e){
    this.setData({
      finishMeter: e.currentTarget.dataset.finishmeter
    })
    this.setData({
      unfinishMeter: e.currentTarget.dataset.unfinishmeter
    })
    this.setData({
      dayinMeter:''
    })
    this.setData({
      orderId: e.currentTarget.dataset.id
    })
    //显示弹框
    this.setData({
      showPrintBox: true
    })
  },
  //米数输入框取消按钮
  cancelPrint(){
    this.setData({
      showPrintBox:false,
      dayinMeter:''
    })
  },
  // 上浆调拨输入框已调拨按钮
  toNext() {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '是否跳过上浆调拨',
      success(res) {
        if (res.confirm) {
          request.request('/flow/' + _this.data.orderId, {
            type: 2,
            note: '',
            okMeter: 0,
            badMeter: 0,
            expressNumber: '',
            id: _this.data.orderId
          },
            'POST', 'orderPart', (res) => {
              wx.hideLoading();
              wx.showToast({
                title: res.data.message,
              })
              _this.getList();
              _this.cancelNext();
            })
        }
      }
    })
  },
  //打印米数输入框确认按钮
  surePrint(){
    let _this = this;
    //判断
    if (_this.data.dayinMeter==''){
      wx.showToast({
        title:'请输入打印米数',
        icon:'none'
      })
    } else if (_this.data.dayinMeter=='0') {
      wx.showToast({
        title: '请输入正确的打印米数',
        icon: 'none'
      })
    } else{
      wx.showLoading({
        title: '正在提交'
      })
      request.request('/flow/' + _this.data.orderId, {
        type: 4,
        note: '',
        meter: parseFloat(_this.data.dayinMeter),
        okMeter: 0,
        badMeter: 0,
        expressNumber: '',
        machineId: 0,
        machineName: '',
        id: _this.data.orderId
      },
        'POST', 'orderPart', (res) => {
          wx.hideLoading();
          wx.showToast({
            title: res.data.message,
            duration: 2000,
            success: () => {
              _this.setData({
                showPrintBox: false
              })
              _this.getList();
            }
          })
        })
    }
  },
  //点击上浆调拨显示调拨米数输入框
  // handlerNext(e) {
  //   // console.log(e)
  //   const indexE = e.currentTarget.dataset.index
  //   const objE = this.data.orderList[indexE]
  //   // console.log(objE)
  //   this.setData({
  //     meter: ''
  //   })
  //   this.setData({
  //     orderId: e.currentTarget.dataset.id
  //   })
  //   const a = {
  //     fkCustomerId: objE.fkCustomerId,
  //     fkFabricId: objE.fkFabricId
  //   }
  //   if (objE.origin === '经销') {
  //     a.fkCustomerId = -10
  //   }
  //   // console.log(a)
  //   // 上浆调拨显示库存
  //   request.request('/inventory/xcx', a, 'get', 'orderPart', (res) => {
  //     wx.showToast({
  //       title: res.data.message,
  //     })
  //     this.setData({
  //       num1: res.data.data.num1,
  //       rollNum: res.data.data.rollNum,
  //       inventoryId: res.data.data.id,
  //       num2: res.data.data.num2,
  //       showNextBox: true,
  //       meter:'',
  //       shangjiangNum:''
  //     })
  //   })
  // },
  //大货确认按钮
  handlerNext (e) {
    const indexE = e.currentTarget.dataset.index
    const orderId = this.data.orderList[indexE].id
    request.request('/flow/' + orderId, {
      type: 2,
      id: orderId
    },
      'POST', 'orderPart', (res) => {
        wx.hideLoading();
        wx.showToast({
          title: res.data.message,
        })
        this.getList();
      })
  },
    // 上浆调拨输入框验证规则
  maxNum1(a){
    if (parseFloat(a.detail.value)>this.data.num1){
      this.setData({
        meter: this.data.num1
      })
    }else{
      this.setData({
        meter: a.detail.value
      })
    }
  },
  maxRollnum(a) {
    if (a.detail.value > this.data.rollNum) {
      this.setData({
        shangjiangNum: this.data.rollNum
      })
    }
  },
  //调拨米数输入框取消按钮
  cancelNext() {
    this.setData({
      showNextBox: false
    })
  },
  //调拨米数输入框确认按钮
  sureNext() {
    let _this = this;
    //判断
    if (_this.data.meter == '') {
      wx.showToast({
        title: '请输入米数',
        icon: 'none'
      })
    } else if (_this.data.shangjiangNum == '') {
      wx.showToast({
        title: '请输入匹数数',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '正在提交'
      })
      request.request('/inventory/transfer', {
        num: this.data.meter,
        rollNum: this.data.shangjiangNum,
        inventoryId: this.data.inventoryId,
      },
        'POST', 'orderPart', (res) => {
          if (res.data.code !== 0) {
            return wx.showToast({
              title: res.data.message,
            })} else{
            wx.showToast({
              title: res.data.message,
            })
          }
        })
      request.request('/flow/' + _this.data.orderId, {
        type: 2,
        note: '',
        meter: this.data.meter,
        okMeter: 0,
        badMeter: 0,
        expressNumber: '',
        id: _this.data.orderId
      },
        'POST', 'orderPart', (res) => {
          wx.hideLoading();
          wx.showToast({
            title: res.data.message,
          })
          _this.getList();
          _this.cancelNext();
        })
    }
  },
  // 上浆调拨米数输入框
  bindMeterInput(e) {
    this.setData({
      meter: e.detail.value
    })
  },
  // 上浆调拨匹数输入框
  bindShangjiangNumInput(e) {
    this.setData({
      shangjiangNum: e.detail.value
    })
  },
  //点击完成打印按钮待修改
  handlerHavePrintFinish(e) {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '确认已经完成打印吗？',
      success(res) {
        if (res.confirm) {
          //点击完成打印
          wx.showLoading({
            title: '正在提交'
          })
          request.request('/flow/' + e.currentTarget.dataset.id, {
            type: 10,
            note: '',
            meter: 0,
            okMeter: 0,
            badMeter: 0,
            expressNumber: '',
            id: e.currentTarget.dataset.id
          },
            'POST', 'orderPart', (res) => {
              wx.hideLoading();
              wx.showToast({
                title: res.data.message,
              })
              _this.getList();
            })
        } else if (res.cancel) {
        }
      }
    })
  },
  //点击蒸化显示确认框
  handlerSteam(e){
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '确认该订单已蒸化吗?',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在提交'
          })
          request.request('/flow/' + e.currentTarget.dataset.id, {
            type: 5,
            note: '',
            meter: 0,
            okMeter: 0,
            badMeter: 0,
            expressNumber: '',
            id: e.currentTarget.dataset.id,
            machineId: 0,
            machineName: ''
          },
            'POST', 'orderPart', (res) => {
              wx.hideLoading();
              wx.showToast({
                title: res.data.message,
                duration: 2000,
                success: () => {
                  _this.getList();
                }
              })
            })
        } else if (res.cancel) {
        }
      }
    })
  },
  //点击检验按钮跳转瑕疵记录页面
  handlerCheck(e) {
    this.setData({
      orderId: e.currentTarget.dataset.id
    })
    // this.setData({
    //   okMeter: ''
    // })
    // this.setData({
    //   badMeter: ''
    // })
    // //显示弹框
    // this.setData({
    //   showCheckBox: true
    // })
    wx.navigateTo({
      url: '/pages/orderPart/flaw/index?orderId=' + this.data.orderId
    })
  },
  //检验米数输入框取消按钮
  cancelCheck() {
    this.setData({
      showCheckBox: false
    })
  },
  //检验米数输入框确认按钮
  sureCheck() {
    let _this = this;
    //判断
    if (_this.data.okMeter == '') {
      wx.showToast({
        title: '请输入合格数量',
        icon: 'none'
      })
    }else if (_this.data.badMeter == '') {
      wx.showToast({
        title: '请输入次品数量',
        icon: 'none'
      })
    } else if (_this.data.okMeter == '0'&&_this.data.badMeter == '0') {
      wx.showToast({
        title: '请输入正确的次品/合格数量',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '正在提交'
      })
      request.request('/flow/' + _this.data.orderId, {
        type: 6,
        note: '',
        meter: 0,
        okMeter: _this.data.okMeter,
        badMeter: _this.data.badMeter,
        expressNumber: '',
        machineId: 0,
        machineName: '',
        id: _this.data.orderId
      },
        'POST', 'orderPart', (res) => {
          wx.hideLoading();
          wx.showToast({
            title: res.data.message,
            duration: 2000,
            success: () => {
              _this.setData({
                showCheckBox: false
              })
              wx.navigateTo({
                url: '/pages/orderPart/flaw/index?orderId=' + _this.data.orderId
              })
              //_this.getList();
            }
          })
        })
    }
  },
  bindOkMeterInput(e) {
    this.setData({
      okMeter: e.detail.value
    })
  },
  bindBadMeterInput(e) {
    this.setData({
      badMeter: e.detail.value
    })
  },
  //点击发货审核按钮
  handlerSendCheck(e) {
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确认该订单通过发货审核吗?',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在提交'
          })
          request.request('/flow/' + e.currentTarget.dataset.id, {
            type: 9,
            id: e.currentTarget.dataset.id,
          },
            'POST', 'orderPart', (res) => {
              wx.hideLoading();
              wx.showToast({
                title: res.data.message,
                duration: 2000,
                success:()=>{
                  _this.getList();
                }
              })
            })
        } else if (res.cancel) {
        }
      }
    })
  },
  bindCompanyNameChange(e){
    this.setData({
      companyIndex: e.detail.value
    })
    this.setData({
      companyName:this.data.expressCompanyList[e.detail.value]
    })
  },
  //点击发货按钮
  handlerSend(e) {
    // this.setData({
    //   orderId: e.currentTarget.dataset.id
    // })
    // this.setData({
    //   companyName: '自提'
    // })
    // this.setData({
    //   expressNumber: ''
    // })
    // //显示弹框
    // this.setData({
    //   showSendBox: true
    // })
    const _this = this
    wx.showModal({
      title: '提示',
      content: '确认该订单进行发货吗?',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在提交'
          })
          const data = {
            type: 7,
            id: e.currentTarget.dataset.id
          }
          request.request('/flow/' + e.currentTarget.dataset.id, data,
            'POST', 'orderPart', (res) => {
              wx.hideLoading();
              wx.showToast({
                title: res.data.message,
                duration: 2000,
                success: () => {
                  _this.getList();
                }
              })
            }
          )
        }
      }
    })
  },
  // 点击快递单号
  handlerkuaidiForm(e) {
    this.setData({
      orderId: e.currentTarget.dataset.id,
      showSendBox: true
    })
  },
  //快递单号输入框取消按钮
  cancelSend() {
    this.setData({
      expressNumberAll:'',
      expressNumberArr: [],
      expressNumber:'',
      showSendBox: false
    })
  },
  // 快递单号下一个按钮
  nextSend() {
    let _this = this;
    //判断
    if (_this.data.companyName == '') {
      wx.showToast({
        title: '请输入快递公司',
        icon: 'none'
      })
    } else if (_this.data.companyName != '自提' && _this.data.expressNumber == '') {
      wx.showToast({
        title: '请输入快递单号',
        icon: 'none'
      })
    } else {
      this.addExpressNumber()
    }
  },
  // 添加快递单数组
  addExpressNumber() {
    let expressNumber = this.data.expressNumberAll
    const companyName = this.data.companyName
    const expressNumber1 = this.data.expressNumber
    let expressNumberArr = this.data.expressNumberArr
    if (this.data.companyName==='自提') {
      expressNumber = expressNumber + companyName + ';'
      expressNumberArr.push({ companyName: companyName, expressNumber:''})
    } else {
      expressNumber = expressNumber + companyName + ':' + expressNumber1 + ';'
      expressNumberArr.push({ companyName: companyName, expressNumber: expressNumber1})
    }
    this.setData({
      expressNumberAll: expressNumber,
      expressNumber:'',
      expressNumberArr: expressNumberArr
    })
  },
  // 快递单重新填写
  cancelSendbtn() {
    this.setData({
      expressNumberAll: '',
      expressNumberArr: [],
      showSubmitCourier: false,
      expressNumber: ''
    })
  },
  //快递单号输入框确认按钮弹出确定框
  sureSend() {
    if (this.data.companyName == '') {
      wx.showToast({
        title: '请输入快递公司',
        icon: 'none'
      })
    } else if (this.data.companyName != '自提' && this.data.expressNumber == '') {
      wx.showToast({
        title: '请输入快递单号',
        icon: 'none'
      })
    } else{
      this.addExpressNumber()
      this.setData({
        showSendBox: false,
        showSubmitCourier: true
      })
    }
  },
  // 快递预览确定
  sureSendbtn () {
    const _this = this
    request.request('/flow/' + this.data.orderId, {
      type:13,
      id: this.data.orderId,
      expressNumber: this.data.expressNumberAll
    },
      'POST', 'orderPart', (res) => {
        wx.hideLoading();
        wx.showToast({
          title: res.data.message,
          duration: 2000,
          success: () => {
            _this.setData({
              showSubmitCourier: false
            })
            _this.getList();
          }
        })
      }
    )
  },
  bindExpressNumberInput(e) {
    this.setData({
      expressNumber: e.detail.value
    })
  },
  bindCompanyNameInput(e) {
    this.setData({
      companyName: e.detail.value
    })
  },
  //点击退货按钮显示退货备注输入框
  handlerReturn(e) {
    this.setData({
      orderId: e.currentTarget.dataset.id
    })
    this.setData({
      returnNote: ''
    })
    //显示弹框
    this.setData({
      showReturnBox: true
    })
  },
  //点击评论按钮，跳转到评论页面
  goToRate(e){
    wx.navigateTo({
      url: "/pages/orderPart/rateOrder/index?orderId="+ e.currentTarget.dataset.id
    })
  },
  bindReturnNoteInput(e) {
    this.setData({
      returnNote: e.detail.value
    })
  },
  //厂长点击修改订单
  updateOrder(e){
    //存储订单信息
    wx.removeStorageSync("orderInfo")
    wx.setStorageSync("orderInfo", this.data.orderList[e.currentTarget.dataset.index])
    wx.navigateTo({
      url: '/pages/order/order?orderUpdate=true'
    })
  },
  //预警
  getYujingList () {
    request.request('/order/alarm', '', 'get', '', (res) => {
      console.log(res.data.data)
      const orderList = res.data.data.list
      if (orderList.length > 0) {
        for (let i = 0; i < orderList.length; i++) {
          orderList[i].createTime = util.formatTime2(orderList[i].createTime)
          orderList[i].totalPrice = util.fmoney(orderList[i].totalPrice)
        }
      }
      this.setData({
        orderList: orderList,
        imgBaseUrl: res.data.wwwFileBaseUrl,
        total: res.data.data.total
      })
    })
  },
  // 打开备注窗口
  beizhuBtn (e) {
    console.log(e.currentTarget.dataset.id)
    console.log(e.currentTarget.dataset.note2)
    this.setData({
      beizhuId:e.currentTarget.dataset.id,
      beizhuInput: e.currentTarget.dataset.note2,
      beizhuInputShow:true
    })
  },
  //备注输入框
  addBeizhuInput (e) {
    console.log(e.detail.value)
    this.setData({
      beizhuInput: e.detail.value
    })
  },
  //备注取消
  beizhuInputShowFalse () {
    this.setData({
      beizhuId:'',
      beizhuInputShow:false,
      beizhuInput: ''
    })
  },
  //备注确定
  beizhuInputShowTijiao () {
    const obj = {
      note2:this.data.beizhuInput
    }
    console.log(obj)
    request.requestPut('/order/'+this.data.beizhuId, obj, '', (res) => {
      wx.hideLoading()
      console.log(res)
      this.getYujingList()
      wx.showToast({
        title: res.data.message,
        duration: 2000,
        success: () => {
        }
      })
      this.setData({
        beizhuInputShow:false
      })
    })
  },
  // request.requestPut(this.data.requestUrl.order + '/' + this.data.id, data, '', (result)=>{
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    if (options.five) {
      _this.getYujingList()
      _this.setData({
        five: true,
        // selectTypeIndex: 1
      })
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
      return
    }
    if (options["id"]){
      _this.setData({
        searchOrderId: options["id"]
      })
    }
    if(options.q){
      let id=options.q+"";
      let index = id.indexOf('%3D')+3;
      _this.setData({
        searchOrderId: id.substring(index,id.length)
      })
    }
    if (options.orderStatus){
      let status = options.orderStatus;
      _this.setData({
        type: status
      })
    }
    if (options.key) {
      let status = options.key;
      _this.setData({
        key: status
      })
    }
    if (options.endTime) {
      let status = options.endTime;
      _this.setData({
        searchEndTime: status
      })
    }
    if (options.fkFabricId) {
      let status = options.fkFabricId;
      _this.setData({
        searchFkFabricId: status
      })
    }
    if (options.companyName) {
      let status = options.companyName;
      _this.setData({
        searchCompanyName: status
      })
    }
    if (options.contacts) {
      let status = options.contacts;
      _this.setData({
        searchContacts: status
      })
    }
    if (options.flowerNum) {
      let status = options.flowerNum;
      _this.setData({
        searchFlowerNum: status
      })
    }
    // 判断是否为首页跳转
    if(options.type){
      _this.setData({
        selectTypeIndex: options.type
      })
    }
    if (options.orderId) {
      _this.setData({
        searchOrderIdN: options.orderId
      })
    }
    if (options.bigOrderNum) {
      _this.setData({
        searchBigOrderNum: options.bigOrderNum
      })
    }
    if (options.productNum) {
      _this.setData({
        searchProductNum: options.productNum
      })
    }
    console.log(options)
    _this.getList();
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
          //如果是打印组长，则事先获取打印员列表
          // if (res.data.role == 4||res.data.role==2) {
          //   _this.getMachineList();
          // }
        }
      }
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
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.total > this.data.pageSize){
      this.setData({
        pageSize: this.data.pageSize + 6
      })
      this.getList();
    }else{
      wx.showToast({
        title: '已全部加载完成',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})