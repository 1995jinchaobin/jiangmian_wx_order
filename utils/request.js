const baseUrl = 'https://yc.jiangmiantex.com/jiangjin'//线上
// const baseUrl = 'http://192.168.1.115:9911';
const app = getApp();
var userId="";

const request = (url, data, method,path,callbackMethod)=> {
  wx.showLoading({
    title: '加载中...',
    mask: true
  })
  wx.request({
    url: baseUrl + url, 
    data: {...data},
    method: method,
    header: {
      "content-type": "application/x-www-form-urlencoded",
      "token": wx.getStorageSync('token'),
      "wxType":"wxType"
    },
    success(res) {
      wx.hideLoading();
      // console.log(res)
      if (res.data.code == 0 || res.data.code == 100) {
        wx.setStorageSync("imgUrl", res.data.wwwFileBaseUrl)
        callbackMethod(res);
      } else if (res.data.code == 9) {
        wx.showToast({
          title: res.data.message ,
          icon: 'none',
          duration: 2000,
          complete:()=>{
            wx.removeStorageSync('token');
            wx.removeStorageSync('userInfo');
            wx.redirectTo({
              'url': '/pages/orderPart/login/login',
            })
          }
        });
      } else {
        // console.log(res)
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        });
      }
    }
  })
}
const requestPut = (url, data,path,callbackMethod)=>{
  url += '?';
  Object.keys(data).forEach(item=>{
    url += `${item}=${data[item]}&`
  })
  let length = url.length-1;
  url = url.slice(0, length);
  wx.request({
    url: baseUrl + url,
    data: {},
    method: 'put',
    header: {
      "content-type": "application/x-www-form-urlencoded",
      "token": wx.getStorageSync('token'),
      'wxType':'wxType'
    },
    success(res) {
      if (res.data.code == 0) {
        callbackMethod(res);
      } else if (res.data.code == 9) {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000,
          complete: () => {
            wx.removeStorageSync('token');
            wx.removeStorageSync('userInfo');
            if (path != '') {
              wx.redirectTo({
                'url': '/pages/knowLedgeCount/login/login',
              })
            } else {
              wx.redirectTo({
                'url': '/pages/knowLedgeCount/login/login',
              })
            }
          }
        });
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        });
      }
    }
  })
}
const getUserInfo =()=>{
  wx.getStorage({
    key: 'userInfo',
    success(res) {
      if (res.data == null || res.data == undefined) {
        page.setData({ "userId": "" });
      } else {
        page.setData({ "userInfo": res.data.id });
      }
    }
  })
  wx.getStorage({
    key: 'token',
    success(res) {
      if (res.data == null || res.data == undefined) {
        page.setData({ "token": "" });
      } else {
        page.setData({ "token": res.data.token });
      }
    }
  })
}


/**
 * POST请求，
 * URL：接口
 * postData：参数
 * path: 当前页面的名称，用来确定登录成功之后返回的页面
 * doSuccess：成功的回调函数
 * doFail：失败的回调函数
 */
function requestWay2(url, postData,path, doSuccess, doFail) {
  // postData.userFrom = 10;
  // console.log(postData)
  wx.request({
    //项目的真正接口，通过字符串拼接方式实现
    url: baseUrl + url,
    header: {
      // 修改请求主体类型
      "content-type": "application/x-www-form-urlencoded",
      'token': wx.getStorageSync('token'),
      "wxType":"wxType"
    },
    data: postData,
    method: 'POST',
    success: function (res) {
      //参数值为res.data,直接将返回的数据传入
      if (res.data.code == 0) {
        doSuccess(res.data);
      } else if (res.data.code == 9) {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          success: () => {
            setTimeout(function () {
              wx.removeStorageSync('userId');
              wx.removeStorageSync('token');
              wx.removeStorageSync('userInfo');
              wx.navigateTo({
                url: '/pages/threeDCount/login/login?path=' + path,
              })
            }, 2000)
          },
          fail:(res)=>{
            
          }
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    },
    fail: function () {
      doFail();
    },
  })
}

module.exports = {
  request: request, 
  requestWay2: requestWay2,
  baseUrl: baseUrl,
  requestPut: requestPut
}