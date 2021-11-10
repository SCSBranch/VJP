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

/*--------------------------------------------------------------------   Document ready  -----------------------------------------------------------------------------------------------*/

var Sec_question = getlocalStorage('security_ques');
var profile_userID = getlocalStorage("user_id");


var msg_success = "";
var menuId = "";
var ScreenId = "";
$(document).ready(function () {
    Form_validate_Name = $('form.form-horizontal').attr('id');
    kendodate_format_validator('form_forgotPassword');


    fetch_screen_master('PASSWORD');
    captcha();
    $("#txtUserId").val(profile_userID);

    $("#cmbQuestion").data("kendoComboBox").value(Sec_question);
    var cmbQuestion = $('#cmbQuestion').data("kendoComboBox");
    cmbQuestion.enable(false);
    //$("#cmbQuestion").val(Sec_question);
    $("#seq_mode").val(Sec_question);
    setlocalStorage('UserID', $("#txtUserId").val());
    if (Sec_question == "" || Sec_question == null) {
        var cmbQuestion = $('#cmbQuestion').data("kendoComboBox");
        cmbQuestion.enable();
        $("#lblPass").text("Change Password");
        $("#policy_doc").show(); $("#btnSave").prop("disabled", true);
    }
    $("#txtcnfrmPassword").bind("change", function () {
        password_check();
    });

    $("#txtCaptchaAnswer").bind("change", function () {
        ValidCaptcha();
    });


});

function con_close() {
    if (msg_success == "successful") {
        location.href = "../Launch.html";
    }
    else {
        $('.k-window').css('display', 'none');
        $('.k-overlay').css('display', 'none');
    }

}
/*--------------------------------------------------------------------   Combo Load  -----------------------------------------------------------------------------------------------*/

var weburl = 'http://208.109.11.245:810';
var cmb_code = {};
var cmb_desc = {};
var cmb_dependent = {};
var role_data = [];

function fetch_screen_master(screen_id) {
    if (screen_id != "") {
        var OrgId = 'SCS';
        var LocnId = 'chn';
        var User = getlocalStorage('user_id');
        role_data = [];
        var sRequest = weburl + '/server/MasterCodes/fetch_mastercode_screenid.ashx?org=' + OrgId + '&locn=' + LocnId + '&user=' + User + '&lang=en_us&user_id=' + User + '&screen_code=' + screen_id + '';
        var s = executeService(sRequest);
        var responseJSON = JSON.parse(s);
        if (responseJSON.update == "successful") {
            var cmb_data = responseJSON.data.context.Detail;
            for (var i = 0; i < cmb_data.length; i++) {
                if (cmb_data[i].master_code == "SEC_QUES") {
                    cmb_code[i] = cmb_data[i].code;
                    cmb_desc[i] = cmb_data[i].description;
                    cmb_dependent[i] = cmb_data[i].dependent_code;
                    role_data.push({ code: cmb_code[i], desc: cmb_desc[i], dependent: cmb_dependent[i] });
                }
            }
            filter_combobox("cmbQuestion", role_data);
        }
    }
}

/*--------------------------------------------------------------------   Forgot password save  -----------------------------------------------------------------------------------------------*/

var sec_question = getlocalStorage('security_ques');

function form_save() {
    var valPassword = password_check();
    if (valPassword == true) {
        var valCaptcha = ValidCaptcha();
    }
    if (valPassword == true && valCaptcha == true) {
        var textb = $("#txtnewPassword").val();
        if (textb.trim() == "") {
            kendoAlert('Password cannot be blank');
            return false;
        }
        $("#txtUserId").removeAttr("disabled");
        var cmbQuestion = $('#cmbQuestion').data("kendoComboBox");
        cmbQuestion.enable();
        var save_data = {};
        // save_data.formval = form_Serialize("form_forgotPassword");

        save_data.user_id = $('#txtUserId').val();
        save_data.sec_question_code = $('#cmbQuestion').val();
        save_data.sec_answer = $('#txtAnswer').val();
        save_data.user_password = $('#txtcnfrmPassword').val();
        if (sec_question == "") {
            save_data.mode_flag = "C";
        }
        else {
            save_data.mode_flag = "F";
        }
        $("#txtUserId").prop("disabled", true);
        var cmbQuestion = $('#cmbQuestion').data("kendoComboBox");
        cmbQuestion.enable(false);

        var data = {};
        data.context = context();
        data.context.Header = save_data;
        var sRequest = weburl + '/server/UserRole/save_forgotpassword.ashx';
        var sData = executeService(sRequest, data);
        var responseJSON = JSON.parse(sData);
        if (responseJSON.update == "successful") {
            msg_success = responseJSON.update;
            kendoAlert('Password/ Security Q and A updated successfully <br> Relogin using New Password');
            // location.href = "../Login/Login";
        }
        else {
            kendoAlert(responseJSON.error);
            msg_success = responseJSON.update;
        }
    }
    return false;
    // }
}


/*--------------------------------------------------------------------   Forgot password Captcha validation  -----------------------------------------------------------------------------------------------*/
function captcha() {
    var a = Math.ceil(Math.random() * 9) + ' ';
    var b = Math.ceil(Math.random() * 9) + ' ';
    var c = Math.ceil(Math.random() * 9) + ' ';
    var d = Math.ceil(Math.random() * 9) + ' ';
    var code = a + b + c + d;
    $("#txtCaptcha").val(code);
}

function removeSpaces(string) {
    return string.split(' ').join('');
}

function password_check() {
    if ($("#txtnewPassword").val() == $("#txtcnfrmPassword").val()) {
        return true;
    }
    else {
        kendoAlert("password mismatch");
        return false;
    }
}

function ValidCaptcha() {
    var str1 = removeSpaces($("#txtCaptcha").val());
    var str2 = removeSpaces($("#txtCaptchaAnswer").val());
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
function close1() {
    location.href = "../Launch.html";
}

function refresh() {
    captcha();
}


function onTermsClick() {
    if ($("#chk_term_con").prop('checked') == true) {
        $("#btnSave").prop("disabled", false);
    } else {
        $("#btnSave").prop("disabled", true);
    }

}