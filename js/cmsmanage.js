currentCMSListPage_total = 0;//初始化授权设备总页数
currentCMSListPage = 0; //初始化授权设备当前页数
currentCMSListPageSize = 20; // 初始化授权设备每页获取数据


//初始化黑名单页数数据
currentCMSBlackListPage_total = 0;
currentCMSBlackListPage = 0;
currentCMSBlackListPageSize = 20;

//初始化白名单页数数据
currentCMSWhiteListPage_total = 0;
currentCMSWhiteListPage = 0;
currentCMSWhiteListPageSize = 20;


currentCMS = '';


switch (location.hash) {
  case "#cmslist":
    changeContent($("a[data-bind=#cmslist]")[0]);
    break;
  case "#black_white":
    changeContent($("a[data-bind=#black_white]")[0]);
    break;
  default:
    location.hash = "#cmslist";
    changeContent($("a[data-bind=#cmslist]")[0]);
}

//切换导航
function changeContent(target) {
  var targetId = $(target).attr("data-bind");
  $(".content").hide();
  $(targetId).show();
  if ($(target)[0] == $("a[data-bind=#cmslist]")[0]) {
    GetUserMsg_CallBack(showCmsList)
  } else if ($(target)[0] == $("a[data-bind=#black_white]")[0]) {
    GetUserMsg_CallBack(showBlack_White_list)
  }
}

//cms信息列表
function showCmsList() {
  param = {
    "access_token": access_token,
    'page': currentCMSListPage,
    'user_id': CurrentUserId,
    'page_size': currentCMSListPageSize,
    'filter': {"type": "CMS"}
  };
  AjaxPost(GET_USER_TERMINAL_LIST, param).then(function (obj_json) {
    if (obj_json.terminal_list.length === 0) {
      alert("已经是最后一页");
      return;
    }
    currentCMSListPage = obj_json.page;
    // currentCMSListPageSize = obj_json.page_size;
    currentCMSListPage_total = obj_json.page_total;

    var templist = [];
    for (let i = 0; i < obj_json.terminal_list.length; i++) {
      templist.push(obj_json.terminal_list[i].SerialNumber);
    }

    return AjaxPost(GET_CMS_INFO, {'access_token': access_token, 'cms_list': templist})
  }).then(
      function (obj_json) {
        $("#cmslist .cmslistContent .cmstablebox tbody").html(template("cmsListTemp", obj_json))
        $("#black_white .cmslistContent .cmstablebox tbody").html(template("cmsBlackWhiteListTemp", obj_json))
      }
  )
}

//CMS黑白名单CMS列表
function showBlack_White_list() {
  $("#black_white .black_whiteContent").hide();
  $("#black_white .cmslistContent").show()
  param = {
    "access_token": access_token,
    'page': currentCMSListPage,
    'user_id': CurrentUserId,
    'page_size': currentCMSListPageSize,
    'filter': {"type": "CMS"}
  };
  AjaxPost(GET_USER_TERMINAL_LIST, param).then(function (obj_json) {
    if (obj_json.terminal_list.length === 0) {
      alert("已经是最后一页");
      return;
    }
    currentCMSListPage = obj_json.page;
    // currentCMSListPageSize = obj_json.page_size;
    currentCMSListPage_total = obj_json.page_total;

    var templist = [];
    for (let i = 0; i < obj_json.terminal_list.length; i++) {
      templist.push(obj_json.terminal_list[i].SerialNumber);
    }

    return AjaxPost(GET_CMS_INFO, {'access_token': access_token, 'cms_list': templist})
  }).then(
      function (obj_json) {
        $("#cmslist .cmslistContent .cmstablebox tbody").html(template("cmsListTemp", obj_json))
        $("#black_white .cmslistContent .cmstablebox tbody").html(template("cmsBlackWhiteListTemp", obj_json))

      }
  )
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

//根据page页数获取在线设备
function getCMSTerm_list(page) {

  GetUserMsg_CallBack(function () {
    if (page < 0) {
      page = 0
    }
    param = {
      "access_token": access_token,
      'page': page,
      'user_id': CurrentUserId,
      'page_size': currentCMSListPageSize,
      'filter': {"type": "CMS"}
    };
    AjaxPost(GET_USER_TERMINAL_LIST, param).then(function (obj_json) {
      if (obj_json.terminal_list.length === 0) {
        alert("已经是最后一页");
        return;
      }
      currentCMSListPage = obj_json.page;
      // currentCMSListPageSize = obj_json.page_size;
      currentCMSListPage_total = obj_json.page_total;

      var templist = [];
      for (let i = 0; i < obj_json.terminal_list.length; i++) {
        templist.push(obj_json.terminal_list[i].SerialNumber);
      }

      return AjaxPost(GET_CMS_INFO, {'access_token': access_token, 'cms_list': templist})
    }).then(
        function (obj_json) {
          $("#cmslist .cmslistContent .cmstablebox tbody").html(template("cmsListTemp", obj_json))
          $("#black_white .cmslistContent .cmstablebox tbody").html(template("cmsBlackWhiteListTemp", obj_json))

        }
    )

  })
}

//根据page页数获取黑名单
function getCMSBlack_list(page) {

  GetUserMsg_CallBack(function () {
    if (page < 0) {
      page = 0
    }
    var param = {
      'access_token': access_token,
      'filter': {
        'cms': currentCMS,
        'item_type': 'BlackList',
      },
      'page': page, 'page_size': currentCMSBlackListPageSize,
    };
    AjaxPost(GET_BLACK_WHITE_LIST_FILTER, param).then(function (obj_json) {
      if(obj_json.code===0){
        if (obj_json.list.length === 0) {
          alert("已经是最后一页");
          return;
        }
        currentCMSBlackListPage = obj_json.page;
        // currentCMSBlackListPageSize = obj_json.page_size;
        currentCMSBlackListPage_total = obj_json.page_total;

        BW_fields_Name2Chinese(obj_json);
        $("#black_white .BlackWhiteListContent .showBlackWhiteMsg .Blacktablebox tbody").html(template("BlackListTemp", obj_json))
        RenderSelectField(function () {
          var target = $("#black_white .showBlackWhiteMsg .Blacktablebox .FieldSelectList");

          target.each(function () {
            $(this).find("option[value="+$(this).attr("data-bind")+"]").prop("selected",true);
          });
        })

      }
    })

  })
}

//根据page页数获取白名单
function getCMSWhite_list(page) {

  GetUserMsg_CallBack(function () {
    if (page < 0) {
      page = 0
    }
    var param = {
      'access_token': access_token,
      'filter': {
        'cms': currentCMS,
        'item_type': 'WhiteList',
      },
      'page': page, 'page_size': currentCMSBlackListPageSize,
    };
    AjaxPost(GET_BLACK_WHITE_LIST_FILTER, param).then(function (obj_json) {
      if(obj_json.code===0){
        if (obj_json.list.length === 0) {
          alert("已经是最后一页");
          return;
        }
        currentCMSWhiteListPage = obj_json.page;
        // currentCMSWhiteListPageSize = obj_json.page_size;
        currentCMSWhiteListPage_total = obj_json.page_total;

        BW_fields_Name2Chinese(obj_json);
        $("#black_white .BlackWhiteListContent .showBlackWhiteMsg .Whitetablebox tbody").html(template("BlackListTemp", obj_json))
        RenderSelectField(function () {
          var target = $("#black_white .showBlackWhiteMsg .Whitetablebox .FieldSelectList");

          target.each(function () {
            $(this).find("option[value="+$(this).attr("data-bind")+"]").prop("selected",true);
          });
        })
      }
    })

  })
}


//select选择每页的显示多少条
$(".pageSelect").change(function () {
  window[$(this).attr("name")] = parseInt($(this).find("option:selected").val());
  window[$(this).attr("data-bind")](currentCMS);
});




//更新CMS设备使用的是黑白名单
function CMSUpdateBW() {
  var bw = $("input[name=CMSbwManage]:checked").val();

  AjaxPost(UPDATE_CMS_INFO,{"access_token": access_token,
    "term": currentCMS,"cms":{"use_list_type":bw}}).then(function (obj_json) {
    if(obj_json.code===0){
      $("input[value="+bw+"][name=CMSbwManage]").prop("checked",true)
    }
  })
}



//展示黑名单列表
function showBlack_list(cms) {
  currentCMS = cms;

  AjaxPost(GET_CMS_INFO,{"access_token":access_token,"cms_list":[cms]}).then(function (obj_json) {
    if(obj_json.cms_list.length>0){
        $("input[value="+obj_json.cms_list[0].use_white_black_list_type+"][name=CMSbwManage]").prop("checked",true)
      }
  });


  $("#black_white .black_whiteContent").hide();
  $("#black_white .BlackWhiteListContent").show()

  var param = {
    'access_token': access_token,
    'filter': {
      'cms': cms,
      'item_type': 'BlackList',
    },
    'page': 0, 'page_size': currentCMSBlackListPageSize,
  };
  AjaxPost(GET_BLACK_WHITE_LIST_FILTER, param).then(function (obj_json) {
    if(obj_json.code===0){
      currentCMSBlackListPage = obj_json.page;
      // currentCMSBlackListPageSize = obj_json.page_size;
      currentCMSBlackListPage_total = obj_json.page_total;

      BW_fields_Name2Chinese(obj_json);
      $("#black_white .BlackWhiteListContent .showBlackWhiteMsg .Blacktablebox tbody").html(template("BlackListTemp", obj_json))

      RenderSelectField(function () {
        var target = $("#black_white .showBlackWhiteMsg .Blacktablebox .FieldSelectList");

        target.each(function () {
          $(this).find("option[value="+$(this).attr("data-bind")+"]").prop("selected",true);
        });
      })
    }

  })


  showWhite_list(currentCMS);
}

//展示白名单列表
function showWhite_list(cms) {
  currentCMS = cms;
  $(".Content").hide();
  $(".BlackWhiteContent").show()

  var param = {
    'access_token': access_token,
    'filter': {
      'cms': cms,
      'item_type': 'WhiteList',
    },
    'page': 0, 'page_size': currentCMSWhiteListPageSize,
  };
  AjaxPost(GET_BLACK_WHITE_LIST_FILTER, param).then(function (obj_json) {
    if(obj_json.code===0){

      currentCMSWhiteListPage = obj_json.page;
      // currentCMSBlackListPageSize = obj_json.page_size;
      currentCMSWhiteListPage_total = obj_json.page_total;

      BW_fields_Name2Chinese(obj_json);
      $("#black_white .BlackWhiteListContent .showBlackWhiteMsg .Whitetablebox tbody").html(template("WhiteListTemp", obj_json))

      RenderSelectField(function () {
        var target = $("#black_white .showBlackWhiteMsg .Whitetablebox .FieldSelectList");

        target.each(function () {
          $(this).find("option[value="+$(this).attr("data-bind")+"]").prop("selected",true);
        });
      })
    }
  })
}

$('.showBlackWhiteMsg a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  if ($(".showBlackWhiteMsg ul li a:first-child")[0] === e.target) {
    // showBlack_list(currentCMS)
  } else {
    // showWhite_list(currentCMS)
  }

});

//渲染黑白名单字段select
function RenderSelectField(func) {
  if(!window.CurrentSelectField){
    var param = {'access_token': access_token};
    AjaxPost(GET_BW_FIELD_TYPE_LIST, param).then(function (obj_json) {
      BW_fields_Name2Chinese(obj_json);
      CurrentSelectField = obj_json;
      var html = "";
      for (let i = 0; i < obj_json.fields.length; i++) {
        html += '<option value="' + obj_json.fields[i].split("|")[0] + '">' + obj_json.fields[i].split("|")[1] + '</option>';
      }
      $(".FieldSelectList").html(html)
      func()
    })
  }else{
    var html = "";
    for (let i = 0; i < CurrentSelectField.fields.length; i++) {
      html += '<option value="' + CurrentSelectField.fields[i].split("|")[0] + '">' + CurrentSelectField.fields[i].split("|")[1] + '</option>';
    }
    $(".FieldSelectList").html(html);
    func()
  }

}


//显示添加用户标签提示框
function ShowAddBlack_White() {
  $("#AddBlackWhite_Modal").modal("show");
  $("#AddBlackWhite_Modal .addField tbody").html($("#AddBalckWhiteSelect").html());
  $("#AddBlackWhite_Modal .modal-body").css('maxHeight', $(window).height() * 0.6);
  RenderSelectField(function () {
    //null
  })

}

//添加一行黑白名单
function addTrField(target) {

  $(target).parent().parent().html($(target).parent().parent().parent().find("tr:nth-child(1)").html());
  $("#AddBlackWhite_Modal .addField tbody").append('<tr>\n' +
      '              <td colspan="4">\n' +
      '                <input type="button" class="btn btn-primary" value="添加一行" onclick="addTrField(this)">\n' +
      '              </td>\n' +
      '            </tr>')

}

//提示框中删除一行黑白名单
function delBlackWhiteField(target) {
  $(target).parent().parent().remove()
}



//添加黑白名单
function AddBWField() {
  var add_list = [];
  var length = $("#AddBlackWhite_Modal .addField tbody tr:nth-child(n+2)").length;
  var num = 1;

  $("#AddBlackWhite_Modal .addField tbody tr:nth-child(n+2)").each(function () {
    if($(this).find(".input_addfield").val()===""){
      alert("请填写数据");
      return;
    }
  });


  $("#AddBlackWhite_Modal .addField tbody tr:nth-child(n+2)").each(function () {
    if(num===length){
      return;
    }
    add_list.push({
      "cms":currentCMS,
      "item_type":$(this).find("select option:selected")[0].value,
      "field_type":$(this).find("select option:selected")[1].value,
      "field_value":$(this).find(".input_addfield").val()
    });
    num++;
  });

  var param = {
    'access_token': access_token,
    'add_list': add_list
  };
  AjaxPost(UPDATE_BLACK_WHITE_LIST_FILTER, param).then(function (obj_json) {
    if (obj_json.code === 0) {
      alert("添加成功");
      showBlack_list(currentCMS);
      showWhite_list(currentCMS);
      $("#AddBlackWhite_Modal").modal("hide");
    }
  })
}



//编辑黑白名单
function ShowEdit(target) {
  $(target).parent().parent().find(".edit").show();
  $(target).parent().parent().find(".source").hide();
}
function HideEdit(target){
  $(target).parent().parent().parent().find(".source").show();
  $(target).parent().parent().parent().find(".edit").hide();
}

//编辑确认按钮
function DoEdit(target,id,BW){
  var val = $(target).parent().parent().parent().find("input.edit").val()
  if(val===""){
    alert("请输入修改后的值");
    return;
  }
  var param ={
    'access_token':access_token,
    "update_list":[{
      "id":parseInt(id),
      "cms":currentCMS,
      "item_type":"BlackList",
      "field_type":$(target).parent().parent().parent().find(".FieldSelectList option:selected").val(),
      'field_value':val
    }]
  };

  AjaxPost(UPDATE_BLACK_WHITE_LIST_FILTER,param).then(function (obj_json) {
    if(obj_json.code===0){
      alert("更改成功");
      showBlack_list(currentCMS);
      showWhite_list(currentCMS);
    }
  })
}



//删除黑白名单
function delW(id) {
  var param = {
    'access_token': access_token,
    'del_list': [id]
  };
  AjaxPost(UPDATE_BLACK_WHITE_LIST_FILTER, param).then(function (obj_json) {
    showWhite_list(currentCMS);
  });

}
//删除黑白名单
function delB(id) {
  var param = {
    'access_token': access_token,
    'del_list': [id]
  };
  AjaxPost(UPDATE_BLACK_WHITE_LIST_FILTER, param).then(function (obj_json) {
    showBlack_list(currentCMS)
  });
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


//删除用户标签
function RemoveUserLabel() {
  var isCheck = false;
  var userlabels = [];
  $("input[name=cb_label]").each(function () {
    if ($(this).prop("checked")) {
      isCheck = true;
      userlabels.push($(this).attr("data-bind"));
    }
  });
  if (!isCheck) {
    alert("请选择用户标签");
    return;
  }
  param = {
    'access_token': access_token,
    'userlabels': userlabels
  };
  bproto_ajax(USER_LABEL_DEL, param, function (obj_json) {
    console.log(obj_json);
    if (obj_json.code === 0) {
      alert("删除成功");
      $("#labelList_all_cb").prop("checked", false);
      showUserLabel();
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
    alert("请选择要修改的标签");
    return;
  }
  $("#UserLabelManage_modal").modal("show");
  $("#update_textarea_label_note").val(label_note);
  $("#update_textarea_label_note").attr("placeholder", label_note);
  $(".modal-content").hide();
  $(".UpdateLabel_content").show();
}

//修改用户标签信息
function UpdateUserLabel() {
  if ($("#update_input_label_name").val() === "") {
    alert("请输入标签名称");
    return;
  }
  if ($("#update_textarea_label_note").val() === "") {
    alert("请输入描述信息");
    return;
  }
  param = {
    'access_token': access_token,
    'userlabel_id': currentLabelId,
    'userlabel_note': $("#update_textarea_label_note").val(),
    'userlabel_name': $("#update_input_label_name").val()
  }
  bproto_ajax(USER_LABEL_UPDATE, param, function (obj_json) {
    console.log(obj_json);
    if (obj_json.code === 0) {
      alert("修改成功");
      $("#update_input_label_name").val("")
      $("#update_textarea_label_note").val("")
      closeModal('#UserLabelManage_modal');
      showUserLabel();
    }
  })
}


//将数组中英文翻译
function BW_fields_Name2Chinese(list) {
  if(list.list){
    for (let i = 0; i < list.list.length; i++) {
      switch (list.list[i].field_type.toString()) {
        case "CLI_ID":
          list.list[i].field_type = list.list[i].field_type + "|设备ID";
          break;
        case "HardwareProvider":
          list.list[i].field_type = list.list[i].field_type + "|硬件供应商";
          break;
        case "HardwareSN":
          list.list[i].field_type = list.list[i].field_type + "|硬件SN码";
          break;
        case "SoftwareProvider":
          list.list[i].field_type = list.list[i].field_type + "|软件供应商";
          break;
        case "OSID":
          list.list[i].field_type = list.list[i].field_type + "|系统ID";
          break;
        case "OSType":
          list.list[i].field_type = list.list[i].field_type + "|系统类型";
          break;
        case "HardwareVersion":
          list.list[i].field_type = list.list[i].field_type + "|硬件版本";
          break;
        case "SoftwareVersion":
          list.list[i].field_type = list.list[i].field_type + "|软件版本";
          break;
        case "OSVersion":
          list.list[i].field_type = list.list[i].field_type + "|系统版本";
          break;
        case "SerialNumber":
          list.list[i].field_type = list.list[i].field_type + "|序列号";
          break;
        case "ModuleNumber":
          list.list[i].field_type = list.list[i].field_type + "|类型验证";
          break;
        case "Type":
          list.list[i].field_type = list.list[i].field_type + "|类型";
          break;
        default:
          list.list[i].field_type = list.list[i].field_type + "|" + list.list[i].field_type;
      }
    }
  }else {

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
        case "HardwareVersion":
          list.fields[i] = list.fields[i] + "|硬件版本";
          break;
        case "SoftwareVersion":
          list.fields[i] = list.fields[i] + "|软件版本";
          break;
        case "OSVersion":
          list.fields[i] = list.fields[i] + "|系统版本";
          break;
        case "SerialNumber":
          list.fields[i] = list.fields[i] + "|序列号";
          break;
        case "ModuleNumber":
          list.fields[i] = list.fields[i] + "|类型验证";
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


//返回按钮
function Back(target1, target2) {
  $(target1).hide();
  $(target1 + target2).show();
}


function closeModal(target) {
  $(target).modal("hide");
}

$(".modal").click(function (e) {
  if (e.target == $("#AddBlackWhite_Modal")[0]) {
    closeModal("#AddBlackWhite_Modal");
  } else if (e.target == $("#ModuleFieldManage_Modal")[0]) {
    closeModal("#ModuleFieldManage_Modal");
  }
});