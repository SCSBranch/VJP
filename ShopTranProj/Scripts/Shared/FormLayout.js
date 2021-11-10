
$(document).ready(function () {
    dirty_modal()
    $(document).on('click', '.dirty_anger a:not([target="_blank"])', onAnchorClick);
})

function GoBackonClick() {
    if ($('#modevalue').text() != "View Mode") {
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
            setlocalStorage('header_title', $("#lblFormTitle").text());
            setlocalStorage('MenuId', $("#lblForm_menuid").text());
            $("#dirtymodal_proceed").css("display", "none");
            $("#dirty_clear").css("display", "none");
            if ($(".custom_proceed_href").length > 0) {
                $(".custom_proceed_href").remove();
            }
            $("#dirty_modal_btn").prepend("<a  class='custom_proceed_href btn btn-danger' style='float:left;color:white;background-color:#699917;border-color:#699917' href='" + form_list_url + "'>Leave This Page</a>");
            $('#custom_dirty').modal("show");
            return false;
        }
        else {
            setlocalStorage('header_title', $("#lblFormTitle").text());
            setlocalStorage('MenuId', $("#lblForm_menuid").text());
            setlocalStorage('view_name_from_form', "form_view");
            document.location = form_list_url;
        }
    }
    else {
        document.location = form_list_url;
    }   
}

function back_onClick() {
    location.href = form_list_url;
}

function BindingTabs(rowid, menu_Id, li_Id, tab_Id) {
    var data = {};
    data.menu_id = menu_Id;
    data.rowid = rowid;
    var get_data = ajaxcall_param("/Home/get_TabDetails", JSON.stringify(data));
    if (get_data != undefined) {
        var get_val = JSON.parse(get_data);
        if (get_val.success == true) {
            var tab_data = JSON.parse(get_val.detail);
            if (tab_data != null) {

                $.each(tab_data, function (key, value) {
                    if (key == 0) {
                        $('<li><a class="accordion-design-start" id="apanel' + key + '" href = "#panel' + key + '" data-toggle="tab" style ="--my-color:' + tab_data[key].tab_color + '"><p  class="accordion-name">' + tab_data[key].tab_name + '</p><br /></a ></li >').appendTo('#' + li_Id);
                    }
                    else if (key == (tab_data.length - 1)) {
                        $('<li><a class="accordion-design-end" id="apanel' + key + '" href = "#panel' + key + '" data-toggle="tab" style ="--my-color:' + tab_data[key].tab_color + '"><p  class="accordion-name">' + tab_data[key].tab_name + '</p><br /> </a ></li >').appendTo('#' + li_Id);
                    }
                    else {
                        $('<li><a class="accordion-design" id="apanel' + key + '" href = "#panel' + key + '" data-toggle="tab" style ="--my-color:' + tab_data[key].tab_color + '" ><p  class="accordion-name">' + tab_data[key].tab_name + '</p><br /> </a ></li >').appendTo('#' + li_Id);
                    }
                });

                {
                    $.each(tab_data, function (key, value) {
                        $('<div class="tab-pane fade" id="panel' + key + '"><div class="panel panel-default" style="overflow-y:scroll"><div class="panel-body" id="' + tab_data[key].panel_name + '"></div></div></div>').appendTo('#' + tab_Id);
                    });

                }
            }
        }
    }
}


function Tabs_StatusUpdate(rowid, menu_Id, li_Id, tab_Id) {
    var data = {};
    data.menu_id = menu_Id;
    data.rowid = rowid;
    var get_data = ajaxcall_param("/Home/get_TabDetails", JSON.stringify(data));
    if (get_data != undefined) {
        var get_val = JSON.parse(get_data);
        if (get_val.success == true) {
            var tab_data = JSON.parse(get_val.detail);
            if (tab_data != null) {
                $.each(tab_data, function (key, value) {
                    $("#lblPanel" + key).text(tab_data[key].status);
                });
            }
        }
    }
}