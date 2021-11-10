var _data = null;
function executeService(sRequest, data_val) {
    sRequest = encodeURI(sRequest);
    var result = '{"data":[]}';
    if (data_val != '') {
        _data = JSON.stringify(data_val);
    }
    else {
        _data = null;
    }

    var json;
    var arr;
    var json_string = "";
    try {
        var xhr = new XMLHttpRequest();
        if (!xhr) {
            return result;
        };
        function onreadystatechange(evt) {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                return onloadend(evt);
            }
        }
        function onloadend(evt) {
            try {
                if ((xhr.status == 200)) {
                    try {
                        json_string = xhr.responseText;
                        json = eval("(" + json_string + ")");
                        s = JSON.stringify(json);
                        if (json.update == 'failed') {
                            var msg = json.error;                        
                            kendoAlert(msg)
                        }
			if (json.update == 'failed in iud') {
                            var msg = json.error;
                            kendoAlert(msg)
                        }
                    }
                    catch (err) {
                        kendoAlert(sRequest + '::' + JSON.stringify(err) + ':::' + err.message, err, 1);
                        return result;
                    }
                    result = s;
                }
                else {
                    kendoAlert('Error Occurred : ' + JSON.stringify(xhr));
                    return result;
                }
            }
            catch (err) {
                kendoAlert(err.message, err, 1);
                return result;
            }
        }
        xhr.addEventListener("readystatechange", onreadystatechange);
        xhr.open("POST", sRequest, false);
        if (_data != null) {
            xhr.send(_data);
        }
        else
            xhr.send();
        return result;
    }
    catch (err) {
        kendoAlert(err.message, err, 0);
    }
    return result;
}

window.kendoAlert = function (msg) {
    var win = $("<div />").kendoWindow({
        title: "Message",
        width: "400px",
        //height: "130px",
        resizable: false,
        activate: onActivate,
        modal: true
    });
    win.data("kendoWindow").content(msg + "<br><br>" + $("#ok-confirmation").html()).center().open();
    win.find(".okcon_close").click(function () {
        win.data("kendoWindow").close();
    }).end()
}


window.kendoAlertList = function (msg) {
    var win = $("<div />").kendoWindow({
        title: "Message",
        width: "350px",
        //height: "130px",
        resizable: false,
        activate: onActivate,
        modal: true
    });
    win.data("kendoWindow").content(msg + "<br><br>" + $("#ok-confirmationList").html()).center().open();
    win.find(".okcon_closelist").click(function () {
        win.data("kendoWindow").close();
    }).end()
}

$(document).on('click', '#btnDelete', function (e) {
    if ($('#txtStatus').val() != undefined && ($('#txtStatus').val() == "INACTIVE"|| $('#txtStatus').val() == "InActive"  || $('#txtStatus').val() == "New")) {
        kendoAlert('New / Inactive record cannot be deleted');
        return false;
    }
    else if ($('#txtStatus').val() == "") {
        kendoAlert('Status Field cannot be blank');
        return false;
    }
    else {
        delete_inact(e);
    }
});

function delete_inact(e) {
    e.preventDefault();
    var kendoWindow = $("<div />").kendoWindow({
        title: "Confirm",
        width: "360px",
        height: "140px",
        resizable: false,
        modal: true
    });
    kendoWindow.data("kendoWindow")
        .content($("#deleteYesNo-confirmation").html())
        .center().open();
    kendoWindow
        .find(" .delete-confirm, .delete-cancel") //.Yes-delete-Reason,
        .click(function () {
            if ($(this).hasClass("delete-confirm")) {
                form_delete();
                kendoWindow.data("kendoWindow").close();
            }
            else {
                kendoWindow.data("kendoWindow").close();
            }
        })
}

function DeleteWindowEvent(e, dataItem, grid) {
    e.preventDefault();
    if (dataItem.mode_flag != "I" && dataItem.mode_flag != "D" && dataItem.mode_flag != "T") {
        var kendoWindow = $("<div />").kendoWindow({
            title: "Confirm",
            width: "350px",
            height: "130px",
            resizable: false,
            modal: true
        });
        kendoWindow.data("kendoWindow")
            .content($("#grid_delete-confirmation").html())
            .center().open();
        kendoWindow
            .find(".grid_delete-confirm,.grid_delete-cancel")
            .click(function () {
                if ($(this).hasClass("grid_delete-confirm")) {
                    if (dataItem.mode_flag == "S" || dataItem.mode_flag == "U") {
                        dataItem.mode_flag = "D";
                        ($(e.target).closest("tr")).css('backgroundColor', '#ff3333');
                        if (menuId == "HIRERARCHY") {
                            save('SAVE')
                        }
                    }
                    else if (dataItem.mode_flag == undefined) {
                        grid.dataSource.remove(dataItem);
                        grid.dataSource.sync();
                    }
                }
                else {
                    if (dataItem.mode_flag == "U")
                        dataItem.mode_flag = "U";
                    else if (dataItem.mode_flag == "S")
                        dataItem.mode_flag = "S";
                    kendoWindow.data("kendoWindow").close();
                }
                kendoWindow.data("kendoWindow").close();
            })
    }
    else if (dataItem.mode_flag == "D") {
        var kendoWindow = $("<div />").kendoWindow({
            title: "Confirm",
            width: "350px",
            height: "130px",
            resizable: false,
            modal: true
        });
        kendoWindow.data("kendoWindow")
            .content($("#grid_undo-confirmation").html())
            .center().open();
        kendoWindow
            .find(".grid_undo-confirm,.grid_undo-cancel")
            .click(function () {
                if ($(this).hasClass("grid_undo-confirm")) {
                    if (dataItem.mode_flag == "D") {
                        dataItem.mode_flag = "S";
                        ($(e.target).closest("tr")).css('backgroundColor', '');
                    }
                }
                else {
                    if (dataItem.mode_flag == "D")
                        dataItem.mode_flag = "D";
                    kendoWindow.data("kendoWindow").close();
                }
                kendoWindow.data("kendoWindow").close();
            })
    }
    else {
        grid.dataSource.remove(dataItem);
        grid.dataSource.sync();
        var rows = grid.tbody.children();
        for (var j = 0; j < rows.length; j++) {
            var row = $(rows[j]);
            var dataItem = grid.dataItem(row);
            if (dataItem.mode_flag == "I") {
                row.css('backgroundColor', 'lightgreen')
            }
            else if (dataItem.mode_flag == "D") {
                grid.closeCell();
                row.css('backgroundColor', '#ff3333')
            }
        }
    }
};

function onActivate(e) {
    var windowElement = this.wrapper,
        windowContent = this.element;
    $(document).on("keydown.kendoWindow", function (e) {
        var focusedElement = $(document.activeElement);
        if (e.keyCode == kendo.keys.TAB && focusedElement.closest(windowElement).length == 0) {
            windowContent.focus();
        }
    });
}

function load_dropdown_list(screen_id, master) {
    var list = []
    var OrgId = 'SCS';
    var LocnId = 'chn';
    var User = 'admin';
    var sRequest = weburl + '/server/MasterCodes/fetch_mastercode_screenid.ashx?org=' + OrgId + '&locn=' + LocnId + '&user=' + User + '&lang=en_us&user_id=' + User + '&screen_code=' + screen_id + '';
    var s = executeService(sRequest);
    var responseJSON = JSON.parse(s);
    if (responseJSON.update == "successful") {
        var cmb_data = responseJSON.data.context.Detail;
        for (var i = 0; i < cmb_data.length; i++) {
            if (cmb_data[i].master_code == master) {
                list.push({ code: cmb_data[i].code, desc: cmb_data[i].description, dependent: cmb_data[i].dependent_code });
            }
        }
    }
    return list
}

$(document).ready(function () {
    var click_btn_val = getlocalStorage('btn_clk_val');
    if (click_btn_val == "Create") {
        $("#btnDelete").hide();
        $("#btnClear").show();
        $(".edtviw_item").hide();
        $(".create_item").show();
        jQuery("label[for='modevalue']").html("New Mode");
    }
    else if (click_btn_val == "Edit") {
        $("#btnDelete").show();
        $("#btnClear").hide();
        $(".edtviw_item").show();
        $(".create_item").show();
        jQuery("label[for='modevalue']").html("Edit Mode");
    }
    else if (click_btn_val == "View") {
        $('#form1').hide()
        $(".edtviw_item").show();
        $(".create_item").show();
        jQuery("label[for='modevalue']").html("View Mode");
    }
});

function btn_onClick(event) {
    click_btn_val = "";
    if (event != "") {
        if (event == "Create") {
            click_btn_val = "Create";
        }
        else if (event == "Edit") {
            click_btn_val = "Edit";
        }
        else if (event == "View") {
            click_btn_val = "View";
        }
        else if (event == "Draft") {
            click_btn_val = "Draft";
        }
        else
            click_btn_val = "";
        setlocalStorage('btn_clk_val', click_btn_val);
        document.location = form_list_url;
    }
}

$(document).on('focus', '.combobox', function () {
    $('.combobox').trigger('click');
});

function openBusyCursorModal() {
    $('.loadProgress').fadeIn()
    //document.getElementsByClassName('loadProgress').style.display = 'block';
   // document.getElementById('dfade').style.display = 'block';
}

function closeBusyCursorModal() {
    $('.loadProgress').fadeOut()
    //document.getElementsByClassName('loadProgress').style.display = 'none';
    //document.getElementById('dfade').style.display = 'none';
}

function grid_getFormated_toDate(date) {   //get DD/MM/YYYY or MM/DD/YYYYY
    if (date != "" || date != undefined) {
        if (date != null) {
            var d = date;
            var date1 = kendo.parseDate(d);
            value1 = kendo.toString(date1, "yyyy-MM-dd");
            return value1;
        }
    }
}


function crtloginTime() {
    var date = new Date();
    var day = (date.getDate() + 1) > 9 ? (date.getDate() + 0) : "0" + (date.getDate() + 1);
    var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
    var hours = (date.getHours()) > 9 ? (date.getHours()) : "0" + (date.getHours());
    var minutes = (date.getMinutes()) > 9 ? (date.getMinutes()) : "0" + (date.getMinutes());
    var seconds = (date.getSeconds()) > 9 ? (date.getSeconds()) : "0" + (date.getSeconds());
    var dateString =
        day + "/" +
        month + "/" +
        date.getFullYear() + " " +
        hours + ":" +
        minutes + ":" +
        seconds;
    setlocalStorage('crtloginTime', dateString);
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
            }
        }
    }
}

$(window).load(function () {
    $(".loadProgress").fadeOut("slow");

})

function dynamicsHTML(menuId, tabid) {
    var getdata = {};
    getdata.userId = 'sys';
    getdata.screenId = menuId;
    getdata.tabId = tabid;
    var list_detail = ajaxcall_param("/Home/fetch_dynamic_inputs", JSON.stringify(getdata));
    if (list_detail != undefined) {
        var list_data = JSON.parse(list_detail);
        if (list_data.success == true) {
            var _data = JSON.parse(list_data.detail);
            if (_data != null) {
                var result = '';
                for (i = 0; i < _data.length; i++) {
                    result += '<div class="row">'
                    var len = 3;
                    var col = 4;
                    if (_data[i].tab == "KYC") {
                        len = 2;
                        col = 5;
                    }
                    for (j = 0; j < len; j++) {
                        var data = _data[i + j];
                        if (data != undefined) {
                            if (data.type == 'TEXTAREA') {
                                result += '<div class="col-sm-8"><div class="form-group"><label for="' + data.id + '" id="lbl_'+data.id+'" class="col-sm-3 control-label ' + data.required + '">' + data.label + '</label>'
                            }
                            else {
                                result += '<div class="col-sm-' + col + '"><div class="form-group"><label for="' + data.id + '" id="lbl_' + data.id +'" class="col-sm-5 control-label ' + data.required + '">' + data.label + '</label>'
                            }
                            
                            if (data.type == 'TEXT') {
                                result += '<div class="col-sm-7"><input type="text" class="form-control" id="' + data.id + '" name="' + data.name + '"  maxlength="' + data.maxlength + '"></div></div></div>'
                            }
                            else if (data.type == 'EMAIL') {
                                result += '<div class="col-sm-7"><input type="EMAIL" class="form-control" onchange="checkEmail(this)" id="' + data.id + '" name="' + data.name + '"  maxlength="' + data.maxlength + '"></div></div></div>'
                            } 
                            else if (data.type == 'TEXTAREA') {
                                result += '<div class="col-sm-9" style="margin-left:-40px"><textarea class="form-control" id="' + data.id + '" name="' + data.name + '"  maxlength="' + data.maxlength + '"></textarea></div></div></div>'
                            }
                            else if (data.type == 'NUMBER') {
                                result += '<div class="col-sm-7"><input type="text" class="form-control number" id="' + data.id + '" name="' + data.name + '" maxlength="' + data.maxlength + '"></div></div></div>'
                            }
                            else if (data.type == 'COMBO') {
                                result += '<div class="col-sm-7"><input type="text" class="combo" id="' + data.id + '" name="' + data.mastercode + '"   style="width:100%" maxlength="' + data.maxlength + '"></div></div></div>'
                            }
                            else if (data.type == 'MULTISELECT') {
                                result += '<div class="col-sm-7"><input type="text" class="MultiCombo" id="' + data.id + '" name="' + data.mastercode + '"  style="width:100%" maxlength="' + data.maxlength + '"></div></div></div>'
                            }
                            else if (data.type == 'DATE') {
                                result += '<div class="col-sm-7"><input id="' + data.id + '" name="' + data.name + '" maxlength="' + data.maxlength + '" class="attrDate" data-role="datepicker" style="width: 100%;"  onkeypress="return date_validate(event)" data-checkdate-msg="Enter valid date"></div></div></div>'
                            }
                            else if (data.type == 'UPLOAD') {
                                result += '<div class="col-sm-7"><input type="button" class="btn btn-sm btn-primary upload" value="Upload" style="width:auto" onclick="AttachmentClick(' + data.id + ')"><i class="fa fa-paperclip" id="' + data.id + '" data-toggle="tooltip" title="Attachment" data-placement="bottom" style="font-size:16px;font-weight:bold;padding:0px 10px">(0)</i></div></div></div>'
                            }
                            else if (data.type == 'GST') {
                               result += '<div class="col-sm-7"><input type="GST" class="form-control GST" onchange="gst_validation(this)" id="' + data.id + '" name="' + data.name + '"  maxlength="' + data.maxlength + '" style="text-transform:uppercase"></div></div></div>'
                            } 
                            else if (data.type == 'AADHAR') {
                                result += '<div class="col-sm-7"><input type="AADHAR" class="form-control AADHAR" onchange="aadhar_validation(this)" id="' + data.id + '" name="' + data.name + '"  maxlength="' + data.maxlength + '"></div></div></div>'
                            } 
                            else if (data.type == 'PAN') {
                                result += '<div class="col-sm-7"><input type="PAN" class="form-control PAN" onchange="pan_validation(this)" id="' + data.id + '" name="' + data.name + '"  maxlength="' + data.maxlength + '" style="text-transform:uppercase" ></div></div></div>'
                            } 
                            else {
                                result += '</div></div>'
                            }
                        }
                    }
                    result += '</div>'
                    i += j - 1;
                }
            }
        }
    }
    $("#" + tabid).append(result);
    var form_data = $('#' + tabid + " " + ':input');
    for (var i = 0; i < form_data.length; i++) {
        var form = form_data[i];
        var classname = form.className;
        var id = form.id;
        if (classname == 'attrDate') {
            $("#" + id).kendoDatePicker({ format: "dd/MM/yyyy" });
        }
        if (classname == 'combo') {
            var list = load_dropdown_list(menuId, form.name)
            filter_combobox(id, list);
        }
        if (classname == 'MultiCombo') {
            var list = load_dropdown_list(menuId, form.name)
            mul_filter_combobox(id, list);
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
}


function dynamicsGRID(menuId, tabid) {
    var getdata = {};
    getdata.userId = 'sys';
    getdata.screenId = menuId;
    getdata.tabId = tabid;
    var list_detail = ajaxcall_param("/Home/fetch_dynamic_inputs", JSON.stringify(getdata));
    if (list_detail != undefined) {
        var list_data = JSON.parse(list_detail);
        if (list_data.success == true) {
            var _data = JSON.parse(list_data.detail);
            if (_data != null) {
                var result = get_gridColumns(_data)
            }
        } else {
            kendoAlert(list_detail.msg)
        }
    }
    return result
}

function get_gridColumns(data) {
    try {
        var columns = [];
        $.each(data, function (key, value) {
            var col = {};
            col.field = value.name;
            col.title = value.label;
            var hide = value.required;
            col.hidden = hide == "required" ? true : false;
            col.width = value.maxlength + 'px';
            columns.push(col);
        });
        return columns;
    }
    catch (err) {
        javascript_log4j_root(arguments.callee.name, err);
    }
}


function mul_filter_combobox(id, datasource) {
    $("#" + id).kendoMultiSelect({
        dataTextField: "desc",
        dataValueField: "code",
        autoClose: false,
        dataSource: datasource
    });

    list_in = "";
}



/*validation for POSP Profile Form*/
function pan_validation(currVal) {
    var pan_id = currVal.id;
    var pan_val = $("#" + pan_id).val();
    if (pan_val == "") {
        return true;
    }
    var regExp = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/;
    if (pan_val.length == 10) {
        if (pan_val.match(regExp)) {
            return true;
        }
        else {
            kendoAlert("Invalid PAN Number");
            return false;
        }
    }
    else {
        kendoAlert('Please enter 10 digits for a valid PAN number');
        return false;
    }
}

function gst_validation(currVal) {
    var gst_id = currVal.id;
    var gst_val = $("#" + gst_id).val();
    if (gst_val == "") {
        return true;
    }
    var reggst = /^([0-9]){2}([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}([0-9]){1}([a-zA-Z]){1}([0-9]){1}?$/;
    if (gst_val.length == 15) {
        var isValidGst = reggst.test(gst_val);
        if (isValidGst == false) {
            kendoAlert("Invalid GST Number");
            return false;
        }
    }
    else {
        kendoAlert('Please enter 15 digits for a valid GST number');
        return false;
    }
}

function checkEmail(val) {
    var email_id = val.id;
    var email_val = $("#" + email_id).val();
    var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (email_val == "") {
        return true;
    } else if (regex.test(email_val) == false) {
        kendoAlert("You have entered an invalid email address!");
        return false;
    }
    return true;
}

function isDate(currVal) {
    if (currVal == "") {
        return true;
    }
    var rgexp = /(^(((0[1-9]|1[0-9]|2[0-8])[/](0[1-9]|1[012]))|((29|30|31)[/](0[13578]|1[02]))|((29|30)[/](0[4,6,9]|11)))[/](19|[2-9][0-9])\d\d$)|(^29[/]02[/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/;
    var isValidDate = rgexp.test(currVal);
    return isValidDate;
}

function aadhar_validation(val) {
    var aadhar_id = val.id;
    var aadhar_val = $("#" + aadhar_id).val();
    if (aadhar_val != "") {
        if (aadhar_val.indexOf('XXXX') == 0) {
            return true;
        }
        else {
            var maxLength = val.maxLength;
            if (aadhar_val.length != maxLength) {
                kendoAlert('Invalid AADHAR number');
                return false;
            }
        }
    }
    else {
        return true;
    }
}

function aadhar_Hyphen(element) {
    var value = $(element).val();
    value = value.replace(/\D/g, "").split(/(?:([\d]{4}))/g).filter(s => s.length > 0).join("-");
    $(element).val(value);
}



function OBJtoXML(obj) {
    var xml = '';
    for (var prop in obj) {
        xml += "<" + prop + ">";
        if (obj[prop] == null) {
            obj[prop] = "";
        }
        if (Array.isArray(obj[prop])) {
            for (var array in obj[prop]) {
                // A real botch fix here
                xml += "</" + prop + ">";
                xml += "<" + prop + ">";
                xml += OBJtoXML(new Object(array));
            }
        }
        else if (typeof obj[prop] == "object") {
            xml += OBJtoXML(new Object(obj[prop]));
        }
        else {
            xml += obj[prop];
        }
        xml += "</" + prop + ">";
    }
    var xmls = xml.replace(/<\/?[0-9]{1,}>/g, '');
    xmls = "<row>" + xmls + "</row>"
    return xmls
}

function convert_xml(id) {
    var grid_val = JSON.stringify($("#" + id).data("kendoGrid").dataSource.data());
    var obj_grid_val = JSON.parse(grid_val);
    var xml_data = OBJtoXML(obj_grid_val);
    var result = xml_data.slice(5, -6);
    return result;
}