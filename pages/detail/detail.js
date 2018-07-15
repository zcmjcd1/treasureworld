// pages/detail/detail.js

var API = require('../../api/API.js');
var Bmob = require('../../lib/Bmob-1.6.0.min.js');

var treasurebox = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status_open: true,
    timehide: false,
    peoplehide: false,
    needpass: false,
    normalbox: false,
    status_desc: "未开启",
    btncolor: "#bf4932",
    timelimit: "",
    peoplelimit: 0,
    join_by_status_button_text: '开启宝箱',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log('options', options);
    if (options.item) {
      treasurebox = JSON.parse(options.item);
      if (treasurebox.gettype == 0 && treasurebox.haspass == 0) {
        that.setData({
          normalbox: true,
        });
      } else if (treasurebox.gettype == 1 && treasurebox.haspass == 0) {
        that.setData({
          timehide: true,
          timelimit: treasurebox.timelimit.iso,
        })
      } else if (treasurebox.gettype == 1 && treasurebox.haspass == 1) {
        that.setData({
          timehide: true,
          timelimit: treasurebox.timelimit.iso,
          needpass: true,
        })
      } else if (treasurebox.gettype == 2 && treasurebox.haspass == 0) {
        that.setData({
          peoplehide: true,
          peoplelimit: treasurebox.peoplelimit,
        })
      } else if (treasurebox.gettype == 2 && treasurebox.haspass == 1) {
        that.setData({
          peoplehide: true,
          peoplelimit: treasurebox.peoplelimit,
          needpass: true,
        })
      }
      var userData = wx.getStorageSync("userData");
      var myid = userData.objectId
      that.setData({
        myid: myid,
      })
      var joinarray = treasurebox.joinarray
      if (treasurebox.status == 0 && joinarray.length > 0) {
        for (var i = 0; i < joinarray; i++) {
          if (myid == joinarray[i]) {
            that.setData({
              status_desc: "wait",
              join_by_status_button_text: '等待开启',
            })
            break;
          }
        }
      } else if (treasurebox.status == 1) {
        that.setData({
          status_open: false,
        })
      }
      API.getUserData(treasurebox.creator.objectId, (res) => {
        console.log(res);
        that.setData({
          creator_pic: res.userPic,
          creator_nickname: res.nickName,
          treasurebox: treasurebox
        })
      });
      //获取参与总数和前十个参与人的头像并且展示出来
      // loadjoiners(this);
      // 获取当前位置，得到与该宝箱的距离，setbuttontext为开启enable或者请接近宝箱disable
    } else {
      console.log("detail没有item")
    }
    //设置宝箱图片大小
    // app.getSystemInfo((width, height) => {
    //   that.setData({
    //     img_width: width,
    //     img_height: width * 9 / 16
    //   })
    // })
  },
  openbox: function(e) {
    var that = this;
    console.log("join")
    console.log(that.data.status_open, that.data.status_desc)
    //再查询一次宝箱状态是否为待开启，如果是再进行下面步骤
    var getstatus = Bmob.Query('TreasureBoxes');
    console.log(treasurebox.objectId)
    var thisbox = getstatus.get(treasurebox.objectId).then(res => {
      console.log(res)
      that.setData({
        status_open: res.status,
      })
      //判断如何操作数据库
      if (that.data.status_open && !(that.data.status_desc == "wait")) {
        console.log("宝箱开启参与表记录一条数据，joinarray添加用户objectid")
        const pointUser = Bmob.Pointer('_User')
        const pointID = pointUser.set(that.data.myid)
        const box = Bmob.Pointer('TreasureBoxes')
        const boxID = box.ser(treasurebox.objectId)
        var myjoin = Bmob.Query('JoinOpenBox')
        myjoin.set("joiner", pointID)
        myjoin.set("box", boxID)
        myjoin.save()
        //判断位置
        app.getLocationInfo(locationInfo => {
          var query = Bmob.Query("TreasureBoxes");
          var currentdistance = getDistance(locationInfo.latitude, locationInfo.longitude, treasurebox.location.latitude, treasurebox.location.longitude)
          if (currentdistance < 0.1) {
            console.log("距离允许参与")
            //判断是否抽奖宝箱。。抽奖则变成等待开启等通知，不抽奖则。。。
            //判断是否有口令，有则弹出口令输入窗口，无则直接改变宝箱状态为已开启，获奖人为当前用户
            //joinarray+id joinnum+1 TreasureBoxes表，改变btntext和btnstatustext
          } else {
            console.log("距离不允许参与")
            return;
          }
        })

      }
    }).catch(err => {
      console.log(err)
      console.log("加入失败");
    });


  },
  //查看宝箱大图
  preview: function(e) {
    if (treasurebox) {
      wx.previewImage({
        current: treasurebox.imgsrc, // 当前显示图片的http链接
        urls: [treasurebox.imgsrc] // 需要预览的图片http链接列表
      })
    }
  },

  //打开地图查看宝箱位置
  openLocation: function() {
    wx.openLocation({
      latitude: treasurebox.location.latitude,
      longitude: treasurebox.location.longitude,
      scale: 28
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