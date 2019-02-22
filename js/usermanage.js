page_size = 10;//分页查询默认每页数据
currentCertsPageSize = 10;//初始化显示用户证书每页页数
currentCertsPage = 0;//初始化显示用户证书当前页数
currentCertsPage_total = 0;//初始化显示用户证书总页数\

currentCerts2TermPageSize = 10;//初始化显示用户证书颁布的设备每页页数
currentCerts2TermPage = 0; //初始化证书颁布的设备当前页数
currentCerts2TermPage_total = 0;//初始化证书颁布的设备总页数

cacheUserslist = [];

currentCert = ""; //初始化证书号

ModalShowList = [];

allUsers = [];//初始化所有用户信息


showWhitchSlider(5)

switch (location.hash) {
  case "#userslistManage":
    changeContent($("a[data-bind=#userslistManage]")[0]);
    break;
  case "#certslistManage":
    changeContent($("a[data-bind=#certslistManage]")[0]);
    break;
  case "#termslistManage":
    changeContent($("a[data-bind=#termslistManage]")[0]);
    break;
  case "#TerminalVerify":
    changeContent($("a[data-bind=#TerminalVerify]")[0]);
    break;
  default:
    location.href = "#userslist";
    changeContent($("a[data-bind=#userslistManage]")[0]);
}

//切换导航
function changeContent(target) {
  var targetId = $(target).attr("data-bind");
  $(".content>div").hide();
  // $(".right a").removeClass("active");
  // $(target).addClass("active");
  $(targetId).show();
  if ($(target)[0] == $("a[data-bind=#userslistManage]")[0]) {
    showUserList();
  } else if ($(target)[0] == $("a[data-bind=#certslistManage]")[0]) {
    showCertsManage();
  } else if ($(target)[0] == $("a[data-bind=#termslistManage]")[0]) {
    showTermsManage();
  }
}


//nav切换逻辑
function bindSwitch() {
  $(".userSelect li").on("click", "a[data-bind]", function () {
    var className = $(this).attr("data-bind");

    $(".content>div").hide();
    $(className).show();

    // $("section .left.fl a[data-bind]").removeClass("active");
    // $(this).addClass("active")
    $(".userSelect").hide();
  })
}

// bindSwitch();


$("#Times").popover({
  html: true,
  trigger: "manual",
  content: '<div id="Times_pop">请输入证书授权次数</div>',
  container: 'body',
  animation: false
});
$("#dayduration").popover({
  html: true,
  trigger: "manual",
  content: '<div id="dayduration_pop">请输入证书授权时效(可单选)</div>',
  container: 'body',
  animation: false
});

$("#addUserLabel").popover(
    {
      html: true,
      trigger: "manual",
      title: "请扫描二维码",
      content: "<div id='userlabelqrcode'></div>",
      container: 'body',
    }
);


verifTarget("#Times");

function verifTarget(target) {
  $(target).on("input", function () {
    if ($(target).val().length > 0) {
      $(target).popover("hide");
    } else {
      $(target).popover("show");
    }
  });
  $(target).blur(function () {
    if ($(target).val().length > 0) {
      $(target).popover("hide");
    } else {
      $(target).popover("show");
    }
  });
}

$("#dayduration").on("input", function () {
  if ($("#dayduration").val().length > 0 || $("#yearduration").val().length > 0) {
    $("#dayduration").popover("hide");
  } else {
    $("#dayduration").popover("show");
  }
});
$("#dayduration").blur(function () {
  if ($("#dayduration").val().length > 0 || $("#yearduration").val().length > 0) {
    $("#dayduration").popover("hide");
  } else {
    $("#dayduration").popover("show");
  }
});
$("#yearduration").on("input", function () {
  if ($("#dayduration").val().length > 0 || $("#yearduration").val().length > 0) {
    $("#dayduration").popover("hide");
  } else {
    $("#dayduration").popover("show");
  }
});
$("#yearduration").blur(function () {
  if ($("#dayduration").val().length > 0 || $("#yearduration").val().length > 0) {
    $("#dayduration").popover("hide");
  } else {
    $("#dayduration").popover("show");
  }
});


//获得用户信息
function getUserList(func) {
  param = {"access_token": ""};
  bproto_ajax(GET_USERLIST_URL, param, function (obj_json) {
    cacheUserslist = obj_json.users;
    for (let i = 0; i < cacheUserslist.length; i++) {
      if (!cacheUserslist[i].OwnerUserGroup_id) {
        cacheUserslist[i].OwnerUserGroup_id = "无"
      }
    }
    func(cacheUserslist);
  });
}


//展示用户列表
function showUserList() {
  $("#userslistManage").show()
  if (cacheUserslist.length === 0) {
    getUserList(function (list) {
      $("#userslistManage table tbody").html(template('userListTemp', {"users": cacheUserslist}));
    });
  } else {
    $("#userslistManage table tbody").html(template('userListTemp', {"users": cacheUserslist}));
  }

}

//展示用户证书管理
function showCertsManage() {
  $(".certsManageContent").hide();
  $(".certsManageContent.usersTable").show();
  if (cacheUserslist.length === 0) {
    getUserList(function (list) {
      $("#certslistManage table tbody").html(template('certslistTemp', {"users": list}));
    })
  } else {
    $("#certslistManage table tbody").html(template('certslistTemp', {"users": cacheUserslist}));
  }

}

//展示用户设备管理
function showTermsManage() {
  $(".termsManageContent").hide();
  $(".termsManageContent.usersTable").show();
  if (cacheUserslist.length === 0) {
    getUserList(function (list) {
      $("#termslistManage .termsManageContent.usersTable table tbody").html(template('termslistTemp', {"users": list}));
    })
  } else {
    $("#termslistManage .termsManageContent.usersTable table tbody").html(template('termslistTemp', {"users": cacheUserslist}));
  }
}


//给用户添加证书
function addUserCert(target) {
  currentUserId = $(target).attr("data-bind");
  $("#AddCert input").val("");
  $("#AddCertLabel").text($(target).attr("data-user") + " 颁布证书");
  $("#AddCert").modal("show");
}

//给用户添加证书提交
function AddCert_Modal() {
  if ($("#Times").val() === "") {
    $("#Times").popover("show");
    return;
  }
  if ($("#yearduration").val() === "" && $("#dayduration").val() === "") {
    $("#dayduration").popover("show");
    return;
  }
  var times = parseInt($("#Times").val());
  var days = ($("#yearduration").val() ? parseInt($("#yearduration").val()) * 365 : 0) + parseInt($("#dayduration").val() ? parseInt($("#dayduration").val()) : 0);

  param = {
    'access_token': access_token,
    "user_id_to": currentUserId,
    "times": times,
    'duration': days,
    'issue_term_type' : $(".addtermtype option:selected").val()
  };
  bproto_ajax(ADMIN_ISSUE_UESER_CERT, param, function (obj_json) {
    if (obj_json.code === 0) {
      alert("添加完成");
      $("#AddCert").modal("hide");
    } else if (obj_json.code === -2) {
      alert("权限不足,请管理员操作");
    } else {
      alert(obj_json.msg);
    }
  })
}

//绑定查看证书
function showUserCerts(target) {
  username = $(target).attr("data-bind");
//    {"access_token":"SAKPFLsOpsnrzAyAmYSxNu6pCJEwxpHM","username":"admin","page":0,"page_size":5}:
  userid = $(target).attr("data-userid");
  param = {
    "access_token": access_token,
    "username": username,
    "page": 0,
    "page_size": currentCertsPageSize
  };
  bproto_ajax(GET_USERCERTS_URL, param, function (obj_json) {
    if (obj_json.code === 0 && obj_json.certs.length > 0) {
      // "page": 0,    "page_size": 5,    "page_total": 86
      currentCertsPage = obj_json.page;
      currentCertsPage_total = obj_json.page_total;
      obj_json.userid = userid;
      RenderCertTable(obj_json);//渲染数据

      $(".certsManageContent").hide();
      $(".certsManageContent.certTable").show();

      $(".certsManageContent.certTable .title").text(username+" 证书数据");

      // $("#UserModal").modal("show");
      // if(!window.ModalShowList){
      //     ModalShowList = [];
      // }
      // ModalShowList.push({target:$(".certTable"),title:$("#UserModal #myModalLabel").text()});
    } else {
      alert("无数据")
    }
  });
}

//查看用户返回按钮
function Back(target1,target2){
  $(target1).hide();
  $(target1+target2).show();
}



//查看用户标签信息
function showUserLabel(target) {

}

//添加用户标签
function addUserLabel() {

  param = {'access_token': access_token};

  bproto_ajax(USER_LABEL_ADD, param, function (obj_json) {
    console.log(obj_json);
    var data = obj_json.userlabel;
    $("#addUserLabel").popover("show");
    new QRCode(document.getElementById("userlabelqrcode"), data);
  })
}




//上一页
function bindPager_Previous(target_page, func) {
  if (target_page === 0) {
    alert("已经是第一页了");
    return
  }
  target_page -= 1;
  func(target_page);
}

//下一页
function bindPager_Next(target_page, total_page, func) {
  if (total_page === 0 || target_page === total_page - 1) {
    alert("已经是最后一页了");
    return;
  }
  target_page += 1;
  func(target_page);
}

//根据page页数获取证书数据
function getCerts_list(page) {
  if (page < 0) {
    page = 0
  }
  param = {
    "access_token": access_token,
    "username": username,
    "page": page,
    "page_size": currentCertsPageSize
  };
  bproto_ajax(GET_USERCERTS_URL, param, function (obj_json) {
    if (obj_json.code === 0 && obj_json.certs.length > 0) {
      // "page": 0,    "page_size": 5,    "page_total": 86
      currentCertsPage = obj_json.page;
      currentCertsPage_total = obj_json.page_total
      obj_json.userid = userid;
      RenderCertTable(obj_json);
      // RenderCert2TermTable(obj_json);
    }
  });
}

//根据page页数获取证书颁布的设备的数据
function getCerts2Term_list(page) {
  if (page < 0) {
    page = 0
  }
  param = {
    "access_token": access_token,
    "cert": currentCert,
    "page": page,
    "page_size": currentCerts2TermPageSize
  };
  bproto_ajax(GET_CERT_TERMINAL_URL, param, function (obj_json) {
    if (obj_json.code === 0) {
      if(obj_json.terminals.length===0){
        currentCerts2TermPage_total = obj_json.page;
        alert("已经是最后一页了");
        return;
      }
      currentCerts2TermPage = obj_json.page;
      currentCerts2TermPage_total = obj_json.page_total;
      RenderCert2TermTable(obj_json);
    }
  })
}




//绑定证书certs分页按钮
function bindCertsPager_Previous() {
  if (currentCertsPage === 0) {
    alert("已经是第一页了");
    return
  }
  currentCertsPage -= 1;
  getCerts_list(currentCertsPage);
}

function bindCertsPager_Next() {
  if (currentCertsPage === currentCertsPage_total - 1) {
    alert("已经是最后一页了");
    return;
  }
  currentCertsPage += 1;
  getCerts_list(currentCertsPage);
}

//绑定证书颁布的设备页面分页按钮
function bindCerts2TermPager_Previous() {
  if (currentCerts2TermPage === 0) {
    alert("已经是第一页了");
    return
  }
  currentCerts2TermPage -= 1;
  getCerts2Term_list(currentCerts2TermPage);
}

function bindCerts2TermPager_Next() {
  if (currentCerts2TermPage === currentCerts2TermPage_total - 1) {
    alert("已经是最后一页了");
    return;
  }
  currentCerts2TermPage += 1;
  getCerts2Term_list(currentCerts2TermPage);
}


//渲染用户证书table
function RenderCertTable(list) {
  for (let i = 0; i < list.certs.length; i++) {
    list.certs[i].ValidityBegin_ = list.certs[i].ValidityBegin.replace(" ", "T");
    list.certs[i].ValidityEnd_ = list.certs[i].ValidityEnd.replace(" ", "T");
  }
  $(".certsManageContent.certTable table tbody").html(template('certList', list))
}

//渲染证书颁布的设备table
function RenderCert2TermTable(list) {
  $(".showCert2Term table tbody").html(template('termList', list))
}

//修改用户证书
function updateCert(target) {
  var allSelects = $(target).parent().parent().find("td select");
  var allInputDates = $(target).parent().parent().find("td input[type=datetime-local]");
  if (!target.isClick) {
    //获取当前行的select，让他们显示出来
    $(".updateCert").css("backgroundColor", "#ddd").val("修改").css("color", "#000");
    $(".updateCert").parent().parent().find("td select,td input[type=datetime-local]").prev().show().end().hide();

    $(".updateCert").each(function () {
      $(this)[0].isClick = false;
    });

    $(target).css("backgroundColor", "#000").val("确认").css("color", "#fff");

    var parentcertid = $(allSelects[2]).attr("data-bind");
    allSelects.prev().hide().end().show();
    if(parentcertid){
      // bproto_ajax(GET_USERCERTS_URL,)
      $(allSelects[2]).prev().show().end().hide();
    }else{

    }

    //除了admin其他用户不可以修改时间
    if(CurrentUser==="admin"){
      allInputDates.prev().hide().end().show();
    }
    allSelects.each(function () {
      $(this).find("option[value=" + $(this).prev().text() + "]").prop("selected", true)
    });
    target.isClick = true;
  } else {
    var ValidityBegin = allInputDates.parent().find(".ValidityBegin").val();
    var ValidityEnd = allInputDates.parent().find(".ValidityEnd").val();
    param = {
      "access_token": access_token,
      "SerialNumber": $(target).attr("data-bind"),
      "Type": allSelects.parent().find("select[name=Type]").find("option:selected").val(),
      "State": allSelects.parent().find("select[name=State]").find("option:selected").val(),
      "Mode": allSelects.parent().find("select[name=Mode]").find("option:selected").val(),
      "ValidityBegin": ValidityBegin.replace("T", " "),
      "ValidityEnd": ValidityEnd.replace("T", " ")
    };
    bproto_ajax("/api/v1/update_cert/", param, function (obj_json) {
      if (obj_json.code === 0) {
        $(target).css("backgroundColor", "#ddd").val("修改").css("color", "#000");
        getCerts_list(currentCertsPage);
        alert("更改成功")
      } else if (obj_json.code === -2) {
        alert("更改失败,权限不足");
        $(target).css("backgroundColor", "#ddd").val("修改").css("color", "#000");
        getCerts_list(currentCertsPage);
      } else {
        alert("更改失败");
      }

      // allSelects.show();
      // allSelects.prev().hide();
    })
  }
}


//展示选择用户页面
function showUpdateCertTimes(target) {
  current_certId = $(target).attr("data-bind");
  param = {"access_token": ""};
  bproto_ajax(GET_USERLIST_URL, param, function (obj_json) {
    var users = obj_json.users;
    for (let i = 0; i < users.length; i++) {
      if (!users[i].OwnerUserGroup_id) {
        users[i].OwnerUserGroup_id = "无"
      }
    }
    var html = template('Select_usersList', {"users": users});
    for (let index = 0; index < users.length; index++) {      
      allUsers[users[index].username]=users[index].user_id
    }
    $("#UserModal .SelectUser .users").html(html);
    $("#UserModal #myModalLabel").text("选择用户");
    $("#UserModal .modal-dialog").removeClass("modal-lg").addClass("modal-md");
    $("#UserModal").modal("show");
    $("#updateTimes").val("");
    $(".modalTable").hide();
    $(".SelectUser").show();
    ModalShowList.push({target: $(".SelectUser"), title: $("#UserModal #myModalLabel").text()});

    //li选择用户click
    $(".SelectUser .users .dropdown-menu").on("click","li",function () {
      $("#user_id").val($(this).find("a").text())
      $("#user_id").attr("data-bind",$(this).attr("data-bind"))
    })

  });
}

function UpdateCertTimes() {
  if (!$("#updateTimes").val()) {
    alert("次数不能为空");
    return;
  }
  if (!($("#user_id").val())) {
    alert("请选择用户");
    return;
  }
  if(!allUsers[$("#user_id").val()]){
    alert("用户不存在");
    return;
  }
  if (CurrentUser === "admin") {
    // current_certId = "null";
  }
  param = {
    "access_token": access_token,
    "cert_id_from": current_certId,
    "user_id_to": allUsers[$("#user_id").val()],
    "times": parseInt($("#updateTimes").val())
  };
  bproto_ajax(ISSUE_UESER_CERT, param, function (obj_json) {
    if(obj_json.code===0){
      alert("转移成功");
      $("#UserModal").modal("hide");
    }
  })
}


//查看证书颁布的设备
function showTerminal(cert) {
  currentCert = cert;
  param = {
    "access_token": access_token,
    "cert": currentCert,
    "page": 0,
    "page_size": currentCerts2TermPageSize
  };
  bproto_ajax(GET_CERT_TERMINAL_URL, param, function (obj_json) {
    if (obj_json.code === 0) {
      currentCerts2TermPage = obj_json.page;
      currentCerts2TermPage_total = obj_json.page_total;
      $(".showCert2Term tbody").html(template("termList", obj_json));
      $("#UserModal .modal-dialog").removeClass("modal-md").addClass("modal-lg");
      $("#UserModal").modal("show");
      $(".modalTable").hide();
      $("#UserModal #myModalLabel").text("证书(" + currentCert + ")颁发的设备");
      $(".termTable").show();
      ModalShowList.push({target: $(".termTable"), title: $("#UserModal #myModalLabel").text()});
    }
  })
}

//查看用户所有的设备信息按钮逻辑
function showAllTerms(target) {
  $(".modalTable").hide();
  $(".allTermTable").show();
  $("#UserModal").modal("show");
  $("#UserModal #myModalLabel").text($(target).attr("data-bind") + " 所有设备");
  if (!window.ModalShowList) {
    ModalShowList = [];
  }
  ModalShowList.push({target: $(".allTermTable"), title: $("#UserModal #myModalLabel").text()});
}


//查看用户所有授权的设备
function getAuthTerm(target) {
  $(".tab").removeClass("active");
  $(target).addClass("active");
  var classname = $(target).attr("data-bind");
  $(".allTermTable .content").hide();
  $(classname).show();
}

//查看用户所有未授权的设备
function getUnAuthTerm(target) {
  $(".tab").removeClass("active");
  $(target).addClass("active");
  var classname = $(target).attr("data-bind");
  $(".allTermTable .content").hide();
  $(classname).show();
}


//查看用戶设备验证信息
function showTermsVerify(target) {
  // $(".modalTable").hide();
  // $(".TermVerifyTable").show();
  // $("#UserModal").modal("show");
  // $("#UserModal #myModalLabel").text($(target).attr("data-bind") + " 设备型号认证信息");
  var username = $(target).attr("data-bind");
  $(".termsManageContent").hide();
  $(".termsManageContent.TermVerifyTable").show();
  $(".termsManageContent.TermVerifyTable .title").text(username+" 设备型号认证信息");
  // if (!window.ModalShowList) {
  //   ModalShowList = [];
  // }
  // ModalShowList.push({target: $(".TermVerifyTable"), title: $("#UserModal #myModalLabel").text()});
}


//提示框关闭逻辑
function closeModal() {
  if (ModalShowList.length > 1) {
    var target_obj = ModalShowList.pop();
    target_obj.target.hide();
    var last_obj = ModalShowList[ModalShowList.length - 1];
    last_obj.target.show();
    $("#UserModal #myModalLabel").text(last_obj.title);
  } else {
    $("#UserModal").modal("hide");
    ModalShowList = [];
  }

}

//关闭添加证书的提示框
function closeAddCertModal() {
  $("#AddCert input").popover("hide");
  $("#AddCert").modal("hide");
}


//添加用户
function addUser() {

  param = {
    'access_token': access_token,
    "username": $("form.add .username").val(),
    "password": $("form.add .password").val()
  };
  bproto_ajax(ADD_USER_URL, param, function (obj_json) {
    if (obj_json.code === 0) {
      alert("添加成功")

    } else if (obj_json.code === -1) {
      alert("用户已存在，请重新添加")
    }

  }, function () {
    console.log("Error:" + obj_json)
  });
  $("form.add .username").val("");
  $("form.add .password").val("")
}


$(".modal").click(function (e) {
  if (e.target == $("#AddCert")[0]) {
    closeAddCertModal();
    return;
  }
  if (e.target == this) {
    closeModal()
  }
});
