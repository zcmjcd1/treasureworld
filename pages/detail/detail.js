// pages/detail/detail.js

var API = require('../../api/API.js');
var Bmob = require('../../lib/Bmob-1.6.0.min.js');
var getDistance = require('../../utils/distance.js').getDistance;
const util = require('../../utils/util.js')
const app = getApp()

var treasurebox = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    TopTips: "",
    passinput: "",
    contentHide: false,
    hidenpassmodal: true,
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
    var userdata = wx.getStorageSync("userData")
    var openid = userdata.openid;
    that.setData({
      openid: openid
    })
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
          timelimit: treasurebox.timelimit,
        })
      } else if (treasurebox.gettype == 1 && treasurebox.haspass == 1) {
        that.setData({
          timehide: true,
          timelimit: treasurebox.timelimit,
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
      } else if (treasurebox.gettype == 0 && treasurebox.haspass == 1) {
        that.setData({
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
        if (myid == treasurebox.winner) {
          that.setData({
            status_desc: "已开启，恭喜中奖",
            contentHide: true,
          })
        } else {
          for (var i = 0; i < joinarray; i++) {
            if (myid == joinarray[i]) {
              that.setData({
                status_desc: "已开启，没中奖",
              })
              break;
            }
          }
          if (that.data.status_desc != "已开启，没中奖") {
            that.setData({
              status_desc: "宝箱已开启",
            })
          }
        }
        that.setData({
          status_open: false,
        })
      }
      that.setData({
        joinnum: treasurebox.joinnum
      })
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
    } else {
      console.log("detail没有item")
    }
  },
  openbox: function(e) {
    var that = this;
    that.setData({
      formid: e.detail.formId,
    })
    console.log("join")
    console.log(that.data.status_open, that.data.status_desc)
    //再查询一次宝箱状态是否为待开启，如果是再进行下面步骤
    var getstatus = Bmob.Query('TreasureBoxes');
    console.log(treasurebox.objectId)
    var thisbox = getstatus.get(treasurebox.objectId).then(res => {
      console.log(res.status, that.data.status_desc)
      //判断如何操作数据库
      if (res.status == 0 && !(that.data.status_desc == "wait")) {
        // console.log("宝箱开启参与表记录一条数据，joinarray添加用户objectid")
        // const pointUser = Bmob.Pointer('_User')
        // const pointID = pointUser.set(that.data.myid)
        // const box = Bmob.Pointer('TreasureBoxes')
        // const boxID = box.set(treasurebox.objectId)
        // var myjoin = Bmob.Query('JoinOpenBox')
        // myjoin.set("joiner", pointID)
        // myjoin.set("box", boxID)
        // myjoin.save()
        //判断位置
        app.getLocationInfo(locationInfo => {
          var query = Bmob.Query("TreasureBoxes");
          var currentdistance = getDistance(locationInfo.latitude, locationInfo.longitude, treasurebox.location.latitude, treasurebox.location.longitude)
          console.log(currentdistance);
          if (currentdistance < 0.1) {
            console.log("距离允许参与")
            if (treasurebox.haspass == 1) {
              //需要口令弹出输入口令窗口
              that.setData({
                hidenpassmodal: false,
              })
            }
            //时效抽奖宝箱，先判断当前时间是否小于开启时间，小于则继续插入数据到各表,大于则提示，宝箱已经开启
            if (treasurebox.haspass == 0 && treasurebox.gettype == "1") {
              var nowtime = new Date()
              var limittime = res.timelimit
              var str = limittime.toString();
              str = str.replace("/-/g", "/");
              var oDate = new Date(str);
              if (nowtime > oDate) {
                console.log("可以参与")
                //插入数据
                //joinarray
                res.add("joinarray", [that.data.myid]);
                //joinnum
                res.increment("joinnum");
                res.save().then(res2 => {
                  console.log("修改box数据成功")
                  console.log(res)
                  //参与表添加数据
                  const pointUser = Bmob.Pointer('_User')
                  const pointID = pointUser.set(that.data.myid)
                  const box = Bmob.Pointer('TreasureBoxes')
                  const boxID = box.set(treasurebox.objectId)
                  var myjoin = Bmob.Query('JoinOpenBox')
                  myjoin.set("joiner", pointID)
                  myjoin.set("box", boxID)
                  myjoin.set("joinid", that.data.myid)
                  myjoin.set("openid", that.data.openid)
                  myjoin.set("formid", e.detail.formId)
                  myjoin.set("boxid", res.objectId)
                  myjoin.save();
                  that.setData({
                    join_by_status_button_text: '...等待开启',
                    joinnum: res.joinnum,
                  })
                }).catch(err => {
                  console.log("修改box数据失败")
                  console.log(err)
                })
              } else {
                this.setData({
                  showTopTips: true,
                  TopTips: '宝箱已开启，不可参与'
                })
                console.log("宝箱已开启，不可参与")
              }
            }
            //人数抽奖宝箱，先判断joinnum是否小于peoplelimit，小于则继续插入数据到各表,大于则提示，宝箱已经开启
            if (treasurebox.haspass == 0 && treasurebox.gettype == "2") {
              if (res.joinnum < res.peoplelimit) {
                console.log("可以参与人数抽奖")
                //插入数据
                res.add("joinarray", [that.data.myid]);
                res.increment("joinnum");
                if (res.joinnum+1 == res.peoplelimit) {
                  //getrandom in joinarray and 发送开启结果通知到所有参与者和创建者告知宝箱开启
                  var winnerindex = 0;
                  //status
                  res.set("status", 1);
                  var marray = res.joinarray
                  if (marray){
                    marray.push(that.data.myid)
                    winnerindex = Math.floor((Math.random() * marray.length))
                  }else {
                    marray=[]
                    marray.push(that.data.myid)
                  }
                  
                  console.log("marray:",marray)
                  //winner
                  res.set("winner", marray[winnerindex]);
                }
                res.save().then(res2 => {
                  console.log("修改box数据成功")
                  console.log("res2: ",res2)
                  //参与表添加数据
                  const pointUser = Bmob.Pointer('_User')
                  const pointID = pointUser.set(that.data.myid)
                  const box = Bmob.Pointer('TreasureBoxes')
                  const boxID = box.set(treasurebox.objectId)
                  var myjoin = Bmob.Query('JoinOpenBox')
                  myjoin.set("joiner", pointID)
                  myjoin.set("box", boxID)
                  myjoin.set("joinid", that.data.myid)
                  myjoin.set("openid", that.data.openid)
                  myjoin.set("formid", e.detail.formId)
                  myjoin.set("boxid", res.objectId)
                  myjoin.save().then(res3 => {
                    //数据更新成功则发送通知给所有参与者和创建者0000000000000000000000000000000000000000000000000000000
                    //get winner openid
                    const getwinner = Bmob.Query('_User');
                    getwinner.find(res2.winner).then(res4=>{
                      // var authdata = JSON.parse(JSON.stringify(res4.authData));
                      console.log("openip:", res4[0]);
                      console.log("sendres:",res)
                      Bmob.Query('TreasureBoxes').get(res.objectId).then(res5 =>{
                        var temp = {
                          "touser": res4[0].authData.weapp.openid,
                          "template_id": "lRUWdw2USiQ73570mOcGRbi_EOVb4kFsYaQpZ-lIO5A",
                          "page": "/pages/detail/detail?item=" + JSON.stringify(res5),
                          "form_id": res.formid,
                          data: {
                            keyword1: {
                              value: res.title,
                              color: '#173177'
                            },
                            keyword2: {
                              value: '宝箱已经开启，点击查看当前状态',
                              color: '#173177'
                            }
                          },
                          "emphasis_keyword": ""
                        }
                        console.log(temp)
                        Bmob.sendWeAppMessage(temp).then(function (response) {
                          console.log(response);
                        }).catch(function (error) {
                          console.log(error);
                        });
                      })
                     
                    })
                    

                    this.setData({
                      showTopTips: true,
                      TopTips: '宝箱已开启，人数到达，发送通知'
                    })
                  }).catch(err => {
                    console.log("更新数据失败",err)
                  });
                  console.log("001001: ",res.joinnum)
                  that.setData({
                    join_by_status_button_text: '...等待开启',
                    joinnum: res.joinnum+1,
                  })

                }).catch(err => {
                  console.log("修改box数据失败")
                  console.log(err)
                })

              } else {
                this.setData({
                  showTopTips: true,
                  TopTips: '宝箱已开启，不可参与(人数已满)'
                })
                console.log("宝箱已开启，不可参与")
              }
            }
            //缘之宝箱直接被开启，展示宝箱宝贝，请求数据库改变宝箱状态为已开启，添加获取人字段数据为当前用户objectid
            if (treasurebox.haspass == 0 && treasurebox.gettype == "0") {
              //status
              res.set("status", 1);
              //winner
              res.set("winner", that.data.myid);
              //joinarray
              res.add("joinarray", [that.data.myid]);
              //joinnum
              res.increment("joinnum");
              res.save().then(res2 => {
                console.log("修改box数据成功")
                console.log(res)
                //参与表添加数据
                const pointUser = Bmob.Pointer('_User')
                const pointID = pointUser.set(that.data.myid)
                const box = Bmob.Pointer('TreasureBoxes')
                const boxID = box.set(treasurebox.objectId)
                var myjoin = Bmob.Query('JoinOpenBox')
                myjoin.set("joiner", pointID)
                myjoin.set("box", boxID)
                myjoin.set("joinid", that.data.myid)
                myjoin.set("openid", that.data.openid)
                myjoin.set("formid", e.detail.formId)
                myjoin.set("boxid", res.objectId)
                myjoin.save();
                that.setData({
                  contentHide: true,
                  status_open: false,
                  joinnum: res.joinnum,
                })
              }).catch(err => {
                console.log("修改box数据失败")
                console.log(err)
              })
            }
            //joinarray+id joinnum+1 TreasureBoxes表，改变btntext和btnstatustext
          } else {
            //提示接近宝箱
            this.setData({
              showTopTips: true,
              TopTips: '距离不允许参与,请接近宝箱30米以内'
            })
            console.log("距离不允许参与,请接近宝箱30米以内")
            return;
          }
        })

      }
    }).catch(err => {
      console.log(err)
      console.log("加入失败");
    });

    setTimeout(function() {
      that.setData({
        showTopTips: false
      });
    }, 2000);

  },
  passinput: function(e) {
    var that = this;
    that.setData({
      passinput: e.detail.value
    });
  },
  cancelpass: function() {
    var that = this;
    that.setData({
      hidenpassmodal: true,
    })
  },
  confirmpass: function() {
    var that = this;
    var passinput = that.data.passinput;
    //验证passinput是否为空，空则提示输入口令
    if (passinput == "") {
      that.setData({
        showTopTips: true,
        TopTips: '请输入口令'
      });
      setTimeout(function() {
        that.setData({
          showTopTips: false
        });
      }, 1000);
      console.log("请输入口令")
      return
    }
    //验证口令是否正确,弹出提示窗口，查询是否为抽奖宝箱，以及开启状态，正确得改变joinbtn状态，并记录相应信息到数据库
    console.log(passinput, "  sdfsdfsdfsdf");
    if (treasurebox.password == passinput) {
      //查询宝箱状态是否为已经开启
      var getstatus = Bmob.Query('TreasureBoxes');
      console.log(treasurebox.objectId)
      var thisbox = getstatus.get(treasurebox.objectId).then(res => {
        //未开启and不抽奖，直接获取宝贝，显示宝箱内容，改变宝箱状态为已开启，获取人为当前用户，地图不再显示
        if (res.status == 0 && res.gettype == '0') {
          // var setwinner = Bmob.Query('TreasureBoxes')
          //status
          res.set("status", 1);
          //winner
          res.set("winner", that.data.myid);
          //joinarray
          res.add("joinarray", [that.data.myid]);
          //joinnum
          res.increment("joinnum");
          res.save().then(res2 => {
            console.log("修改box数据成功")
            console.log(res)
            //参与表添加数据
            const pointUser = Bmob.Pointer('_User')
            const pointID = pointUser.set(that.data.myid)
            const box = Bmob.Pointer('TreasureBoxes')
            const boxID = box.set(treasurebox.objectId)
            var myjoin = Bmob.Query('JoinOpenBox')
            myjoin.set("joiner", pointID)
            myjoin.set("box", boxID)
            myjoin.set("joinid", that.data.myid)
            myjoin.set("openid", that.data.openid)
            myjoin.set("formid", that.data.formId)
            myjoin.set("boxid", res.objectId)
            myjoin.save();
            that.setData({
              contentHide: true,
              status_open: false,
              joinnum: res.joinnum,
            })
          }).catch(err => {
            console.log("修改box数据失败")
            console.log(err)
          })
        }
        //未开启and时效抽奖，查看当前时间是否早于timelimit，早于则继续改变btntext为等待开启，记录信息到数据库,晚于则提示参与失败和宝箱当前状态
        if (res.status == 0 && res.gettype == "1") {
          var nowtime = new Date()
          var limittime = res.timelimit
          var str = limittime.toString();
          str = str.replace("/-/g", "/");
          var oDate = new Date(str);
          if (nowtime < oDate) {
            console.log("可以参与")
            //status
            // res.set("status", 1);
            //winner
            // res.set("winner", that.data.myid);
            //joinarray
            res.add("joinarray", [that.data.myid]);
            //joinnum
            res.increment("joinnum");
            res.save().then(res2 => {
              console.log("修改box数据成功")
              console.log(res)
              //参与表添加数据
              const pointUser = Bmob.Pointer('_User')
              const pointID = pointUser.set(that.data.myid)
              const box = Bmob.Pointer('TreasureBoxes')
              const boxID = box.set(treasurebox.objectId)
              var myjoin = Bmob.Query('JoinOpenBox')
              myjoin.set("joiner", pointID)
              myjoin.set("box", boxID)
              myjoin.set("joinid", that.data.myid)
              myjoin.set("openid", that.data.openid)
              myjoin.set("formid", that.data.formId)
              myjoin.set("boxid", res.objectId)
              myjoin.save();
              that.setData({
                join_by_status_button_text: '...等待开启',
                joinnum: res.joinnum,
              })
            }).catch(err => {
              console.log("修改box数据失败")
              console.log(err)
            })
          } else {
            this.setData({
              showTopTips: true,
              TopTips: '宝箱已开启，不可参与（时间已过）'
            })
            console.log("宝箱已开启，不可参与")
          }
        }
        //未开启and人数抽奖，查看当前人数是否小于peoplelimit，小于则继续改变btntext为等待开启，等于则开启宝箱，改变状态，记录数据发送通知，晚于则提示参与失败和宝箱当前状态
        if (res.status == 0 && res.gettype == "2") {
          if (res.joinnum < res.peoplelimit) {
            console.log("可以参与人数抽奖")
            //插入数据
            res.add("joinarray", [that.data.myid]);
            res.increment("joinnum");
            if (res.joinnum + 1 == res.peoplelimit) {
              //getrandom in joinarray and 发送开启结果通知到所有参与者和创建者告知宝箱开启
              var winnerindex = 0;
              //status
              res.set("status", 1);
              var marray = res.joinarray
              if (marray) {
                marray.push(that.data.myid)
                winnerindex = Math.floor((Math.random() * marray.length))
              } else {
                marray = []
                marray.push(that.data.myid)
              }

              console.log("marray:", marray)
              //winner
              res.set("winner", marray[winnerindex]);
            }
            res.save().then(res2 => {
              console.log("修改box数据成功")
              console.log("res2: ", res2)
              //参与表添加数据
              const pointUser = Bmob.Pointer('_User')
              const pointID = pointUser.set(that.data.myid)
              const box = Bmob.Pointer('TreasureBoxes')
              const boxID = box.set(treasurebox.objectId)
              var myjoin = Bmob.Query('JoinOpenBox')
              myjoin.set("joiner", pointID)
              myjoin.set("box", boxID)
              myjoin.set("joinid", that.data.myid)
              myjoin.set("openid", that.data.openid)
              myjoin.set("formid", that.data.formId)
              myjoin.set("boxid", res.objectId)
              myjoin.save().then(res3 => {
                //数据更新成功则发送通知给所有参与者和创建者0000000000000000000000000000000000000000000000000000000
                //get winner openid
                const getwinner = Bmob.Query('_User');
                getwinner.find(res2.winner).then(res4 => {
                  // var authdata = JSON.parse(JSON.stringify(res4.authData));
                  console.log("openip:", res4[0]);
                  console.log("sendres:", res3)
                  Bmob.Query('TreasureBoxes').get(res.objectId).then(res5 => {
                    var temp = {
                      "touser": res4[0].authData.weapp.openid,
                      "template_id": "lRUWdw2USiQ73570mOcGRbi_EOVb4kFsYaQpZ-lIO5A",
                      "page": "/pages/detail/detail?item=" + JSON.stringify(res5),
                      "form_id": res.formid,
                      data: {
                        keyword1: {
                          value: res.title,
                          color: '#173177'
                        },
                        keyword2: {
                          value: '宝箱已经开启，点击查看当前状态',
                          color: '#173177'
                        }
                      },
                      "emphasis_keyword": ""
                    }
                    console.log(temp)
                    Bmob.sendWeAppMessage(temp).then(function (response) {
                      console.log(response);
                    }).catch(function (error) {
                      console.log(error);
                    });
                  })

                })


                this.setData({
                  showTopTips: true,
                  TopTips: '宝箱已开启，人数到达，发送通知'
                })
                  }).catch(err =>{
                console.log("更新数据失败")
              });
              that.setData({
                join_by_status_button_text: '...等待开启',
                joinnum: res.joinnum +1,
              })
              
            }).catch(err => {
              console.log("修改box数据失败")
              console.log(err)
            })

          } else {
            this.setData({
              showTopTips: true,
              TopTips: '宝箱已开启，不可参与(人数已满)'
            })
            console.log("宝箱已开启，不可参与")
          }
        }
      });
    } else {
      this.setData({
        showTopTips: true,
        TopTips: '口令输入错误！！！'
      });
      console.log("口令输入错误！！！")
    }
    setTimeout(function() {
      that.setData({
        showTopTips: false
      });
    }, 2000);
    that.setData({
      hidenpassmodal: true,
    })
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