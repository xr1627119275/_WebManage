var typelist = [];
var hardwareproviderlist = [];
var softwareproviderlist = [];
var authorizedlist = [];

//动态设置table高度
$(window).resize(function () {
    $(".tablebox").height($(window).height() - $(".account").height() - $(".tablebox").offset().top)
}).trigger("resize");

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
    },function () {
        $.removeCookie("access_token", {path: '/'});
        access_token = '';
        location.href = "/";
        console.log(obj_json)
    })
}

//切换导航
function changeContent(target) {
    var targetId = $(target).attr("data-bind")
    $(".content").hide();
    // $(".right a").removeClass("active");
    // $(target).addClass("active");
    $(targetId).show();
    $(".shouquan").hide()
}

$(".auth_manage").mouseenter(function () {
    $(".shouquan").show()
});
$(".auth_manage").mouseleave(function () {
    $(".shouquan").hide()
});


//获取未授权列表
function fun_get_register_list() {
    param = {'access_token': access_token};
    bproto_ajax(GET_REGISTER_URL, param, function (obj_json) {
        if (obj_json.code == 0) {
            authorizedlist = obj_json.registers;
            typelist = [];            //清空数据
            hardwareproviderlist = [];//清空数据
            softwareproviderlist = [];//清空数据
            for (let i = 0; i < authorizedlist.length; i++) {
                typelist.push(authorizedlist[i].randcode);
                hardwareproviderlist.push(authorizedlist[i].hardwareprovider);
                softwareproviderlist.push(authorizedlist[i].softwareprovider);
            }
            //去重
            typelist = typelist.unique();
            hardwareproviderlist = hardwareproviderlist.unique();
            softwareproviderlist = softwareproviderlist.unique();

            //模板渲染
            var data = template('unauthorizedTemp', obj_json);
            $("#unauthorized table tbody").html(data);
            applySort()
        }
    })
}

fun_get_register_list();

//渲染检索功能div
function applySort() {
    $(".typesort li:nth-child(n+2)").remove();
    typelist.forEach(function (value) {
        $(".typesort").append("<li><a href='javascript:;'>" + value + "</a></li>");
    });
    $(".softwaresort li:nth-child(n+2)").remove();
    softwareproviderlist.forEach(function (value) {
        $(".softwaresort").append("<li><a href='javascript:;'>" + value + "</a></li>");
    });
    $(".hardwaresort li:nth-child(n+2)").remove();
    hardwareproviderlist.forEach(function (value) {
        $(".hardwaresort").append("<li><a href='javascript:;'>" + value + "</a></li>");
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
        updateSort()
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

        updateSort()

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
        updateSort()
    })
}

bindSortItem();

//根据检索要求重新渲染数据
function updateSort() {
    var sortlist = [];
    var templist = [];
    $(".breadcrumb li:nth-child(n+2)").each(function () {
        if ($(this).text().length > 0) {
            sortlist.push($(this).text())
        }
    });
    for (let i = 0; i < authorizedlist.length; i++) {
        let isIn = 0;
        let thislist = authorizedlist[i];
        for (let j = 0; j < sortlist.length; j++) {
            if (JSON.stringify(thislist).indexOf(sortlist[j]) != -1) {
                isIn++;
            }
        }
        if (isIn == sortlist.length) {
            templist.push(thislist)
        }
    }
    console.log(templist);
    //模板渲染
    var html = template('unauthorizedTemp', {"registers": templist});
    $("#unauthorized table tbody").html(html);
}

//设置checkbox按钮逻辑事件
function checkboxClick() {
    //全选按钮
    $("#allcheck").click(function () {
        if($("#allcheck").prop("checked")){
            $("input[name=done]").each(function () {
                $(this).prop("checked", true)
            });
            $(".checkNum").text("已选"+$("input[name=done]").length).css("visibility","visible");
        }else{
            $("input[name=done]").each(function () {
                $(this).prop("checked", false)
            });
            $(".checkNum").text("已选0").css("visibility","hidden");
        }
    });
    //单个按钮监听
    $(".table tbody").delegate("input[name=done]", "click", function () {
        var isCheck = true;
        var num=0;
        $("input[name=done]").each(function () {
            if (!$(this).prop("checked")) {
                isCheck = false;
            }else{
                num+=1
            }
        });
        if(num>0){
            $(".checkNum").text("已选"+num).css("visibility","visible");
        }else{
            $(".checkNum").text("已选0").css("visibility","hidden");
        }
        $("#allcheck").prop("checked", isCheck);

    })
}

checkboxClick()

//绑定授权按钮
function auth_show() {
    templist = [];
    $("input[name=done]").each(function () {
        if ($(this).prop("checked")) {
            templist.push($(this).attr("data-sessionid"))
        }
    });
    if (templist.length > 0) {
        $(".modal").modal("show")
        // $(".progress-bar").finish();
        //         $(".h2").text("授权成功");
        //         $(".modal-footer button").text("成功");
        //         $(".modal-footer button").click(function () {
        //             $(this).click(null);
        //             fun_get_register_list();
        //             $(".h2").text("正在授权");
        //             $(this).text("请稍等");
        //             $(".progress-bar").css("width", "0")
        //         })
    } else {
        alert("请选择授权设备");
        return false;
    }

}

//弹窗的授权逻辑
function auth_btn() {
    var duration=0;
    //获取期限时间
    duration += parseInt($("#year").val()?$("#year").val()*365:0);
    duration += parseInt($("#day").val()?$("#day").val():1);
    authorize(templist, duration,function (data) {
        if(data.code===0){
            alert("授权成功");

            $("#allcheck").prop("checked",false);
            $(".checkNum").text("已选0").css("visibility","hidden");
        }else{
            alert("请稍后重试");
        }
        fun_get_register_list();
        $(".modal").modal("hide");
    });

}

//授权逻辑ajax
function authorize(data,duration, func) {
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


