/* Without parammeter function*/
function ajaxcall(url) {
    //  set_context();
    var result = $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        async: false
    });
    timeinterval_reset();
    webSession_Exit();
    // webconfig_settings();
    return result.responseText;
}
function ajax_set_api_context(url, paramValue) {
    var result = $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: paramValue,
        contentType: 'application/json; charset=utf-8',
        async: false
    });
    // timeinterval_reset();
    // webSession_Exit();
    // webconfig_settings();
    return result.responseText;
}

function ajaxcall_param_org_login(url, paramValue) {
    var result = $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: paramValue,
        contentType: 'application/json; charset=utf-8',
        async: false
    });
    //timeinterval_reset();
    //webSession_Exit();
    // webconfig_settings();
    return result.responseText;
}

/* With parammeter function*/
function ajaxcall_url_with_1param(url, paramValue) {
    //  set_context();
    var result = $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: paramValue,
        contentType: 'application/json; charset=utf-8',
        async: false
    });
    //  webconfig_settings();
    return result.responseText;
}
function ajaxcall_param_gui(url, paramValue) {
    // set_context();
    var result = $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: paramValue,
        contentType: 'application/json; charset=utf-8',
        async: false
    });
    //timeinterval_reset();
    //webSession_Exit();
    // webconfig_settings();
    return result.responseText;
}

function ajaxcall_param_login(url, paramValue) {
    //set_context();
    var result = $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: paramValue,
        contentType: 'application/json; charset=utf-8',
        async: false
    });
    //timeinterval_reset();
    //webSession_Exit();
    // webconfig_settings();
    return result.responseText;
}
function ajaxcall_param(url, paramValue) {
    //set_context();
    var result = $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: paramValue,
        contentType: 'application/json; charset=utf-8',
        async: false
    });
    timeinterval_reset();
    webSession_Exit();
    // webconfig_settings();
    return result.responseText;
}

//function set_context() {
//    var data = {};
//   // data.userId = getlocalStorage('User_Id_Value');
//    //data.encrypt_id = getlocalStorage('Encryp_Id');
//    data.userId = getlocalStorage('User_Id_Value');
//    data.orgn_id = sessionStorage.getItem('orgId');
//    var set_data = ajax_set_context('/Login/Set_context', data);
//}

function set_context() {
    var data = {};
    if (getlocalStorage('User_Id_Value') == undefined) {
        data.userId = "admin";
    }
    else {
        data.userId = getlocalStorage('User_Id_Value');
    }

    if (getlocalStorage('orgId') == undefined) {
        data.orgn_id = "scs";
    }
    else {
        data.orgn_id = getlocalStorage('orgId');
    }

    //"gkan";
    // data.db_name = sessionStorage.getItem('db_name');// "VEVTVDAxVA";  
    //  data.orgn_id = getlocalStorage('orgId');

    var set_data = ajax_set_context('/Login/Set_context', data);
    return false;
}

function ajax_set_context(url, paramValue) {
    var send = {};
    send.receiveData = JSON.stringify(paramValue);
    var result = $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(send),
        contentType: 'application/json; charset=utf-8',
        async: false
    });
    return "";
}

function ajaxcall_param_new(url, paramValue) {
   // set_context();
    var send = {};
    send.receiveData = JSON.stringify(paramValue);
    var result = $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(send),
        contentType: 'application/json; charset=utf-8',
        async: false
    });
    return result.responseText;
}

function ajaxcall_param_fnew(url, paramValue) {
    //  set_context();
    var send = {};
    send.receiveData = JSON.stringify(paramValue);
    var result = $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(send),
        contentType: 'application/json; charset=utf-8',
        async: false
    });
    return result.responseText;
}


function ajaxcall_param_sec_new(url, paramValue) {

    var send = {};
    send.receiveData = JSON.stringify(paramValue);
    var result = $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(send),
        contentType: 'application/json; charset=utf-8',
        async: false
    });
    return result.responseText;
}


function ajaxcall_param_ques(url, paramValue) {
    set_context();
    var send = {};
    send.receiveData = JSON.stringify(paramValue);
    var result = $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(send),
        contentType: 'application/json; charset=utf-8',
        async: false
    });
    return result.responseText;
}
function showAlert(msg) {
    var len = $(".modelAlertId").length;
    if (len > 0) {
        $(".modelAlertId").remove();
    }
    $("body").append('<div class="modal modelAlertId" data-backdrop="static"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title"><center>Alert</center></h4></div><div class="modal-body"><center>' + msg + '</center></div><div class="modal-footer"><button type="button" class="btn btn-outline pull-left" data-dismiss="modal">Close</button><button type="button" class="btn btn-outline">Save changes</button></div></div></div></div>');

    $(".modelAlertId").modal("show");
    msg = "";
}


function form_Serialize(id) {
    var sArray = $("#" + id).serializeArray();
    var sObj = {};
    $.each(sArray, function (key, value) {
        sObj[value.name] = value.value;
    });
    return JSON.stringify(sObj);
}