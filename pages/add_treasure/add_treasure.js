// pages/add_treasure/add_treasure.js
var common = require("../../utils/common.js");
var Bmob = require('../../lib/Bmob-1.6.0.min.js');
const hours = []
const minutes = ['00', '30']
var days = []
for (var i = 0; i < 24; i++) {
  hours.push(i)
}
//格式化日期
function formate_data(myDate) {
  let month_add = myDate.getMonth() + 1;
  var formate_result = myDate.getFullYear() + '-' +
    month_add + '-' +
    myDate.getDate()
  if(month_add<9){
    formate_result = myDate.getFullYear() + '-0' +
      month_add + '-' +
      myDate.getDate()
  }
  
  return formate_result;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgsrc: '../../images/baoxiang.png',
    loading: true,
    address: '点击选择位置',
    TopTips: '',
    longitude: 0, //经度
    latitude: 0, //纬度
    noteMaxLen: 200, //备注最多字数
    peopleHide: false,
    passIndex: 0,
    timeHide: false,
    passHide: false,
    groupHide: false,
    multiArray: [
      ['2018-07-11'], hours, minutes
    ],
    multiIndex: [0, 0, 0],
    content: "",
    intro: "",
    passnote:"",
    noteNowLenIntro: 0, //备注当前字数
    noteNowLenContent: 0,
    noteNowLenPassNote: 0,
    types: ["不抽奖", "时效抽奖宝箱", "人数抽奖宝箱"],
    typeIndex: "0",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    if (minute < 30) {
      minute = 1
    } else {
      hour = hour + 1
      minute = 0
    }
    console.log(hour, minute)
    days.push(formate_data(date))
    for (var i = 0; i < 6; i++) {
      date = new Date((date / 1000 + 86400) * 1000)
      days.push(formate_data(date))
    }
    that.setData({
      multiArray: [days, hours, minutes],
      multiIndex: [0, hour, minute]
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // this.chooseLocation()
  },
  //口令
  switch1Change: function(e) {
    if (e.detail.value == false) {
      this.setData({
        passHide: false,
        passIndex:0
      })
    } else if (e.detail.value == true) {
      this.setData({
        passHide: true,
        passIndex:1
      })
    }
  },
  //改变宝箱类别
  bindTypeChange: function(e) {
    if (e.detail.value == 2) {
      this.setData({
        peopleHide: true,
        timeHide: false,
      })
    } else if (e.detail.value == 1) {
      this.setData({
        peopleHide: false,
        timeHide: true,
      })
    } else if (e.detail.value == 0) {
      this.setData({
        peopleHide: false,
        timeHide: false,
      })
    }
    this.setData({
      typeIndex: e.detail.value
    })
  },
  bindMultiPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  },
  chooseLocation: function(e) {
    console.log("star to chooselocation1!!!!!!!!")
    var that = this;
    wx.chooseLocation({
      success: function(res) {
        console.log(res)
        that.setData({
          address: res.name,
          longitude: res.longitude, //经度
          latitude: res.latitude, //纬度
        })
        if (e.detail && e.detail.value) {
          this.data.address = e.detail.value;
        }
      },
      fail: function(e) {},
      complete: function(e) {}
    })
  },
  //字数改变触发事件介绍
  bindTextAreaChangeIntro: function(e) {
    var that = this
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen)
      return;
    that.setData({
      intro: value,
      noteNowLenIntro: len
    })
  },
  //字数改变触发事件宝贝
  bindTextAreaChangeContent: function(e) {
    var that = this
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen)
      return;
    that.setData({
      content: value,
      noteNowLenContent: len
    })
  },
  //字数改变触发事件宝贝
  bindTextAreaChangePassNote: function (e) {
    var that = this
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen)
      return;
    that.setData({
      passnote: value,
      noteNowLenPassNote: len
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  //上传活动图片
  uploadPic: function() { //选择图标
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], //压缩图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        wx.showNavigationBarLoading()
        that.setData({
          loading: false
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        var timestamp = Date.parse(new Date());
        var extension = /\.([^.]*)$/.exec(tempFilePaths[0]);
        extension = extension[1].toLowerCase();
        var name = timestamp + "." + extension;
        var file = Bmob.File(name, tempFilePaths[0]);
        file.save().then(res => {
          var obj = JSON.parse(res[0]);
          that.setData({
            loading:true,
            isSrc: true,
            src: obj.url,
            imgsrc: obj.url
          })
          console.log(obj.url,)
          wx.hideNavigationBarLoading();
          common.showTip("上传成功", "success");
        })
      }
    })
  },
  //提交表单
  submitForm: function(e) {
    console.log("start submit")
    var that = this;
    var title = e.detail.value.title;
    var address = this.data.address;
    var longitude = this.data.longitude;
    var latitude = this.data.latitude;
    var treasureIntro = e.detail.value.intro;
    var treasureContent = e.detail.value.content;
    var passnote = e.detail.value.passnote;
    var typeIndex = this.data.typeIndex;
    console.log(typeIndex);
    var peoplelimit = e.detail.value.peoplelimit;
    var multiIndex = this.data.multiIndex;
    var timelimit = days[multiIndex[0]] + ' ' + hours[multiIndex[1]] + ':' + minutes[multiIndex[2]] + ':00'
    console.log("timelimit: " + timelimit)
    var peopleHide = this.data.peopleHide;
    var passHide = this.data.passHide;
    var treasurepass = e.detail.value.treasurepass;
    var passIndex = this.data.passIndex;
    var checkDate = new Date();
    var formid = e.detail.formId;
    console.log(formid);
    //先进行表单非空验证
    if (title == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入宝箱名称'
      });
    } else if (address == '点击选择位置') {
      this.setData({
        showTopTips: true,
        TopTips: '请选择地点'
      });
    } else if (treasureIntro=='') {
      this.setData({
        showTopTips: true,
        TopTips: '请输入宝箱介绍'
      })
    } else if (treasureContent == '') {
      this.setData({
        showTopTips: true,
        TopTips: '请输入您的宝贝'
      })
    } else if (typeIndex == '1' && (multiIndex[0] == 0 && (hours[multiIndex[1]] < checkDate.getHours()) || (hours[multiIndex[1]] == checkDate.getHours() && minutes[multiIndex[2]]<=checkDate.getMinutes()))) {
      this.setData({
        showTopTips: true,
        TopTips: '限制时间不能早于当前'
      })
    } else if (peopleHide == true && peoplelimit =="") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入人数限制'
      })
    } else if (passHide == true && passnote == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入口令提示'
      });
    } else if (passHide == true && treasurepass == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入口令'
      });
    }else {
      console.log('校验完毕');
      //提交数据到bmob
      that.setData({
        isLoading: true,
        isdisabled: true
      })
      var userData = wx.getStorageSync("userData");
      //新增一行记录
      var tbox = Bmob.Query("TreasureBoxes");
      //添加数据关联
      var pointer = Bmob.Pointer("_User");
      var poiID = pointer.set(userData.objectId);
      tbox.set("creator",poiID)
      tbox.set("title",title);
      var location = Bmob.GeoPoint({ latitude: latitude, longitude: longitude })
      tbox.set("location",location)
      tbox.set("boxintro",treasureIntro)
      tbox.set("boxcontent",treasureContent)
      tbox.set("gettype",typeIndex)//0不抽奖1时效抽奖2人数抽奖
      tbox.set("formid",formid)
      console.log(timelimit)
      if(typeIndex=='1'){
        // let timedata = {
        //   "__type": "Date",
        //   "iso": timelimit
        // }
        tbox.set("timelimit", timelimit )
      }else if (typeIndex=='2'){
        tbox.set("peoplelimit",peoplelimit)
      }
      tbox.set("haspass",passIndex)//0无口令1有口令
      if(passHide){
        tbox.set("passnote",passnote)
        tbox.set("password",treasurepass)
      }
      if (that.data.isSrc){
        tbox.set("imgsrc",that.data.imgsrc)
      }else {
        tbox.set("imgsrc","http://bmob-cdn-20364.b0.upaiyun.com/2018/07/11/f323264840156a8b80b9da792c10bb07.jpg")
      }
      tbox.set("status",0)//0是未开启，1是已经开启
      tbox.set("joinnum",0)//参与人数
      tbox.set("joinarray",[])
      tbox.save().then(res => {
        common.showTip("添加成功");
        that.setData({
          isLoading: false,
          isdisabled: true
        })
        wx.navigateBack({
          url: '/pages/index/index',
        })
        // getList(that);
      }).catch(err => {
        console.log(err);
        common.showTip("添加失败", "loading");
      })
    }
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 1000);
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