// pages/detail/detail.js

var treasurebox = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log('options', options);
    if (options.item) {
      treasurebox = JSON.parse(options.item);
      that.setData({
        treasurebox: treasurebox
      })
      //获取参与总数和前十个参与人的头像并且展示出来
      // loadjoiners(this);
      // 获取当前位置，得到与该宝箱的距离，setbuttontext为开启enable或者请接近宝箱disable
    } else {
      console.log("detail没有item")
    }
    //设置宝箱图片大小
    app.getSystemInfo((width, height) => {
      that.setData({
        img_width: width,
        img_height: width * 9 / 16
      })
    })
  },
  //查看宝箱大图
  preview: function (e) {
    if (treasurebox) {
      wx.previewImage({
        current: treasurebox.imgsrc, // 当前显示图片的http链接
        urls: [treasurebox.imgsrc] // 需要预览的图片http链接列表
      })
    }
  },

  //打开地图查看宝箱位置
  openLocation: function () {
    wx.openLocation({
      latitude: treasurebox.location.latitude,
      longitude: treasurebox.location.longitude,
      scale: 28
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