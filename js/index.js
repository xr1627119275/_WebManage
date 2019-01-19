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
currentOnlineTermPageSize = 20; // 初始化在线设备每页获取数据


currentUnAuthTermPage_total = 0;//初始化未授权设备总页数
currentUnAuthTermPage = 0; //初始化未授权设备当前页数
currentUnAuthTermPageSize = 10; // 初始化未授权设备每页获取数据

currentAuthTermPage_total = 0;//初始化授权设备总页数
currentAuthTermPage = 0; //初始化授权设备当前页数
currentAuthTermPageSize = 10; // 初始化授权设备每页获取数据


Module_FiledLists = {};//分类验证字段

cacheIp = [];//缓存IP地址

unauth_account_ishide = false;
online_account_ishide = false;


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


//动态设置table高度
$(window).resize(function () {
  // $(".tablebox").height($(window).height() - $(".account").height() - $(".tablebox").offset().top-60);
  $(".tablebox").height($(window).height() - parseInt(unauth_account_ishide?""+$("#unauthorized .account").height():"0") - $(".tablebox").offset().top-60);
  $(".tablebox_authterm").height($(window).height() - $(".Auth_pager").height() - $(".tablebox_authterm").offset().top-60);
  $(".tablebox_online").height($(window).height() - parseInt(online_account_ishide?""+$("#onlineTerminal .account").height():"0") - $(".tablebox_online").offset().top-60);
  // console.log("change")
}).trigger("resize");

switch (location.hash) {
  case "#unauthorizedPage":
    changeContent($("a[data-bind=#unauthorized]")[0]);
    $(".tablebox").height($(window).height() - parseInt(unauth_account_ishide?""+$("#unauthorized .account").height():"0") - $(".tablebox").offset().top-60);
    break;
  case "#authorizedPage":
    changeContent($("a[data-bind=#authorized]")[0]);
    $(".tablebox_authterm").height($(window).height() - $(".Auth_pager").height() - $(".tablebox_authterm").offset().top-60);
    break;
  case "#onlineTerminalPage":
    changeContent($("a[data-bind=#onlineTerminal]")[0]);
    $(".tablebox_online").height($(window).height() - parseInt(online_account_ishide?""+$("#onlineTerminal .account").height():"0") - $(".tablebox_online").offset().top-60);
    break;
  case "#TerminalVerifyPage":
    changeContent($("a[data-bind=#TerminalVerify]")[0]);
    break;
  default:
    location.href = "#unauthorizedPage";
    changeContent($("a[data-bind=#unauthorized]")[0]);
    $(".tablebox").height($(window).height() - parseInt(unauth_account_ishide?""+$("#unauthorized .account").height():"0") - $(".tablebox").offset().top-60);

}

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


// 退出
function fun_api_logout() {
  param = {'access_token': access_token};
  bproto_ajax(LOGOUT_URL, param, function (obj_json) {
    $.removeCookie("access_token", {path: '/'});
    access_token = '';
    location.href = "/";
    console.log(obj_json)
  }, function () {
    $.removeCookie("access_token", {path: '/'});
    access_token = '';
    location.href = "/";
    console.log(obj_json)
  })
}

//切换导航
function changeContent(target) {
  var targetId = $(target).attr("data-bind");
  $(".content").hide();
  // $(".right a").removeClass("active");
  // $(target).addClass("active");
  $(targetId).show();
  $(".shouquan").hide();
  if ($(target)[0] == $("a[data-bind=#unauthorized]")[0]) {
    fun_get_register_list();
  } else if ($(target)[0] == $("a[data-bind=#onlineTerminal]")[0]) {
    GetUserMsg_CallBack(fun_get_online_terminal_list);
  } else if ($(target)[0] == $("a[data-bind=#TerminalVerify]")[0]) {
    fun_get_module_fields_list();
  } else if($(target)[0] == $("a[data-bind=#authorized]")[0]){
    GetUserMsg_CallBack(fun_get_authterm_list);
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
  unauth_account_ishide = false;
  $("#unauthorized .account").hide();
  $("input[type=checkbox]").prop("checked", false);
  param = {
    "access_token":access_token,
    'page':currentUnAuthTermPage,
    "page_size":currentUnAuthTermPageSize
  };
  bproto_ajax(GET_REGISTER_URL, param, function (obj_json) {
    if (obj_json.code === 0) {
      currentUnAuthTermPage_total = obj_json.page_total;
      currentUnAuthTermPage = obj_json.page;
      var html = template('unauthorizedTemp', obj_json);
      $("#unauthorized table tbody").html(html);
      update_ip();
      UnAuth_List_Search();
    }
  })
}

function update_ip() {
  $(".iphost").each(function () {
    let that = this;
    var ip = $(that).html();
    if ((JSON.stringify(cacheIp).indexOf(ip)) != -1) {
      for (let i = 0; i < cacheIp.length; i++) {
        if (cacheIp[i].ip === ip) {
          $(this).html(cacheIp[i].address);
        }
      }
    } else {
      IP2address(ip, function (json) {
        let temp = {};
        temp.ip = $(that).html();
        $(that).html(json.data[0].location);
        temp.address = json.data[0].location;
        cacheIp.push(temp);
      });
    }
  });
}

//根据未授权列表数据 检索,去重
function UnAuth_List_Search() {
  // unauthorizedlist = lists;
  // unauthTypelist = [];            //清空数据
  // unauthHardwareproviderlist = [];//清空数据
  // unauthSoftwareproviderlist = [];//清空数据
  // for (let i = 0; i < unauthorizedlist.length; i++) {
  //   unauthTypelist.push(unauthorizedlist[i].randcode);
  //   unauthHardwareproviderlist.push(unauthorizedlist[i].hardwareprovider);
  //   unauthSoftwareproviderlist.push(unauthorizedlist[i].softwareprovider);
  // }
  // //去重
  // unauthTypelist = unauthTypelist.unique();
  // unauthHardwareproviderlist = unauthHardwareproviderlist.unique();
  // unauthSoftwareproviderlist = unauthSoftwareproviderlist.unique();

  bproto_ajax(GET_REGISTER_LIST_FILTER_INFO,{},function (obj_json) {
    if(obj_json.code===0){
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
  // unauthorizedlist = lists;
  // unauthTypelist = [];            //清空数据
  // unauthHardwareproviderlist = [];//清空数据
  // unauthSoftwareproviderlist = [];//清空数据
  // for (let i = 0; i < unauthorizedlist.length; i++) {
  //   unauthTypelist.push(unauthorizedlist[i].randcode);
  //   unauthHardwareproviderlist.push(unauthorizedlist[i].hardwareprovider);
  //   unauthSoftwareproviderlist.push(unauthorizedlist[i].softwareprovider);
  // }
  // //去重
  // unauthTypelist = unauthTypelist.unique();
  // unauthHardwareproviderlist = unauthHardwareproviderlist.unique();
  // unauthSoftwareproviderlist = unauthSoftwareproviderlist.unique();

  bproto_ajax(GET_USER_TERMINAL_LIST_FILTER_INFO,{},function (obj_json) {
    if(obj_json.code===0){
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

  bproto_ajax(GET_USER_TERMINAL_LIST_FILTER_INFO,{},function (obj_json) {
    if(obj_json.code===0){
      OnlineTypelist = obj_json.type;
      OnlineLabellist = obj_json.userlabel;
      OnlineHardwareproviderlist = obj_json.hardwareprovider;
      //模板渲染
      applyOnlineSort();
    }
  })
}


//授权过的设备获取list
function fun_get_authterm_list(){

  param = {
    "access_token":access_token,
    'page':currentAuthTermPage,
    'user_id':CurrentUserId,
    'page_size':currentAuthTermPageSize
  };
  bproto_ajax(GET_USER_TERMINAL_LIST,param,function (obj_json) {
    if(obj_json.code===0){
      currentAuthTermPage = obj_json.page;
      currentAuthTermPage_total = obj_json.page_total;
      var html = template('authorizedTemp', obj_json);
      $("#authorized .tablebox_authterm table tbody").html(html);
      Auth_List_Search();
    }
  })
}




//获取在线设备列表
function fun_get_online_terminal_list() {

  param = {
    "access_token": access_token,
    "page": 0,
    "page_size": currentOnlineTermPageSize,
    'user_id':CurrentUserId,
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
    }
  })
}






//在线设备上一页设备
function bindPager_Previous(target_page,func) {
  if (target_page === 0) {
    alert("已经是第一页了");
    return
  }
  target_page -= 1;
  func(target_page);
}

//在线设备下一页设备
function bindPager_Next(target_page,total_page,func) {
  if (total_page === 0 || target_page === total_page - 1) {
    alert("已经是最后一页了");
    return;
  }
  target_page += 1;
  func(target_page);
}

//根据page页数获取未授权设备
function getUnAuthTerm_list(page) {
  if (page < 0) {
    page = 0
  }
  var sortlist = [];
  $("#unauthorized .breadcrumb li:nth-child(n+2)").each(function () {
    if ($(this).text().length > 0) {
      sortlist.push($(this).text())
    }
  });


  $("input[type=checkbox]").prop("checked", false);
  param = {
    "access_token":access_token,
    'page':page,
    "page_size":currentUnAuthTermPageSize,
    'filters':sortlist
  };
  bproto_ajax(GET_REGISTER_URL, param, function (obj_json) {
    if (obj_json.code === 0) {
      if(obj_json.registers.length===0){
        alert("已经是最后一页了");
        return;
      }
      currentUnAuthTermPage_total = obj_json.page_total;
      currentUnAuthTermPage = obj_json.page;
      var html = template('unauthorizedTemp', obj_json);
      $("#unauthorized table tbody").html(html);
      update_ip();
      UnAuth_List_Search();
    }
  })
}



//根据page页数获取已授权设备
function getAuthTerm_list(page) {
  if (page < 0) {
    page = 0
  }
  param = {
    "access_token":access_token,
    'page':page,
    "page_size":currentAuthTermPageSize
  };
  bproto_ajax(GET_USER_TERMINAL_LIST, param, function (obj_json) {
    if (obj_json.code === 0) {
      if(obj_json.terminal_list.length===0){
        alert("已经是最后一页了");
        return;
      }
      currentAuthTermPage = obj_json.page;
      currentAuthTermPage_total = obj_json.page_total;
      var html = template('authorizedTemp', obj_json);
      $("#authorized .tablebox_authterm table tbody").html(html);
      Auth_List_Search();
    }
  })
}



//根据page页数获取在线设备
function getOnlineTerm_list(page) {
  if (page < 0) {
    page = 0
  }

  param = {
    "access_token": access_token,
    'user_id':currentUserId,
    "page": page,
    "page_size": currentOnlineTermPageSize
  };
  bproto_ajax(GET_USER_ONLINE_TERMINAL_URL, param, function (obj_json) {
    if (obj_json.code === 0) {
      // "page": 0,    "page_size": 5,    "page_total": 86
      if(obj_json.registers.length===0){
        alert("已经是最后一页了");
        return;
      }
      currentOnlineTermPage = obj_json.page;
      currentOnlineTermPage_total = obj_json.page_total;
      RenderOnlineTerminalTable(obj_json);
    }
  });
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
    $(".tablebox_online").height($(window).height() - parseInt(online_account_ishide?""+$("#onlineTerminal .account").height():"0") - $(".tablebox_online").offset().top-60);
    Online_List_Search();
  // });

  // $(".tablebox_online table tbody").html(template('onlineTermsTemp', list));
  // $("#onlineTerminal .table tr td:nth-child(1),#onlineTerminal.table tr th:nth-child(1)").hide();
}


//未授权页面的渲染检索功能div
function applyUnAuthSort() {
  $("#unauthorized .typesort li:nth-child(n+2)").remove();
  unauthTypelist.forEach(function (value) {
    $("#unauthorized .typesort").append("<li><a href='javascript:;'>" + value + "</a></li>");
  });
  $("#unauthorized .softwaresort li:nth-child(n+2)").remove();
  unauthSoftwareproviderlist.forEach(function (value) {
    $("#unauthorized .softwaresort").append("<li><a href='javascript:;'>" + value + "</a></li>");
  });
  $("#unauthorized .hardwaresort li:nth-child(n+2)").remove();
  unauthHardwareproviderlist.forEach(function (value) {
    $("#unauthorized .hardwaresort").append("<li><a href='javascript:;'>" + value + "</a></li>");
  });

  $(".tablebox").height($(window).height() - parseInt(unauth_account_ishide?""+$("#unauthorized .account").height():"0") - $(".tablebox").offset().top-60);
}

//已授权页面的渲染检索功能div
function applyAuthSort() {
  $("#authorized .typesort li:nth-child(n+2)").remove();
  authTypelist.forEach(function (value) {
    $("#authorized .typesort").append("<li><a href='javascript:;'>" + value + "</a></li>");
  });
  $("#authorized .labelsort li:nth-child(n+2)").remove();
  authLabellist.forEach(function (value) {
    $("#authorized .labelsort").append("<li><a href='javascript:;'>" + value + "</a></li>");
  });
  $("#authorized .hardwaresort li:nth-child(n+2)").remove();
  authHardwareproviderlist.forEach(function (value) {
    $("#authorized .hardwaresort").append("<li><a href='javascript:;'>" + value + "</a></li>");
  });
  $(".tablebox_authterm").height($(window).height() - $(".Auth_pager").height() - $(".tablebox_authterm").offset().top-60);

}

//在线设备页面的渲染检索功能div
function applyOnlineSort() {
  $("#onlineTerminal .typesort li:nth-child(n+2)").remove();
  OnlineTypelist.forEach(function (value) {
    $("#onlineTerminal .typesort").append("<li><a href='javascript:;'>" + value + "</a></li>");
  });
  $("#onlineTerminal .labelsort li:nth-child(n+2)").remove();
  OnlineLabellist.forEach(function (value) {
    $("#onlineTerminal .labelsort").append("<li><a href='javascript:;'>" + value + "</a></li>");
  });
  $("#onlineTerminal .hardwaresort li:nth-child(n+2)").remove();
  OnlineHardwareproviderlist.forEach(function (value) {
    $("#onlineTerminal .hardwaresort").append("<li><a href='javascript:;'>" + value + "</a></li>");
  });
  $(".tablebox_online").height($(window).height() - parseInt(online_account_ishide?""+$("#onlineTerminal .account").height():"0") - $(".tablebox_online").offset().top-60);
}

//
function SetSortItem(content, target,func) {
  $(content + " " + target).delegate("a", "click", function () {
    if ($(this).css("color") == "rgb(255, 0, 0)") {
      $(content + " " + target + " a").css("color", "#000");
      $(content + " .breadcrumb li[data-bind=" + $(this).parent().parent().attr('data-bind') + "]").text("").hide();
    } else {
      $(content + " "+target+" a").css("color", "#000");
      $(this).css("color", "red");
      $(content + " .breadcrumb li[data-bind=" + $(this).parent().parent().attr('data-bind') + "]").text($(this).text()).show()
    }
    func()
  });
  $(content+" .breadcrumb").on('click','li.active',function(){
    $(this).text("").hide();
    func();
  })

}

//绑定检索item事件
function bindSortItem() {
  SetSortItem("#unauthorized",".typesort",updateUnauthorizedSort);
  SetSortItem("#unauthorized",".hardwaresort",updateUnauthorizedSort);
  SetSortItem("#unauthorized",".softwaresort",updateUnauthorizedSort);


  SetSortItem("#authorized",".typesort",updateAuthorizedSort);
  SetSortItem("#authorized",".hardwaresort",updateAuthorizedSort);
  SetSortItem("#authorized",".labelsort",updateAuthorizedSort);


  SetSortItem("#onlineTerminal",".typesort",updateOnlineSort);
  SetSortItem("#onlineTerminal",".hardwaresort",updateOnlineSort);
  SetSortItem("#onlineTerminal",".labelsort",updateOnlineSort);




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
  var sortlist = [];
  $("#unauthorized .breadcrumb li:nth-child(n+2)").each(function () {
    if ($(this).text().length > 0) {
      sortlist.push($(this).text())
    }
  });
  param = {
    "access_token":access_token,
    'page':0,
    "page_size":currentUnAuthTermPageSize,
    'filters':sortlist
  };
  bproto_ajax(GET_REGISTER_URL, param, function (obj_json) {
    if (obj_json.code === 0) {
      currentUnAuthTermPage_total = obj_json.page_total;
      currentUnAuthTermPage = obj_json.page;
      var html = template('unauthorizedTemp', obj_json);
      $("#unauthorized table tbody").html(html);
      update_ip();
      UnAuth_List_Search();
    }
  })

}


//根据已授权检索要求重新渲染数据
function updateAuthorizedSort() {
  var sortlist = {};
  $("#authorized .breadcrumb li:nth-child(n+2)").each(function () {
    if ($(this).text().length > 0) {
      sortlist[$(this).attr("data-info")] = $(this).text()
    }
  });
  param = {
    "access_token":access_token,
    'user_id':CurrentUserId,
    'page':currentAuthTermPage,
    "page_size":currentAuthTermPageSize,
    'filter':sortlist
  };
  bproto_ajax(GET_USER_TERMINAL_LIST, param, function (obj_json) {
    if (obj_json.code === 0) {
      currentAuthTermPage = obj_json.page;
      currentAuthTermPage_total = obj_json.page_total;
      var html = template('authorizedTemp', obj_json);
      $("#authorized .tablebox_authterm table tbody").html(html);
      Auth_List_Search();
    }
  })
}


//根据在线检索要求重新渲染数据
function updateOnlineSort(){
  var sortlist = {};
  $("#onlineTerminal .breadcrumb li:nth-child(n+2)").each(function () {
    if ($(this).text().length > 0) {
      sortlist[$(this).attr("data-info")] = $(this).text()
    }
  });
  param = {
    "access_token":access_token,
    'user_id':CurrentUserId,
    'page':currentOnlineTermPage,
    "page_size":currentOnlineTermPageSize,
    'filter':sortlist
  };
  bproto_ajax(GET_USER_ONLINE_TERMINAL_URL, param, function (obj_json) {
    if (obj_json.code === 0) {
      currentOnlineTermPage = obj_json.page;
      currentOnlineTermPage_total = obj_json.page_total;
      RenderOnlineTerminalTable(obj_json);
    }
  })
}


function setCheckboxClick(target,func1,func2){

  $(target+" .allcheck").click(function () {
    if ($(target+" .allcheck").prop("checked")) {
      $(target+" input[name=done]").each(function () {
        $(this).prop("checked", true)
      });
      $(target+" .checkNum").text("已选" + $(target+" input[name=done]").length).css("visibility", "visible");
    } else {
      $(target+" input[name=done]").each(function () {
        $(this).prop("checked", false)
      });
      $(target+" .checkNum").text("已选0").css("visibility", "hidden");
      if(!$(target+" .account").is(":hidden")) {
        func1()
      }
    }
  });
  //单个按钮监听
  $(target+" .table tbody").delegate("input[name=done]", "click", function () {
    var isCheck = true;
    var num = 0;
    $(target+" input[name=done]").each(function () {
      if (!$(this).prop("checked")) {
        isCheck = false;
      } else {
        num += 1
      }
    });
    if (num > 0) {
      $(target+" .checkNum").text("已选" + num).css("visibility", "visible");
      if($(target+" .account").is(":hidden")) {
        func2()
      }

    } else {
      $(target+" .checkNum").text("已选0").css("visibility", "hidden");
      if(!$(target+" .account").is(":hidden")) {
        func1()
      }
    }
    $(target+" .allcheck").prop("checked", isCheck);

  })
}
//设置checkbox按钮逻辑事件
function checkboxClick() {
  //按钮
  setCheckboxClick("#unauthorized",function () {
    unauth_account_ishide = false;
    $(".tablebox").height($(window).height() - parseInt(unauth_account_ishide?""+$("#unauthorized .account").height():"0") - $(".tablebox").offset().top-60);
    $("#unauthorized .account").slideUp(500);
  },function () {
    unauth_account_ishide = true;
    $(".tablebox").height($(window).height() - parseInt(unauth_account_ishide?""+$("#unauthorized  .account").height():"0") - $(".tablebox").offset().top-60);
    $("#unauthorized  .account").slideDown(500,function () {
    });
  });

  //
  setCheckboxClick("#onlineTerminal .table_content",function () {
    online_account_ishide = false;
    $(".tablebox_online").height($(window).height() - parseInt(online_account_ishide?""+$("#onlineTerminal .account").height():"0") - $(".tablebox_online").offset().top-60);
    $("#onlineTerminal .table_content .account").slideUp(500);
  },function () {
    online_account_ishide = true;
    $(".tablebox_online").height($(window).height() - parseInt(online_account_ishide?""+$("#onlineTerminal .account").height():"0") - $(".tablebox_online").offset().top-60);
    $("#onlineTerminal .table_content .account").slideDown(500,function () {
    });
  });

}

checkboxClick();

//授权提示框里下拉列表点击逻辑
$(".cert_input .dropdown-menu").on("click",'li a',function () {
  $("#cert_id").val($(this).text());
});
$(".label_input .dropdown-menu").on("click",'li a',function () {
  $("#label_id").val($(this).text());
});

//绑定授权按钮
function auth_show() {
  templist = [];
  certidlist = [];
  labelidlist =[];
  //获取用户证书填充下拉数据
  var param={
    "access_token":access_token,
    "username":CurrentUser,
    "page":0,
    "page_size":20
  };
  bproto_ajax(GET_USERCERTS_URL,param,function (obj_json) {
    if(obj_json.code===0){
      for (let i = 0; i < obj_json.certs.length; i++) {
        certidlist.push(obj_json.certs[i].SerialNumber)
      }
      certid_html = "";
      for (let i = 0; i < certidlist.length; i++) {
        certid_html += "<li><a href='javascript:;'>" +certidlist[i]+"</a></li>"
      }
      $(".cert_input .dropdown-menu").html(certid_html);

    }
  });
  //获取用户标签填充下拉数据
  bproto_ajax(USER_LABEL_GET,param,function (obj_json) {
    if(obj_json.code===0){
      for (let i = 0; i < obj_json.userlabel.length; i++) {
        labelidlist.push(obj_json.userlabel[i].label_id)
      }
      labelid_html = "";
      for (let i = 0; i < labelidlist.length; i++) {
        labelid_html += "<li><a href='javascript:;'>" +labelidlist[i]+"</a></li>"
      }
      $(".label_input .dropdown-menu").html(labelid_html);
    }
  });


  $("input[name=done]").each(function () {
    if ($(this).prop("checked")) {
      templist.push($(this).attr("data-sessionid"))
    }
  });
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
    alert("请选择授权设备");
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
      alert("请输入证书编号");
      return;
    }else if($("#label_id").val() === ""){
      alert("请输入认证标签编号");
      return;
    }
    other_Authorize(templist, {"cert_id":$("#cert_id").val(),"label_id":$("#label_id").val()}, function (obj_json) {
      var code = obj_json.code;
      if (code === 0) {
        alert("授权成功");
        $("#unauthorized .breadcrumb li").each(function () {
          $(this).text("").hide()
        });
        $("#allcheck").prop("checked", false);
        $(".checkNum").text("已选0").css("visibility", "hidden");
        fun_get_register_list();
        $("#AuthModal").modal("hide");
      } else if (code === -2 || code === -3 || code === -4) {
        alert("注册数据出错");
      } else if (code === -5) {
        alert("证书授权次数不足");
      } else if (code === -6) {
        alert("证书编号不存在");
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
    'user_label_id':obj.label_id,
    'registers': registers
  };
  bproto_ajax(AUTHORIZE_BY_CERT_URL, param, function (obj_json) {
    func(obj_json);
  })
}


//发送信息按钮
function exec_show() {
  var ischeck=false;
  var cb_data={"cmd":"","data":[]};


  if(!$(".ta_msg").val()) {
    alert("请输入发送信息内容");
    return;
  }

  cb_data["cmd"]=$(".ta_msg").val();



  $("#onlineTerminal .table_content input[name=done]").each(function () {
    if($(this).prop("checked")){
      ischeck = true;
      cb_data["data"].push({"seq":Math.floor(Math.random()*10000),"term":$(this).attr("data-bind")});
    }
  });
  if(!ischeck){
    alert("请选择一台设备");
    return;
  }

  $("#onlineTerminal .online_content").hide();
  $("#onlineTerminal .exec_content").show();


  RenderOnlineTerminalExecTable(cb_data);


}

//渲染在线设备发送命令table
function RenderOnlineTerminalExecTable(cb_data) {
  var isover = 0;
  var id = 0;
  var html = template('onlineTermsExecTemp', cb_data);
  $("#onlineTerminal .exec_content table tbody").html(html);

  for (let i = 0; i < cb_data.data.length; i++) {

    let param={
      'access_token':access_token,
      "term":cb_data.data[i].term,
      "seq":cb_data.data[i].seq,
      "cmd":cb_data.cmd
    };
    bproto_ajax(SEND_SERVER_CMD,param,function (obj_json) {
      if(obj_json.code===0){
        $("#onlineTerminal .exec_content tr[data-bind="+cb_data.data[i].term+"] .sendstatus").html(`<span class="fa fa-check-square">`)
      }
      isover+=1;
    })
  }
  // id = setInterval(function () {
  //     if(isover===cb_data.data.length){
  //       console.log(isover);
  //       clearInterval(id);
  //       getcmd_response(cb_data.data);
  //     }
  // },1000);
}

function Retrygetcmd_response(data) {
  let param ={
    'access_token':access_token,
    "query":[{"term":data.term,"seq":data.seq}]
  };
  bproto_ajax(GET_SERVER_CMD_RESPONSE,param,function(obj_json){
    let callmsg = "";
    if(obj_json.code===0){
      if(obj_json.response.length>0&&obj_json.response[0].response){
        callmsg = obj_json.response[0].response;
      }else{

      }
    }else if(obj_json.code ===-4){

    }
  })

}





function getcmd_response(term) {

    let param = {
      'access_token':access_token,
      "query":[{"term":term,"seq":-1}]
    };
    bproto_ajax(GET_SERVER_CMD_RESPONSE,param,function(obj_json) {
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



function Back(target1, target2) {
  $(target1).hide();
  $(target2).show();
}



//获取字段验证列表
function fun_get_module_fields_list() {
  param = {'access_token': access_token};
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
  $(".tablebox_TerminalVerify table tbody").html(template('TerminalVerifyTemp', {"list": templist}));
}


//显示一级添加字段提示框
function showAddModuleField_modal() {
  $("#ModuleFieldManage_Modal").modal("show");
  $("#ModuleFieldManage_Modal .modal-content").hide();
  $(".addModuleField_content").show();
  $(".addModuleField_content .beizhu").show();
  $(".addModuleField_content .beizhu #textarea_ModuleNumber").val("");

  param = {'access_token': access_token};
  bproto_ajax(GET_MODULE_FIELD_NAME, param, function (obj_json) {
    if (obj_json.code === 0) {
      RenderModule_fields_Name(obj_json)
    }
  })
}


//删除型号验证
function RemoveModuleField() {
  var isCheck = false;
  $("input[name=cb_termlist]").each(function () {
    if ($(this).prop("checked")) {
      isCheck = true;
    }
  });

  if (!isCheck) {
    alert("请选择一条数据.");
    return;
  }

  param = {
    'access_token': access_token,
    'module': $("input[name=cb_termlist]:checked").attr("data-bind"),
    'field': $("input[name=cb_termlist]:checked").parent().parent().find(".field").attr("data-bind")
  };
  bproto_ajax(DEL_MODULE_FIELD, param, function (obj_code) {
    if (obj_code.code === 0) {
      alert("删除成功");
      param = {'access_token': access_token};
      bproto_ajax(GET_MODULE_FIELDS, param, function (obj_json) {
        RenderModule_fields(obj_json);
        showListModuleField_modal($("input[name=cb_termlist]:checked").attr("data-bind"));
      });
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
    alert("请选择型号字段");
    return;
  }

  if ($("#textarea_ModuleNumber").val().length === 0) {
    alert("请输入备注信息");
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
      alert("添加成功");
      $("#textarea_ModuleNumber").val("");
      fun_get_module_fields_list();
      closeModal("#ModuleFieldManage_Modal");
    }
  })
}


//渲染一级添加字段验证列表
function RenderModule_fields_Name(list) {
  Module_fields_Name2Chinese(list);
  $("#ModuleFieldManage_Modal .selectFieldName").html(template('ModuleFieldNameTemp', list));
}


//渲染型号对应字段验证Modal
function RenderModule_fields_Modal(list,data) {
  $("#ModuleFieldManage_Modal .tablebox_TerminalVerify_Field tbody").html(template('TerminalVerify_FieldTemp', {"module_fields": list,"module":data}));
}


//展示
function showListModuleField_modal(data) {
  $("#ModuleFieldManage_Modal .modal-content").hide();
  $("#ModuleFieldManage_Modal").modal("show");
  $("#ModuleFieldManage_Modal .showModuleField_content").show();


  var list = Module_FiledLists[data];
  $("#addVerify").attr("onclick","showAddField_modal('"+data+"')");
  RenderModule_fields_Modal(list,data)
}

//开启
function showAddField_modal(data){
  $("#ModuleFieldManage_Modal .modal-content").hide();
  $("#ModuleFieldManage_Modal .addModuleField_content").show();
  $(".addModuleField_content .beizhu").hide();
  $(".addModuleField_content .beizhu #textarea_ModuleNumber").val(data);

  param = {'access_token': access_token};
  bproto_ajax(GET_MODULE_FIELD_NAME, param, function (obj_json) {
    if (obj_json.code === 0) {
      RenderModule_fields_Name(obj_json)

      var list = Module_FiledLists[data];
      for (let i = 0; i < list.length; i++) {
        if($("input[value='"+list[i].split("|")[0]+"']").length>0){
          $("input[value='"+list[i].split("|")[0]+"']").attr("checked",true).prop("disabled",true);
        }
      }
    }
  });


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
        default:
          list.fields[i] = list.fields[i] + "|" + list.fields[i];
      }
    }
  }

}


function closeModal(target) {
  $(target).modal("hide");
}

$(".modal").click(function (e) {
  if (e.target == $("#AuthModal")[0]) {
    closeModal("#AuthModal");
  } else if (e.target == $("#ModuleFieldManage_Modal")[0]) {
    closeModal("#ModuleFieldManage_Modal");
  }
});
