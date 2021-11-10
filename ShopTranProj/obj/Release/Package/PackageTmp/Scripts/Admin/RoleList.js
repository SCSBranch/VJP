var menuId = "";
var permission = "";
var grid_height = "";
var default_screen_size = 631;
var default_grid_size = 361;
var screen_id = '';
var filter_condition = "";
$(document).ready(function () {
    //$(".Export").attr("hdrtitle", "Role List");
    //$(".Export").attr("TreeId", "Templates/Admin");
    //$(".Export").attr("SubTreeId", "ROLE_DFN");
    //$(".adv_filter").attr("hdrtitle", "Role List Record");
    //$(".adv_filter").attr("fltid", "RL_DFN");

    //$(".OrgView").attr("hdrtitle", "Role List");
    //$(".OrgView").attr("Org_screen_id", "RL_DFN");
    //$(".OrgView").attr("Org_grid_id", "grid_role_list");
    //$(".OrgView").attr("list_grid_id", "grid_role_list");

    screen_id = 'RL_DFN';
    permission = sec_Permission(screen_id);
    //$("#lblListTitle").text('Role List');
    //setlocalStorage("ls_pageList", "");
    //list_grid_id = 'grid_role_list';
    //Grid_Id = "grid_role_list";
    //cmb_check = "true";

    listpageloadfetch(filter_condition);
    //var full_height = $('.content-wrapper').css('min-height').replace('px', '');
    //var diff_size = parseInt(full_height) - default_screen_size;
    //var grid_height = default_grid_size + diff_size;
    //$('#grid_role_list .k-grid-content').height(grid_height);
    //screen_lang_data("ROLE_LIST", "en_us");
    //show_tooltip();
    //grid_tooltip("grid_role_list");
    //$('[data-toggle="tab"]').tooltip();
});

/*--------------------------------------------------------------------   Grid Role List  -----------------------------------------------------------------------------------------------*/
function listgrid(data){
    try {
        $("#grid_role_list").kendoGrid({
            dataSource: {
                data: data,
                pageSize: 20,
                schema: {
                    model: {
                        fields: {
                            role_id: {
                                type: "string"
                            },
                            role_description: {
                                type: "string"
                            },
                            screen_id: {
                                type: "string"
                            },
                            //screen_name: {
                            //    type: "string"
                            //},                          
                        }
                    }
                },
                change: function (e) {
                    setTimeout(function () {
                        var gd = $("#grid_role_list").data("kendoGrid");
                        filter_row(gd);
                        $('.k-i-close').css('display', 'none');
                        $('button.k-button-icon').css('display', 'none');
                        $('#grid_role_list .k-input').prop('disabled', false);
                        $('#grid_role_list .k-input').prop('readonly', true);

                    }, 1);
                },
            },
            dataBound: function (o) {
                reset_Selected_GridRows("grid_role_list", o);
            },
            toolbar: "<button type= 'button' id = 'Exportclick' class = 'k-grid-excel' style = 'display:none' href=''><span class='fa fa-file-excel-o' style='color: Black;'> &nbsp Export To Excel</span></button>",

            excel: {
                allPages: true
            },
            excelExport: function (e) {
                export_data(e);
            },

            filterable: {
                enabled: true,
                delay: 1500,
                mode: "menu, row",
                height: 200,
                click: function (e) {
                    var gd = $("#grid_role_list").data("kendoGrid");
                    filter_row(gd);
                }
            },
            filterMenuInit: function (e) {
                var gd = $("#grid_role_list").data("kendoGrid");
                filter_row(gd);
            },
            scrollable: true,
            // height: 523,
            sortable: {
                mode: "multiple",
                dir: "asc"
            },
            pageable: {
                refresh: false,
                pageSizes: true,
                buttonCount: 5
            },
            selectable: true,
            change: selectRow,
            columns: [{
                field: "role_id",
                title: "Role Id",
                width: "200px",
                filterable: {
                    cell: {
                        operator: "contains",
                        inputWidth: 1500
                    }
                },
            },
            {
                field: "role_description",
                title: "Role Name",
                width: "200px",
                filterable: {
                    cell: {
                        operator: "contains",
                        inputWidth: 1500
                    }
                },
            },
                //{
                //    field: "screen_name",
                //    title: "Screen Name",
                //    width: 100,
                //    hidden: true,
                //},
                //{
                //    field: "new_perm",
                //    title: "New Perm",
                //    width: "100px",
                //    hidden: true,
                //},
                //{
                //    field: "mod_perm",
                //    title: "Mod Perm",
                //    width: "100px",
                //    hidden: true,
                //},
                //{
                //    field: "del_perm",
                //    title: "Del Perm",
                //    width: "100px",
                //    hidden: true,
                //},
                //{
                //    field: "prn_perm",
                //    title: "Print Perm",
                //    width: "100px",
                //    hidden: true,
                //},
                //{
                //    field: "view_perm",
                //    title: "View Perm",
                //    width: "100px",
                //    hidden: true,
                //},
                //{
                //    field: "deny_perm",
                //    title: "Deny Perm",
                //    width: "100px",
                //    hidden: true,
                //},
            ]
        });

        $(".k-dropdown-operator").css('display', 'none');
        $("#grid_role_list .k-input").attr('disabled', 'false');
    } catch (err) {
        kendoAlert(err);
    }
}

function statusFilter(element) { // Dropdown list functionality
    element.kendoDropDownList({
        dataSource: status_Priority,
        optionLabel: "--Select Value--"
    });
}

function selectRow() {
    var grid = $("#grid_role_list").data("kendoGrid");
    var selectedItem = grid.dataItem(grid.select());
    //setlocalStorage("ls_pageList", selectedItem);

  var role_id = selectedItem.role_id;
         $("#txtRoleid").val(role_id);
    single_fetch(role_id);
    $("#txtRoleid").attr('readonly', 'readonly');
}

function getSerializedSelectedRows(mode) {
    try {
        if (getlocalStorage("ls_pageList") != undefined) {
            var items = getlocalStorage("ls_pageList");
            if (items.length == 0) {
                kendoAlert("Please select records");
            } else {
                if (mode == "edit") {
                    btn_onClick('Edit');
                    location.href = "../Admin/RoleForm";
                } else if (mode == "view") {
                    btn_onClick('View');
                    location.href = "../Admin/RoleForm";
                }
            }
        }
    } catch (err) {
        kendoAlert(err);
    }
}


$("#btn_Edit").bind("click", function (e) {
    getSerializedSelectedRows('edit');
});

$("#btn_View").bind("click", function (e) {
    getSerializedSelectedRows('view');
});

$("#btn_New").bind("click", function () {
    btn_onClick('Create');
    location.href = "../Admin/RoleForm";
});

/*-------------------------------------------------------------------- Listpageloadfetch - Grid Binding  -----------------------------------------------------------------------------------------------*/
function listpageloadfetch(filter_condition) {
    try {
        var filter = filter_condition;
        var sRequest = weburl + '/server/RoleScreenMap/fetch_allrolescreen.ashx?org=' + OrgId + '&locn=' + LocnId + '&user=' + User + '&lang=en_us' + '&FilterBy=' + filter;
        var s = executeService(sRequest);
        var responseJSON = JSON.parse(s);
        if (responseJSON.update == "successful") {
            generateGrid_Role(responseJSON);
        } else {
            listgrid([]);
        }
    } catch (err) {
        kendoAlert(err);
    }
}

function master_list_refresh() {
    try {
        listpageloadfetch("");
    } catch (err) {
        kendoAlert(err);
    }
}

function generateGrid_Role(res) {
    try {
        if (res.data.context.List != null) {
            var data = changedataType(res.data.context.List);
            listgrid(data);
        } else {
            listgrid([]);
        }
        //LoadView_screen();
        //var full_height = $('.content-wrapper').css('min-height').replace('px', '');
        //var diff_size = parseInt(full_height) - default_screen_size;
        //var grid_height = default_grid_size + diff_size;
        //$('#grid_role_list .k-grid-content').height(grid_height);

    } catch (err) {
        kendoAlert(err);
    }

}