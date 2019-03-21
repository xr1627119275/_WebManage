page_size = 15;//分页查询默认每页数据
currentCertsPage = 0;//初始化显示用户证书当前页数
currentCertsPage_total = 0;//初始化显示用户证书总页数
currentCerts2TermPage = 0; //初始化证书颁布的设备当前页数
currentCerts2TermPage_total = 0;//初始化证书颁布的设备总页数

currentCert = ""; //初始化证书号
current_certId = '';
showWhitchSlider(3);

$(window).resize(function () {
  $("aside").height($(document).height())
}).trigger("resize");

window.addEventListener('load', function () {
  switch (location.hash) {
    case "#certList":
      changeContent($("a[data-bind=#certList]")[0]);
      break;
    default:
      location.hash = "#certList";
      changeContent($("a[data-bind=#certList]")[0]);
  }
})


$(".table ").on("click","td.more",function () {  
  // console.log(($(this).offset().top-60),$(this).find(".msg_body").height());
  if( ($(this).offset().top-60)> $(this).find(".msg_body").height() ){
    $(this).find(".msg_body").css({"display":"block","bottom":"0"});
  }else{
    $(this).find(".msg_body").css({"display":"block","top":"0"});
    // $(this).find(".msg_body").css({"display":"block","bottom":""});

  }
})
 
$(".table ").on("mouseleave","td.more",function () {  
  $(this).find(".msg_body").css("display","none");
})

//切换导航
function changeContent(target) {
  $(target).parent().parent().find("li").removeClass("active");
  $(target).parent().addClass("active")

  var targetId = $(target).attr("data-bind");
  $(".content").hide();
  $(targetId).show();
  if ($(target)[0] == $("a[data-bind=#certList]")[0]) {
    showUserCerts();
  }
}


//显示用户证书
function showUserCerts() {
  $(".content").hide()
  $("#certList").show()
  if (window.CurrentUser === undefined) {
    bproto_ajax(GET_LOGIN_MSG_URL, { 'access_token': access_token }, function (obj_json) {
      if (obj_json.code != 0) {
        location.href = '/';
      }
      CurrentUser = obj_json.username;
      getUserCerts();
    })
  } else {
    getUserCerts();
  }
}

function getUserCerts() {
  var param = {
    "access_token": access_token,
    "username": CurrentUser,
    "page": 0,
    "page_size": page_size
  };
  bproto_ajax(GET_USERCERTS_URL, param, function (obj_json) {
    if (obj_json.code === 0 && obj_json.certs.length > 0) {
      // "page": 0,    "page_size": 5,    "page_total": 86
      currentCertsPage = obj_json.page;
      currentCertsPage_total = obj_json.page_total;
      userid = obj_json.userid;
      RenderCertTable(obj_json);//渲染数据

      $(".modalTable").hide();
      $(".certTable").show();

      $("#UserModal #myModalLabel").text(username + " 证书数据");

      $("#UserModal").modal("show");
      if (!window.ModalShowList) {
        ModalShowList = [];
      }
      ModalShowList.push({ target: $(".certTable"), title: $("#UserModal #myModalLabel").text() });
    } else if (obj_json.code === 0 && obj_json.certs.length === 0) {
      toastr.info("无数据")
    } else {
      toastr.error(obj_json.msg)
    }
  });
}



//根据page页数获取证书数据
function getCerts_list(page) {
  if (page < 0) { page = 0 }
  param = {
    "access_token": access_token,
    "username": window.CurrentUser,
    "page": page,
    "page_size": page_size
  };
  bproto_ajax(GET_USERCERTS_URL, param, function (obj_json) {
    if (obj_json.code === 0 && obj_json.certs.length > 0) {
      // "page": 0,    "page_size": 5,    "page_total": 86
      currentCertsPage = obj_json.page;
      currentCertsPage_total = obj_json.page_total;
      obj_json.userid = userid;
      RenderCertTable(obj_json);
    }
  });
}
// //根据page页数获取证书颁布的设备的数据
// function getCerts2Term_list(page){
//     if(page<0){page=0}
//     param = {
//         "access_token":access_token,
//         "cert":currentCert,
//         "page":page,
//         "page_size":page_size
//     };
//     bproto_ajax(GET_CERT_TERMINAL_URL,param,function (obj_json) {
//         if(obj_json.code===0) {
//             currentCerts2TermPage = obj_json.page;

//             RenderCert2TermTable(obj_json);
//         }
//     })
// }


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


//绑定证书certs分页按钮
// function bindCertsPager_Previous() {
//     if(currentCertsPage===0){
//         toastr.info("已经是第一页了");
//         return
//     }
//     currentCertsPage -= 1;
//     getCerts_list(currentCertsPage);
// }
// function bindCertsPager_Next() {
//     if(currentCertsPage===currentCertsPage_total-1){
//         toastr.info("已经是最后一页了");
//         return;
//     }
//     currentCertsPage +=1;
//     getCerts_list(currentCertsPage);
// }

// //绑定证书颁布的设备页面分页按钮
// function bindCerts2TermPager_Previous() {
//     if(currentCerts2TermPage===0){
//         toastr.info("已经是第一页了");
//         return
//     }
//     currentCerts2TermPage -= 1;
//     getCerts2Term_list(currentCerts2TermPage);
// }
// function bindCerts2TermPager_Next() {
//     if(currentCerts2TermPage===currentCerts2TermPage_total-1){
//         toastr.info("已经是最后一页了");
//         return;
//     }
//     currentCerts2TermPage +=1;
//     getCerts2Term_list(currentCerts2TermPage);
// }


//渲染用户证书table
function RenderCertTable(list) {
  getCertsRename(list, function (list) {
    for (let i = 0; i < list.certs.length; i++) {
      list.certs[i].ValidityBegin_ = list.certs[i].ValidityBegin.replace(" ", "T");
      list.certs[i].ValidityEnd_ = list.certs[i].ValidityEnd.replace(" ", "T");
    }
    $("#certList .showCert table tbody").html(template('certList_template', list))
  });
}

function getCertsRename(list, func) {
  var templist = [];
  for (var i = 0; i < list.certs.length; i++) {
    templist.push({ "target_type": "cert", "target_id": list.certs[i].SerialNumber })
  }
  var param = {
    'access_token': access_token,
    'list': templist
  }
  bproto_ajax(GET_REMARK, param, function (obj_json) {
    if (obj_json.list.length > 0) {
      for (var i = 0; i < obj_json.list.length; i++) {
        for (var j = 0; j < list.certs.length; j++) {
          if (obj_json.list[i].target_id == list.certs[j].SerialNumber) {
            list.certs[j].rename = obj_json.list[i].rename
          }
        }
      }
    }
    func(list)
  })

}


//编辑按钮逻辑
function ShowEdit(target) {
  $(target).parent().parent().find(".edit").show();
  $(target).parent().parent().find(".source").hide();
}
function HideEdit(target) {
  $(target).parent().parent().parent().find(".source").show();
  $(target).parent().parent().parent().find("input.edit").val($(target).parent().parent().parent().find("input.edit").attr("data-bind"))
  $(target).parent().parent().parent().find(".edit").hide();
}

//更改备注
function updateCertRename(target,id) {
  var val = $(target).parent().parent().find("input.edit").val()
  if(val===""){
    toastr.warning("备注不能为空");
    $(target).parent().parent().parent().find("input.edit").focus(); 
    return;
  }
  var param = {
    'access_token':access_token,
    "update_list":[{
        "target_type":"cert",
        "target_id":id,
        "rename":val
      }]
  }

  bproto_ajax(UPDATE_REMARK,param,function (obj_json) {  
    if(obj_json.code===0){
      showUserCerts();
      toastr.success("修改成功");
    }else{
      showUserCerts();
      toastr.error(obj_json.msg)
    }
    HideEdit(target)
  })
}


//选择转移证书方式
function Choice(target) {
  $(".Choice").hide();
  $(".Choice"+target).show();
}


//渲染证书颁布的设备table
function RenderCert2TermTable(list) {
  $(".showCert table tbody").html(template('termList_template', list))
}

// param = {
//   "access_token": access_token,
//   "cert_id_from": current_certId,
//   "user_id_to": allUsers[$("#user_id").val()],
//   "times": parseInt($("#updateTimes").val())
// };
// bproto_ajax(ISSUE_UESER_CERT, param, function (obj_json) {
//   if(obj_json.code===0){
//     toastr.success("转移成功");
//     $("#UserModal").modal("hide");
//   }else{
//     toastr.error("失败"+obj_json.msg);
//   }
// })

$("ul.group.dropdown-menu").on("click","a",function () {
  $("ul.user.dropdown-menu").html("")
  $("#user_id").val("").attr("data-bind","");

  $(this).parent().parent().parent().parent().find("input").val($(this).text())
  $(this).parent().parent().parent().parent().find("input").attr("data-bind",$(this).attr("data-bind"))
  var id = $(this).parent().parent().parent().parent().find("input").attr("data-bind")
  var param = {
    'access_token':access_token,
    'group_id':id
  }
  bproto_ajax(GET_GROUP_USER_LIST,param,function (obj_json) {  
    if(obj_json.code===0){

      var userlist = obj_json.user_list;
      if(userlist.length==0){
        toastr.info("该用户组没有用户,请重新选择");
        return;
      }else{
        var html = ''
        for(var i=0;i<userlist.length;i++){
          html+='<li data-bind="PU"><a href="javascript:;" data-bind="'+userlist[i].username+'">'+(userlist[i].username)+'(备注:'+(userlist[i].remark?userlist[i].remark:"无")+')\
            </a></li>'
        }
        $("ul.user.dropdown-menu").html(html);
      }
    }
  })
})


$(".input-group.user .input-group-btn").click(function () {  
  if($("#group_id").val()==""){
    toastr.warning("请先选择用户群组");
    return;
  }
})

$("ul.user.dropdown-menu").on("click","a",function () {  
  
  $("#user_id").val($(this).text())
  $("#user_id").attr("data-bind",$(this).attr("data-bind"))
})



//展示证书提示框
function ShowSwitchCerts_Modal(certid) {
  
  current_certId = certid;
  $("#SwitchCertsModal").modal("show");
  $("#SwitchCertsModal input").val("");
  $("#SwitchCertsModal ul").html("");
  var param = {
    'access_token':access_token
  }
  bproto_ajax(GET_GROUP_LIST,param,function (obj_json) {  
    if(obj_json.code===0){
      if(!obj_json.group_list.length){
        $("#UserGroupManage .ingroup_table tbody").html("")
        return;
      }
      var mydata = {"group_list":[]};
      for (var i = 0; i < obj_json.group_list.length; i++) {
        // if(CurrentUserId===obj_json.group_list[i].master_user_id){
          mydata.group_list.push(obj_json.group_list[i])
        // }
      }

      if(mydata.group_list.length==0){
        toastr.info("无用户组无法转移证书给其他用户，请创建用户组");
        return;
      }else{
        $("#SwitchCertsModal").modal("show");
        $("#SwitchCertsModal input").val("");
        $("#SwitchCertsModal ul").html("");
      }
      // ul.group
      var html = ''
      for(var i=0;i<mydata.group_list.length;i++){
        html+='<li data-bind="PU">\
                <a href="javascript:;" data-bind="'+mydata.group_list[i].id+'">'+(mydata.group_list[i].name)+'(备注:'+(mydata.group_list[i].note?mydata.group_list[i].note:"无")+')\
                </a>\
              </li>'
      }
      $("ul.group.dropdown-menu").html(html);
    }
  })

}
//转移逻辑
function SwitchCertTimes(){
  var name = $("#user_id").attr("data-bind");
  var times = $("#cert_times").val();
  var password = $("#user_password").val();
  var username = $("#user_name").val();

  if(!$(".Choice.ChoiceGroup").is(":hidden")){
    if(name.length==0){
      toastr.warning("请选择一个用户");
      return;
    }else if(times.length==0){
      toastr.warning("请输入转移证书次数");
      return;
    }else if(times==0){
      toastr.warning("转移证书次数不能为0");
      return;
    }else if(password==''){
      toastr.warning("密码不能为空");
      return;
    }
    username = name;
  }else{
    if(username.length==""){
      toastr.warning("请输入用户名");
      return;
    }else if(times.length==0){
      toastr.warning("请输入转移证书次数");
      return;
    }else if(times==0){
      toastr.warning("转移证书次数不能为0");
      return;
    }else if(password==''){
      toastr.warning("密码不能为空");
      return;
    }
  }
 
  param = {
    "access_token": access_token,
    "cert_id_from": current_certId,
    "user_name_to": username,
    "times": parseInt(times),
    "password" : md5(CurrentUser+"@"+md5(password))
  };
  bproto_ajax(ISSUE_UESER_CERT, param, function (obj_json) {
    if(obj_json.code===0){
      toastr.success("转移成功");
      showUserCerts();
      $("#SwitchCertsModal").modal("hide");

    }else if(obj_json.code==-11){
      toastr.error("密码错误");
    }else{
      toastr.error("失败"+obj_json.msg);
    }
  })

}

// GetUserMsg_CallBack(function () {  
//   if(CurrentUser=="admin"){

//   $("#TreeCertsModal").modal("show");
// }
// })

function SetDate(cert) {  
  return cert.ValidityBegin.slice(0,10).replace(/\-/g,"")+" - "+cert.ValidityEnd.slice(0,10).replace(/\-/g,"")
}


function ShowTreeCerts_Modal(certid){
  $("#TreeCertsModal").modal("show");
  $("#TreeCertsModal .modal-body").html('\
  <div style="width:100%">\
    <div style="border: 2px solid #ccc;padding:20px 0;border-radius: 10px;width: 400px;text-align: center;margin: 0 auto;">\
      <div>当前证书</div>\
      <div class="currentInfo" style="overflow:auto">'+certid+'</div>\
      \
      <div>\
        <a class="my-link prev" href="javascript:;" onclick="prev(\''+certid+'\',this)">查看上一级</a>\
        <a class="my-link next" href="javascript:;" onclick="next(\''+certid+'\',this)">查看下一级</a>\
      </div>\
      </div>\
  </div>');
}

function ShowTreeCertsContent(cert) {  
  $(".certListContent").hide();
  $(".TreeCerts").show();
  cert = JSON.parse(cert);
  $(".TreeCerts .body").html('\
  <div style="width:100%">\
    <div style="border: 2px solid #ccc;padding:0 0 10px;border-radius: 10px;width: 260px;text-align: center;margin: 0 auto;">\
      <div class="h4" style="">当前证书('+(cert.IssueTermType)+')</div>\
      <ul class="list-group" style="margin-bottom:10px;;text-align:left">\
        <li class="list-group-item"                 ><span style="display:inline-block;width:60px;font-weight:700;margin-right:10px;text-align:right;">证书用户</span>'+(CurrentUser)+'</li>\
        <li class="list-group-item" style="display:"><span style="display:inline-block;width:60px;font-weight:700;margin-right:10px;text-align:right;">有效时间</span>'+SetDate(cert)+'</li>\
        <li class="list-group-item" style="display:"><span style="display:inline-block;width:60px;font-weight:700;margin-right:10px;text-align:right;">证书次数</span>'+(cert.MaxIssueTimes)+'(剩余'+(cert.MaxIssueTimes-cert.IssueTimes)+')</li>\
      </ul>\
      <div>\
        <a class="my-link prev" href="javascript:;" onclick="prev(\''+cert.SerialNumber+'\',this)">查看上一级</a>\
        <a class="my-link next" href="javascript:;" onclick="next(\''+cert.SerialNumber+'\',this)">查看下一级</a>\
      </div>\
      </div>\
  </div>');
  $(".TreeCerts .body .next").click();
  // bproto_ajax(GET_CERT_TREE2,{"access_token":access_token,"cert":cert.SerialNumber},function(obj_json){

  // });

}


function prev(certid,target) {  
  bproto_ajax(GET_CERT_TREE2,{"access_token":access_token,"cert":certid},function(obj_json){
    if(obj_json.cert_parent!=null){
      var cert_parent = obj_json.cert_parent;
      var parent = document.createElement("div");
      // $(parent).addClass("bottom_tree").attr("data-bind","top_tree1");
      $(parent).css({"marginBottom":20})
      var div = document.createElement("div");
      $(div).addClass("top_tree");
      $(div).html('\
      <div class="h4" >父证书</div>\
      <ul class="list-group" style="margin-bottom:10px;;text-align:left">\
        <li class="list-group-item"                 ><span style="display:inline-block;width:60px;font-weight:700;margin-right:10px;text-align:right;">证书用户</span>'+(cert_parent.IssuerRemark?cert_child[i].IssuerRemark:cert_parent.IssuerName)+'</li>\
        <li class="list-group-item" style="display:"><span style="display:inline-block;width:60px;font-weight:700;margin-right:10px;text-align:right;">有效时间</span>'+SetDate(cert_parent)+'</li>\
        <li class="list-group-item" style="display:"><span style="display:inline-block;width:60px;font-weight:700;margin-right:10px;text-align:right;">证书次数</span>'+(cert_parent.MaxIssueTimes)+'(剩余'+(cert_parent.MaxIssueTimes-cert_parent.IssueTimes)+')</li>\
      </ul>\
      <div>\
        <a class="my-link next" href="javascript:;" onclick="prev(\''+cert_parent.SerialNumber+'\',this)">查看上一级</a>\
      </div>');

      $(parent).append(div);

      // if(i==cert_child.length-1){
      //   break;
      // }

      // var div40 = document.createElement("div");
      // $(div40).css({"width":40})
      // $(parent).append(div40);
      console.log(parent);
      $(target).parent().parent().parent().prevAll().remove()
      $(".TreeCerts .body").prepend(parent);
      $(target).parent().parent().css({"border-color":"red"})
    }else{
      toastr.info("该证书为顶级证书");
    }
  })
}

function next(certid,target){
  // $("#TreeCertsModal").modal("show");
  // window.cert_child = [];
  // $("#TreeCertModal .modal-body").html("");
  bproto_ajax(GET_CERT_TREE2,{"access_token":access_token,"cert":certid},function(obj_json){
    if(obj_json.cert_child.length>0){
      var cert_child = obj_json.cert_child;
      var parent = document.createElement("div");
      $(parent).addClass("bottom_tree").attr("data-bind","bottom_tree1");
      $(parent).css({'width':260*cert_child.length+40*(cert_child.length-1)});
      console.log(parent); 
      for(var i=0;i<cert_child.length;i++){
        var div = document.createElement("div");
        $(div).addClass("tree_child");
        $(div).html('\
        <div class="h4">子证书</div>\
          <ul class="list-group" style="margin-bottom:10px;;text-align:left">\
            <li class="list-group-item"                 ><span style="display:inline-block;width:60px;font-weight:700;margin-right:10px;text-align:right;">证书用户</span>'+(cert_child[i].IssuerRemark?cert_child[i].IssuerRemark:cert_child[i].IssuerName)+'</li>\
            <li class="list-group-item" style="display:"><span style="display:inline-block;width:60px;font-weight:700;margin-right:10px;text-align:right;">有效时间</span>'+(SetDate(cert_child[i]))+'</li>\
            <li class="list-group-item" style="display:"><span style="display:inline-block;width:60px;font-weight:700;margin-right:10px;text-align:right;">证书次数</span>'+(cert_child[i].MaxIssueTimes)+'(剩余'+(cert_child[i].MaxIssueTimes-cert_child[i].IssueTimes)+')</li>\
          </ul>\
        <div>\
          <a class="my-link next" href="javascript:;" onclick="next(\''+cert_child[i].SerialNumber+'\',this)">查看下一级</a>\
        </div>');

        $(parent).append(div);

        if(i==cert_child.length-1){
          break;
        }

        var div40 = document.createElement("div");
        $(div40).css({"width":40})
        $(parent).append(div40);
      }
      console.log($(target).parent().parent())
      $(target).parent().parent().parent().nextAll().remove()
      $(".TreeCerts .body").append(parent);
      $(target).parent().parent().css({"border-color":"red"})
    }else{
      toastr.info("无子证书");
    }

    $("#TreeCertsModal .modal-body").resize()
  })
}



function closeModal(target) {
  $(target).modal("hide");
}

$(".modal").click(function (e) {
  if (e.target == $("#SwitchCertsModal")[0]) {
    closeModal("#SwitchCertsModal");
  } 
});
