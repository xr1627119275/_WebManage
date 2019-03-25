

showWhitchSlider(6);
window.addEventListener('load', function () {
  switch (location.hash) {
    case "#OwnMsgPage":
      changeContent($("a[data-bind=#OwnMsg]")[0]);
      break;
    case "#OtherPage":
      changeContent($("a[data-bind=#Other]")[0]);
      break;
    case "#UpdatePassword":
      showupdatePassword_Modal();
      changeContent($("a[data-bind=#OwnMsg]")[0]);
      break;
    default:
      location.hash = "#OwnMsgPage";
      changeContent($("a[data-bind=#OwnMsg]")[0]);
  }
})

//切换导航
function changeContent(target) {
  $(target).parent().parent().find("li").removeClass("active");
  $(target).parent().addClass("active")

  var targetId = $(target).attr("data-bind");
  $(".content").hide();
  $(targetId).show();
  if ($(target)[0] == $("a[data-bind=#OwnMsg]")[0]) {
    showUserMsg()
  }
}


//展示用户个人信息
function showUserMsg() {
  if (window.CurrentUser === undefined) {
    bproto_ajax(GET_LOGIN_MSG_URL, { 'access_token': access_token }, function (obj_json) {
      if (obj_json.code != 0) {
        location.href = '/';
      }
      CurrentUser = obj_json.username;
      getUserMsg();
    })
  } else {
    getUserMsg();
  }
}
function getUserMsg() {
  $("#OwnMsg").show()
  param = { 'access_token': access_token };

  bproto_ajax(GET_USERLIST_URL, param, function (obj_json) {
    if (obj_json.code === 0) {
      var usermsg = {};
      for (var i = 0; i < obj_json.users.length; i++) {
        if (obj_json.users[i].username === CurrentUser) {
          usermsg = obj_json.users[i];
          RenderUsertable(usermsg)
        }
      }
    }
  })
}

//渲染用户资料列表
function RenderUsertable(usermsg) {
  $(".username").text(usermsg.username)
  $(".nickname span").text(usermsg.nickname == null ? "无" : usermsg.nickname)
  $(".nickname .nickname_val").val(usermsg.nickname == null ? "无" : usermsg.nickname)
  $(".email span").text(usermsg.email)
  $(".cellphone span").text(usermsg.cellphone == null ? "无" : usermsg.cellphone)
}


//编辑按钮逻辑
function ShowEdit(target) {
  $(target).parent().find(".edit").show();
  $(target).parent().find(".source").hide();
  $(target).parent().find("input.edit[type=text]").focus();
}
function HideEdit(target) {
  $(target).parent().parent().find(".source").show();
  $(target).parent().parent().find(".edit").hide();
  $(target).parent().find("input.edit[type=text]").val($(target).parent().find("span.source").text());
}

//修改昵称
function nodify_nickname(target){

  var param = {
    'access_token':access_token,
    'user_info': {
      'nickname': $(".nickname_val").val(),
      }
  }
  bproto_ajax(SET_USER_INFO,param,function (obj_json) {  
    if(obj_json.code===0){
      alert("更改成功");
      showUserMsg();
      HideEdit(target);
    }
  })
}



//渲染二维码
function RenderQrcode() {
  $(".showqrcode").each(function () {
    var body = { "code": 0 };
    body["label_id"] = toUtf8(toUtf8($(this).text()));
    body["label_name"] = toUtf8($(this).attr("data-bindname").trim())
    body["label_note"] = toUtf8($(this).attr("data-bindnote").trim())
    body["user"] = toUtf8(CurrentUser)
    body["user_id"] = toUtf8(CurrentUserId)
    $(this).text("");
    $(this).qrcode({ text: JSON.stringify(body) })
  })
}


//显示添加用户标签提示框
function ShowAddUserLabel_modal() {
  $("#UserLabelManage_modal").modal("show");
  $(".modal-content").hide();
  $(".AddLabel_content").show();
}

//添加用户标签
function addUserLabel() {
  if ($("#input_label_name").val() === "") {
    toastr.warning("请输入标签名称");
    return;
  }
  if ($("#textarea_label_note").val() === "") {
    toastr.warning("请输入描述信息");
    return;
  }
  param = {
    'access_token': access_token,
    'userlabel_name': $("#input_label_name").val(),
    'userlabel_note': $("#textarea_label_note").val()
  }
  bproto_ajax(USER_LABEL_ADD, param, function (obj_json) {
    console.log(obj_json);
    if (obj_json.code === 0) {
      toastr.success("添加成功");
      $("#input_label_name").val("")
      $("#textarea_label_note").val("")
      closeModal('#UserLabelManage_modal');
      showUserLabel();
    }else{
      toastr.error("添加失败"+obj_json.msg);
    }
  })
}


//设置checkbox按钮逻辑事件
function checkboxClick() {
  //全选按钮
  $("#labelList_all_cb").click(function () {
    if ($("#labelList_all_cb").prop("checked")) {
      $("input[name=cb_label]").each(function () {
        $(this).prop("checked", true)
      });
    } else {
      $("input[name=cb_label]").each(function () {
        $(this).prop("checked", false)
      });

    }
  });
  //单个按钮监听
  $(".showUserLabel tbody").delegate("input[name=cb_label]", "click", function () {
    var isCheck = true;
    var num = 0;
    $("input[name=cb_label]").each(function () {
      if (!$(this).prop("checked")) {
        isCheck = false;
      } else {
        num += 1
      }
    });
    $("#labelList_all_cb").prop("checked", isCheck);

  })
}
// checkboxClick();




//show修改密码提示框
function showupdatePassword_Modal() {
  $("#updatePassword_Modal").modal("show");
  $("#updatePassword_Modal input[type=password]").val("");
  $(".password_tip").hide();
}

function updatePassword() {  
  var oldpassword = $("#oldpassword").val();
  var new1password = $("#new1password").val();
  var new2password = $("#new2password").val();
  if(StrisBlack(oldpassword)||StrisBlack(new1password)||StrisBlack(new2password)){
    $("#oldpassword").trigger("input");
    $("#new1password").trigger("input");
    $("#new2password").trigger("input");
    return;
  }
  // if(new1password!=new2password){
  //   alert("两次密码输入不一致,请重新输入");
  //   $("#new1password").val("").focus();
  //   $("#new2password").val("");
  //   return;
  // }
  var _el = null;
  $(".password_tip").each(function (i,el) {  
    if(!$(el).is(":hidden")){
      _el = el;
      return;
    }
  })

  if(_el){
    $(_el).prev().focus();
    return;
  }
  var param = {
    'access_token':access_token,
    'old_password':oldpassword,
    'new_password':new2password
  }
  bproto_ajax(API_UPDATE_PASSWORD,param,function (obj_json) {  
    if(obj_json.code===0){
      alert("修改成功,请重新登录");
      fun_api_logout();
      // showUserMsg();
      $("#updatePassword_Modal").modal("hide");
      
    }else{
      toastr.error("修改失败"+obj_json.msg);
      
    }
  })
}

$("#oldpassword").on('input',oldpasswordinput);
function oldpasswordinput(e){
  if(e.target.value.length<5){
    $(".oldpassword_tip").show().text("密码过短,必须大于等于5位")
    return;
  }else if(e.target.value.length>64){
    $(".oldpassword_tip").show().text("密码过长,必须小于等于64位")
    return;
  }else{
    $(".oldpassword_tip").hide()
  }
}

$("#new1password").on('input',function(e){
  if(e.target.value.length<5){
    $(".new1password_tip").show().text("密码过短,必须大于等于5位")
    return;
  }else if(e.target.value.length>64){
    $(".new1password_tip").show().text("密码过长,必须小于等于64位")
    return;
  }else{
    $(".new1password_tip").hide()
  }

  if (/[a-z]|[A-Z]/.test(e.target.value)){
    $(".new1password_tip").hide()
  }else{
    $(".new1password_tip").show().text("密码中必须包含一个英文字母")
    return;
  }

  if (/[\u4e00-\u9fa5]/.test(e.target.value)){
    $(".new1password_tip").show().text("密码中不能有中文")
    return;
  }else{
    $(".new1password_tip").hide()
  }

  if($("#new2password").val()!=e.target.value){
    $(".new2password_tip").show().text("两次密码不一致")
    return;
  }else{
    $(".new2password_tip").hide()
  }

})
$("#new2password").on('input',function(e){
  if(e.target.value.length<5){
    $(".new2password_tip").show().text("密码过短,必须大于等于5位")
    return;
  }else if(e.target.value.length>64){
    $(".new2password_tip").show().text("密码过长,必须小于等于64位")
    return;
  }else{
    $(".new2password_tip").hide()
  }
  
  if($("#new1password").val()!=e.target.value){
    $(".new2password_tip").show().text("两次密码不一致")
    return;
  }else{
    $(".new2password_tip").hide()
  }
  // if(e.target.value)
  // if (/[a-z]|[A-Z]/.test(e.target.value))

})




// //input非空判断
// function checkIsblank(target) {
//   target.each(function () {
//     var ele = $(this);
//     if (StrisBlack($(ele).val())) {
      
//     } else {
//       $(ele).popover("hide");
//     }
//   })

// }

//判断字符串是否为空
function StrisBlack(str) {
  str = str.replace(/ /g, "");
  if (str === "" || str.length === 0) {
    return true;
  }
  return false;
}

function closeModal(target) {
  $(target).modal("hide");
  location.hash = "";
}

$(".modal").click(function (e) {
  if (e.target == $("#updatePassword_Modal")[0]) {
    closeModal('#updatePassword_Modal');
    location.hash = "";
  }
});
