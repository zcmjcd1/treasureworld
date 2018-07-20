//index.js
//获取应用实例
const app = getApp()
var API = require('../../api/API.js');

var treasuresMap={};
var markers = [];
var mIsmore = false;
var initFlag = false;
var PAGE_SIZE = 50;
var mPage = 1;
var mTreasureboxList =[];

function loadFirstPage(that) {
  if (!app.globalData.locationInfo) {
    app.getLocationInfo(info => {
      console.log('先获取位置,', info)
    })
    setTimeout(function () {
      loadFirstPage(that)
    }, 1500);
    return;
  }

  // setLoading(true);
  API.getTreasureBoxesByPage(1, PAGE_SIZE, (treasureboxes) => {
    // console.log('loadFirstPage', treasureboxes);
    // setLoading(false);
    if (treasureboxes.length<1){
      that.setData({
        hideswiper:false,
      })
    }
    mTreasureboxList = treasureboxes;
    mPage = 1;
    mIsmore = true;
    that.setData({
      treasures: mTreasureboxList,
      ismore: mIsmore
    })
    var treasures = mTreasureboxList;
    // console.log(treasures)
    //清空
    markers = [];
    for (var x in treasures) {
      //
      treasures[x].index = x;
      treasuresMap[treasures[x].objectId] = treasures[x];
      var marker = {
        id: treasures[x].objectId,
        iconPath: "/images/ic_position_nor.png",
        longitude: treasures[x].location.longitude,
        latitude: treasures[x].location.latitude,
        width: 30,
        height: 30,
        data: treasures[x]
      }
      //console.log('marker',marker);
      markers.push(marker);
    }
    if (markers.length > 0) {
      //console.log('onLoaddddddddddddd',markers);
      markers[0].iconPath = "/images/ic_position_sel.png";
      that.setData({
        markers: markers
      })
    }
    that.setData({
      loading: true,
    })
    wx.stopPullDownRefresh();
  }) 
}
Page({
  data: {
    markers: markers, 
    treasures: mTreasureboxList,
    ismore: mIsmore,
    hideswiper:true,
    polyline: [],
    controls: [{}],
    longitude: 113.298569,
    latitude: 23.095207,
    loading: false,
  },
  markertap(e) {
    console.log(e);
    //
    var treasurebox = treasuresMap[e.markerId];
    this.setData({
      current: treasurebox.index
    })
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
    treasuresMap = {};
    markers = [];
    mIsmore = false;
    initFlag = false;
    PAGE_SIZE = 50;
    mPage = 1;
    mTreasureboxList = [];
    that.setData({
      markers: markers,
      treasures: mTreasureboxList,
      ismore: mIsmore,
      polyline: [],
      controls: [{}],
      longitude: 113.298569,
      latitude: 23.095207,
      loading: false
    })
    
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
        console.log(res);
        this.setData({
          windowHeight: res.windowHeight * 0.8,
          windowWidth: res.windowWidth
        })
      },
    })
    initFlag = true;
    loadFirstPage(this)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('ready')
    // wx.showNavigationBarLoading();

  },
  onPullDownRefresh: function () {
    console.log('123123456456')
    // Do something when pull down.
    // wx.stopPullDownRefresh();
    // if (mLoading) return;
    // if (!initFlag) return;
    // wx.showNavigationBarLoading();
    this.onLoad()
    
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  loc(e) {
    var that = this;
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
  },
  add_treasure(e) {
    console.log("跳转")
    wx.navigateTo({
      url: '/pages/add_treasure/add_treasure'
    })
  },
  mine(e) {
    console.log("跳转")
    wx.navigateTo({
      url: '/pages/mine/mine'
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('show')
    this.onLoad();
    // this.setData({
    //   loading: true,
    // })
  },
  gotoDetail: function (e) {
    var item = e.target.dataset.item;
    if (item) {
      wx.navigateTo({
        url: '../detail/detail?item=' + JSON.stringify(item)
      })
    }
  },
  currentChange: function (e) {
    var current = e.detail.current;
    // console.log(current,markers.length)
    if(current==markers.length-1 && current>=49){
      //loadmore boxes
      this.loadMore()
    }
    //console.log('current',current);
    //console.log('data',markers[current].data);
    var treasurebox = markers[current].data;
    this.setData({
      longitude: treasurebox.location.longitude,
      latitude: treasurebox.location.latitude
    });
    //
    for (var i = 0; i < markers.length; i++) {
      markers[i].iconPath = "/images/ic_position_nor.png"
    }
    markers[current].iconPath = "/images/ic_position_sel.png";
    //console.log('currentChangeeeeeeeeeeeeeeeeeeeeeeeeee',markers);
    this.setData({
      markers: markers
    })
  },
  loadMore: function () {
    if (!mIsmore) return;
    // wx.showNavigationBarLoading();
    var that = this;
    that.setData({
      loading: false,
    })
    API.getTreasureBoxesByPage(mPage + 1, PAGE_SIZE, (treasureboxes) => {
      // console.log('loadMore', treasureboxes);
      mIsmore = (treasureboxes.length > 0);
      mPage++;
      mTreasureboxList = mTreasureboxList.concat(treasureboxes);
      that.setData({
        treasures: mTreasureboxList,
        ismore: mIsmore
      })
      that.setData({
        loading: true,
      })
    })
  }
})
