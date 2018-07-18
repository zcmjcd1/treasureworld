// pages/mine/mine.js
var Bmob = require('../../lib/Bmob-1.6.0.min.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    loading: true,
    allboxnum: 0,
    createboxnum: 0,
    ownboxnum: 0,
  },
  toallboxlist: function(){
    wx.navigateTo({
      url: '../boxlist/boxlist?type=all&user=' + this.data.userInfo.objectId + '&num=' + this.data.allboxnum,
    })
  },
  tocreateboxlist: function () {
    wx.navigateTo({
      url: '../boxlist/boxlist?type=create&user=' + this.data.userInfo.objectId + '&num=' + this.data.createboxnum,
    })

  },
  toownboxlist: function () {
    wx.navigateTo({
      url: '../boxlist/boxlist?type=own&user=' + this.data.userInfo.objectId+'&num='+this.data.ownboxnum,
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var value = wx.getStorageSync('openid')
    let current = wx.Bmob.User.current();
    console.log(current)
    that.setData({
      userInfo: current
    })
    //查询creator是当前用户的宝箱个数
    var getcreatnum = Bmob.Query('TreasureBoxes');
    getcreatnum.statTo("where", '{"creator":{"$inQuery":{"where":{"objectId":"'+current.objectId+'"},"className":"_User"}}}');
    getcreatnum.count().then(res =>{
      that.setData({
        createboxnum: res,
      })
      // console.log(res, "asdfasdfeeeee")
    })
    //查询winner是当前用户的宝箱个数
    var getgainnum = Bmob.Query('TreasureBoxes');
    getgainnum.equalTo("winner", "==", current.objectId);
    getgainnum.count().then(res => {
      that.setData({
        ownboxnum: res,
      })
      // console.log(res, "asdfasdfeeeee")
    })
    //查询所有与用户相关的宝箱个数
    var getjoinnum = Bmob.Query('JoinOpenBox');  
    getjoinnum.statTo("where", '{"joiner":{"$inQuery":{"where":{"objectId":"' + current.objectId + '"},"className":"_User"}}}');
    getjoinnum.count().then(res => {
      that.setData({
        allboxnum: res,
      })
      console.log(res, "asdfasdfeeeee")
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