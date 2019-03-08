

currentAddConfig = "AAAServer";
currentAddGroupStep = 1;
addGroupName = "";
addGroupNote = "";
FromPermission = [];
ToPermission = [];

currentGroup = "";

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
    alert("请填写数据");
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
      alert("添加成功");
      // showBlack_list(currentCMS);
      // showWhite_list(currentCMS);
      $("#ServerConfig_modal").modal("hide");
      showServerManage();
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
    alert("请输入修改后的值");
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
      alert("更改成功");
      showServerManage();
      HideEdit(target);
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
      alert("删除成功");
      showServerManage();
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
      alert("请填写数据");
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
        <td class="data">'+ToPermission[i].toUpperCase()+'</td>\
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
    alert("不能为空");
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
      alert("添加用户组成功");
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
    }
  })
}


//用户组对应的用户列表
function showUserGroupUserList(target){
  currentGroup = target;
  $("#UserGroup .body").hide();
  $("#UserGroup .usermanage").show();

  var param = {
    'access_token':access_token,
    'group_id':target
  }
  bproto_ajax(GET_GROUP_USER_LIST,param,function (obj_json) {  
    if(obj_json.code===0){
      console.log(obj_json)
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
    alert("请选择用户");
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
      alert("添加用户成功");
      $("#UserGrounpManage_modal").modal("hide");
    }
  });
}


//显示用户权限管理页面
function showPermissionManage(target){
  currentGroup = target;
  $("#UserGroup .body").hide();
  $("#UserGroup .PermissionManage").show();

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
      alert("删除成功");
      showUserGroupManage();
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
});
