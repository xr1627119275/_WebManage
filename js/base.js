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

  $("header").load("/static/header.html",function () {  
    $("#username").css("color", "#4b646f").html(obj_json.username + ' <i class="fa fa-angle-down"></i>');
  })

});

// $.sidebarMenu($('.sidebar-menu'));

// 退出
function fun_api_logout() {
  param = {'access_token': access_token};
  bproto_ajax(LOGOUT_URL, param, function (obj_json) {
    $.removeCookie("access_token", {path: '/'});
    $.removeCookie("csrftoken", {path: '/'});
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


function showWhitchSlider(i){
  GetUserMsg_CallBack(function () {
    $(".sidebar").load("/static/left.html",function () {
      if(CurrentUser!="admin"){
        $(".sidebar-menu>li").eq(7).remove()
      }
      $(".sidebar-menu>li").removeClass("active").eq(i).addClass("active").find("ul").show()
      $(".sidebar .active").find("i").eq(1).removeClass("fa-angle-right").addClass("fa-angle-down")
      $(".treeview-menu").eq(i-1).find("li").eq(0).addClass("active")
    })
  })
  
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


$(function () {  
  $('.modal').on('shown.bs.modal', function () {
    $(this).find("input").eq(0).focus();
  })
})

//返回按钮
function Back(target1,target2){
  $(target1).hide();
  $(target2).show();
}

