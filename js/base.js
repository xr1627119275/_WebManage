
access_token = '';
//获取登录信息
access_token = $.cookie("access_token");
var param = {"access_token":access_token};
bproto_ajax(GET_LOGIN_MSG_URL, param, function (obj_json) {
    // console.log(obj_json);
    if(obj_json.code!=0){location.href = '/';}
    CurrentUser = obj_json.username;
    $("#username").css("color","#4b646f").html(obj_json.username+' <i class="fa fa-angle-down"></i>');

});

$.sidebarMenu($('.sidebar-menu'));


    //根据ip获取地理位置
function IP2address(ip,callback) {
        var url = "https://opendata.baidu.com/api.php?query="+ip+"&co=&resource_id=6006&cb=op_aladdin_callback&format=json&tn=baidu";

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp',
            timeout: 1000,
            cache: true,
            jsonp:"cb",
            error: function () {
                callback(JSON.stringify({"status":-1}))
            },  //错误执行方法
            success: function (obj_json) {
                callback(obj_json);
            }
        })
}


