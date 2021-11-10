$(document).ready(function () {
    $('#exportexcelModal').on('loaded.bs.modal', function (e) {
        $('#exporthdr').text(hdrtitle + '- Export Excel');
        $('#chkall').prop("checked", false);
        $('#chkfilter').prop("checked", false);
        $('#chktemp').prop("checked", false);
        filter_combobox("cmbtemp", []);
        $('#cmbtemp').data("kendoComboBox").enable(false);
        $('#btnExc').prop("disabled", true);
    });

    $("#exportexcelModal").on('hidden.bs.modal', function () {
        $(this).data('bs.modal', null);
    });
});

$(function () {
    $('#chkall').on('click', function () {
        var checked = $(this).is(':checked');
        if (checked == true) {
            $('#chkall').prop("checked", true);
            $('#chkfilter').prop("checked", false);
            $('#chktemp').prop("checked", false);
            $('#cmbtemp').data("kendoComboBox").value('');
            $('#cmbtemp').data("kendoComboBox").enable(false);
            $('#btnExc').prop("disabled", false);
            $('#btnExc').show();
            $('#btnExcTemp').hide();
        }
    });

    $('#chkfilter').on('click', function () {
        var checked = $(this).is(':checked');
        if (checked == true) {
            $('#chkall').prop("checked", false);
            $('#chkfilter').prop("checked", true);
            $('#chktemp').prop("checked", false);
            $('#cmbtemp').data("kendoComboBox").value('');
            $('#cmbtemp').data("kendoComboBox").enable(false);
            $('#btnExc').prop("disabled", false);
            $('#btnExc').show();
            $('#btnExcTemp').hide();
        }
    });

    $('#chktemp').on('click', function () {
        var checked = $(this).is(':checked');
        if (checked == true) {
            $('#chkall').prop("checked", false);
            $('#chkfilter').prop("checked", false);
            $('#chktemp').prop("checked", true);
            get_file_path_details();
            $('#cmbtemp').data("kendoComboBox").enable(true);
            $('#btnExc').hide();
            $('#btnExcTemp').show();
        }
    });
});

function export_fuc() {
    $('.k-grid-excel').click();
}



function btn_cancel() {
    $('#exportexcelModal').modal('toggle')
}

var exportFlag = false;
function export_data(e) {
    var date = new Date();
    var dateName = kendo.toString(date, "g");
    var fileName = screen_id + '_' + dateName;
    e.workbook.fileName = fileName;
    if (!exportFlag) {
        e.preventDefault();
        exportFlag = true;
        setTimeout(function () {
            e.sender.saveAsExcel();
        });
    } else {
        exportFlag = false;
    }
}

function get_file_path_details() {
    var excel_data = {};
    var combo_data = [];
    excel_data.userId = getlocalStorage("user_id");
    excel_data.screen_id = screen_id;
    var spl_details = ajaxcall_param_new("/ExportExcel/fetch_file_path_details", excel_data);
    if (spl_details != undefined) {
        var mod_data = JSON.parse(spl_details);
        if (mod_data.success == true) {
            var file_locn = JSON.parse(mod_data.set1);
            if (file_locn != null) {
                for (var i = 0; i < file_locn.length; i++) {
                    combo_data.push({ code: file_locn[i].file_path, desc: file_locn[i].template_name });
                }
                filter_combobox("cmbtemp", combo_data);
                $('#chktemp').prop("disabled", false);
            }
            else {
                filter_combobox("cmbtemp", []);
                $('#chktemp').prop("disabled", true);
            }
        }
        else {
            var message = mod_data.msg;
            kendoAlert(message);
        }
    }
}




//list export excel function
function export_temp_fuc() {
    var export_data = $("#" + list_grid_id).data("kendoGrid");
    var cmb_temp = $('#cmbtemp').data("kendoComboBox").text();
    var combo_temp = $('#cmbtemp').data("kendoComboBox");
    cmb_temp_path = $('#cmbtemp').data("kendoComboBox").dataSource.data()[combo_temp.selectedIndex].code;
    var path = cmb_temp_path.split("//");
    path = path[0].split(".");
    var sdata = {};
    if (cmb_temp_path != "" && cmb_temp != "") {
        sdata.combovalue = cmb_temp;
        sdata.filepath = path[1];
        sdata.SubTreeId = SubTreeId;
        sdata.TreeId = TreeId;
        sdata.griddata = JSON.stringify(export_data.dataSource._data);
    }
    if (export_data.dataSource._data.length == 0) {
        kendoAlert('Sorry, no data found in the grid to Export');
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
                kendoAlert(exp_excel.msg);
            }
            e.preventDefault();
            return false;
        }
    }
}



