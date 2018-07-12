require('utils/bmob_init.js');
var Bmob = require('lib/Bmob-1.6.0.min.js');

//app.js

App({
  onLaunch: function () {
    console.log("onlaunch")
    //一键登录
    Bmob.User.auth().then(res => {
      console.log(res);
      console.log("一键登录成功");
      var userData = { nickName: res.nickName, objectId: res.objectId, openid: res.openid, userPic: res.userPic, username:                 res.username };
      wx.setStorageSync('userData', userData);
      wx.setStorageSync('openid', res.openid)
    }).catch(err => {
      console.log(err);
    })
  },
  getLocationInfo: function (cb) {
    var that = this;
    if (this.globalData.locationInfo) {
      cb(this.globalData.locationInfo)
    } else {
      wx.getLocation({
        type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
        success: function (res) {
          that.globalData.locationInfo = res;
          cb(that.globalData.locationInfo)
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    locationInfo: null,
    treasures: [],
    treasuresMap: {},
  },
  flags: {
    refresh_index: false
  }
})
//拓展对象
Object.extend = function () {
  var args = arguments;
  if (args.length < 2) return;
  var firstObj = args[0];
  console.log('first', firstObj);
  for (var i = 1; i < args.length; i++) {
    for (var x in args[i]) {
      firstObj[x] = args[i][x];
    }
  }
  console.log('first', firstObj);
  return firstObj;
}