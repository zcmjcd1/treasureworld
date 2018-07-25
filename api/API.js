var Bmob = require('../lib/Bmob-1.6.0.min.js');
var getDistance = require('../utils/distance.js').getDistance;
var app = getApp();

module.exports = {
  //获取美食点接口
  getTreasureBoxesByPage: function(page, pagesize, cb) {
    app.getLocationInfo(locationInfo => {
      var query = Bmob.Query("TreasureBoxes");
      var point = new Bmob.GeoPoint({
        latitude: locationInfo.latitude,
        longitude: locationInfo.longitude
      });
      // 创建查询
      // location附近的位置
      //query.near("location", point);
      //query.withinGeoBox("location", southwestOfSF, northeastOfSF);
      query.withinKilometers("location", point, 30000);
      // 每页个数
      query.limit(pagesize);
      // 每页个数
      query.skip(pagesize * (page - 1))
      //隐藏的去掉
      query.equalTo("status","<", 1);
      // 查询
      query.find().then(res => {
        var jsonArray = JSON.parse(JSON.stringify(res));
        //distance
        for (var x in jsonArray) {
          jsonArray[x].distance = getDistance(locationInfo.latitude, locationInfo.longitude, jsonArray[x].location.latitude, jsonArray[x].location.longitude)
        }
        cb(jsonArray);
      }).catch(err => {
        cb([])
        console.log(err);
        console.log("查询所有宝箱失败");
      });

    })
  },
  getTreasureBoxesAllByPage: function(user, page, pagesize, cb) {
    var query = Bmob.Query("TreasureBoxes");
    // 每页个数
    query.limit(pagesize);
    // 每页个数
    query.skip(pagesize * (page - 1))
    //隐藏的去掉
    // query.notEqualTo("hide", true);
    // 查询
    const jquery = query.containedIn("joinarray", [user]);
    const pointer = Bmob.Pointer('_User')
    const poiID = pointer.set(user)
    const cquery = query.equalTo("creator", "==", poiID)
    query.or(jquery, cquery);
    query.order('status', '-updatedAt')
    query.find().then(res => {
      var jsonArray = JSON.parse(JSON.stringify(res));
      for (var x in jsonArray) {
        jsonArray[x].endday = jsonArray[x].updatedAt.substring(0, 10)
        this.getSubTitle(jsonArray[x], (a, b, c, d) => {
          jsonArray[x].timehide = a
          jsonArray[x].peoplehide = b
          jsonArray[x].needpass = c
          jsonArray[x].normalbox = d
        })
      }
      cb(jsonArray);
    }).catch(err => {
      cb([])
      console.log(err);
      console.log("查询所有有关宝箱失败");
    });
  },
  getTreasureBoxesCreateByPage: function(user, page, pagesize, cb) {
    var query = Bmob.Query("TreasureBoxes");
    // 每页个数
    query.limit(pagesize);
    // 每页个数
    query.skip(pagesize * (page - 1))
    //隐藏的去掉
    // query.notEqualTo("hide", true);
    // 查询
    const pointer = Bmob.Pointer('_User')
    const poiID = pointer.set(user)
    query.equalTo("creator", "==", poiID)
    query.order('status', '-updatedAt')
    query.find().then(res => {
      var jsonArray = JSON.parse(JSON.stringify(res));
      for (var x in jsonArray) {
        jsonArray[x].endday = jsonArray[x].updatedAt.substring(0, 10)
        this.getSubTitle(jsonArray[x], (a, b, c, d) => {
          jsonArray[x].timehide = a
          jsonArray[x].peoplehide = b
          jsonArray[x].needpass = c
          jsonArray[x].normalbox = d
        })
      }

      cb(jsonArray);
    }).catch(err => {
      cb([])
      console.log(err);
      console.log("查询创建宝箱失败");
    });
  },
  getTreasureBoxesOwnByPage: function(user, page, pagesize, cb) {
    var query = Bmob.Query("TreasureBoxes");
    // 每页个数
    query.limit(pagesize);
    // 每页个数
    query.skip(pagesize * (page - 1))
    //隐藏的去掉
    // query.notEqualTo("hide", true);
    // 查询
    query.equalTo("winner", "==", user)
    query.order('-updatedAt')
    query.find().then(res => {
      var jsonArray = JSON.parse(JSON.stringify(res));
      for (var x in jsonArray) {
        jsonArray[x].endday = jsonArray[x].updatedAt.substring(0, 10)
      }
      cb(jsonArray);
    }).catch(err => {
      cb([])
      console.log(err);
      console.log("查询获得宝箱失败");
    });
  },
  getUserData: function(objectID, cb) {
    var query = Bmob.Query("_User");
    query.get(objectID).then(res => {
      // console.log(res)
      cb(res)
    }).catch(err => {
      cb({})
      console.log(err)
    });
  },
  getSubTitle: function(treasurebox, cb) {
    var timehide = false
    var peoplehide = false
    var needpass = false
    var normalbox = false
    if (treasurebox.gettype == '0' && treasurebox.haspass == 0) {
      normalbox = true
    } else if (treasurebox.gettype == '1' && treasurebox.haspass == 0) {
      timehide = true
    } else if (treasurebox.gettype == '1' && treasurebox.haspass == 1) {
      timehide = true
      needpass = true
    } else if (treasurebox.gettype == '2' && treasurebox.haspass == 0) {
      peoplehide = true
    } else if (treasurebox.gettype == '2' && treasurebox.haspass == 1) {
      peoplehide = true
      needpass = true
    } else if (treasurebox.gettype == '0' && treasurebox.haspass == 1) {
      needpass = true
    }
    cb(timehide, peoplehide, needpass, normalbox)
  }
}