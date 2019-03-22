currentCertsPageSize = 10;//初始化显示用户证书每页页数
currentCertsPage = 0;//初始化显示用户证书当前页数
currentCertsPage_total = 0;//初始化显示用户证书总页数\

currentCerts2TermPageSize = 10;//初始化显示用户证书颁布的设备每页页数
currentCerts2TermPage = 0; //初始化证书颁布的设备当前页数
currentCerts2TermPage_total = 0;//初始化证书颁布的设备总页数

currentAddConfig = "AAAServer";
currentAddGroupStep = 1;
addGroupName = "";
addGroupNote = "";
FromPermission = [];
ToPermission = [];

currentGroup = "";
currentGroupName = "";
allUsers = {};

CurrentCertUserEl = "";//当前证书用户


showWhitchSlider(7);

window.addEventListener('load',changeHashPage)

function changeHashPage(){
  switch (location.hash) {
    case "#ServerConfigPage":
      changeContent($("a[data-bind=#ServerConfig]")[0]);
      break;
    case "#UserGroupPage":
    changeContent($("a[data-bind=#UserGroup]")[0]);
      break;
    case "#certslistManage":
      // alert("1is");
      changeContent($("a[data-bind=#certslistManage]")[0]);
      break;
    default:
      location.hash = "#ServerConfigPage";
      changeContent($("a[data-bind=#ServerConfig]")[0])
      break;
  }
  // if(window.location.hash==="#ServerConfigPage"){
  //   showServerManage();
  // }else if(window.location.hash==="#UserGroupPage"){
  //   showUserGroupManage()
  // }
  
}

// window.addEventListener('hashchange',function (e) {  
//   if(window.location.hash==="#ServerConfigPage"){
//     // changeContent($("a[data-bind=#ServerConfig]")[0]);
//     showServerManage();
//   }else if(window.location.hash==="#UserGroupPage"){
//     // changeContent($("a[data-bind=#UserGroup]")[0]);
//     showUserGroupManage()
//   }
// });



//切换导航
function changeContent(target) {
  
  $(target).parent().parent().find("li").removeClass("active");
  $(target).parent().addClass("active")

  var targetId = $(target).attr("data-bind");
  $(".content").hide();
  $(targetId).show();
  // console.log(targetId)
  
  // console.log($(target)[0] = $("a[data-bind=#UserGroup]")[0]);
  if ($(target)[0] === $("a[data-bind=#ServerConfig]")[0]) {
    showServerManage()

  } else if ($(target)[0] === $("a[data-bind=#UserGroup]")[0]) {
    showUserGroupManage()
  }else if (target === $("a[data-bind=#certslistManage]")[0]) {
    showCertsManage();
  }
}


//展示服务器配置信息
function showServerManage() {
  $(".content").hide();
  $("#ServerConfig").show();

  getServerConfigList(function (AAAServerConfigs,AAAProxyConfigs) {
    RenderServerConfigTable(AAAServerConfigs,AAAProxyConfigs);
  })
}

function getServerConfigList(func) { 
  var param = {
    'access_token': access_token
  }
  bproto_ajax(GET_CONFIG_INFO, param, function (obj_json) {
    if(obj_json.code===0){
      var config_list = obj_json.config_list;
      var AAAServerConfigs = {"config_list":[]};
      var AAAProxyConfigs = {"config_list":[]};
      for (let i = 0; i < config_list.length; i++) {
        if(config_list[i].server_type==="AAAServer"){
          AAAServerConfigs["config_list"] = []
          AAAServerConfigs["config_list"].push(config_list[i]);
        }else{
          AAAProxyConfigs["config_list"] = []
          AAAProxyConfigs["config_list"].push(config_list[i]);
        }
      }
      func(AAAServerConfigs,AAAProxyConfigs);
    }else if(obj_json.code===-5){
      func({"config_list":[]},{"config_list":[]});
    }
  })
}

function RenderServerConfigTable(AAAServerConfigs,AAAProxyConfigs){
  switch(currentAddConfig){
    case "AAAServer":
      if(AAAServerConfigs.config_list.length===0){
        $("#ServerConfig tbody").html("");
        break;
      }
      $("#ServerConfig tbody").html(template("ServerConfigTemp",AAAServerConfigs))
      break;
    case "AAAServerProxy":
      if(AAAProxyConfigs.config_list.length===0){
        $("#ServerConfig tbody").html("");
        break;
      }
      $("#ServerConfig tbody").html(template("ServerConfigTemp",AAAProxyConfigs))
      break;
    default:
      break;
  }
}



//tab切换
$(".mytab").on("click","li",function () {  
  if(!$(this).hasClass("active")){
    $(".mytab li").removeClass("active");
    $(this).addClass("active");
    currentAddConfig = $(this).attr("data-bind");
    showServerManage();
  }else{
    currentAddConfig = $(this).attr("data-bind");
  }
  
})


//显示添加用户标签提示框
function ShowAddUserLabel_modal() {
  $("#ServerConfig_modal").modal("show");
  $(".modal-content").hide();
  $(".AddServerConfig_content").show();
  $(".AddServerConfig_content tbody").html($("#AddServerConfigSelect").html());
  setDropdown();
  $(".selectserver option[value=" + currentAddConfig + "]").prop("selected", true);
}

function setDropdown() {  
  
  $("#ServerConfig_modal .dropdown-menu").on("click",'li a',function () {  
    $(".input_addconfigkey").val($(this).attr('data-bind'));
  })
}






//添加一行黑白名单
function addTrField(target) {
  $(target).parent().parent().html($(target).parent().parent().parent().find("tr:nth-child(1)").html());
  $("#ServerConfig_modal .AddServerConfig_content tbody").append('<tr>\n' +
    '              <td colspan="5">\n' +
    '                <input type="button" class="btn btn-success" value="添加一行" onclick="addTrField(this)">\n' +
    '              </td>\n' +
    '            </tr>')
  $(".selectserver option[value=" + currentAddConfig + "]").prop("selected", true);

}



//提示框中删除一行配置信息
function delServerConfigField(target) {
  $(target).parent().parent().remove()
}



//添加服务器配置信息按钮
function AddServerConfig() {
  var add_list = [];
  var length = $(".AddServerConfig_content tbody tr:nth-child(n+2)").length;
  var num = 1;
  var isNUll = false;

  $(".AddServerConfig_content tbody tr:nth-child(n+2)").each(function () {
    if ($(this).find(".input_addconfigkey").val() === "" ||
      $(this).find(".input_addconfigval").val() === "" ||
      $(this).find(".input_desc").val() === "") {
      isNUll = true;
    }
  });

  if(isNUll){
    toastr.warning("请填写数据");
    return;
  }


  $(".AddServerConfig_content tbody tr:nth-child(n+2)").each(function () {
    if (num === length) {
      return;
    }
    var config_value = $(this).find(".input_addconfigval").val();
    !isNaN(config_value)?config_value=parseInt(config_value):""
    add_list.push({
      "server_type": $(this).find(".selectserver option:selected").val(),
      "config_key": $(this).find(".input_addconfigkey").val(),
      "config_value": config_value,
      "config_desc": $(this).find(".input_desc").val()
    });
    num++;
  });

  
  var param = {
    'access_token': access_token,
    'add_list': add_list
  };
  bproto_ajax(UPDATE_CONFIG_INFO, param ,function (obj_json) {
    if (obj_json.code === 0) {
      toastr.success("添加成功");
      // showBlack_list(currentCMS);
      // showWhite_list(currentCMS);
      $("#ServerConfig_modal").modal("hide");
      showServerManage();
    }else{
      toastr.error("添加失败"+obj_json.msg);
    }
  })
}



//编辑按钮逻辑
function ShowEdit(target) {
  $(target).parent().parent().find(".edit").show();
  $(target).parent().parent().find(".source").hide();
}
function HideEdit(target){
  $(target).parent().parent().parent().find(".source").show();
  $(target).parent().parent().parent().find(".edit").hide();
}

//确定修改按钮
function DoEdit(target,id){
  var config_key = $(target).parent().parent().parent().find("input.edit")[0].value
  var config_value = $(target).parent().parent().parent().find("input.edit")[1].value
  var config_desc = $(target).parent().parent().parent().find("input.edit")[2].value
  if(config_key===""||
  config_value===""||
  config_desc===""){
    toastr.warning("请输入修改后的值");
    return;
  }
  var param ={
    'access_token':access_token,
    "update_list":[{
      "id":parseInt(id),
      "server_type":currentAddConfig,
      "config_key":config_key,
      "config_value":config_value,
      'config_desc':config_desc
    }]
  };

  bproto_ajax(UPDATE_CONFIG_INFO,param,function (obj_json) {
    if(obj_json.code===0){
      toastr.success("更改成功");
      showServerManage();
      HideEdit(target);
    }else{
      toastr.error("更改失败"+obj_json.msg);
    }
  })
}

//删除
function delConfig(id){
  var param = {
    'access_token':access_token,
    'del_list':[parseInt(id)]
  }
  bproto_ajax(UPDATE_CONFIG_INFO,param,function (obj_json) {  
    if(obj_json.code===0){
      toastr.success("删除成功");
      showServerManage();
    }else{
      toastr.error("删除失败"+obj_json.msg);
    }
  })
}


//显示用户组列表
function showUserGroupManage() {  
  $(".content").hide();
  $("#UserGroup").show();
  var param = {
    'access_token':access_token
  }
  bproto_ajax(GET_GROUP_LIST,param,function (obj_json) {  
    if(obj_json.code===0){
        $("#UserGroup .table_usergroup tbody").html(template("usergrouplistTemp",obj_json));
    }
  })

}

//添加用户组
function adduserGroup() {
  $("#UserGroup .body").hide();
  $("#UserGroup .addgroud").show();
  $("#UserGroup .addgroud .addbody").hide();
  $("#UserGroup .addgroud .step1").show();


  $("#UserGroup .addgroud .addbody input[type=text]").val("");
  $("#UserGroup .addgroud .addbody textarea").val("");
  ToPermission = [];
  currentAddGroupStep = 1;
  $(".addbody.step2 .table.from tbody,.addbody.step2 .table.to tbody").html("");

  bproto_ajax(GET_GROUP_AUTHORITY_LIST,{'access_token':access_token},function (obj_json) {  
    if(obj_json.code===0){
      var authority_list = obj_json.authority_list
      
      for (var i = 0; i < authority_list.length; i++) {
        $(".addbody.step2 .table.from tbody").append('\
        <tr class="">\
          <td style="text-align:center"><input  type="checkbox" name="" id="" data-bind="'+authority_list[i]+'"></td>\
          <td class="data">'+authority_list[i].toUpperCase()+'</td>\
        </tr>\
        ') 
      }
    }
  })

}

//添加用户组下一步
function addGroupNext(target){
  if(currentAddGroupStep==1){
    addGroupName = $(".addbody.step1 input").val()
    addGroupNote = $(".addbody.step1 textarea").val()
    if(addGroupName===""||addGroupNote===""){
      toastr.warning("请填写数据");
      return;
    }else{
      currentAddGroupStep=2;
      Back('.addbody','.addbody.step2');
    }
  }else if(currentAddGroupStep==2){
    $(".addbody.step3 .groupname input").val(addGroupName);
    $(".addbody.step3 .groupname span.p_text").text(addGroupName)
    $(".addbody.step3 .groupnote input").val(addGroupNote);
    $(".addbody.step3 .groupnote span.p_text").text(addGroupNote)

    $(".addbody.step3 .table tbody").html("");
    for (var i = 0; i < ToPermission.length; i++) {
      $(".addbody.step3 .table tbody").append('\
      <tr class="active" data-bind="'+ToPermission[i]+'">\
        <td class="data">'+ToPermission[i]+'</td>\
      </tr>\
      ') 
    }

    Back('.addbody','.addbody.step3');
  }
} 

//权限转移
function setPermissionTableCk() {
  $(".addbody.step2").on("click","input[type=checkbox]",function () {  
    var ischeckd = $(this).prop("checked");
    var permission = $(this).attr("data-bind")
    var ishave = false;

    $(this).parent().parent().hasClass("active")?$(this).parent().parent().removeClass("active"):$(this).parent().parent().addClass("active")

    if(ischeckd){
      for (var i = 0; i < ToPermission.length; i++) {
        if(permission===ToPermission[i]){
          ishave = true;
        }
      }

      if(!ishave){
        ToPermission.push(permission);
        $(".addbody.step2 .table.to tbody").append("<tr data-bind='"+permission+"' class='active'><td>"+$(this).parent().parent().find(".data").text()+"</td>\
        <td style='vertical-align: middle; text-align:right'><span class='cancle'></span></td></tr>");
      }
    }else{
      $(".addbody.step2 .table.to tbody tr").each(function (el,i) {  
        if($(this).attr("data-bind")===permission){
          ishave = true;
          $(".table.to tbody tr[data-bind="+permission+"]").remove()
          var index ;
          for (var i = 0; i < ToPermission.length; i++) {
            if(permission===ToPermission[i]){
              index = i;
            }
          }
          if(index!=undefined){
            delete ToPermission[index];
            ToPermission.length -= 1; 
          }
        }
      })
    }
  })

  $(".addbody.step2").on("click","span.cancle",function () {  
    var permission = $(this).parent().parent().attr("data-bind");
    // var index ;
    //       for (var i = 0; i < ToPermission.length; i++) {
    //         if(permission===ToPermission[i]){
    //           index = i;
    //         }
    //       }
    //       if(index!=undefined){
    //         delete ToPermission[index];
    //       }
    $(".addbody.step2 input[data-bind="+permission+"]").click()
  })

}
setPermissionTableCk();

function showEdit(target) {
  $(target).parent().find(".p_text").hide();
  $(target).parent().find(".p_edit").show();
}

function p_do(target){
  if($(target).parent().find("input").val()===""){
    toastr.warning("不能为空");
    return;
  }
  $(target).parent().find("span.p_text").text($(target).parent().find("input").val());
  $(target).parent().find(".p_edit").hide();
  $(target).parent().find(".p_text").show();
}

function p_cancle(target) {
  $(target).parent().find(".p_edit").hide();
  $(target).parent().find(".p_text").show();
} 

//完成添加
function adduserGroupFinsh(){
  addGroupName = $("div.groupname span.p_text").text();
  addGroupNote = $("div.groupnote span.p_text").text();

  var param = {
    "access_token":access_token,
    "add_list": [{
        'name': addGroupName,
        'note': addGroupNote
    }]
  }
  bproto_ajax(UPDATE_GROUP_LIST,param,function (obj_json) {  
    if(obj_json.code===0){
      showUserGroupManage();
      toastr.success("添加用户组成功");
      $("#UserGroup .body").hide();
      $("#UserGroup .usergrouplist").show();
      setTimeout(function () {  
        var add_list = [];
        if(ToPermission.length>0){
          for (var i = 0; i < ToPermission.length; i++) {
            var permission = ToPermission[i];
            add_list.push({
              'group_name': addGroupName,
              'authority_name': permission
            })
          }
          var param = {
              "access_token": access_token,
              "add_list": add_list
          }
          bproto_ajax(UPDATE_GROUP_AUTHORITY,param,function (obj_json) {  
            if(obj_json.code===0){
              
            }
          })
        }
      },5000);
    }else{
      toastr.error("添加用户组失败"+obj_json.msg);
    }
  })
}


//用户组对应的用户列表
function showUserGroupUserList(target,name){
  currentGroup = target;
  $("#UserGroup .body").hide();
  $("#UserGroup .usermanage").show();
  $("#UserGroup .usermanage .head .title").text(name+" 用户信息");
  $("#UserGroup .usermanage .table tbody").html("");
  var param = {
    'access_token':access_token,
    'group_id':target
  }
  bproto_ajax(GET_GROUP_USER_LIST,param,function (obj_json) {  
    if(obj_json.code===0){
      if(obj_json.user_list.length>0){
        $("#UserGroup .usermanage .table tbody").html(template('usermanageTemp',obj_json));
      }else{
        $("#UserGroup .usermanage .table tbody").html("");
      }
    }
  })
}

//添加用户组中的用户
function AddGroup_User(){
  $("#UserGrounpManage_modal").modal("show");
  $("#UserGrounpManage_modal .modal-content").hide();
  $("#UserGrounpManage_modal .UserManage").show();
  
  adduserlist = [];
  $("#UserGrounpManage_modal .UserManage .to tbody,#UserGrounpManage_modal .UserManage .from tbody ").html("");
  bproto_ajax(GET_USERLIST_URL,{'access_token':access_token},function (obj_json) {  
    RenderAddUserTable(obj_json.users);
  })

} 

function RenderAddUserTable(list) {  
  var html = "";
  for (var i = 0; i < list.length; i++) {
    html = html+"<tr>\
            <td style='text-align:center'><input  type='checkbox' data-bind='"+list[i].username+"'></td>\
            <td class='data'>"+(list[i].nickname?list.nickname:list[i].username)+"</td>\
            <td class='data'>"+list[i].username+"</td>\
          </tr>";
  }
  $("#UserGrounpManage_modal .UserManage .from tbody").html(html);
}

adduserlist = []
//权限转移
function setAddUserTableCk() {
  $("#UserGrounpManage_modal .UserManage .from").on("click","input[type=checkbox]",function () {  
    var ischeckd = $(this).prop("checked");
    var user = $(this).attr("data-bind")
    var ishave = false;

    $(this).parent().parent().hasClass("active")?$(this).parent().parent().removeClass("active"):$(this).parent().parent().addClass("active")

    if(ischeckd){
      for (var i = 0; i < adduserlist.length; i++) {
        if(user===adduserlist[i]){
          ishave = true;
        }
      }

      if(!ishave){
        adduserlist.push(user);
        $("#UserGrounpManage_modal .UserManage .to tbody").append("<tr data-bind='"+user+"' class='active'>\
        <td>"+$(this).parent().parent().find(".data").eq(0).text()+"</td>\
        <td style='vertical-align: middle; text-align:right'><span class='cancle'></span></td></tr>");
      }
    }else{
      $("#UserGrounpManage_modal .UserManage .to tbody tr").each(function (el,i) {  
        if($(this).attr("data-bind")===user){
          ishave = true;
          $(".table.to tbody tr[data-bind="+user+"]").remove()
          var index ;
          for (var i = 0; i < adduserlist.length; i++) {
            if(user===adduserlist[i]){
              index = i;
            }
          }
          if(index!=undefined){
            delete adduserlist[index];
            adduserlist.length -= 1; 
          }
        }
      })
    }
  })

  $("#UserGrounpManage_modal .UserManage .to ").on("click","span.cancle",function () {  
    var user = $(this).parent().parent().attr("data-bind");
    // var index ;
    //       for (var i = 0; i < ToPermission.length; i++) {
    //         if(permission===ToPermission[i]){
    //           index = i;
    //         }
    //       }
    //       if(index!=undefined){
    //         delete ToPermission[index];
    //       }
    $("#UserGrounpManage_modal .UserManage .from input[data-bind="+user+"]").click()
  })

}

setAddUserTableCk();


//提示框添加用户按钮
function addGroup_User_modal(){
  var update_list = [];
  if(!adduserlist[0]){
    toastr.warning("请选择用户");
    return;
  }
  for (var i = 0; i < adduserlist.length; i++) {
    update_list.push({
      'user_name': adduserlist[i],
      'group_name': currentGroup
    })
  }

  bproto_ajax(UPDATE_GROUP_USER_LIST,{'access_token':access_token,'update_list':update_list},function (obj_json) {  
    if(obj_json.code===0){
      toastr.success("添加用户成功");
      $("#UserGrounpManage_modal").modal("hide");
    }else{
      toastr.error("添加失败"+obj_json.msg);
    }
  });
}

//显示用户权限管理页面
function showPermissionManage(target,name){
  currentGroup = target;
  currentGroupName = name;
  $("#UserGroup .body").hide();
  $("#UserGroup .PermissionManage").show();
  $("#UserGroup .PermissionManage .title").text(name+" 权限管理");
  var param = {
    'access_token':access_token,
    'group_id':target
  }
  bproto_ajax(GET_GROUP_AUTHORITY,param,function (obj_json) {  
    if(obj_json.code===0){
      console.log(obj_json)
    }
  })
}


$("#PermissionManage_Modal ul.permission").on("click","input",function (e) {  
  e.stopPropagation();
})
$("#PermissionManage_Modal ul.permission").on("click","li",function(){
  $(this).find("input").click();
})
//添加权限提示框
function showGroupPermission_Modal(){
  $("#PermissionManage_Modal").modal("show");

  var param = {'access_token':access_token}
  bproto_ajax(GET_GROUP_AUTHORITY_LIST,param,function (obj_json) {  
    if(obj_json.code===0){
      var authoritylist = obj_json.authority_list;
      var html = '';
      for(var i=0;i<authoritylist.length;i++){
        html+='<li class="list-group-item"><input style="margin-right:10px" type="checkbox" data-bind="'+authoritylist[i]+'" name="permission">\
        '+authoritylist[i]+'</li>'
      }
      $("ul.permission").html(html);
    }
  })

}

//添加权限逻辑
function AddGroupPermission(){
  var permissionlist =[]
  var target = true;
  $("#PermissionManage_Modal ul.permission input[type=checkbox]").each(function (i,el) {  
    if($(el).prop("checked")){
      target = false;
      permissionlist.push({
        'group_id': currentGroup,
        'authority_name': $(this).attr("data-bind")
      });
    }
  })

  if(target){
    toastr.warning("请选择一条权限");
    return;
  }

  var param = {
    'access_token':access_token,
    'add_list':permissionlist
  }
  bproto_ajax(UPDATE_GROUP_AUTHORITY,param,function (obj_json) {  
    console.log(obj_json);
    if(obj_json.code==0){
      toastr.success("添加成功");
      $("#PermissionManage_Modal").modal("hide");
      showPermissionManage(currentGroup,currentGroupName);
    }else{
      toastr.error("添加失败"+obj_json.msg);
      $("#PermissionManage_Modal").modal("hide");
    }
  })
}


//删除用户组
function del_group(target){
  var isdel = confirm("确认删除用户组");
    if(isdel===false){
        return
    }
  var param = {
    'access_token':access_token,
    "del_list": [target]
  }
  bproto_ajax(UPDATE_GROUP_LIST,param,function (obj_json) {
    if(obj_json.code===0){
      toastr.success("删除成功");
      showUserGroupManage();
    }else{
      toastr.error("删除失败"+obj_json.msg);
    }
  })
}


//展示用户证书管理
function showCertsManage() {
  $(".content").hide();
  $("#certslistManage").show();
  $(".certsManageContent").hide();
  $(".certsManageContent.usersTable").show();
  param = {"access_token": access_token};
  bproto_ajax(GET_USERLIST_URL, param, function (obj_json) {
    $("#certslistManage table tbody").html(template('certslistTemp', obj_json));
  })

}

//给用户添加证书
function addUserCert(target) {
  currentUserId = $(target).attr("data-bind");
  $("#AddCert input").val("");
  $("#AddCertLabel").text($(target).attr("data-user") + " 颁布证书");
  $("#AddCert").modal("show");
  $(".addtermtype input").focus();
}


$(".addtermtype").on("click","li",function () {  
  var type = $(this).attr("data-bind")
  $(".addtermtype input").val(type)
})


//给用户添加证书提交
function AddCert_Modal() {
  if($(".addtermtype input").val() === ""){
    toastr.warning("请输入证书类型");
    return;
  }

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
    'issue_term_type' : $(".addtermtype input").val()
  };
  bproto_ajax(ADMIN_ISSUE_UESER_CERT, param, function (obj_json) {
    if (obj_json.code === 0) {
      toastr.success("添加完成");
      $("#AddCert").modal("hide");
    } else if (obj_json.code === -2) {
      toastr.error("权限不足,请管理员操作");
    } else {
      toastr.error("添加失败"+obj_json.msg);
    }
  })
}

//查看证书
function showUserCerts(target) {
  CurrentCertUserEl = target
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
      $('.certslistpage').paging({
        nowPage: currentCertsPage+1,
        allPages: currentCertsPage_total,
        displayPage: 7,
        callBack: function (now) {
          getCerts_list(now-1)
        }
      });
      userid = obj_json.userid;
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
      toastr.warning("无数据")
    }
  });
}

//渲染用户证书table
function RenderCertTable(list) {
  for (let i = 0; i < list.certs.length; i++) {
    list.certs[i].ValidityBegin_ = list.certs[i].ValidityBegin.replace(" ", "T");
    list.certs[i].ValidityEnd_ = list.certs[i].ValidityEnd.replace(" ", "T");
  }
  $(".certsManageContent.certTable table tbody").html(template('certList_template', list))
}

//渲染证书颁布的设备table
function RenderCert2TermTable(list) {
  $(".showCert2Term table tbody").html(template('termList', list))
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
      getCerts_list(currentCertsPage);
      toastr.success("修改成功");
    }else{
      getCerts_list(currentCertsPage);
      toastr.error(obj_json.msg)
    }
    HideEdit(target)
  })
}

//修改用户证书
function updateCert(target) {
  $(target).next().on("click",function () {  
    getCerts_list(currentCertsPage);
  })

  var allSelects = $(target).parent().parent().find("td select");
  var allInputDates = $(target).parent().parent().find("td input[type=datetime-local]");
  if (!target.isClick) {
    //获取当前行的select，让他们显示出来
    $(".updateCert").text("修改")
    $(target).next().hide();
    $(".updateCert").parent().parent().find("td select,td input[type=datetime-local]").prev().show().end().hide();

    $(".updateCert").each(function () {
      $(this)[0].isClick = false;
    });

    $(target).text("确认");
    $(target).next().show();

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


    $(".updateCert_cancel").on("click",function () {  
      getCerts_list(currentCertsPage);
    })

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
        $(target).text("修改")
        $(target).next().hide();
        getCerts_list(currentCertsPage);
        toastr.success("更改成功")
      } else if (obj_json.code === -2) {
        toastr.error("更改失败,权限不足");
        $(target).text("修改")
        $(target).next().hide();
        getCerts_list(currentCertsPage);
      } else {
        toastr.error("更改失败"+obj_json.msg);
      }
      // allSelects.show();
      // allSelects.prev().hide();
    })
  }
}


// //展示选择用户页面
// function showUpdateCertTimes(target) {
//   current_certId = $(target).attr("data-bind");
//   param = {"access_token": access_token};
//   bproto_ajax(GET_USERLIST_URL, param, function (obj_json) {
//     var users = obj_json.users;
//     var html = template('Select_usersList', {"users": users});
//     for (let index = 0; index < users.length; index++) {      
//       allUsers[users[index].username]=users[index].user_id
//     }
//     $("#UserModal .SelectUser .users").html(html);
//     $("#UserModal #myModalLabel").text("选择用户");
//     $("#UserModal .modal-dialog").removeClass("modal-lg").addClass("modal-md");
//     $("#UserModal").modal("show");
//     $("#updateTimes").val("");
//     $(".modalTable").hide();
//     $(".SelectUser").show();
//     // ModalShowList.push({target: $(".SelectUser"), title: $("#UserModal #myModalLabel").text()});

//     //li选择用户click
//     $(".SelectUser .users .dropdown-menu").on("click","li",function () {
//       $("#user_id").val($(this).find("a").text())
//       $("#user_id").attr("data-bind",$(this).attr("data-bind"))
//     })

//   });
// }

// function UpdateCertTimes() {
//   if (!$("#updateTimes").val()) {
//     toastr.warning("次数不能为空");
//     return;
//   }
//   if (!($("#user_id").val())) {
//     toastr.warning("请选择用户");
//     return;
//   }
//   if(!allUsers[$("#user_id").val()]){
//     toastr.warning("用户不存在");
//     return;
//   }
//   if (CurrentUser === "admin") {
//     // current_certId = "null";
//   }
//   param = {
//     "access_token": access_token,
//     "cert_id_from": current_certId,
//     "user_id_to": allUsers[$("#user_id").val()],
//     "times": parseInt($("#updateTimes").val())
//   };
//   bproto_ajax(ISSUE_UESER_CERT, param, function (obj_json) {
//     if(obj_json.code===0){
//       toastr.success("转移成功");
//       $("#UserModal").modal("hide");
//     }else{
//       toastr.error("失败"+obj_json.msg);
//     }
//   })
// }

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
  $("#switchuser_id").val("").attr("data-bind","");

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
  
  $("#switchuser_id").val($(this).text())
  $("#switchuser_id").attr("data-bind",$(this).attr("data-bind"))
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
  var name = $("#switchuser_id").attr("data-bind");
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
  $(".certsManageContent").hide();
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
      // ModalShowList.push({target: $(".termTable"), title: $("#UserModal #myModalLabel").text()});
    }
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
        toastr.info("已经是最后一页了");
        return;
      }
      currentCerts2TermPage = obj_json.page;
      currentCerts2TermPage_total = obj_json.page_total;
      RenderCert2TermTable(obj_json);
    }
  })
}

function closeModal(target) {
  $(target).modal("hide");
}

$(".modal").click(function (e) {
  if (e.target == $("#ServerConfig_modal")[0]) {
    closeModal('#ServerConfig_modal')
  }
  if (e.target == $("#AddCert")[0]) {
    closeModal('#AddCert')
  }
  if (e.target == $("#UserModal")[0]) {
    closeModal('#UserModal')
  }
  if (e.target == $("#UserGrounpManage_modal")[0]) {
    closeModal('#UserGrounpManage_modal')
  }
  if (e.target == $("#SelectUser")[0]) {
    closeModal('#SelectUser')
  }
  if (e.target == $("#PermissionManage_Modal")[0]) {
    closeModal('#PermissionManage_Modal')
  }
});
