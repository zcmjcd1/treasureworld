//index.js
//获取应用实例
const app = getApp()

var markers = [];
Page({
  data: {
    markers: markers, 
    polyline: [],
    controls: [{}],
    longitude: 113.298569,
    latitude: 23.095207
  },
  regionchange(e) {
    console.log(e.type)
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../create/create'
    })
  },
  onLoad: function () {
    var that = this;
    // 获取用户当前位置信息
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        console.log("locres", res.longitude)
        // latitude = res.latitude;
        // longitude = res.longitude;
        // console.log("当前位置坐标：" + latitude + "，" + longitude)
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
      },
      fail: function () {
        console.log("获取位置失败");
      }
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight * 0.8,
          windowWidth: res.windowWidth
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
