//静态资源目录 ==> "/static/"



API_V1 = "/api/v1/";//baseUrl

LOGIN_URL = API_V1 + "api_login/";//登录url

REGISTER_URL = API_V1 + "user/user_register/"; //用户注册

REGISTER_CHECK_USERNAME = API_V1 + "user/user_register_check_username/"; // 检查用户名是否存在

REGISTER_GET_CAPTCHA = API_V1 + "user/user_register_get_captcha/"; // 获取邮箱验证码

REGISTER_CHECK_CAPTCHA = API_V1 + "user/user_register_check_captcha/"; // 验证验证码



GET_LOGIN_MSG_URL = API_V1 + "api_login_info/" ;//获取登录信息的url

LOGOUT_URL = API_V1 + "api_logout/"; //退出登录url

GET_REGISTER_URL = API_V1 + "get_register_list2/"; //获取未授权列表

DEL_REGISTER_INFO = API_V1 + "del_register_info/"; //获取未授权列表

GET_REGISTER_LIST_FILTER_INFO = API_V1 + "get_register_list_filter_info/";//获取未授权检索列表内容

GET_USER_TERMINAL_LIST_FILTER_INFO = API_V1 + "get_user_terminal_list_filter_info/";//获取授权检索列表内容

GET_USER_TERMINAL_LIST = API_V1 + "get_user_terminal_list/"; //获取授权的设备列表




GET_ONLINE_TERMINAL_URL = API_V1 + "get_online_terminal_list/"; //获取在线设备list

GET_USER_ONLINE_TERMINAL_URL = API_V1 + "get_user_online_terminal_list/"; //获取在线设备list

GET_TERMINAL_INFO = API_V1 + "get_terminal_info/";//获取在线设备信息

SEND_SERVER_CMD = API_V1 + "send_server_cmd/";//给在线设备发送信息

GET_SERVER_CMD_RESPONSE = API_V1 + "get_server_cmd_response/";//获取在线设备回复信息

GET_TERMINAL_LOGIN_INFO =  API_V1 + "get_terminal_login_info/"; //获取终端登录信息


AUTHORIZE_URL = API_V1 + "auth_register2/"; //授权设备

AUTHORIZE_BY_CERT_URL = API_V1 + "auth_register_by_cert/"; //通过证书授权设备

PAUSE_TERM_AUTHORITY = API_V1 + "pause_term_authority/"; //暂停终端

RESUME_TERM_AUTHORITY = API_V1 + "resume_term_authority/"; //恢复终端





ADD_USER_URL = API_V1 + "user/add_user/";//添加用户

GET_USERLIST_URL = API_V1 + "get_user_list/" ; //查看所有用户列表

GET_USERCERTS_URL = API_V1 + "get_user_issue_cert_list/" ; //查看用户证书列表

UPDATE_CERTS_URL = API_V1 + "update_cert/" ; //更改证书信息

GET_CERT_TERMINAL_URL = API_V1 + "get_cert_terminal/" ;  //查看证书颁布的设备

GET_CERT_TYPE = API_V1 + "get_cert_type/"; //证书类型列表

ADMIN_ISSUE_UESER_CERT = API_V1 + "issue/admin_issue_user_cert/"; //管理员颁发个用户证书

ISSUE_UESER_CERT = API_V1 + "issue/issue_user_cert/"; //将授权次数转移


GET_CERT_TREE = API_V1 + "get_cert_tree/"; //证书关系树1

GET_CERT_TREE2 = API_V1 + "get_cert_tree2/"; //证书关系树2




USER_LABEL_GET = API_V1 + "user/user_label_get/"; //查看用户标签

USER_LABEL_ADD  = API_V1 + "user/user_label_add/"; //用户标签添加

USER_LABEL_DEL  = API_V1 + "user/user_label_del/"; //用户标签删除

USER_LABEL_UPDATE  = API_V1 + "user/user_label_update/"; //用户标签修改


GET_REMARK = API_V1 + "get_remark/";//获取备注

UPDATE_REMARK = API_V1 + "update_remark/"; //更新备注



GET_MODULE_FIELDS = API_V1 + "get_module_fields/";//设备字段验证列表

GET_MODULE_FIELD_NAME = API_V1 + "get_module_field_name/";//获取字段名称列表

ADD_MODULE_FIELD = API_V1 + "add_module_field/";//添加验证字段

DEL_MODULE_FIELD = API_V1 + "del_module_field/";//删除验证字段



GET_CMS_INFO = API_V1 + "get_cms_info/";//CMS服务器信息

GET_CMS_INFO_LIST = API_V1 + "get_cms_info_list/";//CMS服务器信息

GET_CMS_PU_LIST = API_V1 + "get_cms_pu_list/";

UPDATE_CMS_INFO = API_V1 + "update_cms_info/";//CMS服务器信息(主要是启用/关闭黑白名单)

GET_BW_FIELD_TYPE_LIST = API_V1 + "get_bw_field_type_list/"; //CMS黑白名单字段获取

UPDATE_BLACK_WHITE_LIST_FILTER = API_V1 + "update_black_white_list_filter/"; //添加CMS删除白名单, 增加时(有该项数据, 修改) (条件筛选, 比如CMS上线的设备是指定硬件厂商的设备

GET_BLACK_WHITE_LIST_FILTER = API_V1 + "get_black_white_list_filter/";//获取CMS黑白名单 (条件筛选)


GET_CONFIG_KEYS = API_V1 + "config/get_config_keys/";//获取配置keys

GET_CONFIG_INFO =  API_V1 + "config/get_config_info/"; //获取配置信息列表

UPDATE_CONFIG_INFO = API_V1 + "config/update_config_info/"; //添加/修改/删除 配置信息

GET_APP_INFO = API_V1 + "config/get_app_info/"; //获取开发信息

UPDATE_APP_INFO = API_V1 + "config/update_app_info/"; //修改开发信息



GET_GROUP_AUTHORITY_LIST = API_V1 + "user/get_group_authority_list/"; //用户组权限

GET_GROUP_AUTHORITY = API_V1 + "user/get_group_authority/";//获取组权限列表

UPDATE_GROUP_AUTHORITY = API_V1 + "user/update_group_authority/";//增加/修改/删除 组权限

GET_GROUP_LIST = API_V1 + "user/get_group_list/";//获取用户组

UPDATE_GROUP_LIST = API_V1 + "user/update_group_list/";//添加/修改/删除 组信息

GET_GROUP_USER_LIST = API_V1 + "user/get_group_user_list/";//获取用户组

UPDATE_GROUP_USER_LIST = API_V1 + "user/update_group_user_list/";//修改用户的所在组


GET_GROUP_INVITE_INFO = API_V1 + "user/get_group_invite_info/";//获取邀请码用户组信息

JOIN_GROUP_INVITE = API_V1 + "user/join_group_invite/";//邀请用户加入群组(仅群主), 返回邀请码

JOIN_GROUP = API_V1 + "user/join_group/";//加入群组

EXIT_GROUP = API_V1 + "user/exit_group/";//离开群组




SET_USER_INFO = API_V1 + "user/set_user_info/";//修改用户信息

API_UPDATE_PASSWORD = API_V1 + "api_update_password/"; //修改密码


GET_BACK_PASSWORD = API_V1 + "get_back_password/"; //找回密码

SET_NEW_PASSWORD = API_V1 + "set_new_password/"; //设置密码