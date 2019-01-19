!function (e) {
  var t = {};

  function a(o) {
    if (t[o]) return t[o].exports;
    var r = t[o] = {i: o, l: !1, exports: {}};
    return e[o].call(r.exports, r, r.exports, a), r.l = !0, r.exports
  }

  a.m = e, a.c = t, a.d = function (e, t, o) {
    a.o(e, t) || Object.defineProperty(e, t, {enumerable: !0, get: o})
  }, a.r = function (e) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(e, "__esModule", {value: !0})
  }, a.t = function (e, t) {
    if (1 & t && (e = a(e)), 8 & t) return e;
    if (4 & t && "object" == typeof e && e && e.__esModule) return e;
    var o = Object.create(null);
    if (a.r(o), Object.defineProperty(o, "default", {
      enumerable: !0,
      value: e
    }), 2 & t && "string" != typeof e) for (var r in e) a.d(o, r, function (t) {
      return e[t]
    }.bind(null, r));
    return o
  }, a.n = function (e) {
    var t = e && e.__esModule ? function () {
      return e.default
    } : function () {
      return e
    };
    return a.d(t, "a", t), t
  }, a.o = function (e, t) {
    return Object.prototype.hasOwnProperty.call(e, t)
  }, a.p = "", a(a.s = 0)
}([function (e, t) {
  function a(e) {
    e.each(function () {
      var e = $(this);
      r($(e).val()) ? ($(e).popover("show"), $($(e).attr("data-bind")).html(e.attr("data-msg"))) : $(e).popover("hide")
    })
  }

  function o(e) {
    var t = !1;
    return e.each(function () {
      var e = $(this);
      ChineseReg.test(e.val()) ? (e.popover("show"), $(e.attr("data-bind")).text("不支持中文"), t = !0) : e.popover("hide")
    }), t
  }

  function r(e) {
    return "" === (e = e.replace(/ /g, "")) || 0 === e.length
  }

  function i() {
    return Math.floor(90 * Math.random())
  }

  function n() {
    return Math.floor(40 * Math.random())
  }

  function s() {
    var e = document.getElementById("mycanvas").getContext("2d");
    e.fillStyle = "#000", e.fillRect(0, 0, 90, 40);
    for (var t = 0; t < 20; t++) e.strokeStyle = "#fff", e.beginPath(), e.moveTo(i(), n()), e.lineTo(i(), n()), e.lineWidth = .5, e.closePath(), e.stroke();
    e.fillStyle = "red", e.font = "bold 20px Arial", e.fillText(function () {
      for (var e = "abcdefghijklmnopqrstuvwxyz0123456789".split(""), t = "", a = 0; a < 4; a++) t += e[Math.floor(36 * Math.random())];
      return window.captcha_code = t, t
    }(), 25, 25)
  }

  $(function () {
    var e = {access_token: $.cookie("access_token")};
    bproto_ajax(GET_LOGIN_MSG_URL, e, function (e) {
      console.log(e), 0 == e.code && (location.href = "/static/xr/index2.html")
    }), $.cookie("saveName") && $("#username").val($.cookie("saveName")), mailReg = new RegExp("^(\\w-*\\.*)+@(\\w-?)+(\\.\\w{1,})+$"), ChineseReg = new RegExp("[一-龥]"), $("#reg_email").focus(function () {
      var e = $(this).val();
      r(e) ? $(this).popover("show") : mailReg.test(e) ? $(this).popover("hide") : ($(this).popover("show"), $($(this).attr("data-bind")).html("邮箱格式不正确"))
    }), $("#reg_email").on("input", function () {
      var e = $(this).val();
      mailReg.test(e) ? $(this).popover("hide") : ($(this).popover("show"), $($(this).attr("data-bind")).html("邮箱格式不正确"))
    }), $("#reg_email").blur(function () {
      var e = $(this).val();
      r(e) ? $(this).popover("show") : mailReg.test(e) ? $(this).popover("hide") : ($(this).popover("show"), $($(this).attr("data-bind")).html("邮箱格式不正确"))
    }), $("#reg_username,#reg_password,#reg_password_again,#captcha,#username,#password").each(function () {
      $(this).focus(function () {
        $(this).popover("hide"), $(this)[0] == $("#reg_password_again")[0] && ($("#reg_password").val() == $(this).val() ? $(this).css("border-color", "#1e90ff") : ($(this).css("border-color", "rgba(255, 30, 37, 0.89)"), $(this).popover("show")))
      }), $(this).on("input", function () {
        return $(this).popover("hide"), r($(this).val()) ? ($(this).popover("show"), void $($(this).attr("data-bind")).html($(this).attr("data-msg"))) : o($(this)) ? ($(this).popover("show"), void $($(this).attr("data-bind")).html("不支持中文")) : void ($(this)[0] != $("#reg_username")[0] ? $(this)[0] != $("#reg_password")[0] ? $(this)[0] == $("#reg_password_again")[0] && ($("#reg_password").val() == $(this).val() ? ($(this).css("border-color", "#fff #fff #ccc #fff"), $(this).popover("hide")) : ($(this).css("border-color", "rgba(255, 30, 37, 0.89)"), $(this).popover("show"))) : $(this).val().length < 5 ? ($(this).popover("show"), $($(this).attr("data-bind")).html("密码必须大于等于5位")) : $(this).val().length > 64 ? ($(this).popover("show"), $($(this).attr("data-bind")).html("密码必须小于64位")) : /[a-z]|[A-Z]/.test($(this).val()) ? $(this).val() != $("#reg_password_again").val() && ($("#reg_password_again").popover("show"), $($("#reg_password_again").attr("data-bind")).html("两次密码不一致")) : ($(this).popover("show"), $($(this).attr("data-bind")).html("密码中必须包含一个字母")) : $(this).val().length < 5 ? ($(this).popover("show"), $($(this).attr("data-bind")).html("用户名必须大于等于5位")) : $(this).val().length > 64 ? ($(this).popover("show"), $($(this).attr("data-bind")).html("用户名必须小于64位")) : /[a-z]|[A-Z]/.test($(this).val()) || ($(this).popover("show"), $($(this).attr("data-bind")).html("用户名中必须包含一个字母")))
      }), $(this).blur(function () {
        return $(this).popover("hide"), r($(this).val()) ? ($(this).popover("show"), void $($(this).attr("data-bind")).html($(this).attr("data-msg"))) : o($(this)) ? ($(this).popover("show"), void $($(this).attr("data-bind")).html("不支持中文")) : void ($(this)[0] != $("#reg_username")[0] ? $(this)[0] != $("#reg_password")[0] ? $(this)[0] == $("#reg_password_again")[0] && ($("#reg_password").val() == $(this).val() ? ($(this).css("border-color", "#fff #fff #ccc #fff"), $(this).popover("hide")) : ($(this).css("border-color", "rgba(255, 30, 37, 0.89)"), $(this).popover("show"))) : $(this).val().length < 5 ? ($(this).popover("show"), $($(this).attr("data-bind")).html("密码必须大于等于5位")) : $(this).val().length > 64 ? ($(this).popover("show"), $($(this).attr("data-bind")).html("密码必须小于64位")) : /[a-z]|[A-Z]/.test($(this).val()) ? $(this).val() != $("#reg_password_again").val() && ($("#reg_password_again").popover("show"), $($("#reg_password_again").attr("data-bind")).html("两次密码不一致")) : ($(this).popover("show"), $($(this).attr("data-bind")).html("密码中必须包含一个字母")) : $(this).val().length < 5 ? ($(this).popover("show"), $($(this).attr("data-bind")).html("用户名必须大于等于5位")) : $(this).val().length > 64 ? ($(this).popover("show"), $($(this).attr("data-bind")).html("用户名必须小于64位")) : /[a-z]|[A-Z]/.test($(this).val()) || ($(this).popover("show"), $($(this).attr("data-bind")).html("用户名中必须包含一个字母")))
      })
    }), $(window).resize(function () {
      $("#username").popover({
        trigger: "manual",
        content: "请输入用户名/邮箱",        container: "body",
        animation: !1
      }), $("#password").popover({
        trigger: "manual",
        content: "请输入密码",
        container: "body",
        animation: !1
      }), $("#reg_username").popover({
        html: !0,
        trigger: "manual",
        content: '<div id="reg_username_pop">请输入您的用户名</div>',
        container: "body",
        animation: !1
      }), $("#reg_email").popover({
        html: !0,
        trigger: "manual",
        content: '<div id="reg_email_pop">请输入您的邮箱</div>',
        container: "body",
        animation: !1
      }), $("#reg_password").popover({
        html: !0,
        trigger: "manual",
        content: '<div id="reg_password_pop">请输入您的密码</div>',
        container: "body",
        animation: !1
      }), $("#reg_password_again").popover({
        html: !0,
        trigger: "manual",
        content: '<div id="reg_password_again_pop">两次密码不一致</div>',
        container: "body",
        animation: !1
      }), $("#captcha").popover({trigger: "manual", content: "请输入验证码", container: "body", animation: !1})
    }).trigger("resize")
  }), window.login = function () {
    var e = document.getElementById("username").value, t = document.getElementById("password").value,
        o = document.getElementById("login_captcha_input").value;
    r(e) || r(t) ? a($("#username,#password")) : r(o) || o !== captcha_code ? alert("验证码不正确") : (param = {
      username: e,
      password: t
    }, bproto_ajax(LOGIN_URL, param, function (e) {
      console.log(e), 0 == e.code ? ($.cookie("access_token", e.access_token, {path: "/"}), $("[type=checkbox]").prop("checked") && ($.cookie("saveName") || $.cookie("saveName", "", {
        expires: 365,
        path: "/"
      }), -1 == $.cookie("saveName").indexOf(e.username) && $.cookie("saveName", e.username, {
        expires: 365,
        path: "/"
      })), location.href = "/static/xr/index2.html") : alert("用户名或密码错误")
    }, function () {
      alert("服务器连接失败")
    }))
  }, window.GoRegister = function () {
    if (reg_username = document.getElementById("reg_username").value, reg_email = document.getElementById("reg_email").value, reg_password = document.getElementById("reg_password").value, reg_password_again = document.getElementById("reg_password_again").value, r($("#reg_username").val()) || r($("#reg_password").val()) || r($("#reg_password_again").val()) || r($("#reg_email").val())) a($("#reg_username,#reg_password,#reg_password_again,#reg_email")); else if (!o($("#reg_username,#reg_password,#reg_password_again,#reg_email"))) if (mailReg.test($("#reg_email").val())) {
      var e = function () {
        var e = [!1, !1, !1], t = $("#reg_username"), a = $("#reg_password"), o = $("#reg_password_again");
        return t.val().length < 5 ? (t.popover("show"), $(t.attr("data-bind")).html("用户名必须大于等于5位")) : t.val().length > 64 ? (t.popover("show"), $(t.attr("data-bind")).html("用户名必须小于64位")) : /[a-z]|[A-Z]/.test(t.val()) ? e[0] = !0 : (t.popover("show"), $(t.attr("data-bind")).html("用户名中必须包含一个字母")), a.val().length < 5 ? (a.popover("show"), $(a.attr("data-bind")).html("密码必须大于等于5位")) : a.val().length > 64 ? (a.popover("show"), $(a.attr("data-bind")).html("密码必须小于64位")) : /[a-z]|[A-Z]/.test(a.val()) ? a.val() != $("#reg_password_again").val() ? ($("#reg_password_again").popover("show"), $($("#reg_password_again").attr("data-bind")).html("两次密码不一致")) : e[1] = !0 : (a.popover("show"), $(a.attr("data-bind")).html("密码中必须包含一个字母")), o.val() != a.val() ? ($("#reg_password_again").popover("show"), $($("#reg_password_again").attr("data-bind")).html("两次密码不一致")) : e[2] = !0, e
      }();
      e[0] && e[1] && e[2] && bproto_ajax(REGISTER_CHECK_USERNAME, {username: reg_username}, function (e) {
        console.log("验证用户名是否存在:  " + JSON.stringify(e)), 0 === e.code ? bproto_ajax(REGISTER_GET_CAPTCHA, {email: reg_email}, function (e) {
          console.log("获取验证码后提示框:  " + JSON.stringify(e)), 0 === e.code ? $(".modal").modal("show") : -4 === e.code ? ($("#reg_email").val("").focus(), alert("邮箱已存在,请更换邮箱绑定")) : -6 === e.code && alert("邮件发送失败，请联系管理员后重试")
        }) : alert("用户 " + reg_username + " 已存在,请重新输入")
      })
    } else $("#reg_email").popover("show")
  }, window.Get_Captcha = function () {
    bproto_ajax(REGISTER_GET_CAPTCHA, {email: reg_email}, function (e) {
      console.log("再次获取验证码:  " + JSON.stringify(e)), 0 === e.code ? alert("重新获取成功") : -4 === e.code && alert("该邮箱获取次数过多,请稍后重试")
    })
  }, window.Register = function () {
    var e = $("#captcha").val();
    if (r(e)) a($("#captcha")); else {
      var t = {username: reg_username, password: reg_password, cellphone: "12333333333", email: reg_email, captcha: e};
      bproto_ajax(REGISTER_URL, t, function (e) {
        console.log("注册:  " + JSON.stringify(e)), 0 === e.code && (alert("注册成功"), CloseModal(), $(".login input").val(""), ChangeLogin(), $("#username").val(reg_username), $("#password").val(reg_password))
      })
    }
  }, window.ChangeRegister = function () {
    $(".login input").val(""), $("#particles-js .login").hide(), $(".login input").popover("hide"), $("#particles-js .registerdiv").show()
  }, window.ChangeLogin = function () {
    $(".login input").val(""), $("#particles-js .login").hide(), $(".login input").popover("hide"), $("#particles-js .logindiv").show()
  }, s(), mycanvas.onclick = function (e) {
    e.preventDefault(), s()
  }
}]);
