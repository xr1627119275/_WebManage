currentCMSListPage_total = 0;//初始化授权设备总页数
currentCMSListPage = 0; //初始化授权设备当前页数
currentCMSListPageSize = 20; // 初始化授权设备每页获取数据


//初始化CMS设备页数数据
currentCMSDevicePage_total = 0;
currentCMSDevicePage = 0;
currentCMSDevicePageSize = 20;

//初始化黑名单页数数据
currentCMSBlackListPage_total = 0;
currentCMSBlackListPage = 0;
currentCMSBlackListPageSize = 20;

//初始化白名单页数数据
currentCMSWhiteListPage_total = 0;
currentCMSWhiteListPage = 0;
currentCMSWhiteListPageSize = 20;

//默认添加黑名单
currentAddBW = "WhiteList";


currentCMS = '';

showWhitchSlider(2)

var resizeWaiter = false;
$(window).resize(function() {
    if(!resizeWaiter){
        resizeWaiter = true;
        setTimeout(function(){
            $(".showBlackWhiteMsg .Blacktablebox,.showBlackWhiteMsg .Whitetablebox").height($(window).height() - $(".Whitetablebox").offset().top - 60);
            resizeWaiter = false;
        }, 500);
    }
});
//动态设置table高度
// $(window).resize(function () {
  
  // $(".tablebox").height($(window).height() - $(".account").height() - $(".tablebox").offset().top-60);
  // $(".tablebox_authterm").height($(window).height() - $(".Auth_pager").height() - $(".tablebox_authterm").offset().top);
  // $(".tablebox_online").height($(window).height() - parseInt(online_account_ishide ? "" + $("#onlineTerminal .account").height() : "0") - $(".tablebox_online").offset().top - 60);
  // console.log("change")
// }).trigger("resize");
window.addEventListener('load',function () { 
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
})
//切换导航
function changeContent(target) {
  $(target).parent().parent().find("li").removeClass("active");
  $(target).parent().addClass("active")

  var targetId = $(target).attr("data-bind");
  $(".content").hide();
  $(targetId).show();
  if ($(target)[0] == $("a[data-bind=#cmslist]")[0]) {
    GetUserMsg_CallBack(showCmsList)
  } else if ($(target)[0] == $("a[data-bind=#black_white]")[0]) {
    GetUserMsg_CallBack(showBlack_White_list)
  }
}

//双击table Th逻辑
// $("body").on("dblclick","th",function () {
//   var index = $(this)[0].cellIndex;
//   console.log(index)
//   let el = $(this).parent().parent().parent().find("td:nth-child("+(index+1)+")");
//   let maxwidth = $(this).text().length*15;
//   if(!$(this)[0].dbclick){
//     el.addClass("table_td").css("maxWidth",maxwidth)
//     el.each(function(){$(this).attr("title",$(this).text())})
//   }else{
//     el.removeClass("table_td").css("maxWidth","")
//   }
//   $(this)[0].dbclick = !$(this)[0].dbclick
// })

 
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

//处理table中Th 合并
function RenderTable_Th(target) {
  return;
  $(target+" th").each(function (i,ele) {
    $(this).attr("title","双击展开列表")
    if(i>0){
      let el = $(this).parent().parent().parent().find("td:nth-child("+(i+1)+")");
      el.addClass("table_td").css("maxWidth",$(this).text().length*15)
      el.each(function(){$(this).attr("title",$(this).text())})
      $(this)[0].dbclick = true;
    }
  })
}

//cms信息列表
function showCmsList() {
  $(".content").hide();
  $("#cmslist").show();
  var param = {
    "access_token": access_token,
    'page': 0,
    'user_id': CurrentUserId,
    'page_size': currentCMSListPageSize,
  };
  AjaxPost(GET_CMS_INFO_LIST, param).then(
      function (obj_json) {
        currentCMSListPage = obj_json.page;
        currentCMSListPage_total = obj_json.page_total;
        $("#cmslist .cmslistContent .cmstablebox tbody").html(template("cmsListTemp", obj_json))
      }
  )
}

//查看cmsPu设备信息
function showDeviceMsg(cms){
  currentCMS = cms;

  $("#cmslist .CmsContent").hide();
  $("#cmslist .cmsDevicelistContent").show();

  RenderCmsDevice()
}

//渲染CMSPu设备table
function RenderCmsDevice() {
  var param = {
    "access_token": access_token,
    "term": currentCMS,
    "page": 0,
    "page_size": currentCMSDevicePageSize
  }
  AjaxPost(GET_CMS_PU_LIST,param)
      .then(function (obj_json) {

        currentCMSDevicePage = obj_json.page;
        currentCMSDevicePage_total = obj_json.page_total;

        $("#cmslist .CmsContent .cmsDevicetablebox tbody").html(template("cmsDeviceListTemp", obj_json))
      })
}





//CMS黑白名单CMS列表
function showBlack_White_list() {

  $("#black_white .black_whiteContent").hide();
  $("#black_white .bwcmslistContent").show();
  param = {

    "access_token": access_token,
    'page': currentCMSListPage,
    'user_id': CurrentUserId,
    'page_size': currentCMSListPageSize,
    'filter': {"type": "CMS"}
  };
  AjaxPost(GET_USER_TERMINAL_LIST, param).then(function (obj_json) {
    // if (obj_json.terminal_list.length === 0) {
    //   alert("已经是最后一页");
    //   return;
    // }
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
        // $("#cmslist .cmslistContent .cmstablebox tbody").html(template("cmsListTemp", obj_json))
        $("#black_white .bwcmslistContent .cmstablebox tbody").html(template("cmsBlackWhiteListTemp", obj_json))
        RenderTable_Th("#black_white .bwcmslistContent")
      }
  )
}



//在线设备上一页设备
function bindPager_Previous(target_page,func) {
  if (target_page === 0) {
    toastr.info("已经是第一页了");
    return
  }
  target_page -= 1;
  func(target_page);
}

//在线设备下一页设备
function bindPager_Next(target_page,total_page,func) {
  if (total_page === 0 || target_page === total_page - 1) {
    toastr.info("已经是最后一页了");
    return;
  }
  target_page += 1;
  func(target_page);
}

//根据page页数获取CMS信息
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
    };
    AjaxPost(GET_CMS_INFO_LIST, param).then(
      function (obj_json) {
        currentCMSListPage = obj_json.page;
        currentCMSListPage_total = obj_json.page_total;
        $("#cmslist .cmslistContent .cmstablebox tbody").html(template("cmsListTemp", obj_json))
      }
    )

  })
}

//根据page页数获取CMSPu设备信息
function getCMSPuDevice_list(page) {
  var param = {
    "access_token": access_token,
    "term": currentCMS,
    "page": page,
    "page_size": currentCMSDevicePageSize
  }
  AjaxPost(GET_CMS_PU_LIST,param)
      .then(function (obj_json) {
        if(obj_json.pu_list.length===0){
          toastr.info("已经是最后一页");
          return;
        }
        currentCMSDevicePage = obj_json.page;
        currentCMSDevicePage_total = obj_json.page_total;
        $("#cmslist .CmsContent .cmsDevicetablebox tbody").html(template("cmsDeviceListTemp", obj_json))
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
          toastr.info("已经是最后一页");
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
          toastr.info("已经是最后一页");
          return;
        }
        currentCMSWhiteListPage = obj_json.page;
        // currentCMSWhiteListPageSize = obj_json.page_size;
        currentCMSWhiteListPage_total = obj_json.page_total;

        BW_fields_Name2Chinese(obj_json);
        $("#black_white .BlackWhiteListContent .showBlackWhiteMsg .Whitetablebox tbody").html(template("BlackListTemp", obj_json))
        $(".showBlackWhiteMsg .Blacktablebox,.showBlackWhiteMsg .Whitetablebox").height($(window).height() - $(".Whitetablebox").offset().top - 60);
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
  var mxdevice = $("input[name=MaxDevices]").val();
  var mxonlinedevice = $("input[name=MaxOnlineDevices]").val();

  var param = {
    "access_token": access_token,
    "term": currentCMS,
    "cms":{
      "use_list_type":bw,
      "max_pu_count":parseInt(mxdevice),
      "max_online_pu_count":parseInt(mxonlinedevice),
    }
  }
  AjaxPost(UPDATE_CMS_INFO,param).then(function (obj_json) {
    if(obj_json.code===0){
      $("input[value="+bw+"][name=CMSbwManage]").prop("checked",true)
      $("input[name=MaxDevices]").val(mxdevice)
      toastr.success("保存成功")
    }else{
      toastr.error("保存失败"+obj_json.code)
    }
  })
}




//展示黑名单列表
function showBlack_list(cms) {
  currentCMS = cms;

  AjaxPost(GET_CMS_INFO,{"access_token":access_token,"cms_list":[cms]}).then(function (obj_json) {
    if(obj_json.cms_list.length>0){
        $("input[value="+obj_json.cms_list[0].use_white_black_list_type+"][name=CMSbwManage]").prop("checked",true)
        $("input[name=MaxDevices]").val(obj_json.cms_list[0].max_pu_count)
        $("input[name=MaxOnlineDevices]").val(obj_json.cms_list[0].max_online_pu_count)
      }
  });


  $("#cmslist .CmsContent").hide();
  $("#cmslist .BlackWhiteListContent").show()

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
      $("#cmslist .BlackWhiteListContent .showBlackWhiteMsg .Blacktablebox tbody").html(template("BlackListTemp", obj_json))

      RenderSelectField(function () {
        var target = $("#cmslist .showBlackWhiteMsg .Blacktablebox .FieldSelectList");

        target.each(function () {
          $(this).find("option[value="+$(this).attr("data-bind")+"]").prop("selected",true);
        });
      })
    }

  });
  $(".showBlackWhiteMsg .Blacktablebox,.showBlackWhiteMsg .Whitetablebox").height($(window).height() - $(".showBlackWhiteMsg .Blacktablebox").offset().top - 60);

  showWhite_list(currentCMS);
}


//显示添加黑白名单提示框
function ShowAddBlack_White() {
  $("#AddBlackWhite_Modal").modal("show");
  $("#AddBlackWhite_Modal .addField tbody").html($("#AddBalckWhiteSelect").html());
  $(".selectbw option[value="+currentAddBW+"]").prop("selected",true);
  $("#AddBlackWhite_Modal .modal-body").css('maxHeight', $(window).height() * 0.6);
  RenderSelectField(function () {
    
  })

}

//展示白名单列表
function showWhite_list(cms) {
  currentCMS = cms;
  $(".Content").hide();
  $(".BlackWhiteContent").show()

  AjaxPost(GET_CMS_INFO,{"access_token":access_token,"cms_list":[cms]}).then(function (obj_json) {
    if(obj_json.cms_list.length>0){
        $("input[value="+obj_json.cms_list[0].use_white_black_list_type+"][name=CMSbwManage]").prop("checked",true)
        $("input[name=MaxDevices]").val(obj_json.cms_list[0].max_pu_count)
        $("input[name=MaxOnlineDevices]").val(obj_json.cms_list[0].max_online_pu_count)
      }
  });


  $("#cmslist .black_whiteContent").hide();
  $("#cmslist .BlackWhiteListContent").show();
  
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
      $("#cmslist .BlackWhiteListContent .showBlackWhiteMsg .Whitetablebox tbody").html(template("WhiteListTemp", obj_json))
      $(".showBlackWhiteMsg .Blacktablebox,.showBlackWhiteMsg .Whitetablebox").height($(window).height() - $(".Whitetablebox").offset().top - 60);
      RenderSelectField(function () {
        var target = $("#cmslist .showBlackWhiteMsg .Whitetablebox .FieldSelectList");

        target.each(function () {
          $(this).find("option[value="+$(this).attr("data-bind")+"]").prop("selected",true);
        });
      })
    }
  })
}

$('.showBlackWhiteMsg a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  if ($(".showBlackWhiteMsg ul li a:first-child")[0] === e.target) {
    currentAddBW = "WhiteList";
  } else {
    currentAddBW = "BlackList";
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


//添加一行黑白名单
function addTrField(target) {
  $(target).parent().parent().html($(target).parent().parent().parent().find("tr:nth-child(1)").html());
  $("#AddBlackWhite_Modal .addField tbody").append('<tr>\n' +
      '              <td colspan="4">\n' +
      '                <input type="button" class="btn btn-primary" value="添加一行" onclick="addTrField(this)">\n' +
      '              </td>\n' +
      '            </tr>')
  $(".selectbw option[value="+currentAddBW+"]").prop("selected",true);

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
  var isNUll = false;

  $("#AddBlackWhite_Modal .addField tbody tr:nth-child(n+2)").each(function () {
    if($(this).find(".input_addfield").val()===""){
      isNUll = true;
    }
  });
  
  if(isNUll){
    toastr.warning("请填写数据");
    return;
  }

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
      toastr.success("添加成功");
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
  $(target).parent().parent().parent().find("select.edit").val($(target).parent().parent().parent().find("select.edit").attr("data-bind"));
  $(target).parent().parent().parent().find("input.edit").val($(target).parent().parent().parent().find("input.edit").attr("data-bind"));
  $(target).parent().parent().find("input.edit").val($(target).parent().parent().find("input.edit").attr("data-bind"));
}

//编辑确认按钮
function DoEdit(target,id,BW){
  var val = $(target).parent().parent().parent().find("input.edit").val()
  if(val===""){
    toastr.warning("请输入修改后的值");
    return;
  }
  var param ={
    'access_token':access_token,
    "update_list":[{
      "id":parseInt(id),
      "cms":currentCMS,
      "item_type":BW,
      "field_type":$(target).parent().parent().parent().find(".FieldSelectList option:selected").val(),
      'field_value':val
    }]
  };

  AjaxPost(UPDATE_BLACK_WHITE_LIST_FILTER,param).then(function (obj_json) {
    if(obj_json.code===0){
      toastr.success("更改成功");
      showBlack_list(currentCMS);
      showWhite_list(currentCMS);
    }else{
      toastr.error(obj_json.msg);
    }
  })
}

function updateCmsRemark(target,cms) {  
  var val = $(target).parent().parent().find("input.edit").val();

  var param = {
    'access_token':access_token,
    "update_list":[{
        "target_type":"term",
        "target_id":cms,
        "rename":val
      }]
  }

  bproto_ajax("/api/v1/update_remark/",param,function(obj_json){
    if(obj_json.code==0){
      toastr.success("修改备注成功");
      getCMSTerm_list(currentCMSListPage);
    }else{
      toastr.error("修改备注失败"+obj_json.msg);
      HideEdit(target);
    }
  })
}



//删除黑白名单
function delW(id) {
  var isdel = confirm("确认删除");
    if(isdel===false){
        return
    }
  var param = {
    'access_token': access_token,
    'del_list': [id]
  };
  AjaxPost(UPDATE_BLACK_WHITE_LIST_FILTER, param).then(function (obj_json) {
    if(obj_json.code===0){
      toastr.success("删除成功");
    }else{
      toastr.error(obj_json.msg);

    }
    showWhite_list(currentCMS);
  });

}
//删除黑白名单
function delB(id) {
  var isdel = confirm("确认删除");
    if(isdel===false){
        return
    }
  var param = {
    'access_token': access_token,
    'del_list': [id]
  };
  AjaxPost(UPDATE_BLACK_WHITE_LIST_FILTER, param).then(function (obj_json) {
    if(obj_json.code===0){
      toastr.success("删除成功");
    }else{
      toastr.error(obj_json.msg);
    }
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
        case "Desc":
          list.list[i].field_type = list.list[i].field_type + "|描述";
          break;
        case "UserLabel":
          list.list[i].field_type = list.list[i].field_type + "|用户认证标签";
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
        case "Desc":
          list.fields[i] = list.fields[i] + "|描述";
          break;
        case "UserLabel":
          list.fields[i] = list.fields[i] + "|用户认证标签";
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
