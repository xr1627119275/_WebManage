access_token = '';
window.CurrentUserId = '';
//获取登录信息
access_token = $.cookie("access_token");
var param = {"access_token": access_token};
bproto_ajax(GET_LOGIN_MSG_URL, param, function (obj_json) {
  // console.log(obj_json);
  if (obj_json.code != 0) {
    location.href = '/';
  }
  CurrentUser = obj_json.username;
  CurrentUserId = obj_json.user_id;
  $("#username").css("color", "#4b646f").html(obj_json.username + ' <i class="fa fa-angle-down"></i>');
});

$.sidebarMenu($('.sidebar-menu'));

// 退出
function fun_api_logout() {
  param = {'access_token': access_token};
  bproto_ajax(LOGOUT_URL, param, function (obj_json) {
    $.removeCookie("access_token", {path: '/'});
    access_token = '';
    location.href = "/";
    console.log(obj_json)
  })
}

//提前获取用户信息，并回调
function GetUserMsg_CallBack(func){
  if(!window.CurrentUserId){
    access_token = $.cookie("access_token");
    var param = {"access_token": access_token};
    bproto_ajax(GET_LOGIN_MSG_URL, param, function (obj_json) {
      CurrentUser = obj_json.username;
      window.CurrentUserId = obj_json.user_id;
      func();
    });

  }else{
    func();
  }
}

//根据ip获取地理位置
function IP2address(ip, callback) {
  var url = "https://opendata.baidu.com/api.php?query=" + ip + "&co=&resource_id=6006&cb=op_aladdin_callback&format=json&tn=baidu";

  $.ajax({
    url: url,
    type: 'GET',
    dataType: 'jsonp',
    timeout: 1000,
    cache: true,
    jsonp: "cb",
    error: function () {
      callback(JSON.stringify({"status": -1}))
    },  //错误执行方法
    success: function (obj_json) {
      callback(obj_json);
    }
  })
}



