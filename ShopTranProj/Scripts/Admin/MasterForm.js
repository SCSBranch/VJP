
form_list_url = "/Admin/MasterList";
var ScreenId = "";
var master_code = '';
var grid_height = '';
var default_screen_size = 631;
var default_grid_size = 328;
var master_description = '';

/*--------------------------------------------------------------------   Page Load Function  -----------------------------------------------------------------------------------------------*/

$(document).ready(function () {
    Form_validate_Name = $('form.form-horizontal').attr('id');
    kendodate_format_validator('form_master');    
    $("#txt_attr_basetable_name_desc").val('');
    $("#btnDelete").hide();
    $("#btnCreate").hide();
    
    grid_master_detail([]);
    //if (getlocalStorage('btn_clk_val') == "Create") {
    //    $('#txtStatus').val('New');
    //    $('#txtMode').val('I');
    //    master_code = 'SYS';
    //    master_description = 'System Defined';
    //    $("#txtMastercode").val('SYS');
    //    $("#txtMasterDesc").val('System Defined');
    //    grid_master_detail([]);
    //} else if (getlocalStorage('btn_clk_val') == "View" || getlocalStorage('btn_clk_val') == "Edit") {
    //    if (getlocalStorage("ls_pageList") != undefined) {
    //        $('.edtviw_item').hide();
    //        var data = getlocalStorage("ls_pageList");
    //        master_code = data.master_code;
    //        single_fetch(master_code);
    //    }
    //}

    //var full_height = $('.content-wrapper').css('min-height').replace('px', '');
    //var diff_size = parseInt(full_height) - default_screen_size;
    //var grid_height = default_grid_size + diff_size;
    //$('#grid_master_detail .k-grid-content').height(grid_height);
    //var formval = form_Serialize(Form_validate_Name);
    //oldform_value.form = JSON.parse(formval);
    //oldform_value.grid = getGridDataSource(["grid_master_detail"]);

    //screen_lang_data("MAS_FORM", "en_us");
    //show_tooltip();
    //grid_tooltip("grid_master_detail");

    //$('[data-toggle="tab"]').tooltip();
    //$("#HelpModal").on('hidden.bs.modal', function () { });
    var screen_id = 'MAS_DFN';
    var permission = sec_Permission(screen_id);
});

/*--------------------------------------------------------------------   Grid Master Details  -----------------------------------------------------------------------------------------------*/
function grid_master_detail(user_data) {
    $("#grid_master_detail").kendoGrid({
        dataSource: {
            data: user_data,
            schema: {
                model: {
                    fields: {
                        code: {
                            type: "string",
                            editable: true,
                            validation: {
                                required: {
                                    message: "Code cannot be blank"
                                }
                            }
                        },
                        description: {
                            type: "string",
                            editable: true,
                            validation: {
                                required: {
                                    message: "Description cannot be blank"
                                }
                            }
                        },
                        status_code: {
                            type: "string",
                            editable: false,
                            defaultValue: "Active"
                        },
                        code_type_code: {
                            type: "string",
                            editable: false,
                            defaultValue: "USER"
                        },
                        dependent_code: {
                            editable: true
                        },
                        dependent_desc: {
                            editable: false
                        },
                        mode_flag: {
                            type: "string"
                        }
                    }
                }
            },
        },
        navigatable: true,
        sortable: {
            mode: "multiple",
            dir: "asc"
        },
      //  height:520,
        selectable: true,
        selectable: "singl", //  Grid Row Selection
        dataBinding: setDefaultValues,
        dataBound: function (e) {
            resultData = e.sender._data;
            var rows = $('#grid_master_detail').data('kendoGrid').tbody.children();
            setColor(rows, resultData);
        },
        edit: OnEdit,
        toolbar: "<a class=' k-grid-add'  id = 'btnSave' href=''><span class='fa fa-plus' style='color:Black'></span></a>",
        columns: [{
            command: [{
                name: "Delete",
                id: "Delete",
                imageClass: "fa fa-close",
                click: function (e) {
                    var grid = $("#grid_master_detail").data("kendoGrid");
                    var dataItem = $("#grid_master_detail").data("kendoGrid").dataItem($(e.target).closest("tr"));
                    DeleteWindowEvent(e, dataItem, grid);
                    e.stopImmediatePropagation()
                }
            },],
            title: "&nbsp;",
            width: "40px",
        },
        {
            field: "code",
            title: "Code",
            width: 70,

        }, {
            field: "description",
            title: "Description",
            width: 150
        },
        {
            field: "code_type_code",
            title: "Code Type",
            width: 100,
            hidden: true,
        },
        {
            field: "dependent_code",
            title: "Dependent Code",
            width: 150,
            editor: '<div class="input-group input-group-sm"><input type="text" readonly name="dependent_code" maxlength="50" style="width: 190px;color:black"  onkeypress="return speical_char(event)" data-bind="value:dependent_code"/><span class="input-group-btn" style="padding-right: 150px;"><a class="HelpWindow fa fa-search fa-lg" data-toggle="modal" href="/HelpFilter/HelpFilter" hdrtitle="Dependent Code Details" searchid="P01" data-target="#HelpModal" onclick=transfer(this,"grid","grid_master_detail","grid_master_detail") title="Search" style="font-size: 15px; padding-left: 10px;"></a> </span> </div>',
            hidden: true,
        },
        {
            field: "dependent_desc",
            title: "Dependent Desc",
            width: 100,
            editable: false,
            hidden: true,
        },
        {
            field: "status_code",
            title: "Status",
            width: 150
        },
        {
            field: "mode_flag",
            title: "Mode",
            width: 3,
            hidden: true,
        }
        ],
        editable: true,
    });
}

function OnEdit(e) {
    setDefaultValues(e);
    e.container.find("input[name='code']").attr('maxlength', '20');
    e.container.find("input[name='description']").attr('maxlength', '512');
    e.container.find("input[name='dependent_code']").attr('maxlength', '20');
    var columnIndex = this.cellIndex(e.container);
    var fieldName = this.thead.find("th").eq(columnIndex).data("field");
    if (!isEditable(fieldName, e.model)) {
        this.closeCell();
    }
}

function isEditable(fieldName, model) {
    if (fieldName === "code") {
        return ((model.hasOwnProperty("code") && model.mode_flag !== "U"));
    } else if (fieldName === "description") {
        return ((model.status_desc !== "Inactive"));
    } else if (fieldName === "dependent_code") {
        return ((model.status_desc !== "Inactive"));
    }
    return true; // default to editable
}

function OnAdd() {
    var grid_mas = $('#grid_master_detail').data("kendoGrid");
    var rows = grid_mas.tbody.children();
    for (var i = 0; i < rows.length; i++) {
        var row = $(rows[i]);
        if (grid_mas._data[i].code == "") {
            grid_mas.editCell(row.find('td:eq("1")'))
        } else if (grid_mas._data[i].code != "" && grid_mas._data[i].description == "") {
            grid_mas.editCell(row.find('td:eq("2")'))
        }
    }
}

/*--------------------------------------------------------------------   Master Save Details  -----------------------------------------------------------------------------------------------*/
function form_save() {
    SaveMaster();
}

function SaveMaster() {
    var formval = form_Serialize("form_master");
    var obj_val = JSON.parse(formval);
    var grid_val = JSON.stringify($("#grid_master_detail").data("kendoGrid").dataSource.data());
    var obj_grid_val = JSON.parse(grid_val);
    if (obj_grid_val.length == 0) {
        kendoAlert("Atleast one record needs to be entered");
        return false;
    }
    var data = {};
    data.context = context();
    data.context.Header = obj_val;
    data.context.Detail = obj_grid_val;
    var sRequest = weburl + '/server/MasterCodes/save_newmaster.ashx';
    var sData = executeService(sRequest, data);
    var responseJSON = JSON.parse(sData);
    if (responseJSON.update == "successful") {
        if ($("#modevalue").text() == "New Mode") {
            kendoAlertList('Master Code Details Saved Successfully');
        } else {
            kendoAlert('Master Code Details Saved Successfully');
            //single_fetch($('#txtMastercode').val());
            form_clear();
        }
        var formval = form_Serialize(Form_validate_Name);
        oldform_value.form = JSON.parse(formval);
        oldform_value.grid = getGridDataSource(["grid_master_detail"]);
    }
}

/*---------------------------------------------------------------------  Form Clear  ----------------------------------------------------------------------------------*/

function form_clear() {
    $("#txtStatus").val('New');
    grid_master_detail([]);
    $("#txtMastercode").val('');
    $("#txtMasterDesc").val('');
    listpageloadfetch("");
}

/*---------------------------------------------------------------------  Single Fetch Method  ----------------------------------------------------------------------------------*/
function single_fetch(master_code) {
    if (master_code != "") {
        var sRequest = weburl + '/server/MasterCodes/fetch_mastercode.ashx?org=' + OrgId + '&locn=' + LocnId + '&user=' + User + '&lang=en_us&user_id=' + User + '&master_code=' + master_code + '';
        var s = executeService(sRequest);
        var responseJSON = JSON.parse(s);
        if (responseJSON.update == "successful") {
            generateGrid_master_detail(responseJSON);
        } else {
            grid_master_detail([]);
        }

    }
}

function generateGrid_master_detail(res) {
    if (res.data.context.Header != undefined) {
        var res_data = res.data.context.Header;
       // $('#txtMastercode').val(master_code);
        if (res_data.master_description != '') {
            $('#txtMasterDesc').val(res_data.master_description);
        } else {
            $('#txtMasterDesc').val(master_description);
        }
    }
    if (res.data.context.Detail == null) {
        grid_master_detail([]);
    } else {
        var data = changedataType(res.data.context.Detail);
        grid_master_detail(data);
    }
}

/*---------------------------------------------------------------------  Help Transfer Method  ----------------------------------------------------------------------------------*/
function trans_input_data(searchid) {
    var trans_coll;
    if (searchid == 'P01') {
        trans_coll = [{
            "trasfer": "Yes",
            "dataCol": "",
            "controlId": "code",
            "grid_id": "grid_master_detail",
            "grid_row_col": "dependent_code"
        },
        {
            "trasfer": "Yes",
            "dataCol": "",
            "controlId": "description",
            "grid_id": "grid_master_detail",
            "grid_row_col": "dependent_desc"
        },
        ];
    }
    return trans_coll;
}

function grid_control(searchid) {
    var control_Name = "";
    if (searchid == 'P01') { // attribute table
        control_Name = [{
            "dataCol": "",
            "grid_row_col": "code"
        },
        {
            "dataCol": "",
            "grid_row_col": "description"
        },
        {
            "dataCol": "",
            "grid_row_col": "code_type_code"
        },
        {
            "dataCol": "code",
            "grid_row_col": "dependent_code"
        },
        {
            "dataCol": "description",
            "grid_row_col": "dependent_desc"
        },
        {
            "dataCol": "",
            "grid_row_col": "status_code"
        },
        {
            "dataCol": "",
            "grid_row_col": "mode_flag"
        },
        {
            "dataCol": "",
            "grid_row_col": "uid"
        }
        ];
    }
    return control_Name;
}