
form_list_url = "/Admin/UserList";
var ScreenId = "";
var user_id = '';
var grid_height = '';
var default_screen_size = 631;
var default_grid_size = 171;
Screen_Id = "USER_DFN";
var def_lang = true;

/*--------------------------------------------------------------------   Page Load Function  -----------------------------------------------------------------------------------------------*/
$(document).ready(function () {
    Form_validate_Name = $('form.form-horizontal').attr('id');
    kendodate_format_validator('form_user');
    //$("#lblFormTitle").text('User Details');
    //$(".file_attach").attr("hdrtitle", "User Form");
    var sData = load_dropdown_list('USR_DFN', 'DEPARTMENT');
    filter_combobox("cmbUserOf", sData);
    mul_filter_combobox("cmbPermission", []);
   // show_tooltip();
    formvalidate_load();
    role_grid([]);
    //if (getlocalStorage('btn_clk_val') == "Create") {
    //    $("#file_attach").hide();
    //    single_fetch("");
    //    $('#txtStatus').val('New');
    //    $('#txtMode').val('I');
    //} else if (getlocalStorage('btn_clk_val') == "View" || getlocalStorage('btn_clk_val') == "Edit") {
    //    if (getlocalStorage("ls_pageList") != undefined) {
    //        var data = getlocalStorage("ls_pageList");
    //        $("#pageTotal").text(data.length);
    //        if (data.length != 0) {
    //            $("#page").text("1");
    //        } else {
    //            $("#page").text("0");
    //        }
    //        $("#txtUserId").attr('readonly', 'readonly');
    //        var data = getlocalStorage("ls_pageList");
    //        user_id = data[0].user_id;
    //        single_fetch(user_id);
    //        $("#txtUserId").val(user_id);
    //    }
    //}

    //var full_height = $('.content-wrapper').css('min-height').replace('px', '');
    //var diff_size = parseInt(full_height) - default_screen_size;
    //var grid_height = default_grid_size + diff_size;
    //$('#grid_role_detail .k-grid-content').height(grid_height); 
    var screen_id = 'USR_DFN';
    var permission = sec_Permission(screen_id);
    //var formval = form_Serialize(Form_validate_Name);
    //oldform_value.form = JSON.parse(formval);
    //oldform_value.grid = getGridDataSource(["grid_role_detail"]);

    $("#templateFile").change(function () {
        readURL(this);
    });
});

/*--------------------------------------------------------------------  Profile Image  - Upload  -------------------------------------------------------------------------------------------*/

function browseTemplateFile() {
    $("#templateFile").click();
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#Profile_img').attr('src', e.target.result);
            $("#txtImageHidden").val(e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function check(form_id) {
    var container = $("#" + form_id);
    kendo.init(container);
    container.kendoValidator({});
}

/*--------------------------------------------------------------------  Grid - User Role Details  -----------------------------------------------------------------------------------------------*/
function role_grid(data) {
    try {
        $("#grid_role_detail").kendoGrid({
            dataSource: {
                data: data,
                schema: {
                    model: {
                        fields: {
                            user_id: {
                                type: "string"
                            },
                            sel_flag: {
                                type: "string"
                            },
                            role_id: {
                                type: "string"
                            },
                            role_description: {
                                type: "string"
                            },
                            def_role_flag: {
                                type: "string"
                            },
                        }
                    }
                },
            },
            scrollable: true,
            sortable: {
                mode: "multiple",
                dir: "asc"
            },
            selectable: true,
            columns: [{
                field: "user_id",
                title: "User Id",
                width: 50,
                hidden: true,
            },
            {
                field: "sel_flag",
                title: "Select",
                template: '<input type="checkbox" #= sel_flag == "1" ? "checked=checked" : "" # class="chkbx10" ></input>',
                width: 30
            },
            {
                field: "role_id",
                title: "Role Id",
                width: 50,
                hidden: true,
            },
            {
                field: "role_description",
                title: "Role Name",
                width: 50,
            },
            {
                field: "def_role_flag",
                title: "Default",
                template: '<input type="checkbox" #= def_role_flag == "1" ? "checked=checked" : "" # class="chkbx9" ></input>',
                width: 30
            },
            {
                command: [{
                    name: "View",
                    text: "",
                    template: '<input type="button" class="iclass  k-button k-button-icontext"  click: historyDetails name="iclass" value="View"  style="height: 26px; margin: 0px 2px; min-width: 64px;" />',
                }],
                width: "100px",
            },
            ]
        });

        $('#grid_role_detail').data('kendoGrid').tbody.find('.iclass').click(function (e) {
            var dataitem = $('#grid_role_detail').data('kendoGrid').dataItem($(e.currentTarget).closest("tr"));
            save_wnd_permission.content($("#grid_role_detail_template").html()).center().open();
            $("#txt_role_id").val(dataitem.role_id);
            role_fetch(dataitem.role_id);
            $(".k-i-close").css("display", "block");
        });

        var gridDoc = $("#grid_role_detail").data("kendoGrid");
        gridDoc.table.on("change", ".checkbox", selectRow);

        function selectRow() {
            selected_Grid_Row("grid_role_detail", this);
        }

    } catch (err) {
        kendoAlert(err);
    }
}

$(function () {
    $('#grid_role_detail').on('click', '.chkbx10', function () {
        var checked = $(this).is(':checked');
        var grid = $('#grid_role_detail').data().kendoGrid;
        var dataItem = grid.dataItem($(this).closest('tr'));
        var row = $(this).closest('tr');
        if (checked == true) {
            dataItem._set('sel_flag', '1');
        } else {
            dataItem._set('sel_flag', '0');
        }
    });

    $('#grid_role_detail').on('click', '.chkbx9', function () {
        var checked = $(this).is(':checked');
        var grid = $('#grid_role_detail').data().kendoGrid;
        var dataItem = grid.dataItem($(this).closest('tr'));
        var row = $(this).closest('tr');
        if (checked == true) {
            dataItem._set('def_role_flag', '1');
        } else {
            dataItem._set('def_role_flag', '0');
        }
    });
});

/*--------------------------------------------------------------------   User Save & Delete Details  -----------------------------------------------------------------------------------------------*/
function form_save() {
    if ($('#txtStatus').val() != "New" && $('#txtStatus').val() != "") {
        $('#txtMode').val('U');
    } else if ($('#txtStatus').val() == "") {
        kendoalert('Status Field cannot be blank');
        return false;
    }
    SaveUser();
    return false;
}

var obj_grid_val = {};
var save_data = "";
function SaveUser() {
    var formval = form_Serialize("form_user");
    var obj_val = JSON.parse(formval);
    obj_val.role_id = "";
    obj_val.status_desc = $('#txtStatus').val();
    if (obj_val.hasOwnProperty('valid_until')) {
        if (obj_val.valid_until != '')
            obj_val.valid_until = getFormated_StringDate(obj_val.valid_until);
    }
    var grid_val = JSON.stringify($("#grid_role_detail").data("kendoGrid").dataSource.data());
    save_data = JSON.parse(grid_val);
    var sel_cond = select_flagExists("1");
    if (sel_cond == false) {
        kendoAlert("Atleast one Role to be select");
        return false;
    }
    var def_cond = default_flagExists("1");
    if (def_cond == false) {
        kendoAlert("Atleast one default role to be select");
        return false;
    }
    var data = {};
    data.context = context();
    data.context.Header = obj_val;
    data.context.Detail = save_data;
    var sRequest = weburl + '/server/UserRole/save_newuserrole.ashx';
    var sData = executeService(sRequest, data);
    var responseJSON = JSON.parse(sData);
    if (responseJSON.update == "successful") {
        if ($("#modevalue").text() == "New Mode") {
            kendoAlertList('User Details Saved Successfully');
        } else {
            kendoAlert('User Details Saved Successfully');
            //single_fetch($('#txtUserId').val());
            form_clear();
        }
        var formval = form_Serialize(Form_validate_Name);
        oldform_value.form = JSON.parse(formval);
        oldform_value.grid = getGridDataSource(["grid_role_detail"]);
    }
}

function default_flagExists(d_flag) {
    return save_data.some(function (el) {
        return el.def_role_flag === d_flag;
    });
}

function select_flagExists(s_flag) {
    return save_data.some(function (el) {
        return el.sel_flag === s_flag;
    });
}

function form_delete() {
    $('#txtMode').val('D');
    SaveUser();
}

/*---------------------------------------------------------------------  Form Clear  ----------------------------------------------------------------------------------*/
function form_clear() {
    $('.form-group .k-invalid-msg').remove();
    $("#txtStatus").val('New');
    $("#txtUserId").val('');
    $("#txtUserName").val('');
    $("#txtValidity").val('');
    $("#txtEmailId").val('');
    $("#txtPassword").val('');
    $("#txtMobile").val('');
    $('#cmbUserOf').data("kendoComboBox").value('');
    $("#txtUserId").removeAttr("readonly");
    role_grid([]);
    listpageloadfetch("");
    var full_height = $('.content-wrapper').css('min-height').replace('px', '');
    var grid_height = parseInt(full_height) - 223;
    $('#grid_userList .k-grid-content').height(grid_height);
}

/*---------------------------------------------------------------------  Single Fetch Method  ----------------------------------------------------------------------------------*/
function single_fetch(user_id) {
    var sRequest = weburl + '/server/UserRole/fetch_userrole.ashx?org=' + OrgId + '&locn=' + LocnId + '&user=' + User + '&lang=en_us&user_id=' + user_id + '';
    var s = executeService(sRequest);
    var responseJSON = JSON.parse(s);
    if (responseJSON.update == "successful") {
        $('#txtUserId').val(user_id);
        generateGrid_user_detail(responseJSON);
    } else {
        role_grid([]);
    }
   
}

function generateGrid_user_detail(res) {
    if (res.data.context.Header != undefined) {
        var res_data = res.data.context.Header;
        $('.form-group .k-invalid-msg').remove();

        $('#txtEmailId').val(res_data.email_id);
        $('#txtValidity').val(res_data.valid_until);
        $('#txtUserName').val(res_data.user_name);
        $('#txtPassword').val(res_data.user_password);
        $('#txtMobile').val(res_data.user_mobile);
        $('#txtStatus').val(res_data.status_desc);
        $('#cmbUserOf').data("kendoComboBox").value(res_data.user_of_code);
        var profiledata = res_data.profile_photo
        $("#txtImageHidden").val(profiledata);
        if (profiledata != "")
            document.getElementById("Profile_img").src = profiledata;
        else
            document.getElementById("Profile_img").src = "/images/noimage.png";
    }
    if (res.data.context.Detail == null) {
        role_grid([]);
    } else {
        var data = changedataType(res.data.context.Detail);
        role_grid(data);
    }
}

/*--------------------------------------------------------------------  Next Click Function  -------------------------------------------------------------------------------------------*/
//function next(status) {
//    try {
//        var data_next = getPagination(status);
//        user_id = data_next.user_id;
//        $('#page').text(current_pageIndex + 1);
//        $('.form-group .k-invalid-msg').remove();
//        single_fetch(user_id);
//    } catch (err) {
//        kendoAlert(err);
//    }
//}


function next(status, dirty) {
    try {
        if ($('#modevalue').text() != "View Mode") {
            var formval = form_Serialize(Form_validate_Name);
            var currentform_value = {};
            currentform_value.form = JSON.parse(formval);
            currentform_value.grid = getGridDataSource(["grid_role_detail"]);
            var dirty_cond = check_dirty(oldform_value, currentform_value);
            if (dirty_cond == true && dirty == undefined) {
                $("#dirtymodal_proceed").attr("onclick", "next('" + status + "','proceed')");
                $(".custom_proceed_href").remove();
                $("#dirtymodal_proceed").css("display", "block");
                $('#custom_dirty').modal("show");
            }
            else {
                var data_next = getPagination(status);               
                $('#page').text(current_pageIndex + 1);
                $('#custom_dirty').modal("hide");
                user_id = data_next.user_id;
                $('#page').text(current_pageIndex + 1);
                $('.form-group .k-invalid-msg').remove();
                single_fetch(user_id);
                var formval = form_Serialize(Form_validate_Name);
                oldform_value.form = JSON.parse(formval);
                oldform_value.grid = getGridDataSource(["grid_role_detail"]);
            }
        }
        else {
            var data_next = getPagination(status);
            user_id = data_next.user_id;
            $('#page').text(current_pageIndex + 1);
            $('.form-group .k-invalid-msg').remove();
            single_fetch(user_id);
            $('#custom_dirty').modal("hide");
            var formval = form_Serialize(Form_validate_Name);
            oldform_value.form = JSON.parse(formval);
            oldform_value.grid = getGridDataSource(["grid_role_detail"]);
        }
    }
    catch (err) {
        //alert(err);
        javascript_log4j_root(arguments.callee.name, err);
    }
}
/*--------------------------------------------------------------------  Role popup Functionality  -------------------------------------------------------------------------------------------*/
function grid_permission(role_data) {
    try {
        $("#grid_role_permission").kendoGrid({
            dataSource: {
                data: role_data,
                schema: {
                    model: {
                        fields: {
                            screen_id: {
                                editable: false
                            },
                            screen_name: {
                                editable: false
                            },
                            new_perm: {
                                editable: false
                            },
                            mod_perm: {
                                editable: false
                            },
                            del_perm: {
                                editable: false
                            },
                            prn_perm: {
                                editable: false
                            },
                            del_perm: {
                                editable: false
                            },
                            view_perm: {
                                editable: false
                            },
                            deny_perm: {
                                editable: false
                            },
                        }
                    }
                },
            },
            height: 330,
            columns: [{
                field: "screen_name",
                title: "Menu Name",
                width: 200,
                update: false,
                editable: false
            },
            {
                field: "new_perm",
                title: "New",
                template: '<input type="checkbox" #= new_perm == "1" ? "checked=checked" : "" # class="chkbx1" ></input>',
                update: true,
                width: 100
            },
            {
                field: "mod_perm",
                title: "Modify",
                template: '<input type="checkbox" #= mod_perm == "1" ? "checked=checked" : "" # class="chkbx2" ></input>',
                update: true,
                width: 100
            },
            {
                field: "del_perm",
                title: "Delete",
                template: '<input type="checkbox" #= del_perm == "1" ? "checked=checked" : "" # class="chkbx3" ></input>',
                update: true,
                width: 100
            },
            {
                field: "prn_perm",
                title: "Print",
                template: '<input type="checkbox" #= prn_perm == "1" ? "checked=checked" : "" # class="chkbx4" ></input>',
                update: true,
                width: 100
            },
            {
                field: "view_perm",
                title: "View Only",
                template: '<input type="checkbox" #= view_perm == "1" ? "checked=checked" : "" # class="chkbx5" ></input>',
                update: true,
                width: 100
            },
            {
                field: "deny_perm",
                title: "Deny",
                template: '<input type="checkbox" #= deny_perm == "1" ? "checked=checked" : "" # class="chkbx6" ></input>',
                update: true,
                width: 100
            }
            ],

            editable: true
        });
    } catch (err) {
        kendoAlert(err);
    }
}

function role_fetch(role_id) {
    if (role_id != "") {
        var sRequest = weburl + '/server/RoleScreenMap/fetch_rolescreen.ashx?org=' + OrgId + '&locn=' + LocnId + '&user=' + User + '&lang=en_us&role_id=' + role_id + '';
        var s = executeService(sRequest);
        var responseJSON = JSON.parse(s);
        if (responseJSON.update == "successful") {
            generateGrid_role_detail(responseJSON);
        } else {
            grid_permission([]);
        }

    }
}

function generateGrid_role_detail(res) {
    if (res.data.context.Header != undefined) {
        var res_data = res.data.context.Header;
        $('#txt_role_description').val(res_data.role_description);
        $('#txt_role_status').val(res_data.status_desc);

    }
    if (res.data.context.Detail == null) {
        grid_permission([]);
    } else {
        var data = changedataType(res.data.context.Detail);
        grid_permission(data);
    }
}

