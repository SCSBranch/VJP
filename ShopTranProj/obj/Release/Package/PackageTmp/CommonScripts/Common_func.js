var fltID = "";
var docno = '';
var scrnid = "";
var doctype = '';
var hdrtitle = "";
var searchid = "";
var profile = "";
var click_ctrl_name = "";
var click_act_name = "";
var form_list_url = "";
var list_grid_id = "";
var Screen_Id = "";
var FormName = "";
var Form_validate_Name = "";
var menuId = "";
var permission = "";
var list_in = "";
var interval;
var serverExit;
var Grid_Id = "";
var org_menu_id = "";
var Main_grid = "";
var Org_screen_id = "";
var Org_grid_id = "";
var detail_obj = {};
var hdrtitleGrant = "";
var Global_row_id = "";

// Javascript log4j root functionality //
var js_filename = "Common_func.js";
 
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#Profile_img').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);

    }
}

function parseDate(input) {
    var parts = input.split('/');
    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1] - 1, parts[2]); // Note: months are 0-based
}

function getCurentForm_FileName() {
    var pagePathName = window.location.pathname;
    return pagePathName.substring(pagePathName.lastIndexOf("/") + 1);
}

function javascript_log4j_root(methodName, errmsg) {
    try {
        var err_data = {};
        err_data.formName = getCurentForm_FileName();
        err_data.filename = js_filename;
        err_data.methodName = methodName.toString();
        err_data.errmsg = errmsg.toString();
        var result = ajaxcall_param('/Home/javascript_log4j', JSON.stringify(err_data));
    }
    catch (err) {
        alert(err);
    }
}
function changedataType(res) {
    $.each(res, function (key, value) {
        $.each(value, function (skey, svalue) {
            if (svalue == null)
                svalue = "";
            value[skey] = svalue.toString();
        })
        res[key] = value;
    });
    return res;
}

function crtloginDate() {
    var date = new Date();
    var day = (date.getDate() + 1) > 9 ? (date.getDate() + 0) : "0" + (date.getDate() + 1);
    var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
    var hours = (date.getHours()) > 9 ? (date.getHours()) : "0" + (date.getHours());
    var minutes = (date.getMinutes()) > 9 ? (date.getMinutes()) : "0" + (date.getMinutes());
    var seconds = (date.getSeconds()) > 9 ? (date.getSeconds()) : "0" + (date.getSeconds());
    var date_String =
                date.getFullYear() + "/" +
                month + "/" +
                day;
                             
    setlocalStorage('crtloginDate', date_String);
}


// Session Timeout Function //

interval = window.setInterval('sessioncheck()', 60 * 1000 * 60);


function pageload_fn() {
    timeinterval_reset();
    if ($("#lblloginTimeMsg").val() != undefined)
        $("#lblloginTimeMsg").text("You are logged in Time is : " + getlocalStorage('crtloginTime'));
}

function timeinterval_reset() {
    clearInterval(interval);
    interval = 0;
    interval = window.setInterval('sessioncheck()', 60 * 1000 * 60);
}

function webSession_Exit() {
    //pageload_fn();
    serverExit = $('#txtserverExit').val();
    if (serverExit == "true") {
        sessioncheck();
    }
}


var grid_selected_rows = {};
function reset_Selected_GridRows(id, o) {
    var grid = $("#" + id).data("kendoGrid");
    var newSelection = [];
    var pageData = o.sender.dataSource._data;
    if ($.isEmptyObject(grid_selected_rows) == false) {
        $.each(grid.dataSource._data, function (key, value) {
            $.each(grid_selected_rows, function (skey, svalue) {
                if ((grid_selected_rows[skey] == true) && (skey == value.randNum)) {
                    newSelection.push(pageData[key].uid);
                }
            });
        });
        $.each(newSelection, function (key, uid) {
            $("tr[data-uid='" + uid + "'] td:first").find("input[type='checkbox']").prop("checked", true);
            $("tr[data-uid='" + uid + "']").addClass("k-state-selected");
        });
    }
}

function selected_Grid_Row(id, e, rSelect, sel_Row) {
    var checked = e.checked;
    if (rSelect) {
        checked = true;
        row = sel_Row;
    } else {
        row = $(e).closest("tr");
    }
    grid = $("#" + id).data("kendoGrid");
    var selection = $(e).closest("tr");
    if (rSelect) {
        selection = sel_Row;
    }
    if (checked) {
        //-select the row
        row.addClass("k-state-selected");
        //download_onChange();       
        grid_selected_rows[grid.dataItem(selection).randNum] = true;
    } else {
        //-remove selection
        row.removeClass("k-state-selected");
        grid_selected_rows[grid.dataItem(selection).randNum] = false;
    }
}


function addRandomNum(data) {
    $.each(data, function (key, value) {
        var randNum = Math.floor((Math.random() * 1000000) + 100);
        data[key].randNum = randNum;
    })
    return data;
}

function reset_Selected_GridRows(id, o) {
    var grid = $("#" + id).data("kendoGrid");
    var newSelection = [];
    var pageData = o.sender.dataSource._data;
    if ($.isEmptyObject(grid_selected_rows) == false) {
        $.each(grid.dataSource._data, function (key, value) {
            $.each(grid_selected_rows, function (skey, svalue) {
                if ((grid_selected_rows[skey] == true) && (skey == value.randNum)) {
                    newSelection.push(pageData[key].uid);
                }
            });
        });
        $.each(newSelection, function (key, uid) {
            $("tr[data-uid='" + uid + "'] td:first").find("input[type='checkbox']").prop("checked", true);
            $("tr[data-uid='" + uid + "']").addClass("k-state-selected");
        });
    }
}

function sessioncheck() {
    kendo_Exit_Alert("Your session has expired please relaunch the application.");
}

//security permission check
function sec_Permission(screen_id) {
    try {
        $("#btn_New").prop("disabled", true);
        $("#btnCreate").prop("disabled", true);
        $("#btnSave").prop("disabled", true);
        $("#btn_Save").prop("disabled", true);
        $("#btnDelete").prop("disabled", true);
        $("#btn_Edit").prop("disabled", true);
        $("#btn_View").prop("disabled", true);
        $("#btnClear").prop("disabled", true);
        $("#btnPSave").css("pointer-events", "none");
        $("#btnPSave").css("opacity", "0.3");
        $("#btnSubmit").css("pointer-events", "none");
        $("#btnSubmit").css("opacity", "0.3");

        $("#btnNew").prop("disabled", true);
        $("#btn_CusEdit").prop("disabled", true);
        $("#btn_CusView").prop("disabled", true);


        var permition = getlocalStorage('sec_permission');
        var obj = [];
        var perm = {};
        perm.new = false;
        perm.modify = false;
        perm.delete = false;
        perm.view = false;
        perm.deny = false;
        perm.print = false;
        $.each(permition, function (key, rec) {
            if (rec.screen_id == screen_id) {
                obj.push(rec);
                if (obj[0].new_perm == "1") {
                    $("#btn_New").prop("disabled", false);
                    $("#btnCreate").prop("disabled", false);
                    $("#btnSave").prop("disabled", false);
                    $("#btn_Save").prop("disabled", false);
                    $("#btnClear").prop("disabled", false);
                    $("#btnPSave").css("pointer-events", "");
                    $("#btnPSave").css("opacity", "");
                    $("#btnSubmit").css("pointer-events", "");
                    $("#btnSubmit").css("opacity", "");

                    $("#btnNew").prop("disabled", false);
                    perm.new = true;
                }
                if (obj[0].mod_perm == "1") {
                    $("#btn_Edit").prop("disabled", false);
                    $("#btnSave").prop("disabled", false);
                    $("#btn_Save").prop("disabled", false);
                    $("#btnClear").prop("disabled", false);
                    $("#btnPSave").css("pointer-events", "");
                    $("#btnPSave").css("opacity", "");
                    $("#btnSubmit").css("pointer-events", "");
                    $("#btnSubmit").css("opacity", "");

                    $("#btn_CusEdit").prop("disabled", false);
                    perm.modify = true;
                }
                if (obj[0].del_perm == "1") {
                    $("#btnDelete").prop("disabled", false);
                    perm.delete = true;
                }
                if (obj[0].view_perm == "1" || obj[0].view_perm == "0") {
                    $("#btn_View").prop("disabled", false);
                    $("#btn_CusView").prop("disabled", false);
                    perm.view = true;
                }
                if (obj[0].deny_perm == "1") {
                    perm.deny = true;

                }
            }
        });
        return perm;
    }
    catch (err) {
        javascript_log4j_root(arguments.callee.name, err);
    }
}
function setDefaultValues(e) {

    if (e.type != "click" || e.type == undefined) {

        if (e.action == "" || e.action == undefined) {
            for (var i = 0; i < e.sender._data.length; i++) {
                if (e.sender._data[i].mode_flag == "") {
                    e.sender._data[i].mode_flag = "I";
                    if (e.sender._data[i].mode_flag == "I") {
                        var rows = e.sender.tbody.children();
                        var row = $(rows[i]);
                        row.css('backgroundColor', 'lightgreen')
                    }

                    var rows = e.sender.tbody.children();

                    for (var j = 1; j < rows.length; j++) {
                        var row = $(rows[j]);
                        var dataItem = e.sender.dataItem(row);

                        if (dataItem.mode_flag == "I") {
                            row.css('backgroundColor', 'lightgreen')
                        }
                        else if (dataItem.mode_flag == "D") {
                            row.css('backgroundColor', '#ff3333')
                        }
                    }

                }
                else if (e.sender._data[i].mode_flag != "") {
                    if (e.sender._data[i].mode_flag == "S")
                        if (e.sender._cellId == "comp_change_Grid_active_cell" || e.sender._cellId == "grid_detail_form_active_cell")

                            e.sender._data[i].mode_flag = "S";

                        else
                            e.sender._data[i].mode_flag = "U";

                }
                //else if (e.sender._data[i].mode_flag != "") {
                //    if (e.model.mode_flag != "I")
                //        e.model.mode_flag = "U";
                //}
            }
        }
    }
}
//local storage functions
function setlocalStorage(key, value) {
    try{
        var guid = sessionStorage.getItem('gui_value');
        var data = JSON.parse(localStorage[guid]);
        data[key] = value;
        localStorage.setItem(guid, JSON.stringify(data));
    }
    catch (err) {
        javascript_log4j_root(arguments.callee.name, err);
    }
}

function getlocalStorage(key) {
    try{
        var guid = sessionStorage.getItem('gui_value');
        if (guid != null) {
            var data = JSON.parse(localStorage[guid]);
            return data[key];
        }
        else {
            
        }
    }
    catch (err) {
        javascript_log4j_root(arguments.callee.name, err);
    }
}

function creatlocalStorage(guid) {
    try{
        var data = {};
        localStorage.setItem(guid, JSON.stringify(data));
        sessionStorage.setItem('gui_value', guid);
    }
    catch (err) {
        javascript_log4j_root(arguments.callee.name, err);
    }

}

function removelocalStorage(key) {
    try{
        var guid = sessionStorage.getItem('gui_value');
        var localdata = JSON.parse(localStorage[guid]);
        delete localdata[key];
        localStorage.setItem(guid, JSON.stringify(localdata));
    }
    catch (err) {
        javascript_log4j_root(arguments.callee.name, err);
    }
}


//combo data load
function grid_combo_mastercodes(mstcode) {
    try{
        var data = {};
        var list = [];
        data.mstcode = mstcode;
        var mst_Dt = ajaxcall_param('/Home/getcode', JSON.stringify(data));
        if (mst_Dt.toString() == "null" || mst_Dt == "[]") {
            var master_code = ajaxcall('/Home/mastercodelist');
            mst_Dt = ajaxcall_param('/Home/getcode', JSON.stringify(data));
        }
        if (mst_Dt.toString() != "null" && mst_Dt != "[]")
            list = getGridComboList(JSON.parse(mst_Dt));//changed as getComboList
        return list;
    }
    catch (err) {
        javascript_log4j_root(arguments.callee.name, err);
    }
}

function load_combo_master(mstcode) {
    try {
        var data = {};
        var list = [];
        data.mstcode = mstcode;
        var mst_Dt = ajaxcall_param('/Home/getcode', JSON.stringify(data));
        if (mst_Dt.toString() == "null" || mst_Dt == "[]") {
            var master_code = ajaxcall('/Home/mastercodelist');
            mst_Dt = ajaxcall_param('/Home/getcode', JSON.stringify(data));
        }
        if (mst_Dt.toString() != "null" && mst_Dt != "[]")
            list = getGridComboList(JSON.parse(mst_Dt));//changed as getComboList
        return list;
    }
    catch (err) {
        javascript_log4j_root(arguments.callee.name, err);
    }
}

//screen base master code load function
function load_master_code() {
    try {
        var data = {};
        data.screen_Id = getlocalStorage('MenuId');
        var tab_values = ajaxcall_param("/Home/screenId_mastercodelist", JSON.stringify(data));
    }
    catch (err) {
        javascript_log4j_root(arguments.callee.name, err);
    }
}

function load_combo_values(menuId, Key) {
    try {
        var data = {};
        var list = [];
        data.orgnId = getlocalStorage('orgId');
        data.locnId = 'CHN';
        data.userId = getlocalStorage("User_Id_Value");
        data.menuId = menuId;
        data.key = Key;
        var mst = ajaxcall_param('/Home/get_combo_values', JSON.stringify(data));
        var mst_Dt = JSON.parse(mst)
        if (mst_Dt.detail != 'null') {
            var data = JSON.parse(mst_Dt.detail);
            var code = {}; var description = {}; var dependent = {};
            $.each(data, function (key, val) {
                list.push({ code: data[key].code, desc: data[key].description, dependent: data[key].dependent });
            });
            return list;
        }
        else {
            return list;
        }
    }
    catch (err) {
        javascript_log4j_root(arguments.callee.name, err);
    }
}

function getGridComboList(mst_Dt) {
    try{
        var arr = [];
        $.each(mst_Dt, function (key, value) {
            var list = {};
            if (value != null) {
                var code=value.code;
                list.code = code.trim();
                list.desc = value.description;
                list.status = value.code_status;
                list.dependent = value.dependent_code;
            }
            arr.push(list);
        });
        return arr;
    }
    catch (err) {
        javascript_log4j_root(arguments.callee.name, err);
    }
}

//save function
var set_custom_msg = "";

function Master_Save() {
    var exists = (typeof form_save === 'function');
    if (exists == true) {
        for (var i = 0; i < $('label.required').length; i++) {
            var label_name = $('label.required:eq(' + i + ')');
            var label_for = label_name.attr('for');
            var input_tag = $("#" + label_for);
            input_tag.addClass('required')
            $("#" + label_for + '.required').prop('required', 'required');
            var label_name = label_name.text();
            var data_role = $("#" + label_for + '.required').data("role");
            if (ScreenId == "") {
                var str = label_name;
                var res = str.split(":");
                res = res[0];
                var data_role = $("#" + label_for + '.required').data("role");
                if (data_role == "radio") {
                    set_custom_msg = $("div input[data-role = 'radio']").attr('data-radio-msg', 'Select any one  of the options')
                }
                else if (data_role == "datepicker") {
                    set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' cannot be blank');
                    set_custom_msg = $("#" + label_for + '.required').attr('data-checkdate-msg', 'Enter valid date');
                }
                else if (data_role == "checkbox") {
                    set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' cannot be uncheck');
                }
                else if (data_role == "filtercombo") {
                    set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' cannot be blank');
                }
                else {
                    set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' cannot be blank');
                }
            }
            else {
                var res = $("#lbl_" + label_for).attr('data-original-title');   

                if (def_lang == true) {
                    if (data_role == "radio") {
                        set_custom_msg = $("div input[data-role = 'radio']").attr('data-radio-msg', 'Select any one  of the options')
                    }
                    else if (data_role == "datepicker") {
                        set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' cannot be blank');
                        set_custom_msg = $("#" + label_for + '.required').attr('data-checkdate-msg', 'Enter valid date');
                    }
                    else if (data_role == "checkbox") {
                        set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' cannot be uncheck');
                    }
                    else if (data_role == "filtercombo") {
                        set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' cannot be blank');
                    }
                    else {
                        set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' cannot be blank');
                    }
                }
                else {
                    if (data_role == "radio") {
                        set_custom_msg = $("div input[data-role = 'radio']").attr('data-radio-msg', 'Select any one  of the options')
                    }
                    else if (data_role == "datepicker") {
                        set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' காலியாக இருக்க முடியாது');
                        set_custom_msg = $("#" + label_for + '.required').attr('data-checkdate-msg', 'Enter valid date');
                    }
                    else if (data_role == "checkbox") {
                        set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' காலியாக இருக்க முடியாது');
                    }
                    else if (data_role == "filtercombo") {
                        set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' காலியாக இருக்க முடியாது');
                    }
                    else {
                        set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' காலியாக இருக்க முடியாது');
                    }
                }
            }                                                    
        }
        var validator = $("#" + Form_validate_Name).data("kendoValidator");
        form_validate(validator);

    }
    else {
        kendoAlert("Missing Form Save function");
    }
}

function form_validate(validator) {
    var valid_form = validator.validate();
    if (valid_form == false) {
        var txt_id = $('.k-invalid:eq(0)').attr('id');
        var data_role = $("#" + txt_id + '.required').data("role");       
        if (data_role == "filtercombo") {
            $("#" + txt_id).data("kendoComboBox").input.focus();
        }
        else {
            $("#" + txt_id).focus();
        }       
        return false;
    }
    else {
        form_save();
    }
}



function Master_Verify_Save() {
    var exists = (typeof form_save === 'function');
    if (exists == true) {
        for (var i = 0; i < $('label.required').length; i++) {
            var label_name = $('label.required:eq(' + i + ')');
            var label_for = label_name.attr('for');
            var input_tag = $("#" + label_for);
            input_tag.addClass('required')
            $("#" + label_for + '.required').prop('required', 'required');
            var label_name = label_name.text();
            var data_role = $("#" + label_for + '.required').data("role");
            if (ScreenId == "") {
                var str = label_name;
                var res = str.split(":");
                res = res[0];
                var data_role = $("#" + label_for + '.required').data("role");
                if (data_role == "radio") {
                    set_custom_msg = $("div input[data-role = 'radio']").attr('data-radio-msg', 'Select any one  of the options')
                }
                else if (data_role == "datepicker") {
                    set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' cannot be blank');
                    set_custom_msg = $("#" + label_for + '.required').attr('data-checkdate-msg', 'Enter valid date');
                }
                else if (data_role == "checkbox") {
                    set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' cannot be uncheck');
                }
                else if (data_role == "filtercombo") {
                    set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' cannot be blank');
                }
                else {
                    set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' cannot be blank');
                }
            }
            else {
                var res = $("#lbl_" + label_for).attr('data-original-title');

                if (def_lang == true) {
                    if (data_role == "radio") {
                        set_custom_msg = $("div input[data-role = 'radio']").attr('data-radio-msg', 'Select any one  of the options')
                    }
                    else if (data_role == "datepicker") {
                        set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' cannot be blank');
                        set_custom_msg = $("#" + label_for + '.required').attr('data-checkdate-msg', 'Enter valid date');
                    }
                    else if (data_role == "checkbox") {
                        set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' cannot be uncheck');
                    }
                    else if (data_role == "filtercombo") {
                        set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' cannot be blank');
                    }
                    else {
                        set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' cannot be blank');
                    }
                }
                else {
                    if (data_role == "radio") {
                        set_custom_msg = $("div input[data-role = 'radio']").attr('data-radio-msg', 'Select any one  of the options')
                    }
                    else if (data_role == "datepicker") {
                        set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' காலியாக இருக்க முடியாது');
                        set_custom_msg = $("#" + label_for + '.required').attr('data-checkdate-msg', 'Enter valid date');
                    }
                    else if (data_role == "checkbox") {
                        set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' காலியாக இருக்க முடியாது');
                    }
                    else if (data_role == "filtercombo") {
                        set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' காலியாக இருக்க முடியாது');
                    }
                    else {
                        set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' காலியாக இருக்க முடியாது');
                    }
                }
            }
        }
        var validator = $("#" + Form_validate_Name).data("kendoValidator");
        form_validate_verify(validator);

    }
    else {
        kendoAlert("Missing Form Save function");
    }
}

function form_validate_verify(validator) {
    var valid_form = validator.validate();
    if (valid_form == false) {
        var txt_id = $('.k-invalid:eq(0)').attr('id');
        var data_role = $("#" + txt_id + '.required').data("role");
        if (data_role == "filtercombo") {
            $("#" + txt_id).data("kendoComboBox").input.focus();
        }
        else {
            $("#" + txt_id).focus();
        }
        return false;
    }
    else {
        submit_verify();
    }
}



//kendo date format & validator function
function kendodate_format_validator(form_id) {
    Form_validate_Name = form_id;
    $(".cusDate").kendoDatePicker({
        format: "dd/MM/yyyy"
    });

    var container = $("#" + form_id);
    kendo.init(container);
    container.kendoValidator({
        rules: {
            checkdate: function (input) {
                if (input.attr("data-role") == "datepicker") {
                    var res = isDate(input.val());
                    return res;
                }
                else {
                    return true;
                }
            }
        }
    });
}

function percentage_editor(container, field) {
    $('<input maxlength="' + 3 + '"  name="' + field + '"/>')
     .appendTo(container)
     .kendoNumericTextBox({
         //format: "{0:n0}",
         // decimals:0,
         min: 0,
         max: 100,
         format: "#",
         decimals: 0,
         spinners: false
     });
}


function grid_validation(add_grid_id) {
    var grid_data = $('#' + add_grid_id).data("kendoGrid");
    if (grid_data._data.length > 0) {
        var rows = grid_data.tbody.children();
        for (var i = 0; i < rows.length; i++) {
            var row = $(rows[i]);
            if (row.find('td:eq("1") input').val() == "") {
                grid_data.editCell(row.find('td:eq("1")'))
                return false;
            }
        }
    }
}


function getFormated_StringDate_old(date) {   //get DD/MM/YYYY or YYYY/MM/DD
    if (date != "" || date != undefined) {
        var d = date.split("/");
        // return d[1] + "/" + d[0] + "/" + d[2];
        return d[2] + "/" + d[1] + "/" + d[0];
    }
}

function getFormated_StringDate(date) {   //get DD/MM/YYYY or MM/DD/YYYYY
    if (date != "" || date != undefined) {
        var d = date.split("/");
        return d[1] + "/" + d[0] + "/" + d[2];
    }

}

function dateTo_DDMMYYYY(date) {
    if (date != "" || date != undefined) {
        date = new Date(date);
        var day = date.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        var month = date.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        return day + "/" + month + "/" + date.getFullYear();
    }
}

function master_list_refresh() {
    var exists = (typeof listRefresh === 'function');
    if (exists == true) {
        openBusyCursorModal();
        listRefresh();
        setTimeout(function () {
            closeBusyCursorModal();
        }, 600);
    }
    else {
        kendoAlert("Missing List Refresh function");
    }
}

function listgrid_colgroup() {
    $("#" + list_grid_id + " .k-grid-header-wrap colgroup").remove();
    $("#" + list_grid_id + " .k-grid-header-wrap table").append('<colgroup></colgroup>');
    $("#" + list_grid_id + " .k-grid-content colgroup").remove();
    $("#" + list_grid_id + " .k-grid-content table").append('<colgroup></colgroup>');
    for (var i = 0; i < ($("#" + list_grid_id).data("kendoGrid").columns.length) ; i++) {
        if ($("#" + list_grid_id).data("kendoGrid").columns[i].hidden == false) {
            var width = $("#" + list_grid_id).data("kendoGrid").columns[i].width;
            $("#" + list_grid_id + " .k-grid-header-wrap colgroup").append('<col style = "width: ' + width + 'px">');
            $("#" + list_grid_id + " .k-grid-content colgroup").append('<col style = "width: ' + width + 'px">');
        }
    }
    $('#list_refresh').on('mouseenter', function (e) {
        var list_tooltip = $('#textserarch').val();
        $('#list_refresh').prop('title', list_tooltip);
    });
}

function filterhover() {
    $(".k-dropdown-operator").css('display', 'none');

    $("#" + list_grid_id + " .k-input").attr('disabled', 'false');
    $('input').on('mouseenter', function (e) {

        $("#" + list_grid_id + " .k-input").prop('readonly', true);
        $("#" + list_grid_id + " .k-input").prop('disabled', false);
        $(this).attr('title', $(this).val());
        var gd = $("#" + list_grid_id).data("kendoGrid");
        $(gd.thead.find('th')).each(function () {
            $(this).prop('title', $(this).data('title'));
            // could also use $(this).data('field')
        });
        e.preventDefault();

    }).on('mousedown', function () {
        $("#" + list_grid_id + " .k-input").prop('disabled', true);
    });
    $('.k-grid th').on('mouseenter', function (e) {
        $(this).attr('title', $(this).val());
        var gd = $("#" + list_grid_id).data("kendoGrid");
        $(gd.thead.find('th')).each(function () {
            $(this).prop('title', $(this).data('title'));
            // could also use $(this).data('field')
        });
        e.preventDefault();
    })
}

function filter_row(gd) {
    for (var i = 0; i < gd.columns.length; i++) {
        var filter = $(gd.thead.find("th:not(.k-hierarchy-cell,.k-group-cell)")[i]).data("kendoFilterMenu");
        if (filter != undefined) {
            var type = filter.type;
            var value1 = filter.filterModel.filters[0].value.toString();
            var value2 = filter.filterModel.filters[1].value.toString();
            var field = filter.filterModel.filters[0].field;

            if (value1.toString() != "") {
                if (type == "date") {
                    var date1 = kendo.parseDate(value1);
                    value1 = kendo.toString(date1, "dd/MM/yyyy");
                }
            }

            if (value1.toString() != "") {
                if (type == "date") {
                    var date2 = kendo.parseDate(value2);
                    value2 = kendo.toString(date2, "dd/MM/yyyy");
                }
            }

            var operator1 = filter.filterModel.filters[0].operator;
            if (operator1 == "eq") {
                operator1 = "Equal to" + ":";
            }
            else if (operator1 == "neq") {
                operator1 = "Not equal to" + ":";
            }
            else if (operator1 == "startswith") {
                operator1 = "Starts with" + ":";
            }
            else if (operator1 == "contains") {
                operator1 = "Contains" + ":";
            }
            else if (operator1 == "doesnotcontain") {
                operator1 = "Doesn't Contain" + ":";
            }
            else if (operator1 == "endswith") {
                operator1 = "Ends with" + ":";
            }
            else if (operator1 == "gte") {
                if (type == "date") {
                    operator1 = "After or equal to" + ":";
                }
                else {
                    operator1 = "Greater than or equal to" + ":";
                }
            }
            else if (operator1 == "gt") {
                if (type == "date") {
                    operator1 = "After" + ":";
                }
                else {
                    operator1 = "Greater than" + ":";
                }
            }
            else if (operator1 == "lte") {
                if (type == "date") {
                    operator1 = "Before or equal to" + ":";
                }
                else {
                    operator1 = "Less than or equal to" + ":";
                }
            }
            else if (operator1 == "lt") {
                if (type == "date") {
                    operator1 = "Before" + ":";
                }
                else {
                    operator1 = "Less than" + ":";
                }
            }
            var operator2 = filter.filterModel.filters[1].operator;
            if (operator2 == "eq") {
                operator2 = "Equal to" + ":";
            }
            else if (operator2 == "neq") {
                operator2 = "Not equal to" + ":";
            }
            else if (operator2 == "startswith") {
                operator2 = "Starts with" + ":";
            }
            else if (operator2 == "contains") {
                operator2 = "Contains" + ":";
            }
            else if (operator2 == "doesnotcontain") {
                operator2 = "Doesn't Contain" + ":";
            }
            else if (operator2 == "endswith") {
                operator2 = "Ends with" + ":";
            }
            else if (operator2 == "gte") {
                if (type == "date") {
                    operator2 = "After or equal to" + ":";
                }
                else {
                    operator2 = "Greater than or equal to" + ":";
                }
            }
            else if (operator2 == "gt") {
                if (type == "date") {
                    operator2 = "After" + ":";
                }
                else {
                    operator2 = "Greater than" + ":";
                }
            }
            else if (operator2 == "lte") {
                if (type == "date") {
                    operator2 = "Before or equal to" + ":";
                }
                else {
                    operator2 = "Less than or equal to" + ":";
                }
            }
            else if (operator2 == "lt") {
                if (type == "date") {
                    operator2 = "Before" + ":";
                }
                else {
                    operator2 = "Less than" + ":";
                }
            }
            if (value1 != "" && value2 != "") {
                $('span[data-field = ' + field + '] .k-input').val(operator1 + " " + value1 + " " + filter.filterModel.logic + " " + operator2 + " " + value2);

            }
            else if (value1 == "" && value2 != "") {
                $('span[data-field = ' + field + '] .k-input').val(value1 + " " + operator2 + " " + value2);
            }
            else if (value1 != "" && value2 == "") {
                $('span[data-field = ' + field + '] .k-input').val(operator1 + " " + value1 + " " + value2);
            }
            else {
                $('span[data-field = ' + field + '] .k-input').val(value1 + " " + value2);
            }
        }
    }
    $('.k-i-close').css('display', 'none');
    $('.k-button-icon').css('display', 'none');
    $('.k-input').prop('disabled', false);
    $('.k-input').prop('readonly', true);
    $(".k-dropdown-operator").css('display', 'none');

}


//filtercombo
function filter_combobox(id, datasource) {
    $("#" + id).kendoComboBox({
        dataTextField: "desc",
        dataValueField: "code",
        filter: "contains",
        autoBind: false,
        autoWidth: true,
        minLength: 1,
        dataSource: datasource,
        change: function () {           
            var value = this.value();
            var text = this.text();
            if (value && this.selectedIndex == -1) {
                this.value("");
            }           
        },
        dataBound: setColorforcombo,        
    });

    // var comboBox = $("#" + id).data("kendoComboBox");
    //$("#" + id + " .k-item").css("display", "inline-block");
    //$("#" + id + " .k-item").css( "min-width", "100%");
    //comboBox.list.css("min-width","100%");
    list_in = "";
}

//multiple select combobox
function mul_filter_combobox(id, datasource) {
    $("#" + id).kendoMultiSelect({
        dataTextField: "desc",
        dataValueField: "code",
        autoClose: false,
        dataSource: datasource
    });

    list_in = "";
}


//combovalue color setup
function setColorforcombo() {

    for (var i = 0; i < this.dataSource._data.length; i++) {
        var val = this.dataSource._data[i].status;
        var desc = this.dataSource._data[i].desc;
        var row = $(this.list.find('li')[i]);
        if (val == "Active") {
            row.css('color', 'black')
        }
        else if (val == "Inactive") {
            row.css('color', 'red')
        }        
    }
}

//calculation
function compute(id, grid_frmla_res, form_frmla_res) {
    var loop_result = 0; var g_result = 0; var f_result = 0;
    try {
        var grid = $("#" + id).data("kendoGrid");
        var gridData = grid.dataSource.view();

        for (var i = 0; i < gridData.length; i++) {
            for (var j = 0; j < grid_frmla_res.length; j++) {
                loop_result = eval(grid_frmla_res[j].grd_formula);
                if (loop_result != undefined && loop_result.toString() != "NaN")
                    eval(grid_frmla_res[j].grd_result + "=" + parseFloat(loop_result));
            }
            for (var k = 0; k < form_frmla_res.length; k++) {
                if (k == 0) {
                    var temp_rec = eval(form_frmla_res[k].frm_formula);
                    if (temp_rec != undefined) {
                        g_result += parseFloat(temp_rec);
                        if (g_result.toString() != "NaN")
                            document.getElementById(form_frmla_res[k].frm_result).value = g_result;
                    }
                }
                else {
                    f_result = eval(form_frmla_res[k].frm_formula);
                    if (f_result != undefined)
                        document.getElementById(form_frmla_res[k].frm_result).value = parseFloat(f_result);
                }
            }
        }
    }
    catch (err) {
        var error = err.message;
    }
}

function check(form_id) {
    var container = $("#" + form_id);
    kendo.init(container);
    container.kendoValidator({
    });
}
//function grid_refresh(id) {
//    $('#' + id).data('kendoGrid').refresh();
//}

//form header title //
function header_title(title, MenuId) {
    setlocalStorage('header_title', title);
    setlocalStorage('MenuId', MenuId);   
}

function check_dirty(oldform_value, currentform_value) {
    var formdirty = false;
    $.each(oldform_value.form, function (key, mytask) {
        $.each(currentform_value.form, function (skey, smytask) {
            if (key.toLowerCase() != "mode_flag") {
                if (key.toLowerCase() == skey.toLowerCase()) {
                    if (mytask != smytask) {
                        formdirty = true;
                        return;
                    }
                }
            }
        });
    });
    if (oldform_value.grid != undefined) {
        for (var i = 0; i < oldform_value.grid.length; i++) {
            if (oldform_value.grid[i].length != currentform_value.grid[i].length) {
                formdirty = true;
            } else {
                $.each(oldform_value.grid[i], function (gkey, gvalue) {
                    var current = currentform_value.grid[i][gkey];
                    if ((current.mode_flag != undefined) && (current.mode_flag != "D")) {
                        current = currentform_value.grid[i][gkey];
                        current.mode_flag = "";
                    }
                    current = JSON.stringify(currentform_value.grid[i][gkey]);
                    var old = oldform_value.grid[i][gkey];
                    if (old.mode_flag != undefined) {
                        old = oldform_value.grid[i][gkey];
                        old.mode_flag = "";
                    }
                    old = JSON.stringify(oldform_value.grid[i][gkey]);
                    if (current != old) {
                        formdirty = true;
                        return;
                    }
                });
            }
        }
    }
    return formdirty;
}

function dirty_modal() {
    $('<div id="custom_dirty" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="custom-title" data-backdrop="static" data-keyboard="false">' +
   '<div class="modal-dialog" role="document">' +
       '<div class="modal-content panel-danger">' +
           '<div class="modal-header panel-heading" style="color:white;background-color:#f56666;border-color:#f56666">' +
               '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
               '<span aria-hidden="true">×</span>' +
               '</button>' +
               '<h3 class="modal-title" id="custom-title"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>Are you sure you want to do that?</h3>' +
           '</div>' +
           '<div class="modal-body panel-body dirty-message" style="background-color:white">You&#39;ve made changes on this page which aren&#39;t saved. If you leave you will lose these changes.</div>' +
           '<div class="modal-footer panel-footer">' +
           '<div class=""  id="dirty_modal_btn" style="float:right">' +
               '<button id ="dirtymodal_proceed" type="button" class="custom-proceed btn btn-danger" style="float:left;color:white;background-color:#028400;border-color:#028400">Leave This Page</button>' +
               '<button type="button" class="custom-stay btn btn-default" data-dismiss="modal" style="float:left;color:white;background-color:#f56666;border-color:#f56666">Stay Here</button>' +
           '</div>' +
     '</div>' +
       '</div>' +
   '</div>' +
'</div>').appendTo('body');
}

function onAnchorClick(ev) {    
     anchor_menu(ev);
    return false;      
}

function anchor_menu(ev) {
    if (ev.currentTarget.className.trim() == "custom_proceed_href btn btn-danger") {
        //  window.location.href = ev.toElement.href;
        window.location.href = ev.currentTarget.pathname;      
    }
    else {
        var target = ev.target;
        FormName = $('form.form-horizontal').attr('id');
        var formval = form_Serialize(FormName);
        var currentform_value = {};
        currentform_value.form = JSON.parse(formval);
        var gridData = [];
        $("div[data-role='grid']").each(function () {
            var id = $(this).attr("id");
            gridData.push(JSON.parse(JSON.stringify($("#" + id).data("kendoGrid").dataSource.data())));
        });
        currentform_value.grid = gridData;
        var dirty_cond = check_dirty(oldform_value, currentform_value);
        if (dirty_cond == true) {
            $("#dirtymodal_proceed").css("display", "none");
            $("#dirty_clear").css("display", "none");
            if ($(".custom_proceed_href").length > 0) {
                $(".custom_proceed_href").remove();
            }
            $("#dirty_modal_btn").prepend("<a  class='custom_proceed_href btn btn-danger' style='float:left;color:white;background-color:#699917;border-color:#699917' href='" + ev.currentTarget.pathname + "'>Leave This Page</a>");
            $('#custom_dirty').modal("show");
            return false;
        }
        else {
            //  window.location.href = ev.toElement.href;           
            window.location.href = ev.currentTarget.pathname;
            return true;
        }
    }
}


// get grid datsource
function getGridDataSource(ids) {
    var arr = [];
    if (typeof ids == "object") {
        for (var i = 0; i < ids.length; i++) {
            var grid = $("#" + ids[i]).data("kendoGrid").dataSource.data();
            grid = JSON.parse(JSON.stringify(grid));
            arr.push(grid);
        }
    } else {
        alert("send only array format data to getGridDataSource function")
    }
    return arr;
}


//grid numeri field editor
function numeric_editor(container, field, maxlen, no_decimals) {
    $('<input maxlength="' + maxlen + '"  name="' + field + '"/>')
     .appendTo(container)
     .kendoNumericTextBox({
         min: 0,
         format: "#",
         decimals: 0,
         spinners: false
     });
}

//grid rate field editor 
function item_rate(container, field, maxlen, no_decimals,name_desc) {
    var formatStr = "#";
    var dec_str = "######";
    if (no_decimals > 0)
        formatStr = formatStr + "." + dec_str.substr(0, no_decimals);
    $('<input required maxlength="' + maxlen + '" data-required-msg="' + name_desc +' cannot be blank" name="' + field + '"/>')
     .appendTo(container)
     .kendoNumericTextBox({
         min: 0,
         format: "{:n2}",
         // format: formatStr,
         //decimals: no_decimals,
         spinners: false
     });
}


//grid numeric and dot allowed editor
function numeric_editor_dot(container, field, maxlen, no_decimals) {
    var formatStr = "#";
    var dec_str = "######";
    if (no_decimals > 0)
        formatStr = formatStr + "." + dec_str.substr(0, no_decimals);
    $('<input maxlength="' + maxlen + '"  name="' + field + '"/>')
     .appendTo(container)
     .kendoNumericTextBox({
         min: 0,
         format: formatStr,
         decimals: no_decimals,
         spinners: false
     });
}

function contactno_length(currVal) {
    if (currVal == "") {
        return true;
    }
    if (currVal.length < 10) {
        return false;
    }
    else {
        return true;
    }
}

//grid textarea editor
function textarea_editor(container, field, maxlen) {
    $('<textarea data-bind="value:' + field + '" maxlength="' + maxlen + '" style="color:black;width:95%" />').appendTo(container);
}

//security permission for list and grid

function page_load_list_permission(permission) {
    if (permission.deny == true) {
        $('#btn_New').attr("disabled", true);
        $('#btn_Edit').attr("disabled", true);
        $('#btbtnViewn_View').attr("disabled", true);
        var data = [];
        listgrid(data);
    }
    else {
        if (permission.new == true) {
            $('#btn_New').attr("disabled", false);
            $('#btn_Edit').attr("disabled", true);
            $('#btn_View').attr("disabled", false);
        }
        if (permission.modify == true) {
            $('#btn_New').attr("disabled", true);
            $('#btn_Edit').attr("disabled", false);
            $('#btn_View').attr("disabled", false);
        }
        if (permission.delete == true) {
            $('#btn_New').attr("disabled", true);
            $('#btn_Edit').attr("disabled", false);
            $('#btn_View').attr("disabled", false);
        }

        if (permission.modify == true && permission.new == true && permission.delete == false) {
            $('#btn_New').attr("disabled", false);
            $('#divEdit #btn_edit_Save').attr("disabled", false);
            $('#divEdit #btn_edit_DeActivate').attr("disabled", true);
        }
        if (permission.new == true && permission.delete == true && permission.modify == false) {
            $('#btn_New').attr("disabled", false);
            $('#divEdit #btn_edit_Save').attr("disabled", true);
            $('#divEdit #btn_edit_DeActivate').attr("disabled", false);
        }
        if (permission.new == false && permission.delete == true && permission.modify == true) {
            $('#btn_New').attr("disabled", true);
            $('#divEdit #btn_edit_DeActivate').attr("disabled", false);
            $('#divEdit #btn_edit_DeActivate').attr("disabled", false);
        }
        if (permission.new == true && permission.delete == true && permission.modify == true) {
            $('#btn_New').attr("disabled", false);
            $('#divEdit #btn_edit_DeActivate').attr("disabled", false);
            $('#divEdit #btn_edit_DeActivate').attr("disabled", false);
        }
        if (permission.new == false && permission.delete == false && permission.modify == false && permission.view == true) {
            $('#btn_New').attr("disabled", true);
            $('#btn_Edit').attr("disabled", true);
            $('#btn_View').attr("disabled", false);
        }             
            listpageloadfetch();          
    }
    return false;
}


function form_user_permission(permission) {
    if (permission.modify == true) {
        $('#divEdit #btnSaveDraft').attr("disabled", false);
        $('#divEdit #btnDeleteDraft').attr("disabled", true);
        $('#divEdit #btnSave').attr("disabled", false);
        $('#divEdit #inactivate').attr("disabled", true);
    }
    if (permission.delete == true) {
        $('#divEdit #btnSaveDraft').attr("disabled", true);
        $('#divEdit #btnDeleteDraft').attr("disabled", false);
        $('#divEdit #btnSave').attr("disabled", true);
        $('#divEdit #inactivate').attr("disabled", false);
    }
    if (permission.modify == true && permission.new == true && permission.delete == false) {
        $('#divEdit #btnSaveDraft').attr("disabled", false);
        $('#divEdit #btnDeleteDraft').attr("disabled", true);
        $('#divEdit #btnSave').attr("disabled", false);
        $('#divEdit #inactivate').attr("disabled", true);
    }
    if (permission.new == true && permission.delete == true && permission.modify == false) {
        $('#divEdit #btnSaveDraft').attr("disabled", true);
        $('#divEdit #btnDeleteDraft').attr("disabled", false);
        $('#divEdit #btnSave').attr("disabled", true);
        $('#divEdit #inactivate').attr("disabled", false);
    }
    if (permission.new == false && permission.delete == true && permission.modify == true) {
        $('#divEdit #btnSaveDraft').attr("disabled", false);
        $('#divEdit #btnDeleteDraft').attr("disabled", false);
        $('#divEdit #btnSave').attr("disabled", false);
        $('#divEdit #inactivate').attr("disabled", false);
    }
    if (permission.new == true && permission.delete == true && permission.modify == true) {
        $('#divEdit #btnSaveDraft').attr("disabled", false);
        $('#divEdit #btnDeleteDraft').attr("disabled", false);
        $('#divEdit #btnSave').attr("disabled", false);
        $('#divEdit #inactivate').attr("disabled", false);
    }
}

//grid mandatory set color
function grid_mandatory(grid_id, title) {
    $("#" + grid_id + " th[role='columnheader']").each(function () {
        for (var i = 0; i < title.length; i++) {
            if (title[i] == $(this).text()) {
                if ($(this).find("a").length > 0) {
                    $(this).children().append("<span class='cr_required'></span>");
                } else {
                    $(this).append("<span class='cr_required'></span>");
                }
            }
        }
    });
}

function date_validate(event) {
    var x = event.charCode;
    if ((x >= 48 && x <= 57) || (x == 47) || (x == 0)) {
        return true;
    }
    else {
        return false;
    }
}

function formvalidate_load() {
    for (var i = 0; i < $('label.required').length; i++) {
        var label_name = $('label.required:eq(' + i + ')');
        var label_for = label_name.attr('for');
        var input_tag = $("#" + label_for);
        var addclass = input_tag.addClass('required')
        var set_prop = $("#" + label_for + '.required').prop('required', 'required');
        var label_name = label_name.text();
        var str = label_name;
        var res = str.split(":");
        res = res[0];
        var data_role = $("#" + label_for + '.required').data("role");
        var set_custom_msg = "";
        if (data_role == "radio") {
            //set_custom_msg = $("#" + label_for + '.required').attr('data-radio-msg', 'Select any one  of the options');
            set_custom_msg = $("div input[data-role = 'radio']").attr('data-radio-msg', 'Select any one  of the options')
        }
        else if (data_role == "datepicker") {
            set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' cannot be blank');
            set_custom_msg = $("#" + label_for + '.required').attr('data-checkdate-msg', 'Enter valid date');
        }
        else if (data_role == "checkbox") {
            set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' cannot be uncheck');
        }
        else if (data_role == "filtercombo") {
            //$("#" + label_for + '.required').data("kendoComboBox").input.focus();
           // $('#' + label_for).siblings().eq(0).children().eq(0).attr("tabindex", i + 1)
            set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' cannot be blank');
        }
        else {
           // var set_tabindex = $("#" + label_for + '.required').prop('tabindex', '' + (i + 1) + '');
            set_custom_msg = $("#" + label_for + '.required').attr('data-required-msg', '' + res + ' cannot be blank');
        }
    }
    var validator = $("#" + Form_validate_Name).data("kendoValidator");
}

//grid allow only number event
function eliminate_text(event) {
    //to eliminate text//
    var x = event.charCode;
    if ((x >= 48 && x <= 57)) {
        return true;
    }
    else {
        return false;
    }
}

function eliminate_char_only(event) {
    //to eliminate numeric//
    var x = event.charCode;
    if ((x >= 65 && x <= 120) && (x != 32 && x != 0)) {
        return true;
    }
    else {
        return false;
    }
}

$('.number').keydown(function (event) {
    // Allow special chars + arrows 
    if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9
        || event.keyCode == 27 || event.keyCode == 13
        || (event.keyCode == 65 && event.ctrlKey === true)
        || (event.keyCode >= 35 && event.keyCode <= 39)) {
        return;
    } else {
        // If it's not a number stop the keypress
        if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
            event.preventDefault();
        }
    }
});

$(".dotnumber").keypress(function (evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57))
        return false;

    return true;
});



//list export excel function
function exportfunction(e, chkall, chkfilter, chktemp, twokendobox, gd) {
    e.preventDefault();
    var sdata = {};
    var detail = {};
    if (chkall == true) {
        if (sdata.griddata == "" || sdata.griddata == undefined) {
            sdata.griddata = JSON.stringify(e.sender.dataSource._data);

        }
    }
    else if (chkfilter == true) {
        if (e.sender.dataSource._view.length == 0) {
            //if (twokendobox == false) {
            //    kendoAlert('Sorry, no data found in the grid to Export');
            //}
            //return false;
        }
        else {
            sdata.griddata = JSON.stringify(e.sender.dataSource._view);
        }
    }
    else {
        var cmb_temp = $('#cmbtemp').data("kendoComboBox").text();
        var combo_temp = $('#cmbtemp').data("kendoComboBox");
        cmb_temp_path = $('#cmbtemp').data("kendoComboBox").dataSource.data()[combo_temp.selectedIndex].code;
        var path = cmb_temp_path.split("//");
        //path = path[2].split(".");
        path = path[0].split(".");
        if (cmb_temp_path != "" && cmb_temp != "") {
            sdata.combovalue = cmb_temp;
            sdata.filepath = path[1];
            sdata.SubTreeId = SubTreeId;
            sdata.TreeId = TreeId;
            sdata.griddata = JSON.stringify(e.sender.dataSource._data);
        }
        else {
            if (twokendobox == false) {
                kendoAlert('Please select any one of the template excel');
            }
            return false;
        }
    }
    sdata.chkall = chkall;
    sdata.chkfilter = chkfilter;
    sdata.chktemp = chktemp;
    sdata.SubTreeId = SubTreeId;
    sdata.TreeId = TreeId;

    if (gd._data.length == 0) {
        if (twokendobox == false) {
            kendoAlert('Sorry, no data found in the grid to Export');
        }
        return false;
    }
    else {
        var export_excel_data = ajaxcall_param("/Home/Export_Excel", JSON.stringify(sdata));
        if (export_excel_data != undefined) {
            var exp_excel = JSON.parse(export_excel_data);
            if (exp_excel.success == true) {
                var pathname = window.location.pathname;
                var url = window.location.href;
                url = url.split("#");
                url = url[0];
                url = url.replace(pathname, "");
                window.location.href = url + (exp_excel.path);
            }
            if (twokendobox == false) {
                kendoAlert(exp_excel.msg);
            }
            e.preventDefault();
            return false;
        }
    }
}


//grid delete function
function grid_row_delete(e,grid_id)
{
    e.preventDefault();
    var grid = $("#" + grid_id).data("kendoGrid");
    var dataItem = $("#" + grid_id).data("kendoGrid").dataItem($(e.target).closest("tr"));
    DeleteWindowEvent(e, dataItem, grid);
    e.stopImmediatePropagation();
}

//grid databound row color setting function
function row_set_color(e,grid_id)
{
    resultData = e.sender._data;
    var rows = $('#' + grid_id).data('kendoGrid').tbody.children();
    setColor(rows, resultData);
}

function setColor(rows, resultData) {
    for (var i = 0; i < rows.length; i++) {
        var row = $(rows[i]);
        if (resultData[i].mode_flag == "I") {
            row.css('backgroundColor', 'lightgreen');
        }
        else if (resultData[i].mode_flag == "D") {
            row.css('backgroundColor', '#ff3333');
        }
    }
    var child_del = $('.k-grid-Delete').children('span:first');
    $('.k-grid-Delete').html(child_del);    
}

//kendo date format & validator function
function kendodate_format_validator(form_id) {
    Form_validate_Name = form_id;
    $(".cusDate").kendoDatePicker({
        format: "dd/MM/yyyy"
    });

    var container = $("#" + form_id);
    kendo.init(container);
    container.kendoValidator({
        rules: {
            checkdate: function (input) {
                if (input.attr("data-role") == "datepicker") {
                    var res = isDate(input.val());
                    return res;
                }
                else {
                    return true;
                }
            }
        }
    });
}

//serialize form
function form_Serialize(id) {
    var sArray = $("#" + id).serializeArray();
    var sObj = {};
    $.each(sArray, function (key, value) {
        sObj[value.name] = value.value;
    });
    return JSON.stringify(sObj);
}

$(function () {
    $('a.adv_filter').click(function () {
        try {
            fltID = $(this).attr('fltID');
            hdrtitle = $(this).attr('hdrtitle');
            if (fltID == undefined || fltID == "") {
                kendoAlert("Check below attributes are mandatory fltID");
                return false;
            }
        }
        catch (err) {
            alert(err);
        }
    });

    $('a.Export').click(function () {
        try {
            hdrtitle = $(this).attr('hdrtitle');
            TreeId = $(this).attr('TreeId');
            SubTreeId = $(this).attr('SubTreeId');
        }
        catch (err) {
            alert(err);
        }
    });

    $('a.OrgView').click(function () {
        try {
            hdrtitle = $(this).attr('hdrtitle');
        }
        catch (err) {
            alert(err);
        }
    });

    $('a.OrgView').click(function () {
        try {
            Org_screen_id = $(this).attr('Org_screen_id');
            Org_grid_id = $(this).attr('Org_grid_id');

        }
        catch (err) {
            alert(err);
        }

    });

    $('a.file_attach').click(function () {
        try {
            var DocumnetNo = $(this).attr('docno')
            if (DocumnetNo != "") {
                docno = $(this).attr('docno');
                doctype = $(this).attr('doctype');
                scrnid = $(this).attr('scrnid');
                hdrtitle = $(this).attr('hdrtitle');
            }
            else {

                kendoAlert("Task Id  cannot be blank", "Warning");
                return false;
            }
        }
        catch (err) {
            alert(err);
        }
    });
});
//get combo box description
function get_code_to_desc(id) {
    try {
        var mat_desc = "";
        var data_source = $('#' + id).data("kendoComboBox");
        data_source = data_source.dataSource._data;
        var cmb_value = $("#" + id).data("kendoComboBox").value();
        $.each(data_source, function (key, val) {
            var deseription = data_source[key];
            if (data_source[key].code.toString() == cmb_value.toString()) {
                mat_desc = data_source[key].desc.toString();
                return false;
            }
        });
        return mat_desc;
    }
    catch (err) {
    }
}

//email validation
function checkEmail(val) {

    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (val == "") {
           
    } else if (regex.test(val) == false) {
            return false;
        }
    return true;
}

//url validation
function is_url(str) {
    regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str)) {
        return true;
    }
    else {
        return false;
    }
}


//hely type content
function helpTypeContent(attribute_type, attributefield) {
    var attributefield_value;
    var field_type = attribute_type.split("_");
    if (field_type.length > 0)
        var attribute_label = field_type[0] + ' ' + field_type[1];
    setlocalStorage('HelpTypeContentlabel', attribute_label);
    var type = attributefield.substring(0, 3);
    if (type == 'cmb')
        attributefield_value = get_code_to_desc(attributefield);
    if (type == 'txt')
        attributefield_value = $("#" + attributefield).val();
    setlocalStorage('HelpTypeContent', attributefield_value);
}


 function speical_char(event) {
        var x = event.charCode;
        if ((x >= 97 && x <= 122) || (x >= 48 && x <= 57) || (x >= 65 && x <= 90) || (x >= 40 && x <= 41) || (x == 47) || (x == 95) || (x == 45) || (x == 32) || (x == 190) || (x == 38) || (x == 0) || (x == 189)) {
            return true;
        }
        else {
            return false;
        }
 }

 function combo_editor(container, cmbid, datasource, datafield, code_datafield, grid_id) {
     $('<input  id="' + cmbid + '" data-text-field="desc" data-value-field="desc" data-bind="value:' + datafield + '"/>').appendTo(container).kendoComboBox({
         autoBind: false,
         filter: "contains",
         dataSource: datasource,
         change: function (e) {
             var cmb_value = this.value();
             if (cmb_value && this.selectedIndex == -1) {
                 this.value("");
             }
             //else{
             var cmb_var = $("#" + grid_id).data("kendoGrid");
             var selectedItem = cmb_var.dataItem(cmb_var.select());
             var combobox_data = $("#" + cmbid).data("kendoComboBox");
             if (combobox_data != undefined && combobox_data.selectedIndex == -1) {
                 selectedItem[datafield] = "";
                 selectedItem[code_datafield] = "";
             }
             else {
                 selectedItem[datafield] = combobox_data.dataItem(combobox_data.selectedIndex).desc;
                 selectedItem[code_datafield] = combobox_data.dataItem(combobox_data.selectedIndex).code;
             }


             //}
         }
     });

     $("#" + grid_id).parent().children().find(".k-input").attr("readonly", "readonly");
 }


// grid combo editor

 function combo_editor_man(container, cmbid, datasource, datafield, code_datafield, grid_id) {

     $('<input  id="' + cmbid + '" data-text-field="desc" data-value-field="desc" data-bind="value:' + datafield + '" name ="' + datafield + '"/>').appendTo(container).kendoComboBox({
         autoBind: false,
         filter: "contains",
         dataSource: datasource,
         placeholder: "select your option",
         change: function (e) {
             var cmb_value = this.value();
             if (cmb_value && this.selectedIndex == -1) {
                 this.value("");
             }
             //else{
             var cmb_var = $("#" + grid_id).data("kendoGrid");
             var selectedItem = cmb_var.dataItem(cmb_var.select());
             var combobox_data = $("#" + cmbid).data("kendoComboBox");
             if (combobox_data != undefined && combobox_data.selectedIndex == -1) {
                 selectedItem[datafield] = "";
                 selectedItem[code_datafield] = "";
             }
             else {
                 selectedItem[datafield] = combobox_data.dataItem(combobox_data.selectedIndex).desc;
                 selectedItem[code_datafield] = combobox_data.dataItem(combobox_data.selectedIndex).code;
                
                
             }


             //}
         }
     });

     $("<span class='k-invalid-msg' data-for='" + datafield + "'></span>").appendTo(container);
 }


function combo_editor_man_check(container, cmbid, datasource, datafield, name_desc, code_datafield, grid_id) {

    $('<input required  id="' + cmbid + '" data-text-field="desc" data-required-msg="' + name_desc + ' cannot be blank"  data-bind="value:' + datafield + '" name ="' + datafield + '"/>').appendTo(container).kendoComboBox({
        autoBind: false,
        filter: "contains",
        dataSource: datasource,
        placeholder: "select your option",
        change: function (e) {
            var cmb_value = this.value();
            if (cmb_value && this.selectedIndex == -1) {
                this.value("");
            }
            //else{
            var cmb_var = $("#" + grid_id).data("kendoGrid");
            var selectedItem = cmb_var.dataItem(cmb_var.select());
            var combobox_data = $("#" + cmbid).data("kendoComboBox");
            if (combobox_data != undefined && combobox_data.selectedIndex == -1) {
                selectedItem[datafield] = "";
                selectedItem[code_datafield] = "";
            }
            else {
                selectedItem[datafield] = combobox_data.dataItem(combobox_data.selectedIndex).desc;
                selectedItem[code_datafield] = combobox_data.dataItem(combobox_data.selectedIndex).code;


            }


            //}
        }
    });

    $("<span class='k-invalid-msg' data-for='" + datafield + "'></span>").appendTo(container);
}
 function combo_dependent_man(container, cmbid, datasource, datafield, code_datafield, grid_id) {
     var asp_arr = [];
     var cus_arr = [];
     var cusnon_arr = [];
     $.each(datasource, function (key, val) {
         if (datasource[key].dependent == "CLOSURE") {
             asp_arr.push(datasource[key]);
         }
         //if (datasource[key].dependent == "CUSTOMER_BILL") {
         //    cus_arr.push(datasource[key]);
         //}
         //if (datasource[key].dependent == "CUSTOMER_NBILL") {
         //    cusnon_arr.push(datasource[key]);
         //}
     });
     var grid = $("#grid_EnquiryStage_Updates").data("kendoGrid");
     var selectedItem = grid.dataItem(grid.select());
     var data = "";
     if (selectedItem.enquiry_stage_code.toUpperCase() == "CLOSURE") {
         data = asp_arr;
     }

     //if (selectedItem.enquiry_stage_code.toUpperCase() == "CUSTOMER_BILL") {
     //    data = cus_arr;
     //}
     //if (selectedItem.enquiry_stage_code.toUpperCase() == "CUSTOMER_NBILL") {
     //    data = cusnon_arr;
     //}


     $('<input  id="' + cmbid + '" data-text-field="desc" data-value-field="desc" data-bind="value:' + datafield + '" name ="' + datafield + '"/>').appendTo(container).kendoComboBox({
         autoBind: false,
         filter: "contains",
         dataSource: data,
         change: function (e) {

             //var model = e.model;

             //model.set("charge_head_desc", "");
             var cmb_value = this.value();
             if (cmb_value && this.selectedIndex == -1) {
                 this.value("");
             }
             //else{
             var cmb_var = $("#" + grid_id).data("kendoGrid");
             var selectedItem = cmb_var.dataItem(cmb_var.select());
             var combobox_data = $("#" + cmbid).data("kendoComboBox");
             if (combobox_data != undefined && combobox_data.selectedIndex == -1) {
                 selectedItem[datafield] = "";
                 selectedItem[code_datafield] = "";
             }
             else {
                 selectedItem[datafield] = combobox_data.dataItem(combobox_data.selectedIndex).desc;
                 selectedItem[code_datafield] = combobox_data.dataItem(combobox_data.selectedIndex).code;
             }


             //}
         }
     });

     $("<span class='k-invalid-msg' data-for='" + datafield + "'></span>").appendTo(container);

 }

 //get pagewise details

 var current_pageIndex = 0;
 function getPagination(status) {
     var all_data = getlocalStorage("ls_pageList");//JSON.parse(localStorage.getItem("ls_pageList"));
     var result = "";
     if (status == "next") {
         if (all_data.length - 1 == current_pageIndex) {
             result = all_data[current_pageIndex];
         } else {
             current_pageIndex++;
             result = all_data[current_pageIndex];
         }

     } else if (status == "last") {
         current_pageIndex = all_data.length - 1;
         result = all_data[current_pageIndex];
     }
     else if (status == "first") {
         current_pageIndex = 0;
         result = all_data[0];
     }
     else {
         if (current_pageIndex == 0) {
             result = all_data[current_pageIndex];
         } else {
             current_pageIndex--;
             result = all_data[current_pageIndex];
         }
     }
     return result;
 }

 function master_first() {
     var exists = (typeof next === 'function');
     if (exists == true) {
         openBusyCursorModal();
         $('.k-widget.k-tooltip.k-tooltip-validation.k-invalid-msg').css('display', 'none');
         next('first');
         setTimeout(function () {
             closeBusyCursorModal();
         }, 600);
     }
     else {
         kendoAlert("Missing Next function");
     }
 }

 function master_previous() {
     var exists = (typeof next === 'function');
     if (exists == true) {
         openBusyCursorModal();
         $('.k-widget.k-tooltip.k-tooltip-validation.k-invalid-msg').css('display', 'none');
         next('previous');
         setTimeout(function () {
             closeBusyCursorModal();
         }, 600);
     }
     else {
         kendoAlert("Missing Next function");
     }
 }

 function master_next() {
     var exists = (typeof next === 'function');
     if (exists == true) {
         openBusyCursorModal();
         $('.k-widget.k-tooltip.k-tooltip-validation.k-invalid-msg').css('display', 'none');
         next('next');
         setTimeout(function () {
             closeBusyCursorModal();
         }, 600);
     }
     else {
         kendoAlert("Missing Next function");
     }
 }

 function master_last() {
     var exists = (typeof next === 'function');
     if (exists == true) {
         openBusyCursorModal();
         $('.k-widget.k-tooltip.k-tooltip-validation.k-invalid-msg').css('display', 'none');
         next('last');
         setTimeout(function () {
             closeBusyCursorModal();
         }, 600);
     }
     else {
         kendoAlert("Missing Next function");
     }
 }



function context() {
    var context = {
        orgnId: 'scs',
        locnId: 'CHN', //String           
        userId: getlocalStorage('user_id'),
        localeId: '1' //String
    };
    return context;
}

function getFormated_filterDate(date) {   //get DD/MM/YYYY or MM/DD/YYYYY
    if (date != "" || date != undefined) {
        var d = date.split("/");
        return d[1] + "/" + d[0] + "/" + d[2];
    }

}


