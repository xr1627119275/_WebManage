
access_token = '';
//获取登录信息
access_token = $.cookie("access_token");
var param = {"access_token":access_token};
bproto_ajax(GET_LOGIN_MSG_URL, param, function (obj_json) {
    console.log(obj_json);
    if(obj_json.code!=0){location.href = '/';}
    $("#username").css("color","#4b646f").html(obj_json.username+' <i class="fa fa-angle-down"></i>');

});

$.sidebarMenu($('.sidebar-menu'));


