var menuId = "";
var permission = "";
var grid_height = '';
var default_screen_size = 631;
var default_grid_size = 361;
var screen_id = '';
var filter_condition = "";
$(document).ready(function () {
    //$(".Export").attr("hdrtitle", "Master List");
    //$(".Export").attr("TreeId", "Templates/Admin");
    //$(".Export").attr("SubTreeId", "MAS_DFN");
    //$("#ad_filter").hide();
    //$(".adv_filter").attr("hdrtitle", "Master List Record");
    //$(".adv_filter").attr("fltid", "MAS_DFN");
    //$(".OrgView").attr("hdrtitle", "Master List Record");
    //$(".OrgView").attr("Org_screen_id", "MAS_DFN");
    //$(".OrgView").attr("Org_grid_id", "grid_masterList");
    //$(".OrgView").attr("list_grid_id", "grid_masterList");
    screen_id = "MAS_DFN";
    permission = sec_Permission(screen_id);
    $("#lblListTitle").text('Master List');
    //setlocalStorage("ls_pageList", "");
    //list_grid_id = 'grid_masterList';
    //Grid_Id = "grid_masterList";
    //cmb_check = "true";
    listpageloadfetch("");
    var full_height = $('.content-wrapper').css('min-height').replace('px', '');
    grid_height = parseInt(full_height) - 270;
    //filterhover();
    //$('#grid_masterList .k-grid-content').height(grid_height);
    //screen_lang_data("MAS_LIST", "en_us");
    //show_tooltip();
    //grid_tooltip("grid_masterList");
    //$('[data-toggle="tab"]').tooltip();
});


/*--------------------------------------------------------------------   Grid Master List  -----------------------------------------------------------------------------------------------*/
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
        });

        gridRowID = -1;
        data = addRandomNum(data);
        $("#grid_masterList").kendoGrid({
            dataSource: {
                data: data,
                pageSize: 20,
                schema: {
                    model: {
                        fields: {
                            master_code: {
                                type: "string"
                            },
                            master_description: {
                                type: "string"
                            },
                            status_desc: {
                                type: "string"
                            }
                        }
                    }
                },
                change: function (e) {
                    setTimeout(function () {
                        var gd = $("#grid_masterList").data("kendoGrid");
                        filter_row(gd);
                        $('.k-i-close').css('display', 'none');
                        $('button.k-button-icon').css('display', 'none');
                        $('#grid_masterList .k-input').prop('disabled', false);
                        $('#grid_masterList .k-input').prop('readonly', true);

                    }, 1);
                },
            },
            dataBound: function (o) {
                reset_Selected_GridRows("grid_masterList", o);
            },
            toolbar: "<button type='button' id='Exportclick' class='k-grid-excel' style='display:none' href=''><span class='fa fa-file-excel-o' style='color: Black;'> &nbsp Export To Excel</span></button>",
           // height:560,
            //excelExport: function (e) {
            //    var gd = $("#grid_masterList").data("kendoGrid");
            //    var len = gd.dataSource._data.length;
            //    var chkall = $('#chkall').is(':checked');
            //    var chkfilter = $('#chkfilter').is(':checked');
            //    var chktemp = $('#chktemp').is(':checked');
            //    var twokendobox = true;
            //    gd.dataSource.pageSize(len);
            //    if (e.sender.dataSource._data.length == len) {
            //        twokendobox = false;
            //        exportfunction(e, chkall, chkfilter, chktemp, twokendobox, gd);
            //    } else {
            //        exportfunction(e, chkall, chkfilter, chktemp, twokendobox, gd);
            //    }
            //    gd.dataSource.pageSize('10');
            //    return false;
            //},
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
                    var gd = $("#grid_masterList").data("kendoGrid");
                    filter_row(gd);
                }
            },
            filterMenuInit: function (e) {
                var gd = $("#grid_masterList").data("kendoGrid");
                filter_row(gd);
            },
            scrollable: true,
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
                field: "master_code",
                title: "Master Code",
                width: "50px",
                filterable: {
                    cell: {
                        operator: "contains",
                        inputWidth: 1500
                    }
                },
            },
            {
                field: "master_description",
                title: "Master Description",
                width: "50px",
                filterable: {
                    cell: {
                        operator: "contains",
                        inputWidth: 1500
                    }
                },
            },
            {
                field: "status_desc",
                title: "Status",
                width: "50px",
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
        $("#grid_masterList .k-input").attr('disabled', 'false');
    } catch (err) {
        kendoAlert(err);
    }
}

function statusFilter(element) { 
    element.kendoDropDownList({
        dataSource: status_Priority,
        optionLabel: "--Select Value--"
    });
}

function selectRow() {
    var grid = $("#grid_masterList").data("kendoGrid");
    var selectedItem = grid.dataItem(grid.select());
   var master_code = selectedItem.master_code;
    single_fetch(master_code);
    $("#txtMastercode").val(master_code);
  //  setlocalStorage("ls_pageList", selectedItem);
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
                    location.href = "../Admin/MasterForm";
                } else if (mode == "view") {
                    btn_onClick('View');
                    location.href = "../Admin/MasterForm";
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
    location.href = "../Admin/MasterForm";
});

/*-------------------------------------------------------------------- Listpageloadfetch - Grid Binding  -----------------------------------------------------------------------------------------------*/
function listpageloadfetch(filter) {
    try {
        var master_code = 'All';
        var sRequest = weburl + '/server/MasterCodes/fetch_allmasterlist.ashx?org=' + OrgId + '&locn=' + LocnId + '&user=' + User + '&lang=en_us&user_id=' + User + '&master_code=' + master_code + '';
        var s = executeService(sRequest);
        var responseJSON = JSON.parse(s);
        if (responseJSON.update == "successful") {
            generateGrid_Master(responseJSON);
        } else {
            listgrid([]);
        }
    } catch (err) {
        kendoAlert(err);
    }
}

function listRefresh() {
    try {
        listpageloadfetch("");
    } catch (err) {
        kendoAlert(err);
    }
}

function generateGrid_Master(res) {
    try {
        if (res.data.context.Detail != null) {
            var data = changedataType(res.data.context.Detail);
            listgrid(data);
        } else {
            listgrid([]);
        }
       // LoadView_screen();
       // var full_height = $('.content-wrapper').css('min-height').replace('px', '');
      //  grid_height = parseInt(full_height) - 270;
      // $('#grid_masterList .k-grid-content').height(grid_height);
    } catch (err) {
        kendoAlert(err);
    }

}