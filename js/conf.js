//静态资源目录 ==> '/static/xr/'





LOGIN_URL = '/api/v1/api_login/';//登录url

REGISTER_URL = '/api/v1/user/user_register/'; //用户注册

REGISTER_CHECK_USERNAME = '/api/v1/user/user_register_check_username/'; // 检查用户名是否存在

REGISTER_GET_CAPTCHA = '/api/v1/user/user_register_get_captcha/'; // 获取邮箱验证码

REGISTER_CHECK_CAPTCHA = '/api/v1/user/user_register_check_captcha/'; // 验证验证码



GET_LOGIN_MSG_URL = "/api/v1/api_login_info/" ;//获取登录信息的url

LOGOUT_URL = "/api/v1/api_logout/"; //退出登录url

GET_REGISTER_URL = "/api/v1/get_register_list2/"; //获取未授权列表

GET_ONLINE_TERMINAL_URL = "/api/v1/get_online_terminal_list/"; //获取在线设备

AUTHORIZE_URL = "/api/v1/auth_register2/"; //授权设备

AUTHORIZE_BY_CERT_URL = "/api/v1/auth_register_by_cert/"; //通过证书授权设备



ADD_USER_URL = "/api/v1/user/add_user/";//添加用户

GET_USERLIST_URL = "/api/v1/get_user_list/" ; //查看所有用户列表

GET_USERCERTS_URL = "/api/v1/get_user_issue_cert_list/" ; //查看用户证书列表

UPDATE_CERTS_URL = "/api/v1/update_cert/" ; //更改证书信息

GET_CERT_TERMINAL_URL = "/api/v1/get_cert_terminal/" ;  //查看证书颁布的设备



ADMIN_ISSUE_UESER_CERT = "/api/v1/issue/admin_issue_user_cert/"; //管理员颁发个用户证书

ISSUE_UESER_CERT = "/api/v1/issue/issue_user_cert/"; //将授权次数转移