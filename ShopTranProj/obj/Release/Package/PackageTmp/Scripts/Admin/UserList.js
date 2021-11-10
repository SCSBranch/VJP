var menuId = "";
var permission = "";
var grid_height = '';
var default_screen_size = 631;
var default_grid_size = 361;
var screen_id = '';
var filter_condition = "";
$(document).ready(function () {
    //$(".Export").attr("hdrtitle", "User");
    //$(".Export").attr("TreeId", "Templates/Admin");
    //$(".Export").attr("SubTreeId", "USER");
    //$(".adv_filter").attr("hdrtitle", "User List Record");
    //$(".adv_filter").attr("fltid", "USR_DFN");

    //$(".OrgView").attr("hdrtitle", "User Definition");
    //$(".OrgView").attr("Org_screen_id", "USR_DFN");
    //$(".OrgView").attr("Org_grid_id", "grid_userList");
    //$(".OrgView").attr("list_grid_id", "grid_userList");

    //$("#lblListTitle").text('User List');

    screen_id = "USR_DFN";
    permission = sec_Permission(screen_id);
    //setlocalStorage("ls_pageList", "");
    //list_grid_id = 'grid_userList';
    //Grid_Id = "grid_userList"; 
    //cmb_check = "true";

    listpageloadfetch(filter_condition);
   
    //screen_lang_data("MAS_LIST", "en_us");
    //show_tooltip();
    //grid_tooltip("grid_userList");
    //$('[data-toggle="tab"]').tooltip();
    //var full_height = $('.content-wrapper').css('min-height').replace('px', '');
    //var diff_size = parseInt(full_height) - default_screen_size;
    //var grid_height = default_grid_size + diff_size;

    //filterhover();
    //$('#grid_userList .k-grid-content').height(grid_height);

});
click_act_name = "UserForm";
click_ctrl_name = "Admin";
form_list_url = '/' + click_ctrl_name + '/' + click_act_name;


/*--------------------------------------------------------------------   Grid User List  -----------------------------------------------------------------------------------------------*/
var gridRowID = -1;

function sel_user_checkbox() {
    gridRowID++;
    return '<input id="chk_sel_' + gridRowID + '" class="checkbox" type="checkbox" />';
}

var status_Priority = [];

function listgrid(data) {
    try {
        $.each(data, function (index, value) {
            var flag = false;
            $.each(status_Priority, function (sindex, svalue) {
                if (svalue == value.status_desc) {
                    flag = true;
                }
            });
            if (flag == false) {
                status_Priority.push(value.status_desc);
            }
            var valid_until = value.valid_until;
            valid_until = getFormated_filterDate(valid_until);
            data[index].valid_until = valid_until;
        });

        gridRowID = -1;
        data = addRandomNum(data);
        $("#grid_userList").kendoGrid({
            dataSource: {
                data: data,
                pageSize: 20,
                schema: {
                    model: {
                        fields: {
                            user_id: {
                                type: "string"
                            },
                            user_name: {
                                type: "string"
                            },
                            user_of_desc: {
                                type: "string"
                            },                            
                            mobile_no: {
                                type: "string"
                            },
                            email_id: {
                                type: "string"
                            },
                            status_desc: {
                                type: "string"
                            },
                            valid_until: {
                                type: "date"
                            },
                        }
                    }
                },
                change: function (e) {
                    setTimeout(function () {
                        var gd = $("#grid_userList").data("kendoGrid");
                        filter_row(gd);
                        $('.k-i-close').css('display', 'none');
                        $('button.k-button-icon').css('display', 'none');
                        $('#grid_userList .k-input').prop('disabled', false);
                        $('#grid_userList .k-input').prop('readonly', true);

                    }, 1);
                },
            },
            dataBound: function (o) {
                reset_Selected_GridRows("grid_userList", o);                
            },
            toolbar: "<button type='button' id='Exportclick' class='k-grid-excel' style='display:none' href=''><span class='fa fa-file-excel-o' style='color: Black;'> &nbsp Export To Excel</span></button>",

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
                    var gd = $("#grid_userList").data("kendoGrid");
                    filter_row(gd);
                }
            },
            selectable: true,
            change: selectRow,
            filterMenuInit: function (e) {
                var gd = $("#grid_userList").data("kendoGrid");
                filter_row(gd);
            },
            scrollable: true,
            // height: grid_height,
            sortable: {
                mode: "multiple",
                dir: "asc"
            },
            pageable: {
                refresh: false,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [
            //    {
            //    title: "Sel",

            //    width: "30px",
            //    field: "select",
            //    template: '#=sel_user_checkbox()#'

            //},
            {
                field: "user_id",
                title: "User Id",
                width: "150px",
                filterable: {
                    cell: {
                        operator: "contains",
                        inputWidth: 1500
                    }
                    },
                locked:true,
            },
            {
                field: "user_name",
                title: "User Name",
                width: "150px",
                filterable: {
                    cell: {
                        operator: "contains",
                        inputWidth: 1500
                    }
                },
                
            },
            {
                field: "user_of_desc",
                title: "Department",
                width: "150px",
                filterable: {
                    cell: {
                        operator: "contains",
                        inputWidth: 1500
                    }
                },
            },
            {
                field: "user_mobile",
                title: "Mobile No",
                width: "150px",
                filterable: {
                    cell: {
                        operator: "contains",
                        inputWidth: 1500
                    }
                },
            },
            {
                field: "email_id",
                title: "Email Id",
                width: "150px",
                filterable: {
                    cell: {
                        operator: "contains",
                        inputWidth: 1500
                    }
                },
            },
            {
                field: "valid_until",
                title: "Valid Until",
                format: "{0: dd/MM/yyyy}",
                width: "150px",
                filterable: {
                    cell: {
                        operator: "contains",
                        inputWidth: 1500
                    },
                    ui: function (element) {
                        element.kendoDatePicker({
                            format: "dd/MM/yyyy"
                        });
                    }
                },
            },            
            {
                field: "status_desc",
                title: "Status",
                width: "150px",
                filterable: {
                    ui: statusFilter,
                    cell: {
                        operator: "contains",
                        inputWidth: 1500
                    }
                },
            },
            ]
        });

        $(".k-dropdown-operator").css('display', 'none');
        $("#grid_userList .k-input").attr('disabled', 'false');
        //var gridDoc = $("#grid_userList").data("kendoGrid");
        //gridDoc.table.on("change", ".checkbox", selectRow);
       
    } catch (err) {
        kendoAlert(err);
    }
}




function selectRow() {
    var grid = $("#grid_userList").data("kendoGrid");
    var selectedItem = grid.dataItem(grid.select());
    var user_id = selectedItem.user_id;
    single_fetch(user_id);
    $("#txtUserId").val(user_id);
    $("#txtUserId").attr("readonly", "readonly");
    
}

function statusFilter(element) { // Dropdown list functionality
    element.kendoDropDownList({
        dataSource: status_Priority,
        optionLabel: "--Select Value--"
    });
}


function getSerializedSelectedRows(mode) {
    try {
        var grid = $("#grid_userList").data("kendoGrid");
        var items = [];
        $.each(grid.dataSource._data, function (key, value) {
            $.each(grid_selected_rows, function (skey, svalue) {
                if ((grid_selected_rows[skey] == true) && (skey == value.randNum)) {
                    items.push(grid.dataSource._data[key]);
                }
            });
        });
        setlocalStorage("ls_pageList", items);
        if (items.length == 0) {
            kendoAlert("Please select records");
        } else {
            if (mode == "edit") {
                btn_onClick('Edit');
                location.href = "../Admin/UserForm";
            } else if (mode == "view") {
                btn_onClick('View');
                location.href = "../Admin/UserForm";
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
    location.href = "../Admin/UserForm";
});

/*-------------------------------------------------------------------- Listpageloadfetch - Grid Binding  -----------------------------------------------------------------------------------------------*/

function listpageloadfetch(filter_condition) {
    try {
        var filter = filter_condition;
        var sRequest = weburl + '/server/UserRole/fetch_alluserrolelist.ashx?org=' + OrgId + '&locn=' + LocnId + '&user=' + User + '&lang=en_us&user_id=' + User + '&FilterBy=' + filter;
        var s = executeService(sRequest);
        var responseJSON = JSON.parse(s);
        if (responseJSON.update == "successful") {
            generateGrid_User(responseJSON);
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

function generateGrid_User(res) {
    try {
        if (res.data.context.List != null) {
            var data = changedataType(res.data.context.List);
            $("#user_grid").empty();
            $("#user_grid").append("<div id='grid_userList'></div>");
            listgrid(data);
        } else {
            listgrid([]);
        }
        //LoadView_screen(); 
        //var gridDoc = $("#grid_userList").data("kendoGrid");
        //gridDoc.table.on("change", ".checkbox", selectRow);
        //var full_height = $('.content-wrapper').css('min-height').replace('px', '');
        //var diff_size = parseInt(full_height) - default_screen_size;
        //var grid_height = default_grid_size + diff_size;
        //$('#grid_userList .k-grid-content').height(grid_height);
    } catch (err) {
        kendoAlert(err);
    }

}