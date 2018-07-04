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
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../create/create'
    })
  },
  onLoad: function () {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight * 0.8,
          windowWidth: res.windowWidth
        })
      },
    })
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
