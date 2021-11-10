window.kendoAlert = function (msg) {
    var win = $("<div />").kendoWindow({
        title: "Message",
        width: "350px",
        height: "130px",
        modal: true,
        draggable: false,
        resizable: false
    }).getKendoWindow();
    win.center().open();
    win.content(msg + "<br><br>" + $("#ok-confirmation").html()).center().open();
};
function con_close() {
    $(".k-i-close").click();
    $('.k-window').css('display', 'none');
    $('.k-overlay').css('display', 'none');
}

/*--------------------------------------------------------------------   Document ready  -----------------------------------------------------------------------------------------------*/
$(document).ready(function () {

    $("#ChangePasswordModal").on('hidden.bs.modal', function () {
        $(this).data('bs.modal', null);
    });
    $('#ChangePasswordModal').on('shown.bs.modal', function (e) {
        $('.form-group .k-invalid-msg').remove();
        filter_combobox("cmbQuestion1", []);
        var sData = load_dropdown_list('PASSWORD', 'SEC_QUES');
        filter_combobox("cmbQuestion1", sData);
    });
    $('#ChangePasswordModal').on('loaded.bs.modal', function (e) {
        $('.form-group .k-invalid-msg').remove();
        filter_combobox("cmbQuestion1", []);

        var sData = load_dropdown_list('PASSWORD', 'SEC_QUES');
        filter_combobox("cmbQuestion1", sData);

    });

    setlocalStorage('tab_click', 'tab_pas');
    chngpassword_captcha();
    chngesecurity_captcha();

    $("#txtUserId").val(getlocalStorage("user_id"));
    $("#txtUserId1").val(getlocalStorage('user_id'));
    $("#txtMode").val("F");

    $("#chngpassword_captcha_ans").bind("change", function () {
        ValidCaptcha();
    });

    $("#security_captcha_ans").bind("change", function () {
        ValidCaptcha1();
    });

});

/*---------------------------------------------------------------------  Change Password Tab Method  ----------------------------------------------------------------------------------*/
function chngpassword_captcha() {
    var a = Math.ceil(Math.random() * 9) + ' ';
    var b = Math.ceil(Math.random() * 9) + ' ';
    var c = Math.ceil(Math.random() * 9) + ' ';
    var d = Math.ceil(Math.random() * 9) + ' ';
    var code = a + b + c + d;
    $("#chng_password_captcha").val(code);
}

function password_refresh() {
    chngpassword_captcha();
}

function ValidCaptcha() {
    var str1 = removeSpaces($("#chng_password_captcha").val());
    var str2 = removeSpaces($("#chngpassword_captcha_ans").val());
    if (str2 != "") {
        if (str1 == str2) {
            return true;
        }
        else {
            kendoAlert("captcha mismatch");
            return false;
        }
    }
}


/*---------------------------------------------------------------------  Change password save  ----------------------------------------------------------------------------------*/
function Save_tab() {
    if (getlocalStorage('tab_click') == "tab_pas") {
        chnge_password_save();
    }
    else if (getlocalStorage('tab_click') == "tab_sec") {
        security_form_save();
    }
}

function chnge_password_save() {
    var validatable = $("#frmChangePassword1").kendoValidator().data("kendoValidator");
    if (validatable.validate()) {
        var valPassword = password_check();
        if (valPassword == true) {
            var valCaptcha = ValidCaptcha();
        }
        if (valCaptcha == true) {
            var formval = form_Serialize("frmChangePassword1");
            var obj_val = JSON.parse(formval);
            obj_val.user_id = getlocalStorage('user_id');

            var data = {};
            data.context = context();
            data.context.Header = obj_val;
            var sRequest = weburl + '/server/UserRole/save_password.ashx';
            var sData = executeService(sRequest, data);
            var responseJSON = JSON.parse(sData);
            if (responseJSON.update == "successful") {
                kendoAlert('Password Details Saved Successfully..');
                // location.href = "../Login/Login";
            }
            else {
                kendoAlert(responseJSON.error);

            }
        }
    }
}

/*---------------------------------------------------------------------  Change security Q/A Method  ----------------------------------------------------------------------------------*/
function chngesecurity_captcha() {
    var a = Math.ceil(Math.random() * 9) + ' ';
    var b = Math.ceil(Math.random() * 9) + ' ';
    var c = Math.ceil(Math.random() * 9) + ' ';
    var d = Math.ceil(Math.random() * 9) + ' ';
    var code = a + b + c + d;
    $("#security_captcha").val(code);
}

function security_refresh() {
    chngesecurity_captcha();
}

function ValidCaptcha1() {
    var str1 = removeSpaces($("#security_captcha").val());
    var str2 = removeSpaces($("#security_captcha_ans").val());
    if (str2 != "") {
        if (str1 == str2) {
            return true;
        }
        else {
            kendoAlert("captcha mismatch");
            return false;
        }
    }
}

/*---------------------------------------------------------------------  Change security Q/A Save  ----------------------------------------------------------------------------------*/


function security_form_save() {
    var validatable = $("#frmchangesecurity1").kendoValidator().data("kendoValidator");
    if (validatable.validate()) {

        var valCaptcha = ValidCaptcha1();
        if (valCaptcha == true) {
            var formval = form_Serialize("frmchangesecurity1");
            var obj_val = JSON.parse(formval);
            obj_val.user_id = getlocalStorage('user_id');

            var data = {};
            data.context = context();
            data.context.Header = obj_val;
            var sRequest = weburl + '/server/UserRole/save_changesecanswer.ashx';
            var sData = executeService(sRequest, data);
            var responseJSON = JSON.parse(sData);
            if (responseJSON.update == "successful") {
                kendoAlert('Security Q and A Details Saved Successfully..');
                // location.href = "../Login/Login";
            }
            else {
                kendoAlert(responseJSON.error);
            }
        }
    }
}


function btn_show() {
    //$("#btnComplete").show();
}

function removeSpaces(string) {
    return string.split(' ').join('');
}

function password_check() {
    if ($("#txtNewPassword").val() == $("#txtConPassword").val()) {
        return true;
    }
    else {
        kendoAlert("password mismatch");
        return false;
    }
}

function btn_password_cancel() {
    $('#ChangePasswordModal').modal('toggle');
}

$('.tab').click(function () {
    var a = $(this).attr('id');
    setlocalStorage('tab_click', a);
});

