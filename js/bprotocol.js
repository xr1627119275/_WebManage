//
function AjaxPost(url,data,list) {
    return new Promise(function (resolve,reject){
        // bproto_ajax(url,data,resolve,reject)
        $.ajax(
            $.ajax({
                type: 'POST',
                dataType: "json",
                url: url,
                headers: {'X-CSRFToken': $.cookie('csrftoken')},
                data: JSON.stringify(data),
                success: function (data,textStatus) {
                    if(data.code&&data.code===-1&&data.msg==="not login"){
                        alert("回话已过期，请重新登录");
                        location.href = '/';
                    }else{
                        resolve(data);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    //通常情况下textStatus和errorThrown只有其中一个包含信息
                    //this; //调用本次ajax请求时传递的options参数
                    console.warn(XMLHttpRequest.statusText)
                    reject(XMLHttpRequest.statusText)
                    // alert("服务器出错,请刷新页面重试" + XMLHttpRequest.statusText + XMLHttpRequest.status);
                }
            })
        )
    })
}

function bproto_ajax(post_url, post_data, on_success, on_error) {

    $.ajax({
        type: 'POST',
        dataType: "json",
        url: post_url,
        headers: {'X-CSRFToken': $.cookie('csrftoken')},
        data: JSON.stringify(post_data),
        success: function (data,textStatus) {
            if(data.code&&data.code===-1&&data.msg==="not login"){
                location.href = '/';
            }else{
                on_success(data);
            }
        },
        error: on_error ? on_error : function (XMLHttpRequest, textStatus, errorThrown) {
            //通常情况下textStatus和errorThrown只有其中一个包含信息
            //this; //调用本次ajax请求时传递的options参数
            console.warn(XMLHttpRequest.statusText)
            // alert("服务器出错,请刷新页面重试" + XMLHttpRequest.statusText + XMLHttpRequest.status);
        }
    })
}



function bproto_ajax_async(post_url, post_data, on_success, on_error) {
    $.ajax({
        type: 'POST',
        dataType: "json",
        url: post_url,
        async:false,
        headers: {'X-CSRFToken': $.cookie('csrftoken')},
        data: JSON.stringify(post_data),
        success: on_success ? on_success : function (data, textStatus) {
            console.log(data)
            console.log(textStatus)
        },
        error: on_error ? on_error : function (XMLHttpRequest, textStatus, errorThrown) {
            //通常情况下textStatus和errorThrown只有其中一个包含信息
            //this; //调用本次ajax请求时传递的options参数
            console.warn(XMLHttpRequest.statusText)
        }
    })
}


function bproto_file_upload(post_url, file_info, on_success, on_error) {
    if(file_info == undefined) {
        console.warn('file_info is undefined')
        return false
    }

    var form_data = new FormData()
    form_data.append('file', file_info);

    $.ajax({
        url: post_url,
        type: 'POST',
        data: form_data,
        dataType: "json",
        headers: {'X-CSRFToken': $.cookie('csrftoken')},
        processData: false,  // tell jquery not to process the data
        contentType: false,  // tell jquery not to set contentType
        success: on_success ? on_success : function (data, textStatus) {
            // $("#weather-temp").html("<strong>" + result + "</strong> degrees");
            console.log(data)
            console.log(textStatus)
        },
        error: on_error ? on_error : function (XMLHttpRequest, textStatus, errorThrown) {
            //通常情况下textStatus和errorThrown只有其中一个包含信息
            //this; //调用本次ajax请求时传递的options参数
            console.warn(XMLHttpRequest.statusText)
        }
    })
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
       var pair = vars[i].split("=");
       if(pair[0] == variable){return pair[1];}
   }
   return false;
}
