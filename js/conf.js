//静态资源目录 ==> '/static/xr/'





LOGIN_URL = '/api/v1/api_login/';//登录url

REGISTER_URL = '/api/v1/user/user_register/'; //用户注册

REGISTER_CHECK_USERNAME = '/api/v1/user/user_register_check_username/'; // 检查用户名是否存在

REGISTER_GET_CAPTCHA = '/api/v1/user/user_register_get_captcha/'; // 获取邮箱验证码

REGISTER_CHECK_CAPTCHA = '/api/v1/user/user_register_check_captcha/'; // 验证验证码



GET_LOGIN_MSG_URL = "/api/v1/api_login_info/" ;//获取登录信息的url

LOGOUT_URL = "/api/v1/api_logout/"; //退出登录url

GET_REGISTER_URL = "/api/v1/get_register_list2/"; //获取未授权列表

DEL_REGISTER_INFO = "/api/v1/del_register_info/"; //获取未授权列表

GET_REGISTER_LIST_FILTER_INFO = "/api/v1/get_register_list_filter_info/";//获取未授权检索列表内容

GET_USER_TERMINAL_LIST_FILTER_INFO = "/api/v1/get_user_terminal_list_filter_info/";//获取授权检索列表内容

GET_USER_TERMINAL_LIST = "/api/v1/get_user_terminal_list/"; //获取授权的设备列表




GET_ONLINE_TERMINAL_URL = "/api/v1/get_online_terminal_list/"; //获取在线设备list

GET_USER_ONLINE_TERMINAL_URL = "/api/v1/get_user_online_terminal_list/"; //获取在线设备list

GET_TERMINAL_INFO = "/api/v1/get_terminal_info/";//获取在线设备信息

SEND_SERVER_CMD = "/api/v1/send_server_cmd/";//给在线设备发送信息

GET_SERVER_CMD_RESPONSE ="/api/v1/get_server_cmd_response/";//获取在线设备回复信息


AUTHORIZE_URL = "/api/v1/auth_register2/"; //授权设备

AUTHORIZE_BY_CERT_URL = "/api/v1/auth_register_by_cert/"; //通过证书授权设备



ADD_USER_URL = "/api/v1/user/add_user/";//添加用户

GET_USERLIST_URL = "/api/v1/get_user_list/" ; //查看所有用户列表

GET_USERCERTS_URL = "/api/v1/get_user_issue_cert_list/" ; //查看用户证书列表

UPDATE_CERTS_URL = "/api/v1/update_cert/" ; //更改证书信息

GET_CERT_TERMINAL_URL = "/api/v1/get_cert_terminal/" ;  //查看证书颁布的设备


ADMIN_ISSUE_UESER_CERT = "/api/v1/issue/admin_issue_user_cert/"; //管理员颁发个用户证书

ISSUE_UESER_CERT = "/api/v1/issue/issue_user_cert/"; //将授权次数转移


USER_LABEL_GET = "/api/v1/user/user_label_get/"; //查看用户标签

USER_LABEL_ADD  = "/api/v1/user/user_label_add/"; //用户标签添加

USER_LABEL_DEL  = "/api/v1/user/user_label_del/"; //用户标签删除

USER_LABEL_UPDATE  = "/api/v1/user/user_label_update/"; //用户标签修改



GET_MODULE_FIELDS = "/api/v1/get_module_fields/";//设备字段验证列表

GET_MODULE_FIELD_NAME = "/api/v1/get_module_field_name/";//获取字段名称列表

ADD_MODULE_FIELD = "/api/v1/add_module_field/";//添加验证字段

DEL_MODULE_FIELD = "/api/v1/del_module_field/";//删除验证字段



GET_CMS_INFO = "/api/v1/get_cms_info/";//CMS服务器信息

GET_CMS_PU_LIST = "/api/v1/get_cms_pu_list/";

UPDATE_CMS_INFO = '/api/v1/update_cms_info/';//CMS服务器信息(主要是启用/关闭黑白名单)

GET_BW_FIELD_TYPE_LIST = "/api/v1/get_bw_field_type_list/"; //CMS黑白名单字段获取

UPDATE_BLACK_WHITE_LIST_FILTER = '/api/v1/update_black_white_list_filter/'; //添加CMS删除白名单, 增加时(有该项数据, 修改) (条件筛选, 比如CMS上线的设备是指定硬件厂商的设备

GET_BLACK_WHITE_LIST_FILTER = '/api/v1/get_black_white_list_filter/';//获取CMS黑白名单 (条件筛选)

