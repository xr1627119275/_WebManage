access_token = '';
window.CurrentUserId = '';
currentIndex = '';
currentLiActive_el = '';
//获取登录信息
access_token = $.cookie("access_token");
var param = { "access_token": access_token };
bproto_ajax(GET_LOGIN_MSG_URL, param, function (obj_json) {
  // console.log(obj_json);
  if (obj_json.code != 0) {
    location.href = '/';
  }
  CurrentUser = obj_json.username;
  CurrentUserId = obj_json.user_id;

  $("header").load("/static/header.html", function () {
    $("#username").css("color", "#4b646f").html(obj_json.nickname ? obj_json.nickname : obj_json.username + ' <i class="fa fa-angle-down"></i>');
  })

});

// $.sidebarMenu($('.sidebar-menu'));

// 退出
function fun_api_logout() {
  param = { 'access_token': access_token };
  bproto_ajax(LOGOUT_URL, param, function (obj_json) {
    $.removeCookie("access_token", { path: '/' });
    $.removeCookie("csrftoken", { path: '/' });
    access_token = '';
    location.href = "/";
    console.log(obj_json)
  })
}

//提前获取用户信息，并回调
function GetUserMsg_CallBack(func) {
  if (!window.CurrentUserId) {
    access_token = $.cookie("access_token");
    var param = { "access_token": access_token };
    bproto_ajax(GET_LOGIN_MSG_URL, param, function (obj_json) {
      CurrentUser = obj_json.username;
      window.CurrentUserId = obj_json.user_id;
      func();
    });

  } else {
    func();
  }
}


function showWhitchSlider(i, notfirst) {
  currentIndex = i;
  GetUserMsg_CallBack(function () {
    $(".sidebar").load("/static/left.html", function () {
      if (CurrentUser != "admin") {
        $(".sidebar-menu>li").eq(7).remove()
      }
      $(".sidebar-menu>li").removeClass("active").eq(i).addClass("active").find("ul").show()
      $(".sidebar .active").find("i").eq(1).removeClass("fa-angle-right").addClass("fa-angle-down")
      if (!notfirst) {
        $(".treeview-menu").eq(i - 1).find("li").eq(0).addClass("active")
      } else {
        $(".treeview-menu").eq(i - 1).find("li").eq(currentLiActive_el).addClass("active")
      }
    })
  })
}

//根据ip获取地理位置
function IP2address(ip, callback) {

  if (!localStorage.iplist) {
    localStorage.setItem("iplist", JSON.stringify({ "code": 0 }));
  }
  var key = ["ip", ip].join("").replace(/\./g, '_');
  if (JSON.parse(localStorage.iplist)[key]) {
    callback({ "status": 0, "data": [{ "location": JSON.parse(localStorage.iplist)[key] }] })
  } else {

    var url = "https://opendata.baidu.com/api.php?query=" + ip + "&co=&resource_id=6006&cb=op_aladdin_callback&format=json&tn=baidu";

    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'jsonp',
      timeout: 1000,
      cache: true,
      jsonp: "cb",
      error: function () {
        callback(JSON.stringify({ "status": -1 }))
      },  //错误执行方法
      success: function (obj_json) {
        // console.log(obj_json);
        var key = ["ip", ip].join("").replace(/\./g, '_');
        var val = JSON.parse(localStorage.iplist)
        val[key] = obj_json.data[0].location;
        localStorage.setItem("iplist", JSON.stringify(val));
        callback(obj_json);
      }
    })

  }


}


function UserListAddUserRename(obj_json, func) {
  // var Userslist =  obj_json.user_list;
  //     var searchlist = {"access_token":access_token,'list':[]};
  //     for(var i=0;i<Userslist.length;i++){
  //       searchlist.list.push({
  //         'target_type':'user',
  //         'target_id':Userslist[i].user_id
  //       })
  //     }

  //     bproto_ajax(GET_REMARK,searchlist,function (obj_json) {  
  //       if(obj_json.code===0){
  //         for(var i=0;i<obj_json.list.length;i++){
  //           for(var j=0;j<Userslist.length;j++){
  //             if(Userslist[j].user_id===obj_json.list[i].target_id){
  //               Userslist[j]['rename'] = obj_json.list[i].rename;
  //             }
  //           }
  //         }
  //         func({'group_list':Userslist});      
  //       }

  //     })
  func(obj_json)
}


function hideLeft(target) {
  if (!target.isclose) {
    currentLiActive_el = $(".sidebar-menu>li").eq(currentIndex).find(".treeview-menu li").index($(".treeview-menu").eq(currentIndex - 1).find("li.active"))
    $(".header>a>span").hide();
    $(".treeview>ul").hide();
    $(".treeview>a>i.pull-right,.treeview>a>span").hide();
    $(".main-sidebar").width(50);
    $(".main-content").css('paddingLeft', 50);
    $(".main-content header").width("200%");
    $(".bottom").css('paddingLeft', 50);
    target.isclose = true;
  } else {
    $(".header>a>span").show();
    showWhitchSlider(currentIndex, true);
    $(".treeview>a>i.pull-right,.treeview>a>span").show();
    $(".main-sidebar").width(230);
    $(".main-content").css('paddingLeft', 230);
    $(".bottom").css('paddingLeft', 230);
    target.isclose = false;
  }
}



function copyText(text, callback) { // text: 要复制的内容， callback: 回调
  var tag = document.createElement('input');
  tag.setAttribute('id', 'cp_hgz_input');
  tag.value = text;
  document.getElementsByTagName('body')[0].appendChild(tag);
  document.getElementById('cp_hgz_input').select();
  document.execCommand('copy');
  document.getElementById('cp_hgz_input').remove();
  if (callback) { callback(text) } else {
    toastr.success("复制到粘贴板成功");
  }
}

$(".table ").on("click", "td.more", function () {
  $(this).find(".msg_body").css("display", "block");
})

$(".table ").on("mouseleave", "td.more", function () {
  $(this).find(".msg_body").css("display", "none");
})

//模板   对象2字符串
$(function () {
  template.helper("toString", function (state) {
    return JSON.stringify(state);
  })
})
//数组去重
Array.prototype.unique = function () {
  // n为hash表，r为临时数组
  var n = {}, r = [];
  for (var i = 0; i < this.length; i++) {
    // 如果hash表中没有当前项
    if (!n[this[i]]) {
      // 存入hash表
      n[this[i]] = true;
      // 把当前数组的当前项push到临时数组里面
      r.push(this[i]);
    }
  }
  return r;
};

$(function () {
  $('.modal').on('shown.bs.modal', function () {
    $(this).find("input").eq(0).focus();
  })
})

//返回按钮
function Back(target1, target2) {
  $(target1).hide();
  $(target2).show();
}

