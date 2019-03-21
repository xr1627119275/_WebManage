

showWhitchSlider(4)

window.addEventListener('load', function () {
  switch (location.hash) {
    case "#labelList":
      changeContent($("a[data-bind=#labelList]")[0]);
      break;
    default:
      location.hash = "#labelList";
      changeContent($("a[data-bind=#labelList]")[0]);
  }
})

//切换导航
function changeContent(target) {
  $(target).parent().parent().find("li").removeClass("active");
  $(target).parent().addClass("active")

  var targetId = $(target).attr("data-bind");
  $(".content").hide();
  $(targetId).show();
  if ($(target)[0] == $("a[data-bind=#labelList]")[0]) {
    showUserLabel()
  }
}


//展示用户标签信息
function showUserLabel() {
  $("#labelList").show()
  if (window.CurrentUser === undefined) {
    bproto_ajax(GET_LOGIN_MSG_URL, { 'access_token': access_token }, function (obj_json) {
      if (obj_json.code != 0) {
        location.href = '/';
      }
      CurrentUser = obj_json.username;
      getUserLabel();
    })
  } else {
    getUserLabel();
  }
}
function getUserLabel() {

  param = { 'access_token': access_token, "username": CurrentUser };

  bproto_ajax(USER_LABEL_GET, param, function (obj_json) {
    // console.log(obj_json);
    if (!window.CurrentUserId) {
      access_token = $.cookie("access_token");
      var param = { "access_token": access_token };
      RenderUserLabel(obj_json);
    } else {
      RenderUserLabel(obj_json);
    }
    RenderQrcode();
  })
}


//渲染用户标签列表
function RenderUserLabel(list) {
  // for (let i = 0; i < list.certs.length; i++) {
  //     list.certs[i].ValidityBegin_ = list.certs[i].ValidityBegin.replace(" ","T");
  //     list.certs[i].ValidityEnd_ = list.certs[i].ValidityEnd.replace(" ","T");
  // }

  $("#labelList .showUserLabel table tbody").html(template('labelList_template', list))
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
    } else {
      toastr.error("添加失败" + obj_json.msg);
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

//编辑按钮逻辑
function ShowEdit(target) {
  $(target).parent().parent().find(".edit").show();
  $(target).parent().parent().find(".source").hide();
  $(target).parent().parent().find(".disable").prop("disabled", false);
  $(target).parent().parent().find(".disable").focus();
}
function HideEdit(target) {
  $(target).parent().parent().parent().find(".source").show();
  $(target).parent().parent().parent().find(".edit").hide();
  $(target).parent().parent().find(".disable").val($(target).parent().parent().find(".disable").attr("data-bind"));
  $(target).parent().parent().find("input.edit").val($(target).parent().parent().find("input.edit").attr("data-bind"));
  $(target).parent().parent().find(".disable").prop("disabled", true);
}

//删除一个用户标签
function RemoveOneUserLabel(id) {
  var isdel = confirm("确认删除");
  if (isdel === false) {
    return
  }

  param = {
    'access_token': access_token,
    'userlabels': [id]
  };
  bproto_ajax(USER_LABEL_DEL, param, function (obj_json) {
    console.log(obj_json);
    if (obj_json.code === 0) {
      toastr.success("删除成功");
      showUserLabel();
    } else {
      toastr.error("删除成功" + obj_json.msg);
    }
  })
}

//删除用户标签
function RemoveUserLabel() {
  var isdel = confirm("确认删除");
  if (isdel === false) {
    return
  }
  var isCheck = false;
  var userlabels = [];
  $("input[name=cb_label]").each(function () {
    if ($(this).prop("checked")) {
      isCheck = true;
      userlabels.push($(this).attr("data-bind"));
    }
  });
  if (!isCheck) { toastr.warning("请选择用户标签"); return; }
  param = {
    'access_token': access_token,
    'userlabels': userlabels
  };
  bproto_ajax(USER_LABEL_DEL, param, function (obj_json) {
    console.log(obj_json);
    if (obj_json.code === 0) {
      toastr.success("删除成功");
      $("#labelList_all_cb").prop("checked", false);
      showUserLabel();
    } else {
      toastr.error("删除失败" + obj_json.msg);
    }
  })
}

//show修改用户标签信息提示框
function ShowUpdateUserLabel_modal() {
  var isCheck = false;
  var label_note = "";
  $("input[name=cb_label]").each(function () {
    if ($(this).prop("checked")) {
      isCheck = true;
      label_note = $(this).parent().parent().find(".textarea_label_note").text();
      currentLabelId = $(this).attr("data-bind");
      return;
    }
  });

  if (!isCheck) {
    toastr.warning("请选择要修改的标签");
    return;
  }
  $("#UserLabelManage_modal").modal("show");
  $("#update_textarea_label_note").val(label_note);
  $("#update_textarea_label_note").attr("placeholder", label_note);
  $(".modal-content").hide();
  $(".UpdateLabel_content").show();
}
//修改用户标签信息
function UpdateUserLabel(id, target) {
  var name = $(target).parent().parent().find('.label_name').val();
  var note = $(target).parent().parent().find('textarea').val();

  if (name === "") {
    toastr.warning("标签名称不能为空");
    return;
  }

  param = {
    'access_token': access_token,
    'userlabel_id': id,
    'userlabel_note': note,
    'userlabel_name': name
  }
  bproto_ajax(USER_LABEL_UPDATE, param, function (obj_json) {
    console.log(obj_json);
    if (obj_json.code === 0) {
      toastr.success("修改成功");
      showUserLabel();
    } else {
      toastr.error("修改失败" + obj_json.msg);
    }
  })
}



$(".showUserLabel").on("click", "input[name=cb_label]", function () {
  var isall = true;
  $("input[name=cb_label]").each(function (i, el) {
    if (!$(el).prop("checked")) {
      isall = false;
    }
  })
  $("#labelList_all_cb").prop("checked", isall);
});
$("#labelList_all_cb").click(function () {
  $("input[name=cb_label]").prop("checked", $(this).prop("checked"))
})


function downloadCanvasIamge(selector, name) {
  // 通过选择器获取canvas元素
  var canvas = document.querySelector(selector)
  // 使用toDataURL方法将图像转换被base64编码的URL字符串
  var url = canvas.toDataURL('image/png')
  // 生成一个a元素
  var a = document.createElement('a')
  // 创建一个单击事件
  var event = new MouseEvent('click')
  
  // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
  a.download = name || '二维码'
  // 将生成的URL设置为a.href属性
  a.href = url
  
  // 触发a的单击事件
  a.dispatchEvent(event);
  toastr.success("下载成功");
}

// 调用方式
// 参数一： 选择器，代表canvas
// 参数二： 图片名称，可选
// downloadCanvasIamge('canvas', '图片名称')

//汉字转UTF8
function toUtf8(str) {
  var out, i, len, c;
  out = "";
  len = str.length;
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if ((c >= 0x0001) && (c <= 0x007F)) {
      out += str.charAt(i);
    } else if (c > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    } else {
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    }
  }
  return out;
}

function closeModal(target) {
  $(target).modal("hide");
}

$(".modal").click(function (e) {
  if (e.target == $("#UserLabelManage_modal")[0]) {
    closeModal('#UserLabelManage_modal')
  }
});
