page_size = 10;//分页查询默认每页数据
currentCertsPage = 0;//初始化显示用户证书当前页数
currentCertsPage_total = 0;//初始化显示用户证书总页数
currentCerts2TermPage = 0; //初始化证书颁布的设备当前页数
currentCerts2TermPage_total = 0;//初始化证书颁布的设备总页数
currentCert = ""; //初始化证书号



// 退出
function fun_api_logout() {
    param = {'access_token': access_token};
    bproto_ajax(LOGOUT_URL, param, function (obj_json) {
        $.removeCookie("access_token", {path: '/'});
        access_token = '';
        location.href = "/";
        console.log(obj_json)
    })
}

//nav切换逻辑
function bindSwitch() {
    $(".userSelect li").on("click","a[data-bind]",function () {
        var className = $(this).attr("data-bind");

        $(".content>div").hide();
        $(className).show();

        // $("section .left.fl a[data-bind]").removeClass("active");
        // $(this).addClass("active")
        $(".userSelect").hide();
    })
}
bindSwitch();



$(".navUserManage").mouseenter(function () {
   $(".userSelect").show();
});
$(".navUserManage").mouseleave(function () {
    $(".userSelect").hide();
});


//展示用户列表
function showUserList() {
    param = {"access_token":""};
    bproto_ajax(GET_USERLIST_URL,param,function (obj_json) {
        var users = obj_json.users;
        for (let i = 0; i < users.length; i++) {
            if(!users[i].OwnerUserGroup_id){
                users[i].OwnerUserGroup_id = "无"
            }
        }
        var html = template('userList', {"users":users});

        $(".ShowUser table tbody").html(html);
    })
}
showUserList();

//绑定查看证书a标签事件
function showUserCerts(a) {
    username = $(a).attr("data-bind");
//    {"access_token":"SAKPFLsOpsnrzAyAmYSxNu6pCJEwxpHM","username":"admin","page":0,"page_size":5}:

    param={
        "access_token":access_token,
        "username":username,
        "page":0,
        "page_size":page_size
    };
    bproto_ajax(GET_USERCERTS_URL,param,function (obj_json) {
        if(obj_json.code===0&&obj_json.certs.length>0){
            // "page": 0,    "page_size": 5,    "page_total": 86
            currentCertsPage = obj_json.page;
            currentCertsPage_total = obj_json.page_total;
            RenderCertTable(obj_json);//渲染数据

            $(".modalTable").hide();
            $(".certTable").show();

            $("#UserModal #myModalLabel").text(username+" 证书数据");

            $(".modal").modal("show");
            if(!window.ModalShowList){
                ModalShowList = [];
            }
            ModalShowList.push({target:$(".certTable"),title:$("#UserModal #myModalLabel").text()});
        }else{
            alert("无数据")
        }
    });
}

//根据page页数获取证书数据
function getCerts_list(page) {
    param={
        "access_token":access_token,
        "username":username,
        "page":page,
        "page_size":10
    };
    bproto_ajax(GET_USERCERTS_URL,param,function (obj_json) {
        if(obj_json.code===0&&obj_json.certs.length>0) {
            // "page": 0,    "page_size": 5,    "page_total": 86
            currentCertsPage = obj_json.page;
            RenderCertTable(obj_json);
        }
    });
}
//根据page页数获取证书颁布的设备的数据
function getCerts2Term_list(page){

    param = {
        "access_token":access_token,
        "cert":currentCert,
        "page":page,
        "page_size":10
    };
    bproto_ajax(GET_CERT_TERMINAL_URL,param,function (obj_json) {
        if(obj_json.code===0) {
            currentCerts2TermPage = obj_json.page;
            RenderCert2TermTable(obj_json);
        }
    })
}


//绑定证书certs分页按钮
function bindCertsPager_Previous() {
    if(currentCertsPage===0){
        alert("已经是第一页了");
        return
    }
    currentCertsPage -= 1;
    getCerts_list(currentCertsPage);
}
function bindCertsPager_Next() {
    if(currentCertsPage===currentCertsPage_total-1){
        alert("已经是最后一页了");
        return;
    }
    currentCertsPage +=1;
    getCerts_list(currentCertsPage);
}

//绑定证书颁布的设备页面分页按钮
function bindCerts2TermPager_Previous() {
    if(currentCerts2TermPage===0){
        alert("已经是第一页了");
        return
    }
    currentCerts2TermPage -= 1;
    getCerts2Term_list(currentCerts2TermPage);
}
function bindCerts2TermPager_Next() {
    if(currentCerts2TermPage===currentCerts2TermPage_total-1){
        alert("已经是最后一页了");
        return;
    }
    currentCerts2TermPage +=1;
    getCerts2Term_list(currentCerts2TermPage);
}


//渲染用户证书table
function RenderCertTable(list) {
    $(".showCert table tbody").html(template('certList',list))
}
//渲染证书颁布的设备table
function RenderCert2TermTable(list) {
    $(".showCert table tbody").html(template('termList',list))
}

//修改用户证书
function updateCert(target){
    var allSelects = $(target).parent().parent().find("td select");
    if(!target.isClick){
        //获取当前行的select，让他们显示出来
        $(target).css("backgroundColor","#000").val("确认").css("color","#fff");
        allSelects.show();
        allSelects.prev().hide();
        allSelects.each(function () {
            $(this).find("option[value="+$(this).prev().text()+"]").prop("selected",true)
        });
        target.isClick = true;
    }else{

        param = {
            "access_token":access_token,
            "SerialNumber":$(target).attr("data-bind"),
            "Type":allSelects.parent().find("select[name=Type]").find("option:selected").val(),
            "State":allSelects.parent().find("select[name=State]").find("option:selected").val(),
            "Mode":allSelects.parent().find("select[name=Mode]").find("option:selected").val()
        };
        bproto_ajax("/api/v1/update_cert/",param,function(code){
            console.log(code);
            $(target).css("backgroundColor","#ddd").val("修改").css("color","#000");
            getCerts_list(currentCertsPage);
            allSelects.show();
            allSelects.prev().hide();
        })
    }
}

//查看证书颁布的设备
function showTerminal(cert){
    currentCert = cert;
    param = {
        "access_token":access_token,
        "cert":currentCert,
        "page":0,
        "page_size":page_size
    };
    bproto_ajax(GET_CERT_TERMINAL_URL,param,function (obj_json) {
        if (obj_json.code === 0) {
            currentCerts2TermPage = obj_json.page;
            currentCerts2TermPage_total = obj_json.page_total;
            $(".showCert2Term tbody").html(template("termList",obj_json));
            $(".modalTable").hide();
            $("#UserModal #myModalLabel").text("证书("+currentCert+")颁发的设备");
            $(".termTable").show();
            ModalShowList.push({target:$(".termTable"),title:$("#UserModal #myModalLabel").text()});
        }
    })
}

//查看用户所有的设备信息按钮逻辑
function showAllTerms(target) {
    $(".modalTable").hide();
    $(".allTermTable").show();
    $(".modal").modal("show");
    $("#UserModal #myModalLabel").text($(target).attr("data-bind")+" 所有设备");
    if(!window.ModalShowList){
        ModalShowList = [];
    }
    ModalShowList.push({target:$(".allTermTable"),title:$("#UserModal #myModalLabel").text()});
}


//查看用户所有授权的设备
function getAuthTerm(target){
    $(".tab").removeClass("active");
    $(target).addClass("active");
    var classname = $(target).attr("data-bind");
    $(".allTermTable .content").hide();
    $(classname).show();
}
//查看用户所有未授权的设备
function getUnAuthTerm(target){
    $(".tab").removeClass("active");
    $(target).addClass("active");
    var classname = $(target).attr("data-bind");
    $(".allTermTable .content").hide();
    $(classname).show();
}




//弹窗关闭逻辑
function closeModal() {
    if(ModalShowList.length>1){
        var target_obj = ModalShowList.pop();
        target_obj.target.hide();
        var last_obj = ModalShowList[ModalShowList.length-1];
        last_obj.target.show();
        $("#UserModal #myModalLabel").text(last_obj.title);
    }else{
        $("#UserModal").modal("hide");
        ModalShowList = [];
    }

}




//添加用户
function addUser() {

    param = {
        'access_token': access_token,
        "username":$("form.add .username").val(),
        "password":$("form.add .password").val()
    };
    bproto_ajax(ADD_USER_URL, param, function (obj_json) {
        if(obj_json.code===0){
            alert("添加成功")

        }else if (obj_json.code===-1){
            alert("用户已存在，请重新添加")
        }

    },function () {
        console.log("Error:"+obj_json)
    })
    $("form.add .username").val("")
    $("form.add .password").val("")
}


$(".modal").click(function(e){
    if(e.target==this){
        closeModal()
    }
});