// pages/detail/detail.js
import request from "../../../utils/request.js";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    imgUrl:'',
    userInfo:'',
    // 网络请求接口列表
    actions:{
      // 搜索用户图库
      getImageList: '/badidu/pic/pic',
      // 用户点击搜索结果
      picClick:'/pic/click'
    },
    resultImgUrl:'',
    imgList:[],
    page:0,
    rows: 50,
    maxImgUrl:'',
    maxImgShow: false,
    path:'knowledge',
    actFlowerList:[],
    baseUrl:'',
    searchImgUrl:'',
    requserImgUrl: ''
  },
  upLoadFile() {
    let _this = this;
    let obj = {
      token: wx.getStorageSync('token'),
      page:0,
      rows: 50
    }
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        _this.setData({
          requserImgUrl: tempFilePaths[0],
          imgList:[],
          imgUrl: tempFilePaths[0]
        })
        _this.getImgList();
      }
    })
  },
  getImgList(){
    let _this = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    wx.uploadFile({
      url: request.baseUrl + _this.data.actions.getImageList,
      filePath: _this.data.requserImgUrl,
      name: 'file',
      header:{
        "token":wx.getStorageSync("token"),
        "wxType":"wxType"
      },
      formData: {
        page: _this.data.page,
        rows: 50
      },
      success(res){
        let result = JSON.parse(res.data);
        if(result.code == 0){
        let newImgList = [];
          if (result.data.result.length >= 1){
          if (_this.data.imgList.length > 0){
            for(let i = 0;i < _this.data.imgList.length;i++){
              newImgList.push(_this.data.imgList[i]);
            }
          }
          // for (let i = 0; i < result.data.result.length;i++){
          //   let str = result.data.result[i].name;
          //   // let text = str.substr(str.lastIndexOf('.'));
          //   // result.data.searchResult.auctions[i].picName = str.replace(text, '');
          //   newImgList.push(result.data.result[i])
          // }
          newImgList = newImgList.concat(result.data.result)
            if (result.data.result.length < 1){
            wx.showToast({
              title: '没有更多相似图片了',
              icon: 'none'
            })
          }
          _this.setData({
            imgList: newImgList,
            baseUrl: result.wwwFileBaseUrl
            // searchImgUrl: result.data.searchImgUrl
          })
          wx.hideLoading();
        }else{
          wx.hideLoading();
          wx.showToast({
            title: '没有找到相似图片',
            icon: 'none'
          })
        }
        }else if(result.code == -1){
        wx.hideLoading();
        wx.showToast({
          title: res.data.message ,
          icon: 'none',
          duration: 2000,
          complete:()=>{
            wx.clearStorageSync('token');
            wx.clearStorageSync('userInfo');
            wx.redirectTo({
              'url':'/pages/orderPart/login/login',
            })
          }
        });
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          });
        }

      }
    })
  },
  clickImg(e){
    let _this = this;
    let item = e.target.dataset.item;
    let baseImgUrl="";
    wx.getStorage({
      key: 'imgUrl',
      success: function(res) {
        baseImgUrl = res.data;
        _this.setData({
          maxImgUrl: baseImgUrl + item.url,
          maxImgShow: true
        })
        let obj = {
          searchImgUrl: _this.data.searchImgUrl,
          resultImgUrl: item.customContent,
          productId: item.productId
        }
        request.request(_this.data.actions.picClick, obj, 'post', 'knowLedgeCount', (res) => { })
      }
    })
    
  },
  maxImgShow(){
    this.setData({
      maxImgUrl:'',
      maxImgShow: false
    })
  },
  // 点击选择花型
  actFlower(e){
    let info = e.target.dataset.info;
    let imgInfo = {
      customContent: info.url,
      picName: info.name,
      productId: info.score
    }
    let list = this.data.actFlowerList;
    list.push(imgInfo);
    this.setData({
      actFlowerList: list
    })
  },
  // 删除已选花型
  deleteFlower(e) {
    let newList = this.data.actFlowerList;
    newList.splice(e.target.id, 1);
    this.setData({
      actFlowerList: newList
    })
  },
  // 前往订单新建页面
  toOrder(){
    let flowerInfo = JSON.stringify(this.data.actFlowerList);
    wx.redirectTo({
      url:'/pages/order/order?flowerInfo=' + flowerInfo
    })
  },
  // 空函数-用于禁止页面滑动
  noneEnoughPeople(){},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        _this.setData({
          userInfo: res.data
        });
      },
    })
    if (JSON.stringify(this.getOpenerEventChannel())!=='{}') {
      const eventChannel = this.getOpenerEventChannel();
      // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
      eventChannel.on('pushImgUrl', function (data) {
        _this.setData({
          imgUrl: data.imgUrl,
          requserImgUrl: data.requserImgUrl,
          searchImgUrl: data.searchImgUrl
        })
        _this.getImgList();
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
    let nextPage = this.data.page;
    let rows = this.data.rows;
    let page = nextPage + rows
    this.setData({
      page:page
    })
    this.getImgList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})