var view_val = "";
var new_click_view = "";
$(document).ready(function () {
    $('#personalviewModal').on('show.bs.modal', function (e) {
        $(this).data('modal', null)
        $('#perviewhdr').text(hdrtitle + ' - Personalize View');
        LoadView();
        $("#grid_Hidden").addClass('k-reorderable');
        TransferRow();
        MandatoryRow();
        $('#grid_Visible .k-grid-content').css('height', "395px");
    });

    $('#personalviewModal').on('loaded.bs.modal', function (e) {
        $('#perviewhdr').text(hdrtitle + ' - Personalize View');
        LoadView();
        $("#grid_Hidden").addClass('k-reorderable');

        var e = document.getElementById("cmb_view");
        var strUser = e.options[e.selectedIndex].text;
        if (strUser == "Default") {
            $('#SaveClick').attr("disabled", true);
        }
        else {
            $('#SaveClick').attr("disabled", false);
        }
        TransferRow();
        MandatoryRow();
        $('#grid_Visible .k-grid-content').css('height', "395px");
    });

    $("#personalviewModal").on('hidden.bs.modal', function () {
        $(this).data('bs.modal', null);
        $(this).off('hidden.bs.modal');
    });

    var dt_Aval = "";
    var dt_Hidden = "";
    var man_data = "";
    var groupview_hidden = "";
    var org_menu_id = "";

});

function MandatoryRow() {
    var man_row = {};
    man_row.screen_id = screen_id;
    man_row.grid_id = Grid_Id;
    man_data = ajaxcall_url_with_1param("/PersonalizeView/MandatoryRows", JSON.stringify(man_row));
    if (man_data != undefined) {
        man_data = JSON.parse(man_data);
    }
}


function insertNoRecordsRow(e) {
    if (!this.dataSource.data().length) {
        this.tbody.append($("<tr class='no-drag' colspan='2'><td></td></tr>"));
    }
}



function TransferRow() {
    $(".k-reorderable table").kendoSortable({
        connectWith: '.k-reorderable table',
        filter: ">tbody >tr",
        disabled: ".no-drag",
        hint: function (e) {
            item = $('<div class="k-grid k-widget" style="background-color: DarkOrange; color: black;"><table><tbody><tr>' + e.html() + '</tr></tbody></table></div>');
            return item;
        },
        cursor: "move",
        placeholder: function (element) {
            return element.clone().addClass("k-state-hover").css("opacity", 0.65);
        },
        change: function (e) {
            var grid = this.element.closest(".k-grid").data("kendoGrid");
            var oldIndex = e.oldIndex;
            var newIndex = e.newIndex;
            if (e.action == "remove") {
                dataItem = grid.dataSource.getByUid(e.item.data("uid"));
                grid.dataSource.remove(dataItem);
            } else if (e.action == "receive" && dataItem != null) {
                grid.dataSource.insert(oldIndex, dataItem);
                dataItem = null;
            }
            else if (e.action == "sort") {
                dataItem = grid.dataSource.getByUid(e.item.data("uid"));
                grid.dataSource.remove(dataItem);
                grid.dataSource.insert(newIndex, dataItem);
                dataItem = null;
            }
            grid.saveChanges();
            var grid = $("#grid_Visible").data("kendoGrid");
            var rows = grid.tbody.children();
            var td = ((rows.length) * 5);
            for (var d = 0; d < td; d++) {
                for (var k = 0; k < man_data.length; k++) {

                    if ($("#grid_Visible td")[d].innerHTML == man_data[k].headerText) {

                        $("#grid_Visible").find('td:eq(' + (d) + ')').closest('tr').addClass('no-drag');

                    }
                }
            }

        }
    });
}


function NewView() {
    $("#cmb_view").remove();
    $("#View_name").append('<input type="text" id="cmb_view" maxlength="100" name ="view" required></input>');
    var grid_ava = $('#grid_Visible').data("kendoGrid");
    var grid_hid = $('#grid_Hidden').data("kendoGrid");
    var cmb_view = $('#cmb_view').val();
    $("#inputview").prop("checked", false);
    var checked = $('#inputview').is(':checked');
    if (checked == true) {
        var default_view = "1";
    }
    else {
        var default_view = "0";
    }
    var grid_main = $("#" + list_grid_id).data("kendoGrid");
    dt_Aval = [{}];
    var k = 0;
    for (var i = 0; i < grid_main.columns.length; i++) {
        if (grid_main.columns[i].title != " " && grid_main.columns[i].locked != true && grid_main.columns[i].width != "0") //grid_main.columns[i].title != "Sel" &&
        {
            dt_Aval[k] = { "headerText": grid_main.columns[i].title, "dataField": grid_main.columns[i].field, "view_name": cmb_view, "default_view": default_view, "width": grid_main.columns[i].width, "seq_no": i };
            k++;
        }
    }

    grid_Visible(dt_Aval);
    dt_Hidden = [];
    grid_hid.dataSource.data().length = 0;
    grid_Hidden(dt_Hidden);

    var rows = grid_ava.tbody.children();
    var td = ((rows.length) * 5);
    for (var d = 0; d < td; d++) {
        for (var k = 0; k < man_data.length; k++) {
            if ($("#grid_Visible td")[d].innerHTML == man_data[k].headerText) {
                $("#grid_Visible").find('td:eq(' + (d) + ')').closest('tr').addClass('no-drag');
            }
        }
    }
    $('#SaveClick').attr("disabled", false);
    new_click_view = "New_view";
    return false;
}


var strUser_view = "";
function LoadView() {
    var Main_grid = $("#" + list_grid_id).data("kendoGrid");
    var detail = {};
    detail.screen_id = screen_id;
    detail.grid_id = Grid_Id;
    detail.newClick = false;
    detail.Menu_ID = org_menu_id;
    detail.usr_id = getlocalStorage('user_id');
    var view_detail = ajaxcall_param("/PersonalizeView/loadViews", JSON.stringify(detail));
    if (view_detail != undefined) {
        var cont_data = JSON.parse(view_detail);
        var dt_View = JSON.parse(cont_data.set1);

        $("#cmb_view").append('<select id="cmb_view" onchange="View_selectChange()" name ="view" required></select>');
        $("#cmb_view").empty();

        for (var i = 0; i < dt_View.length; i++) {
            if (dt_View[i].default_view == "1") {
                $("#cmb_view").append('<option value="' + i + '" selected>' + dt_View[i].VIEW_NAME + '</option>');
                $("#inputview").prop("checked", true);   // added by mani
            }
            else {
                $("#cmb_view").append('<option value="' + i + '">' + dt_View[i].VIEW_NAME + '</option>');
            }

        }

        dt_Aval = JSON.parse(cont_data.dt_Aval);
        dt_Hidden = JSON.parse(cont_data.dt_Hidden);

        $.each(dt_View, function (key, value) {
            if (dt_View[key].default_view == "1") {
                strUser_view = dt_View[key].VIEW_NAME;
            }
        });


        var cur_data = []; var hidden_data = [];
        $.each(dt_Aval, function (key, val) {
            if (dt_Aval[key].view_name == strUser_view) {
                cur_data.push(dt_Aval[key]);
            }
        });

        $.each(dt_Hidden, function (key, val) {
            if (dt_Hidden[key].view_name == strUser_view) {
                hidden_data.push(dt_Hidden[key]);
            }
        });

        // $("#example").empty();
        // $("#example").append("<div id='grid_Visible'></div>");
        grid_Visible(cur_data);
        // $("#example1").empty();
        // $("#example1").append("<div id='grid_Hidden'></div>");
        grid_Hidden(hidden_data);
    }
}



function View_selectChange() {
    var Main_grid = $("#" + list_grid_id).data("kendoGrid");
    var detail = {};
    detail.screen_id = screen_id;
    detail.grid_id = Grid_Id;
    detail.newClick = false;
    detail.Menu_ID = org_menu_id;
    detail.usr_id = getlocalStorage('user_id');
    var view_detail = ajaxcall_param("/PersonalizeView/loadViews", JSON.stringify(detail));
    if (view_detail != undefined) {
        var cont_data = JSON.parse(view_detail);
        var dt_View = JSON.parse(cont_data.set1);
        dt_Aval = JSON.parse(cont_data.dt_Aval);
        dt_Hidden = JSON.parse(cont_data.dt_Hidden);

        $.each(dt_View, function (key, value) {
            if (dt_View[key].default_view == "1") {
                strUser_view = dt_View[key].VIEW_NAME;
            }
        });


        var e = document.getElementById("cmb_view");
        var strUser = e.options[e.selectedIndex].text;

        var cur_data = []; var hidden_data = [];


        $.each(dt_Aval, function (key, val) {
            if (dt_Aval[key].view_name == strUser) {
                cur_data.push(dt_Aval[key]);
            }
        });

        $.each(dt_Hidden, function (key, val) {
            if (dt_Hidden[key].view_name == strUser) {
                hidden_data.push(dt_Hidden[key]);
            }
        });

        // $("#example").empty();
        //  $("#example").append("<div id='grid_Visible'></div>");
        grid_Visible(cur_data);
        // $("#example1").empty();
        //  $("#example1").append("<div id='grid_Hidden'></div>");
        grid_Hidden(hidden_data);


        if (strUser_view == strUser) {
            $("#inputview").prop("checked", true);
        }
        else {
            $("#inputview").prop("checked", false);
        }


        if (strUser == "Default") {
            $('#SaveClick').attr("disabled", true);
        }
        else {
            $('#SaveClick').attr("disabled", false);
        }
    }
}




function grid_Visible(dt_Aval) {

    $("#grid_Visible").kendoGrid({
        dataSource: {
            data: dt_Aval,
            schema: {
                model: {
                    fields: {
                        headerText: { editable: false },
                        width: { editable: true },
                    }
                },
            },

        },
        dataBound: function (e) {
            var rows = e.sender.tbody.children();
            var td = ((rows.length) * 5);
            for (var d = 0; d < td; d++) {
                for (var k = 0; k < man_data.length; k++) {
                    if ($("#grid_Visible td")[d].innerHTML == man_data[k].headerText) {
                        $("#grid_Visible").find('td:eq(' + (d) + ')').closest('tr').addClass('no-drag');
                    }
                }
            }
        },
        height: 420,
        sortable: false,
        scrollable: true,
        navigatable: true,
        selectable: "cell",
        reorderable: true,
        columns: [
            {
                field: "headerText",
                title: "HeaderText"
            },
            {
                field: "dataField",
                title: "dataField",
                hidden: true
            },
            {
                field: "view_name",
                title: "view_name",
                hidden: true
            },
            {
                field: "default_view",
                title: "default_view",
                hidden: true
            },
            {
                field: "width",
                title: "Width"
            },
            {
                field: "seq_no",
                title: "seq no",
                hidden: true
            }],
        editable: true,
    }).data("kendoGrid");
}

function grid_Hidden(dt_Hidden) {
    $("#grid_Hidden").kendoGrid({
        dataSource: {
            data: dt_Hidden,
            schema: {
                model: {
                    fields: {
                        headerText: { editable: false },
                        width: { editable: true },

                    }
                },
            },
        },
        dataBound: insertNoRecordsRow,
        height: 420,
        sortable: false,
        scrollable: true,
        navigatable: true,
        selectable: "cell",
        columns: [
            {
                field: "headerText",
                title: "HeaderText"
            },
            {
                field: "dataField",
                title: "dataField",
                hidden: true
            },
            {
                field: "view_name",
                title: "view_name",
                hidden: true
            },
            {
                field: "default_view",
                title: "default_view",
                hidden: true
            },
            {
                field: "width",
                title: "Width"
            },
            {
                field: "seq_no",
                title: "seq no",
                hidden: true
            }],
        editable: true,

    });
}

function saveView() {
    var detail = {};
    detail.screen_id = screen_id;
    detail.grid_id = Grid_Id;
    var cmb_view = $('#cmb_view').val();
    var checked = $('#inputview').is(':checked');
    detail.user_id = getlocalStorage('user_id');
    var default_view = "";
    if (checked == true) {
        default_view = "1";
        detail.default_view = "1";
    }
    else {
        default_view = "0";
        detail.default_view = "0";
    }
    var grid_ava = $('#grid_Visible').data("kendoGrid");
    var grid_hid = $('#grid_Hidden').data("kendoGrid");
    dt_Aval = [{}];
    dt_Hidden = [{}];
    for (var i = 0; i < grid_ava._data.length; i++) {
        dt_Aval[i] = { "headerText": grid_ava._data[i].headerText, "dataField": grid_ava._data[i].dataField, "view_name": cmb_view, "default_view": default_view, "width": grid_ava._data[i].width, "seq_no": grid_ava._data[i].seq_no };

    }
    grid_Visible(dt_Aval);
    for (var i = 0; i < grid_hid._data.length; i++) {
        dt_Hidden[i] = { "headerText": grid_hid._data[i].headerText, "dataField": grid_hid._data[i].dataField, "view_name": cmb_view, "default_view": default_view, "width": grid_hid._data[i].width, "seq_no": grid_hid._data[i].seq_no };
        if (grid_hid._data[i].headerText == undefined) {
            dt_Hidden = [];
            grid_hid._data.length = 0;
            break;
        }
    }
    grid_Hidden(dt_Hidden);
    detail.Avaldetails = JSON.stringify($("#grid_Visible").data().kendoGrid._data);
    detail.Hiddetails = JSON.stringify($("#grid_Hidden").data().kendoGrid._data);


    var options = $('#cmb_view').children();
    if (options.length == 0) {
        detail.view_name = cmb_view;
    }
    else {
        var e = document.getElementById("cmb_view");
        var strUser = e.options[e.selectedIndex].text;
        detail.view_name = strUser;
    }

    if (detail.view_name != "" && detail.Avaldetails != "") {
        var save_view = ajaxcall_param("/PersonalizeView/savePersonalizeView", JSON.stringify(detail));
        if (save_view != undefined) {
            var view_detail = JSON.parse(save_view);
            if (view_detail.success == true) {
                view_val = $("#cmb_view").val();
                $("#cmb_view").remove();
                $("#View_name").append('<select id="cmb_view" onchange="View_selectChange()" name ="view" required></select>');
                LoadSaveView();

                kendoAlert(view_detail.msg);
            }
            else {
                kendoAlert(view_detail.msg);
            }
        }
    }
    else if (detail.view_name == "") {
        kendoAlert("View Name cannot be blank")
    }
}




var cmb_check = "true";
function LoadView_screen() {
    var Main_grid = $("#" + list_grid_id).data("kendoGrid");
    var detail = {};
    detail.screen_id = screen_id;
    detail.grid_id = Grid_Id;
    detail.newClick = false;
    detail.Menu_ID = org_menu_id;
    detail.usr_id = getlocalStorage('user_id');
    var view_detail = ajaxcall_param("/PersonalizeView/loadViews", JSON.stringify(detail));
    if (view_detail != undefined) {
        var cont_data = JSON.parse(view_detail);
        var dt_View = JSON.parse(cont_data.set1);

        if (cmb_check == "true") {
            $("#cmb_view_master").append('<select id="cmb_view" onchange="View_master_selectChange()" name ="view" required></select>');
            $("#cmb_view_master").empty();

            var back_view = getlocalStorage('view_name_from_form');
            if (back_view == "form_view") {
                var back_view = getlocalStorage('selected_view_name');
                var view_name = parseInt(back_view);
                for (var i = 0; i < dt_View.length; i++) {
                    if (i == view_name) {
                        $("#cmb_view_master").append('<option value="' + view_name + '" selected>' + dt_View[view_name].VIEW_NAME + '</option>');
                    }
                    else {
                        $("#cmb_view_master").append('<option value="' + i + '">' + dt_View[i].VIEW_NAME + '</option>');
                    }
                }
                setlocalStorage('view_name_from_form', "");
            }
            else {
                for (var i = 0; i < dt_View.length; i++) {
                    if (dt_View[i].default_view == "1") {
                        $("#cmb_view_master").append('<option value="' + i + '" selected>' + dt_View[i].VIEW_NAME + '</option>');
                    }
                    else {
                        $("#cmb_view_master").append('<option value="' + i + '">' + dt_View[i].VIEW_NAME + '</option>');
                    }
                }
            }
            cmb_check = "true1";
        }
        else if (cmb_check == "false") {
            $("#cmb_view_master").append('<select id="cmb_view" onchange="View_master_selectChange()" name ="view" required></select>');
            $("#cmb_view_master").empty();
            var close_view = parseInt($("#cmb_view").val());
            for (var i = 0; i < dt_View.length; i++) {
                if (i == close_view) {
                    $("#cmb_view_master").append('<option value="' + close_view + '" selected>' + dt_View[close_view].VIEW_NAME + '</option>');
                }
                else {
                    $("#cmb_view_master").append('<option value="' + i + '">' + dt_View[i].VIEW_NAME + '</option>');
                }
            }
            cmb_check = "true1";
        }

        setlocalStorage('selected_view_name', $("#cmb_view_master").val());

        dt_Aval = JSON.parse(cont_data.dt_Aval);
        dt_Hidden = JSON.parse(cont_data.dt_Hidden);


        var e = document.getElementById("cmb_view_master");
        var strUser = e.options[e.selectedIndex].text;

        var cur_data = []; var hidden_data = [];
        $.each(dt_Aval, function (key, val) {
            if (dt_Aval[key].view_name == strUser) {
                cur_data.push(dt_Aval[key]);
            }
        });

        $.each(cur_data, function (key, val) {
            var grid = $("#" + list_grid_id).data("kendoGrid");
            var opts = grid.options;
            for (var i = 0; i < opts.columns.length; i++) {
                if (opts.columns[i].field == cur_data[key].dataField) {
                    opts.columns[i].width = cur_data[key].width;
                    opts.columns[i].hidden = false;
                    // grid.reorderColumn(i, opts.columns[i]);
                    break;
                }
            }
            grid.setOptions(opts);

        });

        var grid = $("#" + list_grid_id).data("kendoGrid");
        var gridcols = grid.columns;
        for (i = 0; i < cur_data.length; i++) {
            for (j = 0; j < gridcols.length; j++) {
                if (gridcols[j].field == cur_data[i].dataField) {
                    grid.reorderColumn(i, grid.columns[j]);
                    break;
                }
            }
        }

        $.each(dt_Hidden, function (key, val) {
            if (dt_Hidden[key].view_name == strUser) {
                hidden_data.push(dt_Hidden[key]);
            }
        });

        $.each(hidden_data, function (key, val) {
            var grid = $("#" + list_grid_id).data("kendoGrid");
            grid.hideColumn(hidden_data[key].dataField);
        });




        //var grid = $("#grid").data("kendoGrid");
        //grid.reorderColumn(2, grid.columns[1]);  

    }
}



function View_master_selectChange() {
    openBusyCursorModal();
    listpageloadfetch(filter_condition);
    setTimeout(function () {
        closeBusyCursorModal();
    }, 600);

}

function closeView() {
    cmb_check = "false"
    $("#cmb_view_master").val($("#cmb_view").val());
    openBusyCursorModal();
    listpageloadfetch(filter_condition);
    setTimeout(function () {
        closeBusyCursorModal();
    }, 600);

}

function LoadSaveView_old() {
    var Main_grid = $("#" + list_grid_id).data("kendoGrid");
    var detail = {};
    detail.screen_id = screen_id;
    detail.grid_id = Grid_Id;
    detail.newClick = false;
    detail.Menu_ID = org_menu_id;
    detail.usr_id = getlocalStorage('user_id');
    var view_detail = ajaxcall_param("/PersonalizeView/loadViews", JSON.stringify(detail));
    if (view_detail != undefined) {
        var cont_data = JSON.parse(view_detail);
        var dt_View = JSON.parse(cont_data.set1);

        $("#cmb_view").append('<select id="cmb_view" onchange="View_selectChange()" name ="view" required></select>');
        $("#cmb_view").empty();

        for (var i = 0; i < dt_View.length; i++) {
            if (dt_View[i].default_view == "1") {
                $("#cmb_view").append('<option value="' + i + '" selected>' + dt_View[i].VIEW_NAME + '</option>');
            }
            else {
                $("#cmb_view").append('<option value="' + i + '">' + dt_View[i].VIEW_NAME + '</option>');
            }

        }

        dt_Aval = JSON.parse(cont_data.dt_Aval);
        dt_Hidden = JSON.parse(cont_data.dt_Hidden);

        $.each(dt_View, function (key, value) {
            if (dt_View[key].default_view == "1") {
                strUser_view = dt_View[key].VIEW_NAME;
            }
        });


        var cur_data = []; var hidden_data = [];
        $.each(dt_Aval, function (key, val) {
            if (dt_Aval[key].view_name == strUser_view) {
                cur_data.push(dt_Aval[key]);
            }
        });

        $.each(dt_Hidden, function (key, val) {
            if (dt_Hidden[key].view_name == strUser_view) {
                hidden_data.push(dt_Hidden[key]);
            }
        });

        grid_Visible([]);
        grid_Hidden([]);
        grid_Visible(cur_data);
        grid_Hidden(hidden_data);

        var e = document.getElementById("cmb_view");
        var strUser = e.options[e.selectedIndex].text;

        if (strUser_view == strUser) {
            $("#inputview").prop("checked", true);
        }
        else {
            $("#inputview").prop("checked", false);
        }


        if (strUser == "Default") {
            $('#SaveClick').attr("disabled", true);
        }
        else {
            $('#SaveClick').attr("disabled", false);
        }
    }
}

function LoadSaveView() {
    var Main_grid = $("#" + list_grid_id).data("kendoGrid");
    var detail = {};
    detail.screen_id = screen_id;
    detail.grid_id = Grid_Id;
    detail.newClick = false;
    detail.Menu_ID = org_menu_id;
    detail.usr_id = getlocalStorage('user_id');
    var view_detail = ajaxcall_param("/PersonalizeView/loadViews", JSON.stringify(detail));
    if (view_detail != undefined) {
        var cont_data = JSON.parse(view_detail);
        var dt_View = JSON.parse(cont_data.set1);

        $("#cmb_view").append('<select id="cmb_view" onchange="View_selectChange()" name ="view" required></select>');
        $("#cmb_view").empty();

        var def_view = parseInt(view_val);

        if (new_click_view == "New_view") {
            for (var i = 0; i < dt_View.length; i++) {
                if (dt_View[i].VIEW_NAME == view_val) {
                    $("#cmb_view").append('<option value="' + i + '" selected>' + dt_View[i].VIEW_NAME + '</option>');
                }
                else {
                    $("#cmb_view").append('<option value="' + i + '">' + dt_View[i].VIEW_NAME + '</option>');
                }

            }
        }
        else {
            for (var i = 0; i < dt_View.length; i++) {
                if (i == def_view) {
                    $("#cmb_view").append('<option value="' + def_view + '" selected>' + dt_View[def_view].VIEW_NAME + '</option>');
                }
                else {
                    $("#cmb_view").append('<option value="' + i + '">' + dt_View[i].VIEW_NAME + '</option>');
                }

            }
        }

        dt_Aval = JSON.parse(cont_data.dt_Aval);
        dt_Hidden = JSON.parse(cont_data.dt_Hidden);

        if (new_click_view == "New_view") {
            $.each(dt_View, function (key, value) {
                if (dt_View[key].VIEW_NAME == view_val) {
                    strUser_view = dt_View[key].VIEW_NAME;
                }
            });
        }
        else {
            $.each(dt_View, function (key, value) {
                if (key == def_view) {
                    strUser_view = dt_View[key].VIEW_NAME;
                }
            });
        }
        var cur_data = []; var hidden_data = [];
        $.each(dt_Aval, function (key, val) {
            if (dt_Aval[key].view_name == strUser_view) {
                cur_data.push(dt_Aval[key]);
            }
        });

        $.each(dt_Hidden, function (key, val) {
            if (dt_Hidden[key].view_name == strUser_view) {
                hidden_data.push(dt_Hidden[key]);
            }
        });

        grid_Visible([]);
        grid_Hidden([]);
        grid_Visible(cur_data);
        grid_Hidden(hidden_data);

        var e = document.getElementById("cmb_view");
        var strUser = e.options[e.selectedIndex].text;


        if (strUser == "Default") {
            $('#SaveClick').attr("disabled", true);
        }
        else {
            $('#SaveClick').attr("disabled", false);
        }
        new_click_view = "";
    }
}