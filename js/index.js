unauthTypelist = [];
unauthHardwareproviderlist = [];
unauthSoftwareproviderlist = [];
unauthorizedlist = [];

authTypelist = [];
authLabellist = [];
authHardwareproviderlist = [];

OnlineTypelist = [];
OnlineLabellist = [];
OnlineHardwareproviderlist = [];


currentOnlineTermPage_total = 0;//初始化在线设备总页数
currentOnlineTermPage = 0; //初始化在线设备当前页数
currentOnlineTermPageSize = 10; // 初始化在线设备每页获取数据


currentUnAuthTermPage_total = 0;//初始化未授权设备总页数
currentUnAuthTermPage = 0; //初始化未授权设备当前页数
currentUnAuthTermPageSize = 10; // 初始化未授权设备每页获取数据

currentAuthTermPage_total = 0;//初始化授权设备总页数
currentAuthTermPage = 0; //初始化授权设备当前页数
currentAuthTermPageSize = 10; // 初始化授权设备每页获取数据


Module_FiledLists = {};//分类验证字段

cacheIp = [];//缓存IP地址

unauth_account_ishide = false;
auth_account_ishide = false;
online_account_ishide = false;

current_cb_data = { "cmd": "", "data": [] };

MoveTime = 2;

showWhitchSlider(1)

//双击table Th逻辑
//  $("body").on("dblclick","th",function () {
//   var index = $(this)[0].cellIndex;
//   // console.log(index)
//   let el = $(this).parent().parent().parent().find("td:nth-child("+(index+1)+")");
//   let maxwidth = $(this).text().length*15;
//   if(!$(this)[0].dbclick){
//     el.addClass("table_td").css("maxWidth",maxwidth)
//     // el.each(function(){$(this).attr("title",$(this).text())})
//   }else{
//     el.removeClass("table_td").css("maxWidth","")
//   }
//   $(this)[0].dbclick = !$(this)[0].dbclick
// })


// $(".table ").on("mouseenter","td.more",function () {  
//   $(this).find(".msg_body").css("display","block");
// })

// $(".table").on('click')
function ShowOnlineTermAllMsg(id, target) {
  // $(this).find(".msg_body").css("display","block");

  if ($(target).next().find("ul li.info").is(":hidden")) {
    return;
  }

  var param = {
    'access_token': access_token,
    'terminals': [id]
  }
  bproto_ajax(GET_TERMINAL_LOGIN_INFO, param, function (obj_json) {
    if (obj_json.code == 0) {
      var info = obj_json.terminals[0].login_info;
      if (info.login_status == false) {
        return;
      }
      var html = '';
      html += '<li class="list-group-item info"><span style="display:inline-block;width:100px">上线时间</span>' + (info.online_datetime) + '</li>'
      html += '<li class="list-group-item info"><span style="display:inline-block;width:100px">上线IP</span>' + (info.online_host) + '</li>'
      $(target).next().find("ul").append(html);
    }
  })
  // $(target).find(".msg_body ul").append('<li class="list-group-item"><span style="display:inline-block;width:100px">系统版本</span>{{value.OSVersion}}</li>')
}


$(".table ").on("click", "td button", function (e) {
  // $(this).find(".msg_body").css("display","block");
  if (($(this).offset().top) > $(this).next().height()) {
    $(this).parent().find(".msg_body").css({ "display": "block", "bottom": "0" });
  } else {
    $(this).parent().find(".msg_body").css({ "display": "block", "top": "0" });
  }
})

$(".table ").on("mouseleave", "td.more", function () {
  $(this).find(".msg_body").css("display", "none");
})



//终端弹出框
$(".terminal_content").mousedown(function (e) {
  e.preventDefault();
  startX = e.pageX - $(".terminal_content").offset().left - $(".terminal_content").width() / 2;
  startY = e.pageY - $(".terminal_content").offset().top;
  isend = true;
  $(".terminal_content").bind('mousemove', move);
});

$(".terminal_content").mouseup(function (e) {
  e.preventDefault();
  $(".terminal_content").unbind('mousemove', move)
})

$(".terminal_content").mouseup(function (e) {
  e.preventDefault();
  $(".terminal_content").unbind('mousemove', move);
});

$(".terminal").click(function (e) {
  if (e.target === $(this)[0]) {
    closeTerminal();
  }
})
//终端弹出框结束


function move(e) {
  if (isend) {
    isend = false;
    moveX = e.pageX - startX;
    moveY = e.pageY - startY;
    moveX <= $(".terminal_content").width() / 2 ? moveX = $(".terminal_content").width() / 2 : moveX
    moveY <= -100 ? moveY = -100 : moveY
    $(".terminal_content").css({ "left": moveX, "top": moveY })
    isend = true
  }
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


//动态设置table高度
$(window).resize(function () {
  // $(".tablebox").height($(window).height() - $(".account").height() - $(".tablebox").offset().top-60);
  $(".tablebox").height($(window).height() - parseInt(unauth_account_ishide ? "" + $("#unauthorized .account").height() : "0") - $(".tablebox").offset().top - 60);
  // $(".tablebox_authterm").height($(window).height() - parseInt(auth_account_ishide ? "" + $("#authorized .account").height() : "0") - $(".tablebox_authterm").offset().top - 60);
  $(".tablebox_online").height($(window).height() - parseInt(online_account_ishide ? "" + $("#onlineTerminal .account").height() : "0") - $(".tablebox_online").offset().top - 60);
  // console.log("change")
}).trigger("resize");

window.addEventListener('load', function () {
  switch (location.hash) {
    case "#unauthorizedPage":
      changeContent($("a[data-bind=#unauthorized]")[0]);
      $(".tablebox").height($(window).height() - parseInt(unauth_account_ishide ? "" + $("#unauthorized .account").height() : "0") - $(".tablebox").offset().top - 60);
      break;
    case "#authorizedPage":
      changeContent($("a[data-bind=#authorized]")[0]);
      $(".tablebox_authterm").height($(window).height() - parseInt(auth_account_ishide ? "" + $("#authorized .account").height() : "0") - $(".tablebox_authterm").offset().top - 60);

      break;
    case "#onlineTerminalPage":
      changeContent($("a[data-bind=#onlineTerminal]")[0]);
      $(".tablebox_online").height($(window).height() - parseInt(online_account_ishide ? "" + $("#onlineTerminal .account").height() : "0") - $(".tablebox_online").offset().top - 60);
      break;
    case "#TerminalVerifyPage":
      changeContent($("a[data-bind=#TerminalVerify]")[0]);
      break;
    default:
      location.href = "#unauthorizedPage";
      changeContent($("a[data-bind=#unauthorized]")[0]);
      $(".tablebox").height($(window).height() - parseInt(unauth_account_ishide ? "" + $("#unauthorized .account").height() : "0") - $(".tablebox").offset().top - 60);

  }
})




// 退出
function fun_api_logout() {
  param = { 'access_token': access_token };
  bproto_ajax(LOGOUT_URL, param, function (obj_json) {
    $.removeCookie("access_token", { path: '/' });
    access_token = '';
    location.href = "/";
    console.log(obj_json)
  }, function () {
    $.removeCookie("access_token", { path: '/' });
    access_token = '';
    location.href = "/";
    console.log(obj_json)
  })
}

//切换导航
function changeContent(target) {
  $(target).parent().parent().find("li").removeClass("active");
  $(target).parent().addClass("active")

  var targetId = $(target).attr("data-bind");
  $(".content").hide();
  // $(".right a").removeClass("active");
  // $(target).addClass("active");
  $(targetId).show();
  $(".shouquan").hide();
  $(".breadcrumb li.active").text("").hide();
  if ($(target)[0] == $("a[data-bind=#unauthorized]")[0]) {
    GetUserMsg_CallBack(fun_get_register_list);
  } else if ($(target)[0] == $("a[data-bind=#authorized]")[0]) {
    GetUserMsg_CallBack(fun_get_authterm_list);
  } else if ($(target)[0] == $("a[data-bind=#onlineTerminal]")[0]) {
    GetUserMsg_CallBack(fun_get_online_terminal_list);
  } else if ($(target)[0] == $("a[data-bind=#TerminalVerify]")[0]) {
    fun_get_module_fields_list();
  }
}


// $(".auth_manage").mouseenter(function () {
//     $(".shouquan").show()
// });
// $(".auth_manage").mouseleave(function () {
//     $(".shouquan").hide()
// });


//获取未授权列表
function fun_get_register_list() {
  $(".content").hide();
  $("#unauthorized").show()
  unauth_account_ishide = false;
  $("#unauthorized .dropdown-menu li:nth-child(1)").click();
  $("#unauthorized input").val("");
  $("#unauthorized .account").hide();
  $("input[type=checkbox]").prop("checked", false);
  param = {
    "access_token": access_token,
    'user_id': CurrentUserId,
    'page': 0,
    "page_size": currentUnAuthTermPageSize
  };
  bproto_ajax(GET_REGISTER_URL, param, function (obj_json) {
    if (obj_json.code === 0) {
      currentUnAuthTermPage_total = obj_json.page_total;
      currentUnAuthTermPage = obj_json.page;
      var html = template('unauthorizedTemp', obj_json);
      $("#unauthorized table tbody").html(html);
      update_ip();
      UnAuth_List_Search();
      RenderTable_Th("#unauthorized");
    }
    $(".unauth_section").hide();
    $(".unauth_section.section1").show();
  })
}

// function update_ip() {

//   $(".iphost").each(function () {
//     let that;
//     that= this;
//     var ip = $(that).html();
//     if ((JSON.stringify(cacheIp).indexOf(ip)) != -1) {
//       for (let i = 0; i < cacheIp.length; i++) {
//         if (cacheIp[i].ip === ip) {
//           $(this).html(cacheIp[i].address);
//         }
//       }
//     } else {
//       IP2address(ip, function (json) {
//         let temp = {};
//         temp.ip = $(that).html();
//         $(that).html(json.data[0].location);
//         temp.address = json.data[0].location;
//         cacheIp.push(temp);
//       });
//     }
//   });
// }

function update_ip() {
  var templist = [];
  $(".iphost").each(function (i, el) {
    templist.push($(this).attr("data-ip").replace(/\_/g, "."));

    if (i == $(".iphost").length - 1) {
      templist = templist.unique()
      for (let i = 0; i < templist.length; i++) {
        IP2address(templist[i], function (json) {
          $("[data-ip=" + templist[i].replace(/\./g, "_") + "]").html(json.data[0].location);
        });
      }
    }
  });
}

//根据未授权列表数据 检索,去重
function UnAuth_List_Search() {

  bproto_ajax(GET_REGISTER_LIST_FILTER_INFO, { 'access_token': access_token }, function (obj_json) {
    if (obj_json.code === 0) {
      unauthTypelist = obj_json.type;
      unauthHardwareproviderlist = obj_json.hardwareprovider;
      unauthSoftwareproviderlist = obj_json.softwareprovider;
      //模板渲染
      applyUnAuthSort();
    }
  })
}

//根据已授权列表数据 检索,去重
function Auth_List_Search() {
  bproto_ajax(GET_USER_TERMINAL_LIST_FILTER_INFO, { 'access_token': access_token }, function (obj_json) {
    if (obj_json.code === 0) {
      authTypelist = obj_json.type;
      authLabellist = obj_json.userlabel;
      authHardwareproviderlist = obj_json.hardwareprovider;
      //模板渲染
      applyAuthSort();
    }
  })
}

//根据在线设备列表数据检索
function Online_List_Search() {

  bproto_ajax(GET_USER_TERMINAL_LIST_FILTER_INFO, { 'access_token': access_token }, function (obj_json) {
    if (obj_json.code === 0) {
      OnlineTypelist = obj_json.type;
      OnlineLabellist = obj_json.userlabel;
      OnlineHardwareproviderlist = obj_json.hardwareprovider;
      //模板渲染
      applyOnlineSort();
    }
  })
}


// function GetTermRename(args_json,func){
//   var temp = [];
//   for(var i=0;i<args_json.terminal_list.length;i++){
//     temp.push({
//       "target_type":"term",
// 			"target_id":args_json.terminal_list[i].SerialNumber
//     })
//   }
//   var param = {
//     'access_token':access_token,
//     'list':temp
//   }
//   bproto_ajax(GET_REMARK,param,function (obj_json) {  
//     if(obj_json.code==0){
//       if(obj_json.list.elngth===0){
//         func(obj_json);
//         return;
//       }
//       for(var i=0;i<obj_json.list.length;i++){
//         for(var j=0;j<args_json.terminal_list.length;j++){
//           if(obj_json.list[i].target_id===args_json.terminal_list[j].SerialNumber){
//             args_json.terminal_list[j].rename = obj_json.list[i].rename;
//           }
//         }
//         func(args_json);
//       }
//     }
//   })
// }


//授权过的设备获取list
function fun_get_authterm_list() {
  $("#authorized .dropdown-menu li:nth-child(1)").click();
  $("#authorized input").val("");
  param = {
    "access_token": access_token,
    'page': 0,
    'user_id': CurrentUserId,
    'page_size': currentAuthTermPageSize
  };
  bproto_ajax(GET_USER_TERMINAL_LIST, param, function (obj_json) {
    if (obj_json.code === 0) {
      currentAuthTermPage = obj_json.page;
      currentAuthTermPage_total = obj_json.page_total;
      var html = template('authorizedTemp', obj_json);
      $("#authorized .tablebox_authterm table tbody").html(html);
      Auth_List_Search();
      RenderTable_Th("#authorized");
      $(".auth_section").hide();
      $(".auth_section.section1").show();
    }
    $(".auth_section").hide();
    $(".auth_section.section1").show();
  })
}


//获取在线设备列表
function fun_get_online_terminal_list() {
  $("#onlineTerminal .dropdown-menu li:nth-child(1)").click();
  $("#onlineTerminal input").val("");
  param = {
    "access_token": access_token,
    "page": 0,
    "page_size": currentOnlineTermPageSize,
    'user_id': CurrentUserId,
  };
  bproto_ajax(GET_USER_ONLINE_TERMINAL_URL, param, function (obj_json) {
    //{"code":0,"msg":"success","page":0,"page_size":0,"page_total":0,"terminal_list":[]}
    if (obj_json.code === 0) {
      currentOnlineTermPage_total = obj_json.page_total;
      currentOnlineTermPage = obj_json.page;
      // console.log(JSON.stringify(obj_json));
      // var html = template('onlineTermsTemp', obj_json);
      // $("#onlineTerminal .tablebox_authterm table tbody").html(html);
      // Online_List_Search();

      // console.log(obj_json);
      RenderOnlineTerminalTable(obj_json);
      RenderTable_Th("#onlineTerminal");
    }
    $(".online_section").hide();
    $(".online_section.section1").show();
  })
}


//上一页
function bindPager_Previous(target_page, func) {
  if (target_page === 0) {
    toastr.info("已经是第一页了");
    return
  }
  target_page -= 1;
  func(target_page);
}

//下一页
function bindPager_Next(target_page, total_page, func) {
  if (total_page === 0 || target_page === total_page - 1) {
    toastr.info("已经是最后一页了");
    return;
  }
  target_page += 1;
  func(target_page);
}

//根据page页数获取未授权设备
function getUnAuthTerm_list(page, target) {
  if (page < 0) {
    page = 0
  }
  var sortlist = {};

  if (!$("#unauthorized .account").is(":hidden")) {
    if ($("#unauthorized #allcheck").prop("checked")) {
      $("#unauthorized #allcheck").click();
    } else {
      $("#unauthorized input[name=done]").each(function () {
        if ($(this).prop("checked")) {
          $(this).click();
        }
      })
    }
  }

  $("#unauthorized .breadcrumb li:nth-child(n+2)").each(function (i, el) {
    if ($(this).text().length > 0 && el != $("#unauthorized .Receive")[0]) {
      sortlist[$(this).attr("data-info")] = $(this).attr("data-id")
    }
  });

  var search_val = $("#unauthorized .search input").val();


  if (search_val.length > 0) {
    sortlist[$("#unauthorized .search .search-btn").attr("data-bind")] = search_val
  }

  $("input[type=checkbox]").prop("checked", false);
  param = {
    "access_token": access_token,
    'user_id': CurrentUserId,
    'page': page,
    "page_size": currentUnAuthTermPageSize,
    'filter': sortlist
  };
  bproto_ajax(GET_REGISTER_URL, param, function (obj_json) {
    if (obj_json.code === 0) {


      if (obj_json.registers.length === 0 && target === undefined) {
        toastr.info("已经是最后一页了");
        return;
      }


      currentUnAuthTermPage_total = obj_json.page_total;
      currentUnAuthTermPage = obj_json.page;
      var html = template('unauthorizedTemp', obj_json);
      $("#unauthorized table tbody").html(html);
      update_ip();
      UnAuth_List_Search();
      RenderTable_Th("#unauthorized")
    }
  })
}


//根据page页数获取已授权设备
function getAuthTerm_list(page, target) {
  if (page < 0) {
    page = 0
  }
  var sortlist = {};
  $("#authorized .breadcrumb li:nth-child(n+2)").each(function (i, el) {
    if ($(this).text().length > 0 && el != $("#authorized .Receive")[0]) {
      sortlist[$(this).attr("data-info")] = $(this).attr("data-id")
    }
  });

  if (!$("#authorized .account").is(":hidden")) {
    if ($("#authorized #allcheck").prop("checked")) {
      $("#authorized #allcheck").click();
    } else {
      $("#authorized input[name=done]").each(function () {
        if ($(this).prop("checked")) {
          $(this).click();
        }
      })
    }
  }

  var search_val = $("#authorized .search input").val();

  if (search_val.length > 0) {
    if (!isNaN(search_input)) {
      search_val = parseInt(search_val)
    }
    sortlist[$("#authorized .search .search-btn").attr("data-bind")] = search_val
  }
  param = {
    "access_token": access_token,
    'user_id': CurrentUserId,
    'page': page,
    "page_size": currentAuthTermPageSize,
    'filter': sortlist
  };
  bproto_ajax(GET_USER_TERMINAL_LIST, param, function (obj_json) {
    if (obj_json.code === 0) {
      if (obj_json.terminal_list.length === 0 && target === undefined) {
        toastr.info("已经是最后一页了");
        return;
      }
      currentAuthTermPage = obj_json.page;
      currentAuthTermPage_total = obj_json.page_total;

      var html = template('authorizedTemp', obj_json);
      $("#authorized .tablebox_authterm table tbody").html(html);
      Auth_List_Search();
      RenderTable_Th("#authorized")

    }
  })
}


//根据page页数获取在线设备
function getOnlineTerm_list(page, target) {

  GetUserMsg_CallBack(function () {
    if (page < 0) {
      page = 0
    }
    var sortlist = {};
    $("#onlineTerminal .breadcrumb li:nth-child(n+2)").each(function (i, el) {
      if ($(this).text().length > 0 && el != $("#onlineTerminal .Receive")[0]) {
        sortlist[$(this).attr("data-info")] = $(this).attr("data-id")
      }
    });

    if (!$("#onlineTerminal .account").is(":hidden")) {
      if ($("#onlineTerminal #allcheck").prop("checked")) {
        $("#onlineTerminal #allcheck").click();
      } else {
        $("#onlineTerminal input[name=done]").each(function () {
          if ($(this).prop("checked")) {
            $(this).click();
          }
        })
      }
    }
    var search_val = $("#onlineTerminal .search input").val();

    if (search_val.length > 0) {
      sortlist[$("#onlineTerminal .search .search-btn").attr("data-bind")] = search_val
    }
    param = {
      "access_token": access_token,
      'user_id': CurrentUserId,
      "page": page,
      "page_size": currentOnlineTermPageSize,
      'filter': sortlist
    };
    bproto_ajax(GET_USER_ONLINE_TERMINAL_URL, param, function (obj_json) {
      if (obj_json.code === 0) {
        // "page": 0,    "page_size": 5,    "page_total": 86
        if (obj_json.terminal_list.length === 0 && target === undefined) {
          toastr.info("已经是最后一页了");
          return;
        }
        currentOnlineTermPage = obj_json.page;
        currentOnlineTermPage_total = obj_json.page_total;
        RenderOnlineTerminalTable(obj_json);
        RenderTable_Th("#onlineTerminal")
      }
    });
  })
}


//渲染在线设备tableList
function RenderOnlineTerminalTable(list) {
  // if(list.terminal_list.length===0){
  //   return;
  // }
  // var terminal_ID_lists = list.terminal_list;

  // var param = {access_token,"terminal_id_list":terminal_ID_lists};
  // bproto_ajax(GET_TERMINAL_INFO,param,function (obj_json) {
  //   for (let i = 0; i < obj_json.terminal_list.length; i++) {
  //     obj_json.terminal_list[i]["term"] = list.terminal_list[i];
  //   }

  $(".tablebox_online table tbody").html(template('onlineTermsTemp', list));
  $(".tablebox_online").height($(window).height() - parseInt(online_account_ishide ? "" + $("#onlineTerminal .account").height() : "0") - $(".tablebox_online").offset().top - 60);
  Online_List_Search();
  // });

  // $(".tablebox_online table tbody").html(template('onlineTermsTemp', list));
  // $("#onlineTerminal .table tr td:nth-child(1),#onlineTerminal.table tr th:nth-child(1)").hide();
}

$('.search input[type=text]').bind('keyup', function (event) {
  if (event.keyCode == "13") {
    //回车执行查询
    $(this).parent().find(".search-btn").click();
  }
});


//搜索按钮逻辑
function btn_search(target) {
  var select_val = $(target).attr("data-bind");
  var search_input = $(target).parent().prev().val();
  if (!isNaN(search_input)) {
    search_input = parseInt(search_input)
  }
  if (select_val === "") {
    toastr.error('请选择搜索名称')
    return;
  } else if (search_input === "" || search_input.length === 0) {
    toastr.error("请输入搜索内容");
    return;
  }
  var filter = {};


  filter[select_val] = search_input;
  switch ($(target).attr("data-info")) {
    case "unauthorized":
      $("#unauthorized .breadcrumb li:nth-child(n+2)").each(function (i, el) {
        if ($(this).text().length > 0 && el != $("#unauthorized .Receive")[0]) {
          filter[$(this).attr("data-info")] = $(this).text()
        }
      });
      var param = {
        "access_token": access_token,
        'user_id': CurrentUserId,
        'page': 0,
        "page_size": currentUnAuthTermPageSize,
        "filter": filter
      };
      bproto_ajax(GET_REGISTER_URL, param, function (obj_json) {
        if (obj_json.code === 0) {
          currentUnAuthTermPage_total = obj_json.page_total;
          currentUnAuthTermPage = obj_json.page;
          var html = template('unauthorizedTemp', obj_json);
          $("#unauthorized table tbody").html(html);
          update_ip();
          UnAuth_List_Search();
          RenderTable_Th("#unauthorized")
        }
      });
      break;
    case "authorized":
      $("#authorized .breadcrumb li:nth-child(n+2)").each(function (i, el) {
        if ($(this).text().length > 0 && el != $("#authorized .Receive")[0]) {
          filter[$(this).attr("data-info")] = $(this).text()
        }
      });
      param = {
        "access_token": access_token,
        'user_id': CurrentUserId,
        'page': 0,
        "page_size": currentAuthTermPageSize,
        'filter': filter
      };
      bproto_ajax(GET_USER_TERMINAL_LIST, param, function (obj_json) {
        if (obj_json.code === 0) {
          currentAuthTermPage = obj_json.page;
          currentAuthTermPage_total = obj_json.page_total;

          var html = template('authorizedTemp', obj_json);
          $("#authorized .tablebox_authterm table tbody").html(html);
          Auth_List_Search();
          RenderTable_Th("#authorized")
        }
      })
      break;
    case "onlineTerminal":
      $("#onlineTerminal .breadcrumb li:nth-child(n+2)").each(function (i, el) {
        if ($(this).text().length > 0 && el != $("#onlineTerminal .Receive")[0]) {
          filter[$(this).attr("data-info")] = $(this).text()
        }
      });
      param = {
        "access_token": access_token,
        "page": 0,
        "page_size": currentOnlineTermPageSize,
        'user_id': CurrentUserId,
        'filter': filter
      };
      bproto_ajax(GET_USER_ONLINE_TERMINAL_URL, param, function (obj_json) {
        //{"code":0,"msg":"success","page":0,"page_size":0,"page_total":0,"terminal_list":[]}
        if (obj_json.code === 0) {
          currentOnlineTermPage_total = obj_json.page_total;
          currentOnlineTermPage = obj_json.page;
          // console.log(JSON.stringify(obj_json));
          // var html = template('onlineTermsTemp', obj_json);
          // $("#onlineTerminal .tablebox_authterm table tbody").html(html);
          // Online_List_Search();

          // console.log(obj_json);
          RenderOnlineTerminalTable(obj_json);
          RenderTable_Th("#onlineTerminal")
        }
      })
      break;

  }
}

//清空搜索框
function remove_input(target) {
  $(target).next().val("");
  switch ($(target).attr("data-info")) {
    case "unauthorized":
      getUnAuthTerm_list(0, "search");
      break;
    case "authorized":
      getAuthTerm_list(0, "search");
      break;
    case "onlineTerminal":
      getOnlineTerm_list(0, "search");
      break;
  }
}


//搜索框select
function SearchSelect(target) {
  $(target).parent().prev().find(".text").text($(target).text())
  $(target).parent().parent().parent().find(".search-btn").attr("data-bind", $(target).find("a").attr("data-bind"))
}


//检索收起筛选按钮
function Receive(target) {
  target.isclick = !target.isclick;
  if (target.isclick) {
    $(target).find("span.fa").removeClass("fa-angle-up").addClass("fa-angle-down");
    $(target).parent().prev().slideUp(function () {
      $(window).trigger("resize");
      $(target).find("span.tip").text("展开筛选");
    })
  } else {
    $(target).find("span.fa").removeClass("fa-angle-down").addClass("fa-angle-up");
    $(target).parent().prev().slideDown(function () {
      $(window).trigger("resize");
      $(target).find("span.tip").text("收起筛选");

    })
  }

}

//未授权页面的渲染检索功能div
function applyUnAuthSort() {
  $("#unauthorized .typesort li:nth-child(n+2)").remove();
  unauthTypelist.forEach(function (value) {
    $("#unauthorized .typesort").append("<li><a href='javascript:;' data-bind='" + value + "'>" + value + "</a></li>");
  });
  $("#unauthorized .softwaresort li:nth-child(n+2)").remove();
  unauthSoftwareproviderlist.forEach(function (value) {
    $("#unauthorized .softwaresort").append("<li><a href='javascript:;' data-bind='" + value + "'>" + value + "</a></li>");
  });
  $("#unauthorized .hardwaresort li:nth-child(n+2)").remove();
  unauthHardwareproviderlist.forEach(function (value) {
    $("#unauthorized .hardwaresort").append("<li><a href='javascript:;' data-bind='" + value + "'>" + value + "</a></li>");
  });

  $(".tablebox").height($(window).height() - parseInt(unauth_account_ishide ? "" + $("#unauthorized .account").height() : "0") - $(".tablebox").offset().top - 60);
}

//已授权页面的渲染检索功能div
function applyAuthSort() {
  $("#authorized .typesort li:nth-child(n+2)").remove();
  authTypelist.forEach(function (value) {
    $("#authorized .typesort").append("<li><a href='javascript:;'  data-bind='" + value + "'>" + value + "</a></li>");
  });
  $("#authorized .labelsort li:nth-child(n+2)").remove();

  authLabellist.forEach(function (value, i) {
    $("#authorized .labelsort").append("<li><a href='javascript:;' data-bind='" + value.id + "'>" + value.name + "</a></li>");
  });
  $("#authorized .hardwaresort li:nth-child(n+2)").remove();
  authHardwareproviderlist.forEach(function (value) {
    $("#authorized .hardwaresort").append("<li><a href='javascript:;' data-bind='" + value + "'>" + value + "</a></li>");
  });
  $(".tablebox_authterm").height($(window).height() - parseInt(auth_account_ishide ? "" + $("#authorized .account").height() : "0") - $(".tablebox_authterm").offset().top - 60);
}

//在线设备页面的渲染检索功能div
function applyOnlineSort() {
  $("#onlineTerminal .typesort li:nth-child(n+2)").remove();
  OnlineTypelist.forEach(function (value) {
    $("#onlineTerminal .typesort").append("<li><a href='javascript:;' data-bind='" + value + "'>" + value + "</a></li>");
  });
  $("#onlineTerminal .labelsort li:nth-child(n+2)").remove();
  OnlineLabellist.forEach(function (value) {
    $("#onlineTerminal .labelsort").append("<li><a href='javascript:;' data-bind='" + value.id + "'>" + value.name + "</a></li>");
  });
  $("#onlineTerminal .hardwaresort li:nth-child(n+2)").remove();
  OnlineHardwareproviderlist.forEach(function (value) {
    $("#onlineTerminal .hardwaresort").append("<li><a href='javascript:;' data-bind='" + value + "'>" + value + "</a></li>");
  });
  $(".tablebox_online").height($(window).height() - parseInt(online_account_ishide ? "" + $("#onlineTerminal .account").height() : "0") - $(".tablebox_online").offset().top - 60);
}

//
function SetSortItem(content, target, func) {
  $(content + " " + target).delegate("a", "click", function () {
    if ($(this).css("color") == "rgb(255, 0, 0)") {
      $(content + " " + target + " a").css("color", "#000");
      $(content + " .breadcrumb li[data-bind=" + $(this).parent().parent().attr('data-bind') + "]").text("").hide();
    } else {
      $(content + " " + target + " a").css("color", "#000");
      $(this).css("color", "red");
      $(content + " .breadcrumb li[data-bind=" + $(this).parent().parent().attr('data-bind') + "]").attr("data-id", $(this).attr("data-bind")).text($(this).text()).show()
    }
    func()
  });

  if (!$(content + " .breadcrumb")[0].hasClick) {
    $(content + " .breadcrumb").on('click', 'li.active', function () {
      $(this).text("").hide();
      func();
    })
    $(content + " .breadcrumb")[0].hasClick = true;
  }

}

//绑定检索item事件
function bindSortItem() {
  SetSortItem("#unauthorized", ".typesort", updateUnauthorizedSort);
  SetSortItem("#unauthorized", ".hardwaresort", updateUnauthorizedSort);
  SetSortItem("#unauthorized", ".softwaresort", updateUnauthorizedSort);


  SetSortItem("#authorized", ".typesort", updateAuthorizedSort);
  SetSortItem("#authorized", ".hardwaresort", updateAuthorizedSort);
  SetSortItem("#authorized", ".labelsort", updateAuthorizedSort);


  SetSortItem("#onlineTerminal", ".typesort", updateOnlineSort);
  SetSortItem("#onlineTerminal", ".hardwaresort", updateOnlineSort);
  SetSortItem("#onlineTerminal", ".labelsort", updateOnlineSort);


  // $("#unauthorized .typesort").delegate("a", "click", function () {
  //   if ($(this).css("color") == "rgb(255, 0, 0)") {
  //     $("#unauthorized .typesort a").css("color", "#000");
  //     $("#unauthorized .breadcrumb li[data-bind=" + $(this).parent().parent().attr('data-bind') + "]").text("").hide();
  //   } else {
  //     $("#unauthorized .typesort a").css("color", "#000");
  //     $(this).css("color", "red");
  //     $("#unauthorized .breadcrumb li[data-bind=" + $(this).parent().parent().attr('data-bind') + "]").text($(this).text()).show()
  //   }
  //   updateUnauthorizedSort()
  // });
  // $("#unauthorized .hardwaresort").delegate("a", "click", function () {
  //   if ($(this).css("color") == "rgb(255, 0, 0)") {
  //     $(this).css("color", "#000");
  //     $("#unauthorized .breadcrumb li[data-bind=" + $(this).parent().parent().attr('data-bind') + "]").text("").hide();
  //
  //   } else {
  //     $("#unauthorized .hardwaresort a").css("color", "#000");
  //
  //     $(this).css("color", "red");
  //     $("#unauthorized .breadcrumb li[data-bind=" + $(this).parent().parent().attr('data-bind') + "]").text($(this).text()).show()
  //   }
  //
  //   updateUnauthorizedSort()
  //
  // });
  // $("#unauthorized .softwaresort").delegate("a", "click", function () {
  //
  //   if ($(this).css("color") == "rgb(255, 0, 0)") {
  //     $(this).css("color", "#000");
  //     $("#unauthorized .breadcrumb li[data-bind=" + $(this).parent().parent().attr('data-bind') + "]").text("").hide();
  //     return false;
  //   } else {
  //     $("#unauthorized .softwaresort a").css("color", "#000");
  //     $(this).css("color", "red");
  //     $("#unauthorized .breadcrumb li[data-bind=" + $(this).parent().parent().attr('data-bind') + "]").text($(this).text()).show()
  //   }
  //   updateUnauthorizedSort()
  // });


}

bindSortItem();


//根据未授权检索要求重新渲染数据
function updateUnauthorizedSort() {
  var sortlist = {};
  $("#unauthorized .breadcrumb li:nth-child(n+2)").each(function (i, el) {
    if ($(this).text().length > 0 && el != $("#unauthorized .Receive")[0]) {
      sortlist[$(this).attr("data-info")] = $(this).attr("data-id")
    }
  });

  var search_val = $("#unauthorized .search input").val();

  if (search_val.length > 0) {
    sortlist[$("#unauthorized .search .search-btn").attr("data-bind")] = search_val
  }

  param = {
    "access_token": access_token,
    'user_id': CurrentUserId,
    'page': 0,
    "page_size": currentUnAuthTermPageSize,
    'filter': sortlist
  };
  bproto_ajax(GET_REGISTER_URL, param, function (obj_json) {
    if (obj_json.code === 0) {
      currentUnAuthTermPage_total = obj_json.page_total;
      currentUnAuthTermPage = obj_json.page;
      var html = template('unauthorizedTemp', obj_json);
      $("#unauthorized table tbody").html(html);
      update_ip();
      UnAuth_List_Search();
      RenderTable_Th("#unauthorized");
    }
  })

}


//根据已授权检索要求重新渲染数据
function updateAuthorizedSort() {
  var sortlist = {};
  $("#authorized .breadcrumb li:nth-child(n+2)").each(function (i, el) {
    if ($(this).text().length > 0 && el != $("#authorized .Receive")[0]) {
      sortlist[$(this).attr("data-info")] = $(this).attr("data-id")
    }
  });

  var search_val = $("#authorized .search input").val();

  if (search_val.length > 0) {
    sortlist[$("#authorized .search .search-btn").attr("data-bind")] = search_val
  }
  param = {
    "access_token": access_token,
    'user_id': CurrentUserId,
    'page': 0,
    "page_size": currentAuthTermPageSize,
    'filter': sortlist
  };
  bproto_ajax(GET_USER_TERMINAL_LIST, param, function (obj_json) {
    if (obj_json.code === 0) {
      currentAuthTermPage = obj_json.page;
      currentAuthTermPage_total = obj_json.page_total;

      var html = template('authorizedTemp', obj_json);
      $("#authorized .tablebox_authterm table tbody").html(html);
      Auth_List_Search();
      RenderTable_Th("#authorized");
    }
  })
}


//根据在线检索要求重新渲染数据
function updateOnlineSort() {
  var sortlist = {};
  $("#onlineTerminal .breadcrumb li:nth-child(n+2)").each(function (i, el) {
    if ($(this).text().length > 0 && el != $("#onlineTerminal .Receive")[0]) {
      sortlist[$(this).attr("data-info")] = $(this).attr("data-id")
    }
  });

  var search_val = $("#onlineTerminal .search input").val();

  if (search_val.length > 0) {
    sortlist[$("#onlineTerminal .search .search-btn").attr("data-bind")] = search_val
  }
  param = {
    "access_token": access_token,
    'user_id': CurrentUserId,
    'page': currentOnlineTermPage,
    "page_size": currentOnlineTermPageSize,
    'filter': sortlist
  };
  bproto_ajax(GET_USER_ONLINE_TERMINAL_URL, param, function (obj_json) {
    if (obj_json.code === 0) {
      currentOnlineTermPage = obj_json.page;
      currentOnlineTermPage_total = obj_json.page_total;
      RenderOnlineTerminalTable(obj_json);
      RenderTable_Th("#onlineTerminal");
    }
  })
}


function setCheckboxClick(target, func1, func2) {

  $(target + " .allcheck").click(function () {
    if ($(target + " .allcheck").prop("checked")) {
      $(target + " input[name=done]").each(function () {
        $(this).prop("checked", true)
      });
      func2()
      $(target + " .checkNum").text("已选" + $(target + " input[name=done]").length).css("visibility", "visible");
    } else {
      $(target + " input[name=done]").each(function () {
        $(this).prop("checked", false)
      });
      $(target + " .checkNum").text("已选0").css("visibility", "hidden");
      if (!$(target + " .account").is(":hidden")) {
        func1()
      }
    }
  });
  //单个按钮监听
  $(target + " .table tbody").delegate("input[name=done]", "click", function () {
    var isCheck = true;
    var num = 0;
    $(target + " input[name=done]").each(function () {
      if (!$(this).prop("checked")) {
        isCheck = false;
      } else {
        num += 1
      }
    });
    if (num > 0) {
      $(target + " .checkNum").text("已选" + num).css("visibility", "visible");
      if ($(target + " .account").is(":hidden")) {
        func2()
      }

    } else {
      $(target + " .checkNum").text("已选0").css("visibility", "hidden");
      if (!$(target + " .account").is(":hidden")) {
        func1()
      }
    }
    $(target + " .allcheck").prop("checked", isCheck);

  })
}

//设置checkbox按钮逻辑事件
function checkboxClick() {
  //按钮
  setCheckboxClick("#unauthorized", function () {
    unauth_account_ishide = false;
    $(".tablebox").height($(window).height() - parseInt(unauth_account_ishide ? "" + $("#unauthorized .account").height() : "0") - $(".tablebox").offset().top - 60);
    $("#unauthorized .account").slideUp(500);
  }, function () {
    unauth_account_ishide = true;
    $(".tablebox").height($(window).height() - parseInt(unauth_account_ishide ? "" + $("#unauthorized  .account").height() : "0") - $(".tablebox").offset().top - 60);
    $("#unauthorized  .account").slideDown(500, function () {
    });
  });

  setCheckboxClick("#authorized", function () {
    auth_account_ishide = false;
    $(".tablebox_authterm").height($(window).height() - parseInt(auth_account_ishide ? "" + $("#authorized .account").height() : "0") - $(".tablebox_authterm").offset().top - 60);
    $("#authorized .account").slideUp(500);
  }, function () {
    auth_account_ishide = true;
    $(".tablebox_authterm").height($(window).height() - parseInt(auth_account_ishide ? "" + $("#authorized .account").height() : "0") - $(".tablebox_authterm").offset().top - 60);
    $("#authorized .account").slideDown(500, function () {
    });
  });

  //
  setCheckboxClick("#onlineTerminal .table_content", function () {
    online_account_ishide = false;
    $(".tablebox_online").height($(window).height() - parseInt(online_account_ishide ? "" + $("#onlineTerminal .account").height() : "0") - $(".tablebox_online").offset().top - 60);
    $("#onlineTerminal .table_content .account").slideUp(500);
  }, function () {
    online_account_ishide = true;
    $(".tablebox_online").height($(window).height() - parseInt(online_account_ishide ? "" + $("#onlineTerminal .account").height() : "0") - $(".tablebox_online").offset().top - 60);
    $("#onlineTerminal .table_content .account").slideDown(500, function () {
    });
  });

}

checkboxClick();

//授权提示框里下拉列表点击逻辑
$(".cert_input .dropdown-menu").on("click", 'li a', function () {
  $("#cert_id").val($(this).find("span.certname").text());
  $("#cert_id").attr("data-bind", $(this).find("span.certid").text());
});
$(".label_input .dropdown-menu").on("click", 'li a', function () {
  $("#label_id").attr("data-bind", $(this).attr("data-bind"));
  $("#label_id").val($(this).find(".labelname").text())
});


//授权删除
function auth_delete(id) {
  // var isdel = confirm("确认删除");
  //   if(isdel===false){
  //       return
  //   }

  var templist = [];
  if (id) {
    templist.push(id);
  } else {
    $("#unauthorized input[name=done]").each(function () {
      if ($(this).prop("checked")) {
        templist.push($(this).attr("data-sessionid"))
      }
    });
  }
  GetUserMsg_CallBack(function () {

    if (window.confirm('您确定要删除吗?')) {
      var param = {
        "access_token": access_token,
        "user_id": CurrentUserId,
        "session_id_list": templist
      };
      bproto_ajax(DEL_REGISTER_INFO, param, function (obj_json) {
        if (obj_json.code === 0) {
          toastr.success("删除成功");
          $("#unauthorized .breadcrumb li.active").each(function () {
            $(this).text("").hide()
          });
          $("#allcheck").prop("checked", false);
          $(".checkNum").text("已选0").css("visibility", "hidden");
          fun_get_register_list();
        } else {
          toastr.error(obj_json.msg);
        }
      })
    }
  })
}


//绑定授权按钮
function auth_show(id, code, _type) {
  templist = [];
  certidlist = [];
  labelidlist = [];
  var type = "";

  if (id) {
    type = _type;
    console.log(type)
    templist.push({
      "session_id": id,
      "auth_code": parseInt(code)
    })
  } else {
    var target = true;
    type = $("#unauthorized input[name=done]").filter(":checked").eq(0).attr("data-type");
    $("#unauthorized input[name=done]").each(function () {
      if ($(this).prop("checked")) {
        if (type !== $(this).attr("data-type")) {
          target = false;
          return;
        }
        templist.push({
          "session_id": $(this).attr("data-sessionid"),
          "auth_code": parseInt($(this).attr("data-code"))
        })
      }
    });
    if (!target) {
      toastr.warning("暂不支持不同类型设备同时授权，请选择同类型设备");
      return;
    }
  }


  // console.log(allTerms);
  //获取用户证书填充下拉数据
  var param = {
    "access_token": access_token,
    "username": CurrentUser,
    "page": 0,
    "page_size": 20
  };

  bproto_ajax(GET_USERCERTS_URL, param, function (obj_json) {
    if (obj_json.code === 0) {
      for (let i = 0; i < obj_json.certs.length; i++) {
        if (obj_json.certs[i].IssueTermType == type) {
          certidlist.push({
            "id": obj_json.certs[i].SerialNumber,
            "Times": parseInt(obj_json.certs[i].MaxIssueTimes - obj_json.certs[i].IssueTimes),
            "Type": obj_json.certs[i].IssueTermType ? obj_json.certs[i].IssueTermType : "未知",
            "remark": obj_json.certs[i].remark
          });
        }
      }

      if (certidlist.length == 0) {
        toastr.warning("无" + type + "类型证书");
        $("#AuthModal").modal("hide");
        return;
      }

      // var list = [];
      // for (let i = 0; i < certidlist.length; i++) {
      //   list.push({
      //     "target_type": "cert",
      //     "target_id": certidlist[i].id, 
      //   })
      // }
      // bproto_ajax(GET_REMARK,{'access_token':access_token,'list':list},function(obj_json){
      //   if(obj_json.code==0){
      //     for(var i=0;i<obj_json.list.length;i++){
      //       for(var j=0;j<certidlist.length;j++){
      //         if(obj_json.list[i].target_id==certidlist[j].id){
      //           certidlist[j].rename = obj_json.list[i].rename
      //         }
      //       }
      //     }
      certid_html = "";
      for (let i = 0; i < certidlist.length; i++) {
        certid_html += "<li><a style='display: inline-block' href='javascript:;'>\
              <span style='text-align:center;display:inline-block' >(备注名:"+ (certidlist[i].remark == undefined ? '无' : certidlist[i].remark) + ")</span>\
              <span class='certid' style=''>"+ certidlist[i].id + "</span>\
              <span class='certname' style='display:none'>"+ (certidlist[i].remark == "" ? certidlist[i].id : certidlist[i].remark) + "</span>\
              <span style='padding-right: 20px'>(剩余次数:" + certidlist[i].Times + ")</span>\
            </a></li>"
      }
      $(".cert_input .dropdown-menu").html(certid_html);
      $(".cert_input .dropdown-menu a").eq(0).click()
      // }
      // })
    }
  });
  //获取用户标签填充下拉数据
  bproto_ajax(USER_LABEL_GET, param, function (obj_json) {
    if (obj_json.code === 0) {
      for (let i = 0; i < obj_json.userlabel.length; i++) {
        labelidlist.push({ "label_id": obj_json.userlabel[i].label_id, "label_name": obj_json.userlabel[i].label_name })
      }
      labelid_html = "";
      for (let i = 0; i < labelidlist.length; i++) {
        labelid_html += "<li><a data-bind='" + labelidlist[i].label_id + "' title='" + labelidlist[i].label_id + "' href='javascript:;'>\
        (标签名:" + (labelidlist[i].label_name === "" ? "无" : labelidlist[i].label_name) + ")" + labelidlist[i].label_id + "\
        <span class='labelname' style='display:none'>"+ (labelidlist[i].label_name == "" ? labelidlist[i].label_id : labelidlist[i].label_name) + "</span>\
        </a></li>"
      }
      $(".label_input .dropdown-menu").html(labelid_html);
      $(".label_input .dropdown-menu a").eq(0).click()
    }
  });


  // $("#unauthorized input[name=done]").each(function () {
  //   if ($(this).prop("checked")) {
  //     templist.push({
  //       "session_id":$(this).attr("data-sessionid"),
  //       "auth_code":parseInt($(this).attr("data-code"))
  //     })
  //   }
  // });
  if (templist.length > 0) {
    // if (CurrentUser === "admin") {
    //   $("#AuthModal").modal("show");
    //   $("#AuthModal .auth_modal").hide();
    //   $("#AuthModal #AuthCertLabel").text("管理员授权");
    //   $("#AuthModal .adminAuth").show();
    // } else {
    //   $("#AuthModal").modal("show");
    //   $("#AuthModal .auth_modal").hide();
    //   $("#AuthModal #AuthCertLabel").text(CurrentUser + "授权");
    //   $("#AuthModal .otherAuth").show();
    // }
    $("#AuthModal").modal("show");
    $("#AuthModal .auth_modal").hide();
    $("#AuthModal #AuthCertLabel").text(CurrentUser + "授权");
    $("#AuthModal .otherAuth").show();
  } else {
    toastr.warning("请选择授权设备");
    return false;
  }

}

//弹窗的授权逻辑
function auth_btn() {

  // if (CurrentUser === "admin") {
  //   var duration = 0;
  //   //获取期限时间
  //   duration += parseInt($("#year").val() ? $("#year").val() * 365 : 0);
  //   duration += parseInt($("#day").val() ? $("#day").val() : 1);
  //   admin_Authorize(templist, duration, function (data) {
  //     if (data.code === 0) {
  //       alert("授权成功");
  //       $("#allcheck").prop("checked", false);
  //       $(".checkNum").text("已选0").css("visibility", "hidden");
  //     } else {
  //       alert("请稍后重试");
  //     }
  //     fun_get_register_list();
  //     $("#AuthModal").modal("hide");
  //   });
  // } else {
  if ($("#cert_id").val() === "") {
    toastr.warning("请输入证书编号");
    return;
  } else if ($("#label_id").val() === "") {
    toastr.warning("请输入认证标签编号");
    return;
  }
  other_Authorize(templist, { "cert_id": $("#cert_id").attr("data-bind"), "label_id": $("#label_id").attr("data-bind") }, function (obj_json) {
    var code = obj_json.code;
    if (code === 0) {
      toastr.success("授权成功");
      $("#unauthorized .breadcrumb li.active").each(function () {
        $(this).text("").hide()
      });
      $("#allcheck").prop("checked", false);
      $(".checkNum").text("已选0").css("visibility", "hidden");
      fun_get_register_list();
      $("#AuthModal").modal("hide");
    } else {
      toastr.error(obj_json.msg);
    }
  });


}

//Admin授权逻辑ajax
// function admin_Authorize(data, duration, func) {
//   var registers = [];
//   for (let i = 0; i < data.length; i++) {
//     registers.push({'sessionid': data[i], 'duration': duration})
//   }
//   param = {
//     'access_token': access_token,
//     'registers': registers
//   };
//   bproto_ajax(AUTHORIZE_URL, param, function (obj_json) {
//     if (obj_json.code === 0) {
//       func(obj_json);
//     }
//   })
// }

function other_Authorize(data, obj, func) {
  var registers = [];
  for (let i = 0; i < data.length; i++) {
    registers.push(data[i]);
  }
  param = {
    'access_token': access_token,
    'cert_id': obj.cert_id,
    'user_label_id': obj.label_id,
    'registers': registers
  };
  bproto_ajax(AUTHORIZE_BY_CERT_URL, param, function (obj_json) {
    func(obj_json);
  })
}

//
function Terminal_show() {
  $(".terminal").fadeIn(150, function () {
    $(".terminal .body").html('<p><span class="terminal_Prefix"></span><input type="text"></p>')
    $(".terminal_Prefix").text("[" + current_cb_data.data[0].term.slice(0, 20) + "...]")
    $(".terminal_Prefix").attr('title', current_cb_data.data[0].term);
    $(".terminal input").focus();
  });
}

//终端输入命令逻辑
$(".terminal").on('keydown', 'input', function (e) {
  if (e.keyCode === 13) {
    if ($(this).val() === "") {
      $(".terminal .body").append('<p><span class="terminal_Prefix">' + $(".terminal_Prefix:eq(0)").text() + '</span><input type="text"></p>');

      $(".terminal .body input").each(function (i) {
        if (i === $(".terminal .body input").length - 1) {
          $(this).focus();
          return;
        }
        $(this).attr("disabled", true);
      });
      return;
    }

    let term = current_cb_data.data[0].term;
    let param = {
      'access_token': access_token,
      "term": term,
      "seq": current_cb_data.data[0].seq,
      "cmd": JSON.stringify({ "method": "command", "data": $(this).val() })
    };

    bproto_ajax(SEND_SERVER_CMD, param, function (obj_json) {
      if (obj_json.code === 0) {
        var trytimes = 0;
        var id = setInterval(function () {
          if (trytimes > 5) {
            clearInterval(id)
          }
          AjaxPost(GET_SERVER_CMD_RESPONSE, { 'access_token': access_token, 'query': [{ "term": current_cb_data.data[0].term, 'seq': -1 }] }).then(function (obj_json) {
            if (obj_json.code === -4) {
              trytimes += 1;
              return;
            }
            let data = '';
            for (let i = 0; i < obj_json.response.length; i++) {
              data += "<p>" + obj_json.response[i].response + "</p>";
            }
            $(".terminal .body").append(data +
              '<p><span class="terminal_Prefix">' + $(".terminal_Prefix:eq(0)").text() + '</span><input type="text"></p>');
            $(".terminal .body input").each(function (i) {
              if (i === $(".terminal .body input").length - 1) {
                $(this).focus();
                return;
              }
              $(this).attr("disabled", true);
            });

            clearInterval(id);
          })
        }, 2000)

      }
    })
  }
})


//发送信息按钮2
function exec_show(id) {
  var ischeck = false;
  var target = 0;
  current_cb_data = { "cmd": "", "data": [] };

  
  if(id){
    current_cb_data["data"].push({ "seq": Math.floor(Math.random() * 10000), "term": id });
    Terminal_show();
    return;
  }else{
    $("#onlineTerminal .table_content input[name=done]").each(function () {
      if ($(this).prop("checked")) {
        ischeck = true;
        target += 1;
        current_cb_data["data"].push({ "seq": Math.floor(Math.random() * 10000), "term": $(this).attr("data-bind") });
      }
    });
  
    if (target === 1) {
      Terminal_show();
      return;
    }

    if (!ischeck) {
      toastr.warning("请选择一台设备");
      return;
    }
    $("#onlineTerminal .online_content").hide();
    $("#onlineTerminal .exec_content").show();
  
    var html = template('onlineTermsExecTemp', current_cb_data);
    $("#onlineTerminal .exec_content table tbody").html(html);
  }


  
}

//渲染在线多设备发送命令table
function SendExecMsg(msg) {
  var isover = 0;
  var id = 0;
  if (msg === "") {
    if (!$(".input_msg").val()) {
      toastr.warning("请输入发送信息内容");
      return;
    }
    msg = $(".input_msg").val();
  }
  $(".sendmsg").html(msg);

  $(".callmsg").html('<span class="fa fa-refresh fa-spin"></span>\
  <textarea class="getmsg form-control" style="display:none;resize: none;cursor: text;" disabled="" rows="2"></textarea>')
  $(".sendstatus").html('<span class="fa fa-refresh fa-spin"></span>');


  for (let i = 0; i < current_cb_data.data.length; i++) {

    let param = {
      'access_token': access_token,
      "term": current_cb_data.data[i].term,
      "seq": current_cb_data.data[i].seq,
      "cmd": JSON.stringify({ "method": "command", "data": msg })
    };
    // cb_data.data[i].seq = -1;
    let term = current_cb_data.data[i].term;
    bproto_ajax(SEND_SERVER_CMD, param, function (obj_json) {
      if (obj_json.code === 0) {
        $("#onlineTerminal .exec_content tr[data-bind=" + term + "] .sendstatus").html("<span class='fa fa-check-square'></span>")
      }
      isover += 1;
    })
  }
  id = setInterval(function () {
    if (isover === current_cb_data.data.length) {
      // console.log(isover);
      clearInterval(id);
      Retrygetcmd_response(current_cb_data.data);
    }
  }, 2000);
}

function Retrygetcmd_response(data) {
  let tempdata = JSON.parse(JSON.stringify(data));
  for (let i = 0; i < tempdata.length; i++) {
    tempdata[i].seq = -1;
  }
  let param = {
    'access_token': access_token,
    "query": tempdata
  };

  var trytimes = 0;
  var id = setInterval(function () {
    if (trytimes > 5) {
      clearInterval(id)
    }
    bproto_ajax(GET_SERVER_CMD_RESPONSE, param, function (obj_json) {
      let callmsg = [];
      if (obj_json.code === 0) {
        if (obj_json.response.length > 0 && obj_json.response[0].response) {
          callmsg = obj_json.response;
          for (let i = 0; i < callmsg.length; i++) {
            for (let j = 0; j < data.length; j++) {
              if (callmsg[i].seq === data[j].seq) {
                // $(".callmsg .fa").remove()
                console.log(callmsg[i])
                $("#onlineTerminal .exec_content tr[data-bind=" + callmsg[i].term + "] .callmsg span").remove()
                $("#onlineTerminal .exec_content tr[data-bind=" + callmsg[i].term + "] .callmsg .getmsg").show().append(callmsg[i].response);
              }
            }
          }
          clearInterval(id)
        } else {

        }
      } else if (obj_json.code === -4) {
        trytimes += 1;
      }
    })
  }, 1000)



}


function getcmd_response(term) {

  let param = {
    'access_token': access_token,
    "query": [{ "term": term, "seq": -1 }]
  };
  bproto_ajax(GET_SERVER_CMD_RESPONSE, param, function (obj_json) {
    let callmsg = "";
    if (obj_json.code === 0) {
      if (obj_json.response.length > 0) {
        callmsg = obj_json.response[0].response;
        $("#onlineTerminal .exec_content tr[data-bind=" + term + "] .callmsg").html(callmsg);
      } else {
        $("#onlineTerminal .exec_content tr[data-bind=" + term + "] .callmsg").html("无数据");
      }
    }
  });

}


//select选择每页的显示多少条
$(".pageSelect").change(function () {
  window[$(this).attr("name")] = parseInt($(this).find("option:selected").val());
  window[$(this).attr("data-bind")]();
});


function Back(target1, target2) {
  $(target1).hide();
  $(target2).show();
}


//获取字段验证列表
function fun_get_module_fields_list() {
  param = { 'access_token': access_token };
  bproto_ajax(GET_MODULE_FIELDS, param, function (obj_json) {
    RenderModule_fields(obj_json);
  })
}

//渲染字段验证列表
function RenderModule_fields(list) {


  Module_fields_Name2Chinese(list);

  var templist = [];
  Module_FiledLists = {};
  for (let i = 0; i < list.module_fields.length; i++) {
    templist.push(list.module_fields[i].ModuleNumber);
    if (Module_FiledLists[list.module_fields[i].ModuleNumber]) {
      Module_FiledLists[list.module_fields[i].ModuleNumber].push(list.module_fields[i].FieldName);
    } else {
      Module_FiledLists[list.module_fields[i].ModuleNumber] = [list.module_fields[i].FieldName];
    }
  }
  templist = templist.unique();
  $(".tablebox_TerminalVerify table tbody").html(template('TerminalVerifyTemp', { "list": templist }));
}


//显示一级添加字段提示框
function showAddModuleField_modal() {
  $("#ModuleFieldManage_Modal").modal("show");
  $("#ModuleFieldManage_Modal .modal-content").hide();
  $(".addModuleField_content").show();
  $(".addModuleField_content .beizhu").show();
  $(".addModuleField_content .beizhu #textarea_ModuleNumber").val("");

  param = { 'access_token': access_token };
  bproto_ajax(GET_MODULE_FIELD_NAME, param, function (obj_json) {
    if (obj_json.code === 0) {
      RenderModule_fields_Name(obj_json)
    }
  })
}


//删除验证型号
function RemoveModuleField() {

  var isCheck = false;
  $("input[name=cb_termlist]").each(function () {
    if ($(this).prop("checked")) {
      isCheck = true;
    }
  });

  if (!isCheck) {
    toastr.warning("请选择一条验证项");
    return;
  }

  var isdel = confirm("确认删除选中的验证项?");
  if (isdel === false) {
    return
  }

  var del_list = [];
  $("input[name=cb_termlist]:checked").each(function (i, el) {
    del_list.push({
      "module": $(el).attr("data-bind"),
      'field': $(el).parent().parent().find(".field").attr("data-bind")
    })
  })
  var param = {
    'access_token': access_token,
    'del_list': del_list
  };
  bproto_ajax(DEL_MODULE_FIELD, param, function (obj_code) {
    if (obj_code.code === 0) {
      toastr.success("删除成功");
      param = { 'access_token': access_token };
      bproto_ajax(GET_MODULE_FIELDS, param, function (obj_json) {
        RenderModule_fields(obj_json);
        showListModuleField_modal($("input[name=cb_termlist]:checked").attr("data-bind"));
      });
    } else {
      toastr.error("删除失败" + obj_json.msg);
    }
  })
}

//一级添加验证字段
function AddModuleField() {
  var isCheck = false;
  var fields = [];


  $("input[name=radioFieldName]").each(function () {
    if ($(this).prop("checked")) {
      isCheck = true;
      fields.push($(this).val());
    }
  });
  if (!isCheck) {
    toastr.warning("请选择型号字段");
    return;
  }

  if ($("#textarea_ModuleNumber").val().length === 0) {
    toastr.warning("请输入备注信息");
    return;
  }

  param = {
    'access_token': access_token,
    'module': $("#textarea_ModuleNumber").val(),
    'fields': fields,
    'verify': true
  };
  bproto_ajax(ADD_MODULE_FIELD, param, function (obj_json) {
    if (obj_json.code === 0) {
      toastr.success("添加成功");
      $("#textarea_ModuleNumber").val("");
    } else {
      toastr.error("添加失败" + obj_json.msg);
    }
    fun_get_module_fields_list();
    closeModal("#ModuleFieldManage_Modal");
  })
}


//渲染一级添加字段验证列表
function RenderModule_fields_Name(list) {
  Module_fields_Name2Chinese(list);
  $("#ModuleFieldManage_Modal .selectFieldName").html(template('ModuleFieldNameTemp', list));
}


//渲染型号对应字段验证Modal
function RenderModule_fields_Modal(list, data) {
  $("#ModuleFieldManage_Modal .tablebox_TerminalVerify_Field tbody").html(template('TerminalVerify_FieldTemp', {
    "module_fields": list,
    "module": data
  }));
}


//展示
function showListModuleField_modal(data) {
  $("#ModuleFieldManage_Modal .modal-content").hide();
  $("#ModuleFieldManage_Modal").modal("show");
  $("#ModuleFieldManage_Modal .showModuleField_content").show();


  var list = Module_FiledLists[data];
  $("#addVerify").attr("onclick", "showAddField_modal('" + data + "')");
  RenderModule_fields_Modal(list, data)
}

//开启
function showAddField_modal(data) {
  $("#ModuleFieldManage_Modal .modal-content").hide();
  $("#ModuleFieldManage_Modal .addField_content").show();
  $(".addField_content .beizhu").hide();
  $(".addField_content .beizhu #textarea_ModuleNumber").val(data);

  param = { 'access_token': access_token };
  bproto_ajax(GET_MODULE_FIELD_NAME, param, function (obj_json) {
    if (obj_json.code === 0) {
      RenderModule_fields_Name(obj_json)

      var list = Module_FiledLists[data];
      for (let i = 0; i < list.length; i++) {
        if ($("input[value='" + list[i].split("|")[0] + "']").length > 0) {
          $("input[value='" + list[i].split("|")[0] + "']").attr("checked", true).prop("disabled", true);
        }
      }
    }
  });
}

function DelListModuleFields(value) {
  var isdel = confirm("确认删除,将全部删除验证项?");
  if (isdel === false) {
    return
  };
  var param = {
    'access_token': access_token,
    'del_list': [{ "module": value, "field": "*" }]
  };
  bproto_ajax(DEL_MODULE_FIELD, param, function (obj_code) {
    if (obj_code.code === 0) {
      toastr.success("删除成功");
    } else {
      toastr.error("删除失败" + obj_json.msg);
    }
    fun_get_module_fields_list();
  })
}

//型号字段CheckBox逻辑
function SetModuleFieldsCheckbox() {
  $("#TerminalVerify_all_cb").click(function () {
    $("input[name=cb_termlist]").prop("checked", $(this).prop("checked"));
  })

  $(".tablebox_TerminalVerify_Field").on("click", "input[name=cb_termlist]", function () {
    if (!$(this).prop("checked")) {
      $("#TerminalVerify_all_cb").prop("checked", false);
      return;
    }
    var target = true;
    $("input[name=cb_termlist]").each(function (i, el) {
      if (!$(el).prop("checked")) {
        target = false;
      }
    })
    $("#TerminalVerify_all_cb").prop("checked", target);

  })
}
SetModuleFieldsCheckbox();

//处理table中Th 合并
function RenderTable_Th(target) {
  return;
  $(target + " th").each(function (i, ele) {
    $(this).attr("title", "双击展开列表")
    if (i > 4) {
      if ($(ele).hasClass("isZoom")) {
        // el.each(function(){$(this).attr("title",$(this).text())})
        // $(this)[0].dbclick = true;
        return;
      }
      let el = $(this).parent().parent().parent().find("td:nth-child(" + (i + 1) + ")");
      el.addClass("table_td").css("maxWidth", $(this).text().length * 15)
      // el.each(function(){$(this).attr("title",$(this).text())})
      $(this)[0].dbclick = true;
    }
  })
}


//将数组中英文翻译
function Module_fields_Name2Chinese(list) {

  if (list.module_fields) {
    for (let i = 0; i < list.module_fields.length; i++) {
      switch (list.module_fields[i].FieldName.toString()) {
        case "CLI_ID":
          list.module_fields[i].FieldName = list.module_fields[i].FieldName + "|设备ID";
          break;
        case "HardwareProvider":
          list.module_fields[i].FieldName = list.module_fields[i].FieldName + "|硬件供应商";
          break;
        case "HardwareSN":
          list.module_fields[i].FieldName = list.module_fields[i].FieldName + "|硬件SN码";
          break;
        case "SoftwareProvider":
          list.module_fields[i].FieldName = list.module_fields[i].FieldName + "|软件供应商";
          break;
        case "OSID":
          list.module_fields[i].FieldName = list.module_fields[i].FieldName + "|系统ID";
          break;
        case "OSType":
          list.module_fields[i].FieldName = list.module_fields[i].FieldName + "|系统类型";
          break;
        case "Type":
          list.module_fields[i].FieldName = list.module_fields[i].FieldName + "|类型";
          break;
        case "DeviceModuleNumber":
          list.module_fields[i].FieldName = list.module_fields[i].FieldName + "|设备型号";
          break;
        default:
          list.module_fields[i].FieldName = list.module_fields[i].FieldName + "|" + list.module_fields[i].FieldName;
      }
    }

  } else {
    for (let i = 0; i < list.fields.length; i++) {
      switch (list.fields[i].toString()) {
        case "CLI_ID":
          list.fields[i] = list.fields[i] + "|设备ID";
          break;
        case "HardwareProvider":
          list.fields[i] = list.fields[i] + "|硬件供应商";
          break;
        case "HardwareSN":
          list.fields[i] = list.fields[i] + "|硬件SN码";
          break;
        case "SoftwareProvider":
          list.fields[i] = list.fields[i] + "|软件供应商";
          break;
        case "OSID":
          list.fields[i] = list.fields[i] + "|系统ID";
          break;
        case "OSType":
          list.fields[i] = list.fields[i] + "|系统类型";
          break;
        case "Type":
          list.fields[i] = list.fields[i] + "|类型";
          break;
        case "DeviceModuleNumber":
          list.fields[i] = list.fields[i] + "|设备型号";
          break;
        default:
          list.fields[i] = list.fields[i] + "|" + list.fields[i];
      }
    }
  }

}


//暂停授权
function StopAuthTerm(id) {
  var isdel = confirm("确认停用授权?");
  if (isdel === false) {
    return
  }

  var isCheck = false;
  var term_list = [];
  if (id) {
    isCheck = true;
    term_list.push(id);
  } else {

    $("#authorized  input[name=done]").each(function () {
      if ($(this).prop("checked")) {
        isCheck = true;
        term_list.push($(this).attr("data-bind"))
      }
    });
  }

  if (!isCheck) {
    toastr.warning("请选择终端");
    return;
  }

  var param = {
    "access_token": access_token,
    "user_id": CurrentUserId,
    "term_list": term_list
  }
  bproto_ajax(PAUSE_TERM_AUTHORITY, param, function (obj_json) {
    if (obj_json.code === 0) {
      toastr.success("停用授权成功");
      fun_get_authterm_list();
    } else {
      toastr.error(obj_json.msg);
    }
  });

}
//恢复授权
function ResumeAuthTerm(id) {

  var isdel = confirm("确认恢复授权?");
  if (isdel === false) {
    return
  }

  var isCheck = false;
  var term_list = [];
  if (id) {
    isCheck = true;
    term_list.push(id);
  } else {

    $("#authorized  input[name=done]").each(function () {
      if ($(this).prop("checked")) {
        isCheck = true;
        term_list.push($(this).attr("data-bind"))
      }
    });
  }


  if (!isCheck) {
    toastr.warning("请选择终端");
    return;
  }

  var param = {
    "access_token": access_token,
    "user_id": CurrentUserId,
    "term_list": term_list
  }
  bproto_ajax(RESUME_TERM_AUTHORITY, param, function (obj_json) {
    if (obj_json.code === 0) {
      toastr.success("恢复授权成功");
      fun_get_authterm_list();
    } else {
      toastr.error(obj_json.msg);
    }
  });
}

function showTermRemark(target) {
  // var templist = [];
  // $("#authorized input[name=done]").each(function (i,el) {  
  //   if($(el).prop("checked")){
  //     templist.push(el);
  //   }
  // })
  // if(templist.length>1){
  //   toastr.info("不支持批量修改备注，默认修改选择的第一个设备");
  // }
  // var el = templist[0];
  $(target).parent().parent().find(".source").hide().end().find(".edit").show();

}
function updateTermRemark(target, id) {
  var val = $(target).parent().parent().find(".edit input").val();

  var param = {
    'access_token': access_token,
    "update_list": [{
      "target_type": "term",
      "target_id": id,
      "rename": val
    }]
  }

  bproto_ajax("/api/v1/update_remark/", param, function (obj_json) {
    if (obj_json.code == 0) {
      toastr.success("修改备注成功");
      getAuthTerm_list(currentAuthTermPage);
    } else {
      toastr.error("修改备注失败" + obj_json.msg);
      CancelTermRemark(target);
    }
  })
}

function CancelTermRemark(target) {
  $(target).parent().parent().find(".edit input").val($(target).parent().parent().find(".edit input").attr("data-bind"));
  $(target).parent().parent().find(".source").show().end().find(".edit").hide();
}
//表格分段
function unauth_NextSection(target) {
  $(".unauth_section").hide()
  $(".unauth_section.section" + target).show()
}

//表格分段
function auth_NextSection(target) {
  $(".auth_section").hide()
  $(".auth_section.section" + target).show()
}
//表格分段
function online_NextSection(target) {
  $(".online_section").hide()
  $(".online_section.section" + target).show()
}


function closeModal(target) {
  $(target).modal("hide");
}

function closeTerminal() {
  $(".terminal").fadeOut(150);
}

$(".modal").click(function (e) {
  if (e.target == $("#AuthModal")[0]) {
    closeModal("#AuthModal");
  } else if (e.target == $("#ModuleFieldManage_Modal")[0]) {
    if (!$(".addField_content").is(":hidden")) {
      Back('#ModuleFieldManage_Modal .modal-content', '.showModuleField_content')
      return;
    }
    closeModal("#ModuleFieldManage_Modal");
  }
});
