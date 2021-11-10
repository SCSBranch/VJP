var grid_file_Val = "";
var grid_file_Size = "";
var grid_download_fileName = "";
var grid_dn_file_name = "";

//$(document).ready(function () {
//    //alert(dataitem)
//});

$("#file").change(function () {
    readURL(this);

});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
    }
}

function save_file() {
    try {
        document.getElementById('file').files[0];
        grid_file_Val = document.getElementById('file').files[0].name;
        grid_file_Size = document.getElementById('file').files[0].size;
        $("#txtfilename").val(grid_file_Val);
        $("#txtVersion").val("1");
        var fileupload_size = bytesToSize(grid_file_Size);
        $("#txtSize").val(fileupload_size);
        if (grid_file_Size > 5242880) {
            kendoAlert("File length cannot exceed 5 MB", "Warnning");
            $("#txtSize").val("");
            $("#txtfilename").val("");
        }
    }
    catch (error) {
        alert(error)
    }
}

function bytesToSize(bytes) {
    var kilobyte = 1024;
    var megabyte = kilobyte * 1024;
    var gigabyte = megabyte * 1024;
    var terabyte = gigabyte * 1024;
    if ((bytes >= 0) && (bytes < kilobyte)) {
        return bytes + ' B';
    }
    else if ((bytes >= kilobyte) && (bytes < megabyte)) {
        return ((bytes / kilobyte)).toFixed(2) + ' KB';
    }
    else if ((bytes >= megabyte) && (bytes < gigabyte)) {
        return ((bytes / megabyte)).toFixed(2) + ' MB';
    }
    else if ((bytes >= gigabyte) && (bytes < terabyte)) {
        return ((bytes / gigabyte)).toFixed(2) + ' GB';
    }
    else if (bytes >= terabyte) {
        return ((bytes / terabyte)).toFixed(2) + ' TB';
    }
    else {
        return bytes + ' B';
    }
}

function Grid_btn_new() {
    $("#txtfilename").val("");
    $("#txtSize").val("");
    $("#txtnotes").val("");
    $("#cmb_grid_group").data("kendoComboBox").value("");
    $("#cmb_grid_subgroup").data("kendoComboBox").value("");
    $("#txtVersion").val("1");
    $("#txtseqno").val("0");
    $("#txtmodeflag").val("I");
    $("#txtheadfilepath").val("");
    document.getElementById('file').value = "";
    $("#file").prop("disabled", false);
    $("#cmb_grid_group").data("kendoComboBox").enable(true);
    $("#cmb_grid_subgroup").data("kendoComboBox").enable(true);
    doc_url_path = '';
}

function Grid_btn_upload() {
    var validatable = $("#form2").kendoValidator().data("kendoValidator");
    if (validatable.validate()) {
        if ($("#txtDocno").val() != "") {
            if ($("#txtseqno").val() == "0") {
                if ($("#txtfilename").val() != "") {
                    if (Grid_fileExists()) {
                        var kendoWindow = $("<div />").kendoWindow
                            ({
                                title: "Confirm",
                                width: "350px",
                                height: "130px",
                                resizable: false,
                                modal: true
                            });
                        kendoWindow.data("kendoWindow").content($("#fileAttach-confirmation").html()).center().open();
                        kendoWindow.find(".fileAttach-confirm,.fileAttach-cancel").click(function () {
                            if ($(this).hasClass("fileAttach-confirm")) {
                                var newver = parseInt(ver_no) + 1;
                                $("#txtVersion").val(newver);
                                Grid_save_Image();
                            }
                            else {
                                kendoAlert("File not upgraded", "Warning");
                            }
                            kendoWindow.data("kendoWindow").close();
                        })
                            .end()
                    }
                    else {
                        Grid_save_Image();
                    }
                }
                else {
                    kendoAlert("FileName cannot be blank", "Warning");
                }
            }
            else {
                Grid_updateVer_upload();
            }
        }
        else {
            kendoAlert("Document No cannot be blank", "Warning");
        }
    }
}

var ver_no = 0;
function Grid_fileExists() {
    ver_no = 0;
    var file_exists = false;
    var grid_data = $("#Grid_Attach").data("kendoGrid").dataSource.data();
    for (var i = 0; i < grid_data.length; i++) {
        if (grid_data[i].filename == grid_file_Val) {
            if (ver_no == 0) {
                ver_no = grid_data[i].file_version;
            }
            if (grid_data[i].file_version > ver_no) {
                ver_no = grid_data[i].file_version;
            }
            file_exists = true;
        }
    }
    return file_exists;
}

function Grid_save_Image() {
    try {
        var xhr = new XMLHttpRequest();
        var fd = new FormData();
        fd.append("file", document.getElementById('file').files[0]);
        fd.append("txtDocno", $("#txtDocno").val());
        fd.append("txtVersion", $("#txtVersion").val());
        var Save_FileName = document.getElementById('file').files[0].name;
        xhr.open("POST", "/FileAttachment/file_load/", true);
        xhr.send(fd);
        xhr.addEventListener("load", function (event) {
            var file_result = JSON.parse(this.responseText);
            var file_path = JSON.parse(this.responseText).path;
            $("#txtfilepath").val(file_path);
            if (file_result.success == true) {
                Grid_updateVer_upload();
            }
            else {
                kendoAlert(file_result.msg);
            }

        }, false);
    }
    catch (error) {
        alert(error);
    }
}


function Grid_updateVer_upload() {
    var header_data = {};
    var detail_data = {};
    header_data.doc_type = $("#txtDocName").val();
    header_data.doc_number = $("#txtDocno").val();
    if ($("#txtseqno").val() == "") {
        detail_data.seq_No = "0"
    }
    else {
        detail_data.seq_No = $("#txtseqno").val();
    }
    detail_data.filename = $("#txtfilename").val(); //+ "_" + $("#txtDocumentNo").val();
    detail_data.file_version = $("#txtVersion").val();
    detail_data.attach_group = $("#cmb_grid_group").data("kendoComboBox").value();
    detail_data.attach_subgroup = $("#cmb_grid_subgroup").data("kendoComboBox").value();
    detail_data.attach_note = $("#txtnotes").val();
    detail_data.file_size = $("#txtSize").val();
    detail_data.file_path = $("#txtfilepath").val();
    detail_data.mode_flag = $("#txtmodeflag").val();
    var arr = [];
    arr.push(detail_data);
    var data = {};
    data.context = context();
    data.context.Header = header_data;
    data.context.Detail = arr;
    var sRequest = weburl + '/server/DocAttachment/save_docattachment.ashx';
    var sData = executeService(sRequest, data);
    var responseJSON = JSON.parse(sData);
    if (responseJSON.update == "successful") {
        if ($("#txtmodeflag").val() == "I" || $("#txtmodeflag").val() == "U") {
            kendoAlert('Doc Attachment Saved Successfully..');
        }
        else if ($("#txtmodeflag").val() == "D") {
            kendoAlert('Doc Attachment Deleted Successfully..');
        }
        fetch_DocAttach_details($("#txtDocName").val(), $("#txtDocno").val())
        Grid_btn_new();
    }
    else {
        kendoAlert(responseJSON.error);
    }
}

//function Grid_updateVer_upload() {
//    var save_data = {};
//    save_data.formval = form_Serialize("form2");
//    var save_details = ajaxcall_param('/FileAttachment/Grid_iud_doc_attachment', JSON.stringify(save_data));
//    var Doc_detail = JSON.parse(save_details);
//    if (Doc_detail.success == true) {
//        kendoAlert(Doc_detail.msg);
//        fetch_DocAttach_details($("#txtDocName").val(), $("#txtDocno").val());
//        $("#txtVersion").val("1");
//        Grid_btn_new();
//    }
//    else {
//        kendoAlert(Doc_detail.msg);
//    }
//}


function Grid_btn_download() {
    try {
        var gridattach = $("#Grid_Attach").data("kendoGrid");
        var selectedItem = gridattach.dataItem(gridattach.select());
        if ($("#txtseqno").val() != "0") {
            if ($("#txtfilename").val() != "") {
                if (selectedItem != null) {
                    Grid_download_fun(grid_download_fileName);
                }
                else {
                    kendoAlert("Please select a file to download", "Message");
                }
            }
            else {
                kendoAlert("FileName cannot be blank", "Message");
            }
        }
        else {
            kendoAlert("Please select a file to download", "Message");
        }
    }
    catch (err) {
        alert(err);
    }
}

function Grid_btn_view() {
    try {
        if ($("#txtseqno").val() != "0" && $("#txtfilename").val() != "") {
            window.open(doc_url_path, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=100, bottom = 300, left=400, width=850, height=600");
        }
        else {
            kendoAlert("Please select a file", "Message");
        }
    }
    catch (err) {
        alert(err);
    }
}


function Grid_btn_remove() {
    var gridattach = $("#Grid_Attach").data("kendoGrid");
    var selectedItem = gridattach.dataItem(gridattach.select());
    if ($("#txtseqno").val() != "0") {
        if ($("#txtfilename").val() != "") {
            if (selectedItem != null) {
                var kendoWindow = $("<div />").kendoWindow
                    ({
                        title: "Confirm",
                        width: "350px",
                        height: "130px",
                        resizable: false,
                        modal: true
                    });
                kendoWindow.data("kendoWindow")
                    .content($("#selectfile-confirmation").html())
                    .center().open();
                kendoWindow
                    .find(".selectfile-confirm,.selectfile-cancel")
                    .click(function () {
                        if ($(this).hasClass("selectfile-confirm")) {
                            $("#txtmodeflag").val("D");
                            var remove_file = selectedItem.file_path;
                            //$("#txtfilepath").val(remove_file);
                            //save_Image();
                            Grid_updateVer_upload();
                        }
                        else {
                            // updateVer_upload();
                            kendoWindow.data("kendoWindow").close();
                        }

                        kendoWindow.data("kendoWindow").close();
                    })
                    .end()
            }

            else {
                kendoAlert("Please select a file to Remove", "Message");
            }
        }
        else {
            kendoAlert("FileName cannot be blank", "Message");
        }
    }
    else {
        kendoAlert("Please select a file to Remove", "Message");
    }
}

function Attach_Grid(Attach_data) {
    $("#Grid_Attach").kendoGrid({
        dataSource: {
            data: Attach_data,
            //pageSize: 20
        },
        height: 200,
        selectable: true,
        scrollable: true,
        change: onChange,
        // groupable: true,
        columns: [
            {
                field: "seq_No",
                title: "Seq No",
                hidden: true,

            },
            {
                field: "attach_group",
                title: "Group",
                width: 120,
                hidden: true,
            },
            {
                field: "attach_subgroup",
                title: "Sub Group",
                width: 120,
                hidden: true,
            },
            {
                field: "attach_group_desc",
                title: "Group",
                width: 120,
            },
            {
                field: "attach_subgroup_desc",
                title: "Sub Group",
                width: 120,
            },
            {
                field: "filename",
                title: "File Name",
                width: 100
            },
            {
                field: "file_version",
                title: "Version",
                width: 50
            },
            {
                field: "mode_flag",
                title: "mode_flag",
                hidden: true,
            }
        ]
    });

}

function onChange(e) {
    var grid_cont = $("#Grid_Attach").data("kendoGrid");
    var selectedItem = grid_cont.dataItem(grid_cont.select());
    var grp = selectedItem.attach_group_desc;
    var subgrp = selectedItem.attach_subgroup_desc;
    var notes = selectedItem.attach_note;
    $("#cmb_grid_group").data("kendoComboBox").value(grp);
    $("#cmb_grid_subgroup").data("kendoComboBox").value(subgrp);
    $("#cmb_grid_group").data("kendoComboBox").enable(false);
    $("#cmb_grid_subgroup").data("kendoComboBox").enable(false);
    if (selectedItem.mode_flag == "X")
    {
        //$("#btnGNew").prop("disabled", true);
        $("#btnGUpload").prop("disabled", true);
        $("#btnGRemove").prop("disabled", true);
    }
    else {
        //$("#btnGNew").prop("disabled", false);
        $("#btnGUpload").prop("disabled", false);
        $("#btnGRemove").prop("disabled", false);
    }

    $("#txtnotes").val(notes);
    $("#txtVersion").val(selectedItem.file_version);
    $("#txtfilename").val(selectedItem.filename);
    $("#txtSize").val(selectedItem.file_size);
    $("#txtseqno").val(selectedItem.seq_No);
    $("#txtfilepath").val(selectedItem.file_path);
    $("#txtVersion").prop("readonly", true);
    $("#txtfilename").prop("readonly", true);
    $("#txtSize").prop("readonly", true);
    $("#file").prop("disabled", true);
    grid_download_fileName = selectedItem.file_path;
    var dn_fil = selectedItem.file_path;
    var dn_file_split = dn_fil.split("\\");
    var file_len = dn_file_split.length - 1;
    var file = dn_file_split[file_len];
    var fname = file.split(".");
    if (fname[1] == 'pdf' || fname[1] == 'jpg' || fname[1] == 'png') {
        doc_url_path = docUrl + file;
    } else {
        doc_url_path = 'https://docs.google.com/viewer?embedded=true&url=' + docUrl + file;
    }
    $("#txtmodeflag").val("U");
}

var file_data = [];

function fetch_DocAttach_details(DocType, DocNo) {
    try {
        var OrgId = 'SCS';
        var LocnId = 'chn';
        var User = 'admin';
        var doc_type = DocType;
        var doc_number = DocNo;
        var sRequest = weburl + '/server/DocAttachment/fetch_docattachment.ashx?org=' + OrgId + '&locn=' + LocnId + '&user=' + User + '&lang=en_us&doc_type=' + doc_type + '&doc_number=' + doc_number + '';
        var s = executeService(sRequest);
        var responseJSON = JSON.parse(s);
        if (responseJSON.update == "successful") {
            generateGrid_Attach(responseJSON);
            $('#Grid_Attach .k-grid-content').css('height', "170px");
        }
        else {
            Attach_Grid([]);
        }
    }
    catch (err) {
        kendoAlert(err);
    }
}

function generateGrid_Attach(res) {
    try {
        if (res.data.context.Detail.length != 0) {
            var data = changedataType(res.data.context.Detail);
            //if (DocType == "RFQ_HDR" || DocType == "RFQ_DTL")
            //{
            //        var grid_data = [];                        
            //                $.each(data, function (skey, svalue) {
            //                    if ((data[skey].mode_flag == "S")) {
            //                        grid_data.push(data[skey]);
            //                    }
            //                });
                       
            //            Attach_Grid(grid_data);                    
            //}
            //else {
                Attach_Grid(data);
           // }
           
        }
        else {
            Attach_Grid([]);
        }
    }
    catch (err) {
        kendoAlert(err);
    }
}

function Grid_download_fun(fileName) {
    var data_download_details = {};
    data_download_details.dn_file_name = fileName;
    var get_Down_detail = ajaxcall_param("/FileAttachment/file_download", JSON.stringify(data_download_details));
    download_data = JSON.parse(get_Down_detail);
    if (download_data == true) {
        var dn_fil = fileName;
        var dn_file_split = dn_fil.split("\\");
        var file_len = dn_file_split.length - 1;
        var file_path = dn_file_split[file_len];
        var fullpath = window.location.href;
        var rPath = window.location.pathname;
        var spt = fullpath.split(rPath);
        fileName = spt[0] + "/ws/Documents/" + file_path;
        // alert(fileName);

        var a = $("<a>").attr("href", fileName).attr("download", file_path).appendTo("body");
        a[0].click();
        a.remove();
    }
    else {
        kendoAlert("Could not find the File Path", "Warnning");
    }
}