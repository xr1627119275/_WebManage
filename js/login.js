$(function () {
  if(!localStorage.errortimes){

  }else{
    var errortimes = JSON.parse(localStorage.errortimes);
    if(((new Date().getTime()-parseInt(errortimes.t))/1000)>3600){
      localStorage.errortimes = JSON.stringify({'t':new Date().getTime(),"times":0})
    }else if(errortimes.times>2){
      $(".yzm").show();
    }else{

    }
  }

  var param = {"access_token": $.cookie("access_token")};
  bproto_ajax(GET_LOGIN_MSG_URL, param, function (obj_json) {
    console.log(obj_json);
    if (obj_json.code == 0) {
      
      location.href = '/static/';
    }
  });
  if ($.cookie('saveName')) {
    var temp = $.cookie("saveName").split('|');
    var namelist=[];
    var html = '';
    for (let i = 0; i <temp.length; i++) {
      if(temp[i].length===0){
        continue
      }
      namelist.push(temp[i]);
    }

    for (let i = namelist.length-1; i >= 0; i--) {
      html += '<li style="padding: 10px;font-size: 16px;cursor: pointer">'+namelist[i]+'</li>';
    }
    $(".username_tip").html(html);

    $("#username").val(namelist[namelist.length-1]);
  }

  $("ul.username_tip").on('click','li',function () {
      $("#username").val($(this).text());
  });

  //回车检测
  $("#login_captcha_input").bind("keypress",function (e) {
    if(e.keyCode === 13){
      login();
    }
  });


  //邮箱验证
  mailReg = new RegExp("^(\\w-*\\.*)+@(\\w-?)+(\\.\\w{1,})+$");
  ChineseReg = new RegExp("[\u4e00-\u9fa5]");

  $("#reg_email").focus(function () {
    var val = $(this).val();
    if (StrisBlack(val)) {
      $(this).popover("show");
      return
    }

    if (!mailReg.test(val)) {
      //失败后
      $(this).popover("show");
      $($(this).attr("data-bind")).html("邮箱格式不正确");
    } else {
      $(this).popover("hide");
    }
  });
  $("#reg_email").on('input', function () {
    var val = $(this).val();
    if (!mailReg.test(val)) {
      //失败后
      $(this).popover("show");
      $($(this).attr("data-bind")).html("邮箱格式不正确");
    } else {
      $(this).popover("hide");
    }
  });
  $("#reg_email").blur(function () {
    var val = $(this).val();
    if (StrisBlack(val)) {
      $(this).popover("show");
      return
    }
    if (!mailReg.test(val)) {
      //失败后
      $(this).popover("show");
      $($(this).attr("data-bind")).html("邮箱格式不正确");
    } else {
      $(this).popover("hide");
    }
  });
  //邮箱验证

  // $("#reg_username,#reg_password,#reg_password_again").focus(
  //     checkIsblank(this)
  // );
  // $("#reg_username,#reg_password,#reg_password_again").on('input',checkIsblank($("#reg_username,#reg_password,#reg_password_again")));
  // $("#reg_username,#reg_password,#reg_password_again").blur(
  //     checkIsblank(this)
  // );
  $("#reg_username,#reg_password,#reg_password_again,#captcha,#username,#password").each(function () {
    $(this).focus(function () {
      $(this).popover("hide");
      if ($(this)[0] == $("#reg_password_again")[0]) {
        if ($("#reg_password").val() == $(this).val()) {
          $(this).css("border-color", "#1e90ff");
        } else {
          $(this).css("border-color", 'rgba(255, 30, 37, 0.89)');
          $(this).popover("show")
        }
      }

    });
    $(this).on('input', function () {
      $(this).popover("hide");
      if (StrisBlack($(this).val())) {
        $(this).popover("show");
        $($(this).attr("data-bind")).html($(this).attr("data-msg"));
        return;
      } else if (checkIsChinese($(this))) {
        $(this).popover("show");
        $($(this).attr("data-bind")).html("不支持中文");
        return;
      }
      // console.log(JSON.stringify($(this))+"==="+JSON.stringify($("#reg_username")));
      if ($(this)[0] == $("#reg_username")[0]) {
        if ($(this).val().length < 5) {
          $(this).popover("show");
          $($(this).attr("data-bind")).html("用户名必须大于等于5位");
        } else if ($(this).val().length > 64) {
          $(this).popover("show");
          $($(this).attr("data-bind")).html("用户名必须小于64位");
        } else {
          if (/[a-z]|[A-Z]/.test($(this).val())) {

          } else {
            $(this).popover("show");
            $($(this).attr("data-bind")).html("用户名中必须包含一个字母");
          }
        }
        return;
      } else if ($(this)[0] == $("#reg_password")[0]) {
        if ($(this).val().length < 5) {
          $(this).popover("show");
          $($(this).attr("data-bind")).html("密码必须大于等于5位");
        } else if ($(this).val().length > 64) {
          $(this).popover("show");
          $($(this).attr("data-bind")).html("密码必须小于64位");
        } else {
          if (/[a-z]|[A-Z]/.test($(this).val())) {
            if ($(this).val() != $("#reg_password_again").val()) {
              $("#reg_password_again").popover("show");
              $($("#reg_password_again").attr("data-bind")).html("两次密码不一致");
            }
          } else {
            $(this).popover("show");
            $($(this).attr("data-bind")).html("密码中必须包含一个字母");
          }
        }
        return;
      } else if ($(this)[0] == $("#reg_password_again")[0]) {
        if ($("#reg_password").val() == $(this).val()) {
          $(this).css("border-color", "#fff #fff #ccc #fff");
          $(this).popover("hide");
        } else {
          $(this).css("border-color", 'rgba(255, 30, 37, 0.89)');
          $(this).popover("show");

        }
      }
    });
    $(this).blur(function () {
      $(this).popover("hide");
      if (StrisBlack($(this).val())) {
        $(this).popover("show");
        $($(this).attr("data-bind")).html($(this).attr("data-msg"));
        return;
      } else if (checkIsChinese($(this))) {
        $(this).popover("show");
        $($(this).attr("data-bind")).html("不支持中文");
        return;
      }
      // console.log(JSON.stringify($(this))+"==="+JSON.stringify($("#reg_username")));
      if ($(this)[0] == $("#reg_username")[0]) {
        if ($(this).val().length < 5) {
          $(this).popover("show");
          $($(this).attr("data-bind")).html("用户名必须大于等于5位");
        } else if ($(this).val().length > 64) {
          $(this).popover("show");
          $($(this).attr("data-bind")).html("用户名必须小于64位");
        } else {
          if (/[a-z]|[A-Z]/.test($(this).val())) {

          } else {
            $(this).popover("show");
            $($(this).attr("data-bind")).html("用户名中必须包含一个字母");
          }
        }
        return;
      } else if ($(this)[0] == $("#reg_password")[0]) {
        if ($(this).val().length < 5) {
          $(this).popover("show");
          $($(this).attr("data-bind")).html("密码必须大于等于5位");
        } else if ($(this).val().length > 64) {
          $(this).popover("show");
          $($(this).attr("data-bind")).html("密码必须小于64位");
        } else {
          if (/[a-z]|[A-Z]/.test($(this).val())) {
            if ($(this).val() != $("#reg_password_again").val()) {
              $("#reg_password_again").popover("show");
              $($("#reg_password_again").attr("data-bind")).html("两次密码不一致");
            }
          } else {
            $(this).popover("show");
            $($(this).attr("data-bind")).html("密码中必须包含一个字母");
          }
        }
        return;
      } else if ($(this)[0] == $("#reg_password_again")[0]) {
        if ($("#reg_password").val() == $(this).val()) {
          $(this).css("border-color", "#fff #fff #ccc #fff");
          $(this).popover("hide");
        } else {
          $(this).css("border-color", 'rgba(255, 30, 37, 0.89)');
          $(this).popover("show");
        }
      }
    });
  });


  $(window).resize(function () {
    $("#username").popover({
      trigger: "manual",
      content: "请输入用户名/邮箱",
      container: 'body',
      animation: false
    });
    $("#password").popover({
      trigger: "manual",
      content: "请输入密码",
      container: 'body',
      animation: false
    });
    // $("#login_captcha_input").popover({
    //     trigger: "manual",
    //     content: "请输入验证码",
    //     container: 'body',
    //     animation: false});

    $("#reg_username").popover({
      html: true,
      trigger: "manual",
      content: '<div id="reg_username_pop">请输入您的用户名</div>',
      container: 'body',
      animation: false
    });
    $("#reg_email").popover({
      html: true,
      trigger: "manual",
      content: '<div id="reg_email_pop">请输入您的邮箱</div>',
      container: 'body',
      animation: false
    });


    $("#reg_password").popover({
      html: true,
      trigger: "manual",
      content: '<div id="reg_password_pop">请输入您的密码</div>',
      container: 'body',
      animation: false
    });

    $("#reg_password_again").popover({
      html: true,
      trigger: "manual",
      content: '<div id="reg_password_again_pop">两次密码不一致</div>',
      container: 'body',
      animation: false
    });

    $("#captcha").popover({
      trigger: "manual",
      content: "请输入验证码",
      container: 'body',
      animation: false
    });
  }).trigger("resize");

});

//登录
function login() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var login_captcha = document.getElementById('login_captcha_input').value;
  if (StrisBlack(username) || StrisBlack(password)) {
    checkIsblank($("#username,#password"));
    return;
  }

  if(!$(".yzm").is(":hidden")){
    if (StrisBlack(login_captcha) || !(login_captcha.toLowerCase() === captcha_code.toLowerCase())) {
      toastr.warning("验证码不正确");
      mycanvas.click();
      document.getElementById('login_captcha_input').value="";
      return;
    }
  }
  param = {'username': username, 'password': password};
  bproto_ajax(LOGIN_URL, param, function (obj_json) {
    console.log(obj_json);
    if (obj_json.code == 0) {
      $.cookie('access_token', obj_json.access_token, {path: '/'});
      if ($("[type=checkbox]").prop("checked")) {
        if (!$.cookie('saveName')) {
          $.cookie('saveName', '', {expires: 365, path: '/'})
        }
        if ($.cookie('saveName').indexOf(obj_json.username) === -1) {
          $.cookie('saveName',$.cookie("saveName")+"|"+obj_json.username, {expires: 365, path: '/'});
        }else{
          var newstr = $.cookie('saveName').replace("|"+obj_json.username,'');
          $.cookie('saveName',newstr+"|"+obj_json.username, {expires: 365, path: '/'});
        }
      }
      localStorage.errortimes = JSON.stringify({"t":new Date().getTime(),"times":0});
      location.href = "/static/";
    } else {
      toastr.error("用户名或密码错误");
      if(!localStorage.errortimes){
        localStorage.errortimes = JSON.stringify({"t":new Date().getTime(),"times":1});
      }else{
        var errortimes = JSON.parse(localStorage.errortimes);
        localStorage.errortimes = JSON.stringify({"t":errortimes.t,"times":parseInt(errortimes.times)+1});
        if(((new Date().getTime()-parseInt(errortimes.t))/1000)>3600){
          localStorage.errortimes = JSON.stringify({"t":new Date().getTime(),"times":1});
        }else if((errortimes.times+1)>2){
          $(".yzm").show();
        }
      }
    }
  }, function () {
    toastr.error("服务器连接失败");
  })
}

//登录结束


//input非空判断
function checkIsblank(target) {
  target.each(function () {
    var ele = $(this);
    if (StrisBlack($(ele).val())) {
      $(ele).popover("show");
      $($(ele).attr("data-bind")).html(ele.attr("data-msg"));
    } else {
      $(ele).popover("hide");
    }
  })

}

//input长度判断
function checkLength() {
  var temp = [false, false, false];
  var reg_username = $("#reg_username");
  var reg_password = $("#reg_password");
  var reg_password_again = $("#reg_password_again");

  if (reg_username.val().length < 5) {
    reg_username.popover("show");
    $(reg_username.attr("data-bind")).html("用户名必须大于等于5位");

  } else if (reg_username.val().length > 64) {
    reg_username.popover("show");
    $(reg_username.attr("data-bind")).html("用户名必须小于64位");
  } else {
    if (/[a-z]|[A-Z]/.test(reg_username.val())) {
      temp[0] = true;
    } else {
      reg_username.popover("show");
      $(reg_username.attr("data-bind")).html("用户名中必须包含一个字母");
    }
  }
  if (reg_password.val().length < 5) {
    reg_password.popover("show");
    $(reg_password.attr("data-bind")).html("密码必须大于等于5位");
  } else if (reg_password.val().length > 64) {
    reg_password.popover("show");
    $(reg_password.attr("data-bind")).html("密码必须小于64位");
  } else {
    if (/[a-z]|[A-Z]/.test(reg_password.val())) {
      if (reg_password.val() != $("#reg_password_again").val()) {
        $("#reg_password_again").popover("show");
        $($("#reg_password_again").attr("data-bind")).html("两次密码不一致");
      } else {
        temp[1] = true;
      }
    } else {
      reg_password.popover("show");
      $(reg_password.attr("data-bind")).html("密码中必须包含一个字母");
    }
  }

  if (reg_password_again.val() != reg_password.val()) {
    $("#reg_password_again").popover("show");
    $($("#reg_password_again").attr("data-bind")).html("两次密码不一致");
  } else {
    temp[2] = true;
  }
  return temp;

}

//input中文判断
function checkIsChinese(target) {
  var temp = false;
  target.each(function () {
    var ele = $(this);
    if (ChineseReg.test(ele.val())) {
      ele.popover("show");
      $(ele.attr("data-bind")).text("不支持中文");
      temp = true;
    } else {
      ele.popover("hide");
    }
  });
  return temp;
}

//判断字符串是否为空
function StrisBlack(str) {
  str = str.replace(/ /g, "");
  if (str === "" || str.length === 0) {
    return true;
  }
  return false;
}

// 注册
function GoRegister() {
  reg_username = document.getElementById('reg_username').value;
  reg_email = document.getElementById('reg_email').value;
  reg_password = document.getElementById('reg_password').value;
  reg_password_again = document.getElementById('reg_password_again').value;

  //非空判断
  if (StrisBlack($("#reg_username").val()) ||
      StrisBlack($("#reg_password").val()) ||
      StrisBlack($("#reg_password_again").val()) ||
      StrisBlack($("#reg_email").val())) {
    checkIsblank($("#reg_username,#reg_password,#reg_password_again,#reg_email"));
    return;
  }

  //验证是否为中文
  if (checkIsChinese($("#reg_username,#reg_password,#reg_password_again,#reg_email"))) {
    return;
  }

  //验证邮箱表达式
  if (!mailReg.test($("#reg_email").val())) {
    $("#reg_email").popover("show");
    return;
  }

  var temp = checkLength();
  if (!(temp[0] && temp[1] && temp[2])) {
    return;
  }


  bproto_ajax(REGISTER_CHECK_USERNAME, {"username": reg_username}, function (obj_json) {
    console.log("验证用户名是否存在:  " + JSON.stringify(obj_json));
    if (obj_json.code === 0) {
      //用户验证不存在，开始验证用户邮箱
      bproto_ajax(REGISTER_GET_CAPTCHA, {'email': reg_email}, function (obj_json) {
        //成功后
        console.log("获取验证码后提示框:  " + JSON.stringify(obj_json));
        if (obj_json.code === 0) {
          $("#EmailModal").modal("show");
        } else if (obj_json.code === -4) {
          $("#reg_email").val("").focus();
          toastr.error("邮箱已存在,请更换邮箱绑定");
        } else if (obj_json.code === -6) {
          toastr.error("邮件发送失败，请联系管理员后重试");
        }
      });
    } else {
      toastr.warning("用户 " + reg_username + " 已存在,请重新输入");
    }
  });

}

function Get_Captcha() {
  bproto_ajax(REGISTER_GET_CAPTCHA, {'email': reg_email}, function (obj_json) {
    console.log("再次获取验证码:  " + JSON.stringify(obj_json));
    if (obj_json.code === 0) {
      toastr.success("重新获取成功");
    } else if (obj_json.code === -4) {
      toastr.error('该邮箱获取次数过多,请稍后重试');
    }else{
      toastr.error(obj_json.msg)
    }
  });
}

function Register() {
  var captcha = $("#captcha").val();
  if (StrisBlack(captcha)) {
    checkIsblank($("#captcha"));
    return;
  }
  var param = {
    "username": reg_username,
    "password": reg_password,
    "cellphone": "12333333333",
    "email": reg_email,
    'captcha': captcha
  };
  bproto_ajax(REGISTER_URL, param, function (obj_json) {
    console.log("注册:  " + JSON.stringify(obj_json));
    if (obj_json.code === 0) {
      toastr.success("注册成功");
      $("#EmailModal").modal("show");
      $("#captcha").val('');
      $(".login input").val("");
      ChangeLogin();
      $("#username").val(reg_username);
      $("#password").val(reg_password);
    }else if(obj_json.code==-9){
      toastr.error("验证码错误,请重新输入");
    } else{
      toastr.error("注册失败"+obj_json.msg);

    }
  });
}


// 注册结束

function ChangeRegister() {
  $(".login input").val("");
  $("#particles-js .login").hide();
  $(".login input").popover("hide");
  $("#particles-js .registerdiv").show();
}

function ChangeLogin() {
  $(".login input").val("");
  $("#particles-js .login").hide();
  $(".login input").popover("hide");
  $("#particles-js .logindiv").show();
}



function rand() {
  var str = "abcdefghijklmnopqrstuvwxyz0123456789";
  var arr = str.split("");
  var validate = "";
  var ranNum;
  for (var i = 0; i < 4; i++) {
    ranNum = Math.floor(Math.random() * 36); //随机数在[0,35]之间
    validate += arr[ranNum];
  }
  window.captcha_code = validate;
  return validate;
}

/*干扰线的随机x坐标值*/
function lineX() {
  var ranLineX = Math.floor(Math.random() * 90);
  return ranLineX;
}

/*干扰线的随机y坐标值*/
function lineY() {
  var ranLineY = Math.floor(Math.random() * 40);
  return ranLineY;
}

function clickChange() {
  var mycanvas = document.getElementById('mycanvas');
  var cxt = mycanvas.getContext('2d');
  cxt.fillStyle = 'rgba(255,255,255,1)';
  cxt.fillRect(0, 0, 90, 40);
  /*生成干扰线20条*/
  for (var j = 0; j < 6; j++) {
    cxt.strokeStyle = '#000';
    cxt.beginPath(); //若省略beginPath，则每点击一次验证码会累积干扰线的条数
    cxt.moveTo(lineX(), lineY());
    cxt.lineTo(lineX(), lineY());
    cxt.lineWidth = 0.5;
    cxt.closePath();
    cxt.stroke();
  }
  cxt.fillStyle = '#4e7aff';
  cxt.font = 'bold 28px Arial';
  cxt.fillText(rand(), 15, 25); //把rand()生成的随机数文本填充到canvas中
}

clickChange();
/*点击验证码更换*/
mycanvas.onclick = function (e) {
  e.preventDefault(); //阻止鼠标点击发生默认的行为
  clickChange();
};



function showGetBackPassword_Modal() {
  $("#GetBackPasswordModal").modal("show");
  $("#getbackpassword_email").val("")
  $("#getbackpassword_code").val("")
  $(".setPassword").hide();

}

function getBackPassword(){
  
  var code = $("#getbackpassword_email").val();
  var target = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(code)
  if(!target){
    toastr.warning("邮箱格式不正确,请重新输入");
    $("#getbackpassword_email").focus();
    return;
  }
  var param = {
    'access_token':"",
    "email":code
  }
  bproto_ajax(GET_BACK_PASSWORD,param,function (obj_json) {  
    if(obj_json.code===0){
      toastr.success("邮箱验证码发送成功,请登录邮箱查看");

      $("#getbackpassword_code").focus();
      $("#getpassword_btn").text("60秒后获取验证码");
      setInputCodeTime();
      $(".setPassword").show();
    }else if(obj_json.code==-3){
      toastr.error("无此邮箱用户");
    }else{
      toastr.error("邮箱验证码发送失败"+obj_json.msg);
    }
  })
}

function setPassword(){
  var code = $("#getbackpassword_code").val();
  var password1 = $("#setpassword1").val();
  var password2 = $("#setpassword2").val();

  if(code.length==0){
    toastr.warning("验证码不能为空");
    return;
  }

  if(password1.length<5){
    toastr.warning("密码不得少于6位");
    return;
  }
  if(/[\u4e00-\u9fa5]/.test(password1)){
    toastr.warning("密码中不能有中文");
    return;
  }
  if(!(/[a-z]|[A-Z]/.test(password1))){ 
    toastr.warning("密码中必须包含一个英文字母");
    return;
  }

  if(password1!=password2){
    toastr.warning("两次密码不一致,请检查");
    return;
  }

  var param = {
    'access_token':'',
    'set_pwd_code':code,
    'new_password':password1
  }
  bproto_ajax(SET_NEW_PASSWORD,param,function (obj_json) {  
    if(obj_json.code==0){
      toastr.success("密码修改成功,请重新登录");
      $("#GetBackPasswordModal").modal("hide");
    }else{
      toastr.success("密码修改失败"+obj_json.msg);
    }
  })
}

function setInputCodeTime(){
  $("#getpassword_btn").prop("disabled",true);

  var time = 60; 
  var id = setInterval(function(){
    if(time>0){
      $("#getpassword_btn").text(time+"秒后获取验证码");
      time--;
    }else{
      $("#getpassword_btn").text("获取验证码").prop("disabled",false);
      clearInterval(id);
    }
  },1000);
}

function closeModal(target){
  $(target).modal("hide");
}

$(".modal").click(function(e){
  if(e.target==$("#GetBackPasswordModal")[0]){
    closeModal('#GetBackPasswordModal')
  }else if(e.target==$("#EmailModal")[0]){
    closeModal('#EmailModal')
  }
});
