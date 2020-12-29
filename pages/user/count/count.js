import * as echarts from '../../../components/ec-canvas/echarts';
import request from "../../../utils/request.js";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
    screenHeight: wx.getSystemInfoSync().screenHeight,
    customerEc: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
    fabricEc: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
    fabricData:{},
    customerData:{},
    isLoaded: false,
    //是否显示出货数量图表
    isDisposed: false,
    customerType:'dayBtn',
    countData:[],
    //是否显示面料品类图表
    isDisposedFabric:false,
    isLoadedFabric:false,
    showSelectTime:false
  },
  showPicker(){
    this.setData({
      showSelectTime:true
    })
  },
  getData(e) {
    let startTime = "";
    let endTime = "";
    let flag = 0;
    let obj = {
    }
    if(e!=undefined){
      startTime = e.detail.stratTime;
      endTime = e.detail.endTime;
      flag = e.detail.flag;
      // console.log(flag)
      if (flag==0) {
        wx.showToast({
          title: '请先选择时间',
          duration: 2000
        })
      } else {
        obj = {
          startTime: startTime + " 00:00:00",
          endTime: endTime + " 23:59:59"
        }
      }
    }
    wx.stopPullDownRefresh()
    wx.showLoading({
        title: '正在加载'
      })
    let _this = this;
    request.request('/ownCount', obj, 'post', 'orderPart', (res) => {
      wx.hideLoading();
      wx.showToast({
        title: '加载完成',
        duration: 2000
      })
      _this.setData({
        countData: res.data.data
      })
      _this.dealData();
    })
  } ,
  dealData(){
    let xUserData = [];
    let yUserData = [];
    let fabricData = [];
    let lendData =[];
    let countUserDataDetail = this.data.customerType == "dayBtn" ? this.data.countData.customerOwnOut30Day : this.data.customerType == "weekBtn" ? this.data.countData.customerOwnOut12Week : this.data.countData.customerOwnOut12Month;
    let countFabricDataDetail = this.data.customerType == "dayBtn" ? this.data.countData.fabricOwnOut30Day : this.data.customerType == "weekBtn" ? this.data.countData.fabricOwnOut12Week : this.data.countData.fabricOwnOut12Month;
    if(this.data.customerType=='weekBtn'){
      for (let i = 0; i < countUserDataDetail.length; i++) {
        xUserData.push(countUserDataDetail[i].weekTime+'周');
        yUserData.push(countUserDataDetail[i].num);
      }
    } else if(this.data.customerType == 'dayBtn'){
      for (let i = 0; i < countUserDataDetail.length; i++) {
        xUserData.push(countUserDataDetail[i].time);
        yUserData.push(countUserDataDetail[i].num);
      }
    } else if (this.data.customerType == 'monthBtn') {
      for (let i = 0; i < countUserDataDetail.length; i++) {
        xUserData.push(countUserDataDetail[i].monthTime);
        yUserData.push(countUserDataDetail[i].num);
      }
    }
    if (countFabricDataDetail.length != 0) {
      for (let i = 0; i < countFabricDataDetail.length;i++){
        fabricData.push({
          value: countFabricDataDetail[i].num,
          name: countFabricDataDetail[i].fabricName
        });
        lendData.push(countFabricDataDetail[i].fabricName)
      }
    }
    let userOption = {
      color: ['#37a2da'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        backgroundColor: 'rgba(245, 245, 245, 0.8)',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 2,
        textStyle: {
          color: '#000'
        },
        extraCssText: 'width: 170px'
      },
      legend: {
        data: ['米数'],
        type: 'scroll',
        orient: 'vertical'
      },
      grid: {
        left: 20,
        right: 20,
        bottom: 15,
        top: 40,
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: xUserData,
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          },
        }
      ],
      yAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          },
          show: false
        }
      ],
      series: [
        {
          type: 'line',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          data: yUserData,
          itemStyle: {
            // emphasis: {
            //   color: '#37a2da'
            // }
          }
        }
      ]
    };
    let fabricOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}米 ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        data: lendData
      },
      series: [
        {
          name:'米数',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '15',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: fabricData
        }
      ]
    };
    this.setData({
      customerData: userOption,
      fabricData:fabricOption
    })
    // if (!this.data.isLoaded){
    //   this.ecComponent = this.selectComponent('#mychart-dom-bar');
    //   this.initUserChart();
    // }
    this.ecComponent = this.selectComponent('#mychart-dom-bar');
    this.initUserChart();
    this.ecFabricComponent = this.selectComponent('#mychart-dom-pie');
    this.initFabricChart();
  },
  initUserChart: function () {
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const userChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      // this.getData(userChart);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.userChart = userChart;
      this.setData({
        isLoaded: true,
        isDisposed: false
      });
      userChart.setOption(this.data.customerData);
      return userChart;
    });
  },
  initFabricChart: function () {
    this.ecFabricComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const fabricChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.fabricChart = fabricChart;
      this.setData({
        isLoadedFabric: true,
        isDisposedFabric: false
      });
      fabricChart.setOption(this.data.fabricData)
      return fabricChart;
    });
  },
  
  chooseCustomer(e){
    this.setData({
      customerType: e.currentTarget.dataset['index']
    })
    this.dealData();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    
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