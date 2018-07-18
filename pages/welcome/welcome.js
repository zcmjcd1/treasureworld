// pages/welcome/welcome.js
var Bmob = require('../../lib/Bmob-1.6.0.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var userData = wx.getStorageSync("userData");
    if(userData.nickName){
      wx.redirectTo({
        url: '/pages/index/index'
      })
    }


  },
  onGotUserInfo: function(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
    //一键登录
    Bmob.User.auth().then(res => {
      console.log(res);
      console.log("一键登录成功");
      // wx.setStorageSync('userData', userData);
      wx.setStorageSync('openid', res.openid);
      var userInfo = e.detail.userInfo;
      var nickName = userInfo.nickName;
      var userPic = userInfo.avatarUrl;
      console.log(userInfo)
      var query = wx.Bmob.Query("_User");
      query.get(res.objectId).then(ress => {
        console.log(ress);
        ress.set("nickName", nickName);
        ress.set("userPic", userPic);
        ress.save();
        var userData = {
          nickName: nickName,
          objectId: res.objectId,
          openid: res.openid,
          userPic: userPic,
          username: ress.username,
        };
        wx.setStorageSync('userData', userData);
      })
      wx.redirectTo({
        url: '/pages/index/index'
      })
    }).catch(err => {
      console.log(err);
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})