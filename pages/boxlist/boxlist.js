// pages/boxlist/boxlist.js
var Bmob = require('../../lib/Bmob-1.6.0.min.js');
var API = require('../../api/API.js');
var PAGE_SIZE = 5;
var mPage = 1;
var oldboxes=[];
var waitboxes=[];
function loadFirstPage(that,options) {
  switch (options.type) {
    case 'all':
      console.log('1')
      API.getTreasureBoxesAllByPage(options.user, 1, PAGE_SIZE, (res) => {
        console.log(res)
        if (res.length > 0) {
          if (options.num <= 5) {
            that.setData({
              datalength: res.length,
            })
          } else {
            that.setData({
              hasmore: true,
            })
          }
          for (var x in res) {
            console.log(res[x])
            if (res[x].status == 0) {
              waitboxes.push(res[x])
            } else {
              oldboxes.push(res[x])
            }
          }
          if (waitboxes.length > 0) {
            that.setData({
              haswaitbox: true,
            })
          }
          if (oldboxes.length > 0) {
            that.setData({
              hasoldbox: true,
            })
          }
          that.setData({
            nobox: false,
            oldboxes: oldboxes,
            waitboxes: waitboxes
          })
        }
      })
      break;
    case 'create':
      console.log('2')
      API.getTreasureBoxesCreateByPage(options.user, 1, PAGE_SIZE, (res) => {
        console.log(res)
        if (res.length > 0) {
          if (options.num <= 5) {
            that.setData({
              datalength: res.length,
            })
          } else {
            that.setData({
              hasmore: true,
            })
          }
          for (var x in res) {
            console.log(res[x])
            if(res[x].status==0){
              waitboxes.push(res[x])
            }else {
              oldboxes.push(res[x])
            }
          }
          if(waitboxes.length>0){
            that.setData({
              haswaitbox: true,
            })
          }
          if(oldboxes.length>0){
            that.setData({
              hasoldbox: true,
            })
          }
          that.setData({
            nobox: false,
            oldboxes: oldboxes,
            waitboxes: waitboxes
          })
        }
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
function loadMorePage(that, options) {
  switch (options.type) {
    case 'all':
      console.log('1')
      API.getTreasureBoxesAllByPage(options.user, mPage+1, PAGE_SIZE, (res) => {
        console.log(res)
        mPage++
        if (res.length > 0) {
          if (options.num <= 5*mPage) {
            that.setData({
              datalength: that.data.datalength + res.length,
              hasmore:false,
            })
          } else {
            that.setData({
              datalength: that.data.datalength + res.length,
              hasmore: true,
            })
          }
          for (var x in res) {
            console.log(res[x])
            if (res[x].status == 0) {
              waitboxes.push(res[x])
            } else {
              oldboxes.push(res[x])
            }
          }
          if (waitboxes.length > 0) {
            that.setData({
              haswaitbox: true,
            })
          }
          if (oldboxes.length > 0) {
            that.setData({
              hasoldbox: true,
            })
          }
          that.setData({
            oldboxes: oldboxes,
            waitboxes: waitboxes
          })
        }
      })
      break;
    case 'create':
      console.log('2')
      API.getTreasureBoxesCreateByPage(options.user, mPage+1, PAGE_SIZE, (res) => {
        console.log(res)
        mPage++
        if (res.length > 0) {
          if (options.num <= 5 * mPage) {
            that.setData({
              datalength: that.data.datalength + res.length,
              hasmore: false,
            })
          } else {
            that.setData({
              datalength: that.data.datalength + res.length,
              hasmore: true,
            })
          }
          for (var x in res) {
            console.log(res[x])
            if (res[x].status == 0) {
              waitboxes.push(res[x])
            } else {
              oldboxes.push(res[x])
            }
          }
          if (waitboxes.length > 0) {
            that.setData({
              haswaitbox: true,
            })
          }
          if (oldboxes.length > 0) {
            that.setData({
              hasoldbox: true,
            })
          }
          that.setData({
            nobox: false,
            oldboxes: oldboxes,
            waitboxes: waitboxes
          })
        }
      })
      break;
    case 'own':
      console.log('3')
      API.getTreasureBoxesOwnByPage(options.user, mPage+1, PAGE_SIZE, (res) => {
        console.log(res)
        mPage++
        console.log(res.length, options.num)
        if (res.length > 0) {
          if (options.num <= 5 * mPage) {
            that.setData({
              datalength: that.data.datalength + res.length,
              hasmore: false,
            })
          } else {
            that.setData({
              datalength: that.data.datalength + res.length,
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
  gotoDetail: function (e) {
    var item = e.target.dataset.item;
    if (item) {
      wx.navigateTo({
        url: '../detail/detail?item=' + JSON.stringify(item)
      })
    }
  },
  loadMore: function (){
    var that =this;
    var hasmore = that.data.hasmore
    if(hasmore){
      loadMorePage(that,that.data.options)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    oldboxes=[]
    waitboxes=[]
    mPage=1
    that.setData({
      oldboxes: [],
      waitboxes:[],
      hasoldbox: false,
      haswaitbox: false,
      nobox: true,
      hasmore: false,
      options: options,
    })
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