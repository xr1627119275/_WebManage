page_size = 15;//分页查询默认每页数据
currentCertsPage = 0;//初始化显示用户证书当前页数
currentCertsPage_total = 0;//初始化显示用户证书总页数
currentCerts2TermPage = 0; //初始化证书颁布的设备当前页数
currentCerts2TermPage_total = 0;//初始化证书颁布的设备总页数

currentCert = ""; //初始化证书号

showWhitchSlider(3);

$(window).resize(function () {
    $("aside").height($(document).height())
}).trigger("resize");

switch (location.hash) {
    case "#certList":
        changeContent($("a[data-bind=#certList]")[0]);
        break;
    default:
        location.hash = "#certList";
        changeContent($("a[data-bind=#certList]")[0]);
}

//切换导航
function changeContent(target) {
    var targetId = $(target).attr("data-bind");
    $(".content").hide();
    $(targetId).show();
    if($(target)[0]==$("a[data-bind=#certList]")[0]){
        showUserCerts();
    }
}


//显示用户证书
function showUserCerts() {
    $(".content").hide()
    $("#certList").show()
    if(window.CurrentUser===undefined){
        bproto_ajax(GET_LOGIN_MSG_URL, {'access_token':access_token}, function (obj_json) {
            if (obj_json.code != 0) {
                location.href = '/';
            }
            CurrentUser = obj_json.username;
            getUserCerts();
        })
    }else {
        getUserCerts();
    }
}

function getUserCerts() {
    var param={
        "access_token":access_token,
        "username":CurrentUser,
        "page":0,
        "page_size":page_size
    };
    console.log(window.CurrentUser);
    bproto_ajax(GET_USERCERTS_URL,param,function (obj_json) {
        if(obj_json.code===0&&obj_json.certs.length>0){
            // "page": 0,    "page_size": 5,    "page_total": 86
            currentCertsPage = obj_json.page;
            currentCertsPage_total = obj_json.page_total;
            userid = obj_json.userid;
            RenderCertTable(obj_json);//渲染数据

            $(".modalTable").hide();
            $(".certTable").show();

            $("#UserModal #myModalLabel").text(username+" 证书数据");

            $("#UserModal").modal("show");
            if(!window.ModalShowList){
                ModalShowList = [];
            }
            ModalShowList.push({target:$(".certTable"),title:$("#UserModal #myModalLabel").text()});
        }else if (obj_json.code===0&&obj_json.certs.length === 0) {
            alert("无数据")
        }
    });
}



//根据page页数获取证书数据
function getCerts_list(page) {
    if(page<0){page=0}
    param={
        "access_token":access_token,
        "username":window.CurrentUser,
        "page":page,
        "page_size":page_size
    };
    bproto_ajax(GET_USERCERTS_URL,param,function (obj_json) {
        if(obj_json.code===0&&obj_json.certs.length>0) {
            // "page": 0,    "page_size": 5,    "page_total": 86
            currentCertsPage = obj_json.page;
            obj_json.userid = userid;
            RenderCertTable(obj_json);
        }
    });
}
//根据page页数获取证书颁布的设备的数据
function getCerts2Term_list(page){
    if(page<0){page=0}
    param = {
        "access_token":access_token,
        "cert":currentCert,
        "page":page,
        "page_size":page_size
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
    for (let i = 0; i < list.certs.length; i++) {
        list.certs[i].ValidityBegin_ = list.certs[i].ValidityBegin.replace(" ","T");
        list.certs[i].ValidityEnd_ = list.certs[i].ValidityEnd.replace(" ","T");
    }
    $("#certList .showCert table tbody").html(template('certList_template',list))
}

//渲染证书颁布的设备table
function RenderCert2TermTable(list) {
    $(".showCert table tbody").html(template('termList_template',list))
}