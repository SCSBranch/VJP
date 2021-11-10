
form_list_url = "/Admin/RoleList";
var ScreenId = "";
var role_id = "";
Screen_Id = "RL_DFN";
var grid_height = '';
var default_screen_size = 631;
var default_grid_size = 328;
/*--------------------------------------------------------------------   Page Load Function  -----------------------------------------------------------------------------------------------*/
$(document).ready(function () {
    Form_validate_Name = $('form.form-horizontal').attr('id');
    kendodate_format_validator('form_roles');
    //$("#lblFormTitle").text('Role Form');
    grid_permission([]);

    //$(".file_attach").attr("hdrtitle", "Role Form");
    //if (getlocalStorage('btn_clk_val') == "Create") {
    //    $('#txtStatus').val('New');
    //    $('#txtMode').val('I');
    //    $("#file_attach").hide();
    //    single_fetch('0');
    //} else if (getlocalStorage('btn_clk_val') == "View" || getlocalStorage('btn_clk_val') == "Edit") {
    //    if (getlocalStorage("ls_pageList") != undefined) {
    //        $('.edtviw_item').hide();
    //        $("#txtRoleid").attr('readonly', 'readonly');
    //        $("#txt_Mode").val("U");
    //        var data = getlocalStorage("ls_pageList");
    //        role_id = data.role_id;
    //        $("#txtRoleid").val(role_id);
    //        single_fetch(role_id);
    //    }
    //}
    //var full_height = $('.content-wrapper').css('min-height').replace('px', '');
    //var diff_size = parseInt(full_height) - default_screen_size;
    //var grid_height = default_grid_size + diff_size;
    //$('#grid_role_detail .k-grid-content').height(grid_height);
    //screen_lang_data("ROLE_FORM", "en_us");
    //show_tooltip();
    //grid_tooltip("grid_role_detail");
    //$('[data-toggle="tab"]').tooltip();
    var screen_id = 'RL_DFN';
    var permission = sec_Permission(screen_id);
    //var formval = form_Serialize(Form_validate_Name);
    //oldform_value.form = JSON.parse(formval);
    //oldform_value.grid = getGridDataSource(["grid_role_detail"]);

});

function listfetch() {
    var role_data = [];
    grid_permission(role_data);
}

/*--------------------------------------------------------------------   Grid Role Details  -----------------------------------------------------------------------------------------------*/
function grid_permission(role_data) {
    try {
        $("#grid_role_detail").kendoGrid({
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
            sortable: true,
            columns: [
                {
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

$(function () {
    $('#grid_role_detail').on('click', '.chkbx1', function () {
        var checked = $(this).is(':checked');
        var grid = $('#grid_role_detail').data().kendoGrid;
        var dataItem = grid.dataItem($(this).closest('tr'));
        var row = $(this).closest('tr');
        if (checked == true) {
            dataItem._set('new_perm', '1');
            if (dataItem.view_perm == '1') {
                dataItem._set('view_perm', '0');
                row.find("td:eq(5) input").prop("checked", false);
            }
            if (dataItem.deny_perm == '1') {
                dataItem._set('deny_perm', '0');
                row.find("td:eq(6) input").prop("checked", false);
            }
        } else {
            dataItem._set('new_perm', '0');
        }
    })
    $('#grid_role_detail').on('click', '.chkbx2', function () {
        var checked = $(this).is(':checked');
        var grid = $('#grid_role_detail').data().kendoGrid;
        var dataItem = grid.dataItem($(this).closest('tr'));
        var row = $(this).closest('tr');
        if (checked == true) {
            dataItem._set('mod_perm', '1');
            if (dataItem.new_perm == '0') {
                dataItem._set('new_perm', '1');
                row.find("td:eq(1) input").prop("checked", true);
            }
            if (dataItem.view_perm == '1') {
                dataItem._set('view_perm', '0');
                row.find("td:eq(5) input").prop("checked", false);
            }
            if (dataItem.deny_perm == '1') {
                dataItem._set('deny_perm', '0');
                row.find("td:eq(6) input").prop("checked", false);
            }
        } else {
            dataItem._set('mod_perm', '0');
        }
    })
    $('#grid_role_detail').on('click', '.chkbx3', function () {
        var checked = $(this).is(':checked');
        var grid = $('#grid_role_detail').data().kendoGrid;
        var dataItem = grid.dataItem($(this).closest('tr'));
        var row = $(this).closest('tr');
        if (checked == true) {
            dataItem._set('del_perm', '1');
            if (dataItem.new_perm == '0') {
                dataItem._set('new_perm', '1');
                row.find("td:eq(1) input").prop("checked", true);
            }
            if (dataItem.mod_perm == '0') {
                dataItem._set('mod_perm', '1');
                row.find("td:eq(2) input").prop("checked", true);
            }
            if (dataItem.view_perm == '1') {
                dataItem._set('view_perm', '0');
                row.find("td:eq(5) input").prop("checked", false);
            }
            if (dataItem.deny_perm == '1') {
                dataItem._set('deny_perm', '0');
                row.find("td:eq(6) input").prop("checked", false);
            }
        } else {
            dataItem._set('del_perm', '0');
        }
    })
    $('#grid_role_detail').on('click', '.chkbx4', function () {
        var checked = $(this).is(':checked');
        var grid = $('#grid_role_detail').data().kendoGrid;
        var dataItem = grid.dataItem($(this).closest('tr'));
        if (checked == true) {
            dataItem._set('prn_perm', '1');
        } else {
            dataItem._set('prn_perm', '0');
        }
    })
    $('#grid_role_detail').on('click', '.chkbx5', function () {
        var checked = $(this).is(':checked');
        var grid = $('#grid_role_detail').data().kendoGrid;
        var dataItem = grid.dataItem($(this).closest('tr'));
        var row = $(this).closest('tr');
        if (checked == true) {
            dataItem._set('view_perm', '1');
            if (dataItem.new_perm == '1') {
                dataItem._set('new_perm', '0');
                row.find("td:eq(1) input").prop("checked", false);
            }
            if (dataItem.mod_perm == '1') {
                dataItem._set('mod_perm', '0');
                row.find("td:eq(2) input").prop("checked", false);
            }
            if (dataItem.del_perm == '1') {
                dataItem._set('del_perm', '0');
                row.find("td:eq(3) input").prop("checked", false);
            }
            if (dataItem.prn_perm == '1') {
                dataItem._set('prn_perm', '0');
                row.find("td:eq(4) input").prop("checked", false);
            }
            if (dataItem.deny_perm == '1') {
                dataItem._set('deny_perm', '0');
                row.find("td:eq(6) input").prop("checked", false);
            }
        } else {
            dataItem._set('view_perm', '0');
        }
    })
    $('#grid_role_detail').on('click', '.chkbx6', function () {
        var checked = $(this).is(':checked');
        var grid = $('#grid_role_detail').data().kendoGrid;
        var dataItem = grid.dataItem($(this).closest('tr'));
        var row = $(this).closest('tr');
        if (checked == true) {
            dataItem._set('deny_perm', '1');
            if (dataItem.new_perm == '1') {
                dataItem._set('new_perm', '0');
                row.find("td:eq(1) input").prop("checked", false);
            }
            if (dataItem.mod_perm == '1') {
                dataItem._set('mod_perm', '0');
                row.find("td:eq(2) input").prop("checked", false);
            }
            if (dataItem.del_perm == '1') {
                dataItem._set('del_perm', '0');
                row.find("td:eq(3) input").prop("checked", false);
            }
            if (dataItem.prn_perm == '1') {
                dataItem._set('prn_perm', '0');
                row.find("td:eq(4) input").prop("checked", false);
            }
            if (dataItem.view_perm == '1') {
                dataItem._set('view_perm', '0');
                row.find("td:eq(5) input").prop("checked", false);
            }
        } else {
            dataItem._set('deny_perm', '0');
        }
    })
})

/*--------------------------------------------------------------------   Role Save  & Delete Details  -----------------------------------------------------------------------------------------------*/
function form_save() {
    if ($('#txtStatus').val() != "New" && $('#txtStatus').val() != "") {
        $('#txtMode').val('U');
    } else if ($('#txtStatus').val() == "") {
        //kendoAlert('Status Field cannot be blank');
        kendoAlert("Please click the create button to enter the data.");
        return false;
    }
    SaveRole();
    return false;
}

function SaveRole1() {
    var formval = form_Serialize("form_roles");
    var obj_val = JSON.parse(formval);
    var grid_val = JSON.stringify($("#grid_role_detail").data("kendoGrid").dataSource.data());
    var obj_grid_val = JSON.parse(grid_val);
    var data = {};
    data.context = context();
    data.context.Header = obj_val;
    data.context.Detail = obj_grid_val;
    var sRequest = weburl + '/server/RoleScreenMap/save_newrolescreenmap.ashx';
    var sData = executeService(sRequest, data);
    var responseJSON = JSON.parse(sData);
    if (responseJSON.update == "successful") {
        if ($("#modevalue").text() == "New Mode") {
            kendoAlertList('Role Details Saved Successfully');
            listpageloadfetch("");
        } else {
            kendoAlert('Role Details Saved Successfully');
            // single_fetch($('#txtRoleid').val());
            form_clear();
            listpageloadfetch("");
        }
        var formval = form_Serialize(Form_validate_Name);
        oldform_value.form = JSON.parse(formval);
        oldform_value.grid = getGridDataSource(["grid_role_detail"]);
    }
}

function form_delete() {
    $('#txtMode').val('D');
    SaveRole();
}

/*---------------------------------------------------------------------  Single Fetch Method  ----------------------------------------------------------------------------------*/
function single_fetch(role_id) {
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
        $('.form-group .k-invalid-msg').remove();
        $('#txtRoleDesc').val(res_data.role_description);
        $('#txtStatus').val(res_data.status_code);
        $('#txtStatus_code').val(res_data.status_code);
    }
    if (res.data.context.Detail == null) {
        grid_permission([]);
    } else {
        var data = changedataType(res.data.context.Detail);
        grid_permission(data);
    }
}

/*---------------------------------------------------------------------  Form Clear  ----------------------------------------------------------------------------------*/
function form_clear() {
    $('.form-group .k-invalid-msg').remove();
    //$("#txtStatus").val('New');
    $("#txtRoleid").val('');
    $("#txtRoleid").removeAttr("readonly");
    $("#txtRoleDesc").val('');
    grid_permission([]);
    listpageloadfetch("");
    $("#btnSave").prop("disabled", true);
    $("#btnDelete").prop("disabled", true);
}