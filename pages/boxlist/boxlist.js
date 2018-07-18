// pages/boxlist/boxlist.js
var Bmob = require('../../lib/Bmob-1.6.0.min.js');
var API = require('../../api/API.js');
var PAGE_SIZE = 5;
function loadFirstPage(that,options) {
  switch (options.type) {
    case 'all':
      console.log('1')
      API.getTreasureBoxesAllByPage(options.user, 1, PAGE_SIZE, (res) => {
        console.log(res)
      })
      break;
    case 'create':
      console.log('2')
      API.getTreasureBoxesCreateByPage(options.user, 1, PAGE_SIZE, (res) => {
        console.log(res)
      })
      break;
    case 'own':
      console.log('3')
      API.getTreasureBoxesOwnByPage(options.user, 1, PAGE_SIZE, (res) => {
        console.log(res)
        console.log(res.length,options.num)
        if(res.length>0){
          if (options.num <= 5) {
            that.setData({
              datalength: res.length,
            })
          } else {
            that.setData({
              hasmore: true,
            })
          }
          that.setData({
            oldboxes: res,
            nobox: false,
            hasoldbox: true,
          })
        }
      })
      break;
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datalength:0,
    hasmore: false,
    nobox:true,
    haswaitbox:false,
    hasoldbox:false,
    waitboxes:[],
    oldboxes:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log('options', options);
    loadFirstPage(that,options);
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