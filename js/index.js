unauthTypelist = [];
unauthHardwareproviderlist = [];
unauthSoftwareproviderlist = [];
unauthorizedlist = [];

currentOnlineTermPage_total = 0;//初始化在线设备总页数
currentOnlineTermPage = 0; //初始化在线设备当前页数


cacheIp = [];//缓存IP地址


//动态设置table高度
$(window).resize(function () {
    $(".tablebox").height($(window).height() - $(".account").height() - $(".tablebox").offset().top)
    $(".tablebox_online").css("maxHeight",$(window).height() - $(".online_pager").height() - $(".tablebox_online").offset().top)
}).trigger("resize");

switch (location.hash) {
    case "#unauthorized":
        changeContent($("a[data-bind=#unauthorized]")[0]);
        break;
    case "#authorized":
        changeContent($("a[data-bind=#authorized]")[0]);
        break;
    case "#onlineTerminal":
        changeContent($("a[data-bind=#onlineTerminal]")[0]);
        break;
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
    if($(target)[0]==$("a[data-bind=#unauthorized]")[0]){
        fun_get_register_list();
    }else if($(target)[0]==$("a[data-bind=#onlineTerminal]")[0]){
        fun_get_online_terminal_list();
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
    param = {'access_token': access_token};
    bproto_ajax(GET_REGISTER_URL, param, function (obj_json) {

        if (obj_json.code == 0) {
            var html = template('unauthorizedTemp', obj_json);
            $("#unauthorized table tbody").html(html);
            update_ip();
            List_Search(obj_json.registers);
        }
    })
}
fun_get_register_list();

function update_ip() {
    $(".iphost").each(function () {
        let that = this;
        var ip = $(that).html();
        if((JSON.stringify(cacheIp).indexOf(ip))!=-1){
            for (let i = 0; i <cacheIp.length; i++) {
                if(cacheIp[i].ip===ip){
                    $(this).html(cacheIp[i].address);
                }
            }
        }else{
            IP2address(ip,function (json) {
                let temp={};
                temp.ip = $(that).html();
                $(that).html(json.data[0].location);
                temp.address = json.data[0].location;
                cacheIp.push(temp);
            });
        }
    });
}

//根据列表数据 检索,去重
function List_Search(lists) {
    unauthorizedlist = lists;
    unauthTypelist = [];            //清空数据
    unauthHardwareproviderlist = [];//清空数据
    unauthSoftwareproviderlist = [];//清空数据
    for (let i = 0; i < unauthorizedlist.length; i++) {
        unauthTypelist.push(unauthorizedlist[i].randcode);
        unauthHardwareproviderlist.push(unauthorizedlist[i].hardwareprovider);
        unauthSoftwareproviderlist.push(unauthorizedlist[i].softwareprovider);
    }
    //去重
    unauthTypelist = unauthTypelist.unique();
    unauthHardwareproviderlist = unauthHardwareproviderlist.unique();
    unauthSoftwareproviderlist = unauthSoftwareproviderlist.unique();

    //模板渲染
    applyUnAuthSort();
}

//获取在线设备列表
function fun_get_online_terminal_list() {

    param={
        "access_token":access_token,
        "page":0,
        "page_size":20
    };
    bproto_ajax("/api/v1/get_online_terminal_list/",param, function (obj_json) {
        //{"code":0,"msg":"success","page":0,"page_size":0,"page_total":0,"terminal_list":[]}
        if(obj_json.code===0) {
            currentOnlineTermPage_total = obj_json.page_total;
            currentOnlineTermPage = obj_json.page;
            // console.log(JSON.stringify(obj_json));
            RenderOnlineTerminalTable(obj_json);
        }
    })
}

//在线设备上一页设备
function bindOnlineTermPager_Previous() {
    if(currentOnlineTermPage===0){
        alert("已经是第一页了");
        return
    }
    currentOnlineTermPage -= 1;
    getOnlineTerm_list(currentOnlineTermPage);
}
//在线设备下一页设备
function bindOnlineTermPager_Next(){
    if(currentOnlineTermPage_total===0||currentOnlineTermPage===currentOnlineTermPage_total-1){
        alert("已经是最后一页了");
        return;
    }
    currentCertsPage +=1;
    getOnlineTerm_list(currentCertsPage);
}

//根据page页数获取在线设备
function getOnlineTerm_list(page) {
    if(page<0){page=0}
    param = {
        "access_token": access_token,
        "username": username,
        "page": page,
        "page_size": 10
    };
    bproto_ajax(GET_ONLINE_TERMINAL_URL, param, function (obj_json) {
        if (obj_json.code === 0 && obj_json.certs.length > 0) {
            // "page": 0,    "page_size": 5,    "page_total": 86
            currentOnlineTermPage = obj_json.page;
            RenderOnlineTerminalTable(obj_json);
        }
    });
}


//渲染在线设备tableList
function RenderOnlineTerminalTable(list) {
    $(".tablebox_online table tbody").html(template('unauthorizedTemp',list));
    $("#onlineTerminal .table tr td:nth-child(1),#onlineTerminal.table tr th:nth-child(1)").hide();
}

//渲染检索功能div
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
}

//绑定检索item事件
function bindSortItem() {
    $(".typesort").delegate("a", "click", function () {
        if ($(this).css("color") == "rgb(255, 0, 0)") {
            $(".typesort a").css("color", "#000");
            $(".breadcrumb li[data-bind=" + $(this).parent().parent().attr('data-bind') + "]").text("").hide();
        } else {
            $(".typesort a").css("color", "#000");
            $(this).css("color", "red");
            $(".breadcrumb li[data-bind=" + $(this).parent().parent().attr('data-bind') + "]").text($(this).text()).show()
        }
        updateUnauthorizedSort()
    });
    $(".hardwaresort").delegate("a", "click", function () {
        if ($(this).css("color") == "rgb(255, 0, 0)") {
            $(this).css("color", "#000");
            $(".breadcrumb li[data-bind=" + $(this).parent().parent().attr('data-bind') + "]").text("").hide();

        } else {
            $(".hardwaresort a").css("color", "#000");

            $(this).css("color", "red");
            $(".breadcrumb li[data-bind=" + $(this).parent().parent().attr('data-bind') + "]").text($(this).text()).show()
        }

        updateUnauthorizedSort()

    });
    $(".softwaresort").delegate("a", "click", function () {

        if ($(this).css("color") == "rgb(255, 0, 0)") {
            $(this).css("color", "#000");
            $(".breadcrumb li[data-bind=" + $(this).parent().parent().attr('data-bind') + "]").text("").hide();
            return false;
        } else {
            $(".softwaresort a").css("color", "#000");
            $(this).css("color", "red");
            $(".breadcrumb li[data-bind=" + $(this).parent().parent().attr('data-bind') + "]").text($(this).text()).show()
        }
        updateUnauthorizedSort()
    })
}

bindSortItem();

//根据检索要求重新渲染数据
function updateUnauthorizedSort() {
    var sortlist = [];
    var templist = [];
    $(".breadcrumb li:nth-child(n+2)").each(function () {
        if ($(this).text().length > 0) {
            sortlist.push($(this).text())
        }
    });
    for (let i = 0; i < unauthorizedlist.length; i++) {
        let isIn = 0;
        let thislist = unauthorizedlist[i];
        for (let j = 0; j < sortlist.length; j++) {
            if (JSON.stringify(thislist).indexOf(sortlist[j]) != -1) {
                isIn++;
            }
        }
        if (isIn == sortlist.length) {
            templist.push(thislist)
        }
    }
    // console.log(templist);
    //模板渲染
    var html = template('unauthorizedTemp', {"registers": templist});
    $("#unauthorized table tbody").html(html);
    update_ip();
}

//设置checkbox按钮逻辑事件
function checkboxClick() {
    //全选按钮
    $("#allcheck").click(function () {
        if ($("#allcheck").prop("checked")) {
            $("input[name=done]").each(function () {
                $(this).prop("checked", true)
            });
            $(".checkNum").text("已选" + $("input[name=done]").length).css("visibility", "visible");
        } else {
            $("input[name=done]").each(function () {
                $(this).prop("checked", false)
            });
            $(".checkNum").text("已选0").css("visibility", "hidden");
        }
    });
    //单个按钮监听
    $(".table tbody").delegate("input[name=done]", "click", function () {
        var isCheck = true;
        var num = 0;
        $("input[name=done]").each(function () {
            if (!$(this).prop("checked")) {
                isCheck = false;
            } else {
                num += 1
            }
        });
        if (num > 0) {
            $(".checkNum").text("已选" + num).css("visibility", "visible");
        } else {
            $(".checkNum").text("已选0").css("visibility", "hidden");
        }
        $("#allcheck").prop("checked", isCheck);

    })
}

checkboxClick();

//绑定授权按钮
function auth_show() {
    templist = [];
    $("input[name=done]").each(function () {
        if ($(this).prop("checked")) {
            templist.push($(this).attr("data-sessionid"))
        }
    });
    if (templist.length > 0) {
        if(CurrentUser==="admin"){
            $("#AuthModal").modal("show");
            $("#AuthModal .auth_modal").hide();
            $("#AuthModal #AuthCertLabel").text("管理员授权");
            $("#AuthModal .adminAuth").show();
        }else{
            $("#AuthModal").modal("show");
            $("#AuthModal .auth_modal").hide();
            $("#AuthModal #AuthCertLabel").text(CurrentUser+"授权");
            $("#AuthModal .otherAuth").show();
        }
    } else {
        alert("请选择授权设备");
        return false;
    }

}

//弹窗的授权逻辑
function auth_btn() {

    if(CurrentUser==="admin"){
        var duration = 0;
        //获取期限时间
        duration += parseInt($("#year").val() ? $("#year").val() * 365 : 0);
        duration += parseInt($("#day").val() ? $("#day").val() : 1);
        admin_Authorize(templist, duration, function (data) {
            if (data.code === 0) {
                alert("授权成功");
                $("#allcheck").prop("checked", false);
                $(".checkNum").text("已选0").css("visibility", "hidden");
            } else {
                alert("请稍后重试");
            }
            fun_get_register_list();
            $("#AuthModal").modal("hide");
        });
    }else{
        if($("#cert_id").val()===""){
            alert("请输入证书编号");
            return;
        }
        other_Authorize(templist,$("#cert_id").val(),function (obj_json) {
            var code = obj_json.code;
            if(code===0){
                alert("授权成功");
                $("#allcheck").prop("checked", false);
                $(".checkNum").text("已选0").css("visibility", "hidden");
                fun_get_register_list();
                $("#AuthModal").modal("hide");
            }else if(code===-2||code===-3||code===-4){
                alert("注册数据出错");
            }else if(code===-5){
                alert("证书授权次数不足");
            }else if(code===-6){
                alert("证书编号不存在");
            }
        });
    }

}

//Admin授权逻辑ajax
function admin_Authorize(data, duration, func) {
    var registers = [];
    for (let i = 0; i < data.length; i++) {
        registers.push({'sessionid': data[i], 'duration': duration})
    }
    param = {
        'access_token': access_token,
        'registers': registers
    };
    bproto_ajax(AUTHORIZE_URL, param, function (obj_json) {
        if (obj_json.code === 0) {
            func(obj_json);
        }
    })
}

function other_Authorize(data,cert_id,func) {
    var registers = [];
    for (let i = 0; i < data.length; i++) {
        registers.push(data[i]);
    }
    param = {
        'access_token': access_token,
        'cert_id': cert_id,
        'registers': registers
    };
    bproto_ajax(AUTHORIZE_BY_CERT_URL, param, function (obj_json) {
        func(obj_json);
    })
}

function closeModal(){
    $("#AuthModal").modal("hide");
}

$(".modal").click(function(e){
    if(e.target==this){
        closeModal()
    }
});
