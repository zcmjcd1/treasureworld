// pages/welcome/welcome.js
var Bmob = require('../../lib/Bmob-1.6.0.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    TopTips: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      loading: false,
    })
    var userData = wx.getStorageSync("userData");
    
    if(userData.openid && userData.objectId ){
      var query = Bmob.Query("_User");
      query.get(userData.objectId).then(res => {
        console.log("11111111111",res,userData)
        if(res.userPic || res.nickName){
          wx.redirectTo({
            url: '/pages/index/index'
          })
        }
        that.setData({
          loading: true,
        })
      }).catch(err=>{
        console.log(err)
        that.setData({
          loading: true,
        })
        that.setData({
          showTopTips: true,
          TopTips: "网络有问题，无法获取用户信息",
        })
      })
    }
    that.setData({
      loading: true,
    })
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 2000);

  },
  onGotUserInfo: function(e) {
    var that = this;
    that.setData({
      loading: false,
    })
    console.log(e.detail.errMsg)
    console.log('1111111111111111',e.detail.userInfo)
    console.log(e.detail.rawData)
    //一键登录
    Bmob.User.auth().then(res => {
      console.log(res);
      console.log("一键登录成功");
      // wx.setStorageSync('userData', userData);
      console.log(res.authData.weapp.openid)
      wx.setStorageSync('openid', res.authData.weapp.openid);
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
          openid: res.authData.weapp.openid,
          userPic: userPic,
          username: ress.username,
        };
        wx.setStorageSync('userData', userData);
      })
      that.setData({
        loading: true,
      })
      wx.redirectTo({
        url: '/pages/index/index'
      })
    }).catch(err => {
      that.setData({
        showTopTips: true,
        TopTips:"网络有问题，无法获取用户信息",
      })
      console.log(err);
    })
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 2000);
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