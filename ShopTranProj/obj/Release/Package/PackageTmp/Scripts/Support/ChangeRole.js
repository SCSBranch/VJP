var msg_success = "";
var user_id = getlocalStorage('user_id');

/*--------------------------------------------------------------------  File Attachment - Document Ready  -------------------------------------------------------------------------------------------*/
var group = "";
//var group = fetch_attach_screen_master('GROUP', 'SYS');
$(document).ready(function () {
    $("#ChangeRoleModal").on('hidden.bs.modal', function () {
        $(this).data('bs.modal', null);
        filter_combobox('cmbChangeRole', []);
        change_role_combo(user_id);
    });

    $('#ChangeRoleModal').on('loaded.bs.modal', function (e) {
        $('.form-group .k-invalid-msg').remove();
        filter_combobox('cmbChangeRole', []);
        change_role_combo(user_id);
    });

});

function btn_role_cancel() {
    $('#ChangeRoleModal').modal('toggle');
}

/*---------------------------------------------------------------------  Single Fetch Method  ----------------------------------------------------------------------------------*/


function change_role_combo(user_id) {
    var sRequest = weburl + '/server/UserRole/fetch_userrole.ashx?org=' + OrgId + '&locn=' + LocnId + '&user=' + User + '&lang=en_us&user_id=' + user_id + '';
    var s = executeService(sRequest);
    var responseJSON = JSON.parse(s);
    if (responseJSON.update == "successful") {
        generateChange_role(responseJSON);
    }
}

var cmb_code = {};
var cmb_desc = {};
var role_data = [];
var cmb_dependent = {};
function generateChange_role(res) {
    if (res.data.context.Detail != null) {
        var cmb_data = res.data.context.Detail;
        var role_data = [];
        for (var i = 0; i < cmb_data.length; i++) {
            if (cmb_data[i].sel_flag != "0") {
                cmb_code[i] = cmb_data[i].role_id;
                cmb_desc[i] = cmb_data[i].role_description;
                cmb_dependent[i] = cmb_data[i].def_role_flag;
                role_data.push({ code: cmb_code[i], desc: cmb_desc[i], dependent: cmb_dependent[i] });
            }
        }
        filter_combobox("cmbChangeRole", role_data);
        $('#cmbChangeRole').data("kendoComboBox").value(getlocalStorage('role_id'));
    }
}

function Role_change() {
    var role_id_val = $('#cmbChangeRole').data("kendoComboBox").value();
    var role_desc = $('#cmbChangeRole').data("kendoComboBox").text();
    setlocalStorage('role_id', role_id_val);
    setlocalStorage('role', role_desc);
    //get_menu_submenu();
    permission_change();
}

function permission_change() {
    var header_val = {};
    header_val.user_id = getlocalStorage('user_id');
    header_val.role_id = getlocalStorage('role_id');

    var data = {};
    data.context = context();
    data.context.Header = header_val;
    var sRequest = weburl + '/server/Common/change_role_validation.ashx';
    var sData = executeService(sRequest, data);
    var responseJSON = JSON.parse(sData);
    if (responseJSON.update == "successful") {
        var sec_perm = responseJSON.data.context.Detail;
        setlocalStorage('sec_permission', sec_perm);
        kendoVerifyAlert("Role Changed Successfully...");
    }
    else {
        kendoAlert(responseJSON.error);
    }
}
