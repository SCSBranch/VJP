var DocType = "";
var msg_success = "";
var document_no = "";
/*--------------------------------------------------------------------  File Attachment - Document Ready  -------------------------------------------------------------------------------------------*/
var group = "";
$(document).ready(function () {
    $("#frm_attachment").on('hidden.bs.modal', function () {
        $(this).data('bs.modal', null);

    });

    $('#frm_attachment').on('loaded.bs.modal', function (e) {
        $('.form-group .k-invalid-msg').remove();
        gridAttach([]);
        var attach_data = fetch_attach_screen_master('ATTACHMENT', 'ATTCH_GRP');
        var sattach_data = fetch_attach_screen_master('ATTACHMENT', 'ATTCH_SGRP');

        if (getlocalStorage('btn_clk_val') == "View") {
            $("#btnHUpload").css("pointer-events", "none");
            $("#btnHUpload").css("opacity", "0.3");
            $("#btnHUpload").attr("disabled", "disabled");

            $("#btnHNew").css("pointer-events", "none");
            $("#btnHNew").css("opacity", "0.3");
            $("#btnHNew").attr("disabled", "disabled");

            $("#btnHRemove").css("pointer-events", "none");
            $("#btnHRemove").css("opacity", "0.3");
            $("#btnHRemove").attr("disabled", "disabled");
        }

        if ($("#lblFormTitle").text() == "User Details") {
            document_no = $("#txtUserId").val();
            $("#txtDocumentNo").val(document_no);
            DocType = Screen_Id;
            $("#file_attach_title").text(hdrtitle + " - Document Upload");
            filter_combobox("cmbHeadgroup", attach_data);
            filter_combobox("cmbHeadsubgroup", sattach_data);
        }
        if ($("#lblFormTitle").text() == "Role Form") {
            document_no = $("#txtRoleid").val();
            $("#txtDocumentNo").val(document_no);
            DocType = Screen_Id;
            $("#file_attach_title").text(hdrtitle + " - Document Upload");
            filter_combobox("cmbHeadgroup", attach_data);
            filter_combobox("cmbHeadsubgroup", sattach_data);
        }
        if ($("#lblFormTitle").text() == "Document Setup") {
            document_no = $('#cmbType').data("kendoComboBox").value();
            $("#txtDocumentNo").val(document_no);
            DocType = Screen_Id;
            $("#file_attach_title").text(hdrtitle + " - Document Upload");
            filter_combobox("cmbHeadgroup", attach_data);
            filter_combobox("cmbHeadsubgroup", sattach_data);
        }
        if ($("#lblFormTitle").text() == "Downloadable Templates") {
            document_no = $('#cmbMenuID').data("kendoComboBox").value();
            $("#txtDocumentNo").val(document_no);
            DocType = Screen_Id;
            $("#file_attach_title").text(hdrtitle + " - Document Upload");
            filter_combobox("cmbHeadgroup", attach_data);
            filter_combobox("cmbHeadsubgroup", sattach_data);
        }
        if ($("#lblFormTitle").text() == "E Template") {
            document_no = $('#cmbBasedon').data("kendoComboBox").value();
            $("#txtDocumentNo").val(document_no);
            DocType = Screen_Id;
            $("#file_attach_title").text(hdrtitle + " - Document Upload");
            filter_combobox("cmbHeadgroup", attach_data);
            filter_combobox("cmbHeadsubgroup", sattach_data);
        }
        if ($("#lblFormTitle").text() == "POSP Profile" || $("#lblFormTitle").text() == "POSP - My Profile") {
            $("#div_docno").hide();
            $("#div_docname").show();
            $("#cmbHeadgroup").empty()
            $("#cmbHeadsubgroup").empty()
            document_no = $("#txtPPid").val();
            $("#txtDocumentNo").val(document_no);
            filter_combobox("cmbDocumentName", group);
            filter_combobox("cmbHeadgroup", group);
            var active = $(".tab-pane.active").attr("id");
            if (active == "frmContact") {
                var s_data = fetch_attach_screen_master('UPLOAD', 'POSP_ADR_PROOF');
                filter_combobox("cmbDocumentName", s_data);
                filter_combobox("cmbHeadgroup", s_data);
                $("#cmbDocumentName").data("kendoComboBox").value('ADDR_DOC');
                $("#cmbHeadgroup").data("kendoComboBox").value('ADDR_DOC');
                var s_data = fetch_attach_screen_master('UPLOAD', 'ADDR_PROOF');
                filter_combobox("cmbHeadsubgroup", s_data);
                DocType = "POSP_ADR_PROOF";
            }
            if (active == "frmBank") {
                var s_data = fetch_attach_screen_master('UPLOAD', 'POSP_BANK_PROOF');
                filter_combobox("cmbDocumentName", s_data);
                filter_combobox("cmbHeadgroup", s_data);
                $("#cmbDocumentName").data("kendoComboBox").value('BANK_PROOF')
                $("#cmbHeadgroup").data("kendoComboBox").value('BANK_PROOF')
                var s_data = fetch_attach_screen_master('UPLOAD', 'BANK_DOC');
                filter_combobox("cmbHeadsubgroup", s_data);
                DocType = "POSP_BANK_PROOF";
            }
            if (active == "frmKYC") {
                var s_data = fetch_attach_screen_master('UPLOAD', 'PAGE_AADHAR');
                filter_combobox("cmbHeadsubgroup", s_data);
                if (TypeDoc == "upPan") {
                    var s_data = fetch_attach_screen_master('UPLOAD', 'PAN_CARD');
                    filter_combobox("cmbDocumentName", s_data);
                    filter_combobox("cmbHeadgroup", s_data);
                    $("#cmbDocumentName").data("kendoComboBox").value('PAN_DOC')
                    $("#cmbHeadgroup").data("kendoComboBox").value('PAN_DOC')
                    $("#cmbHeadsubgroup").data("kendoComboBox").value('FIRST')
                    DocType = "PAN_CARD";
                }
                else if (TypeDoc == "upGSTCert") {
                    var s_data = fetch_attach_screen_master('UPLOAD', 'GST_CER');
                    filter_combobox("cmbDocumentName", s_data);
                    filter_combobox("cmbHeadgroup", s_data);
                    $("#cmbDocumentName").data("kendoComboBox").value('GST_DOC')
                    $("#cmbHeadgroup").data("kendoComboBox").value('GST_DOC')
                    $("#cmbHeadsubgroup").data("kendoComboBox").value('FIRST')
                    DocType = "GST_CER";
                }
                else if (TypeDoc == "upAadhar") {
                    var s_data = fetch_attach_screen_master('UPLOAD', 'AADHAR_CARD');
                    filter_combobox("cmbDocumentName", s_data);
                    filter_combobox("cmbHeadgroup", s_data);
                    $("#cmbDocumentName").data("kendoComboBox").value('AADHAR_DOC')
                    $("#cmbHeadgroup").data("kendoComboBox").value('AADHAR_DOC')
                    $("#cmbHeadsubgroup").data("kendoComboBox").value('FIRST')
                    DocType = "AADHAR_CARD";
                }
                $("#cmbHeadsubgroup").data("kendoComboBox").enable(false)
                if (TypeDoc == "upAadhar") {
                    $("#cmbHeadsubgroup").data("kendoComboBox").enable(true)
                }
            }
            if (active == "frmCertification") {
                var s_data = fetch_attach_screen_master('UPLOAD', 'PAGE_AADHAR');
                filter_combobox("cmbHeadsubgroup", s_data);
                if (TypeDoc == "upPosp") {
                    var s_data = fetch_attach_screen_master('UPLOAD', 'POSP_CER');
                    filter_combobox("cmbDocumentName", s_data);
                    filter_combobox("cmbHeadgroup", s_data);

                    $("#cmbDocumentName").data("kendoComboBox").value('POSP_DOC')
                    $("#cmbHeadgroup").data("kendoComboBox").value('POSP_DOC')
                    $("#cmbHeadsubgroup").data("kendoComboBox").value('FIRST')
                    $("#cmbHeadsubgroup").data("kendoComboBox").enable(false)
                    DocType = "POSP_CER";
                }
                else if (TypeDoc == "upNoc") {
                    var s_data = fetch_attach_screen_master('UPLOAD', 'NOC_CER');
                    filter_combobox("cmbDocumentName", s_data);
                    filter_combobox("cmbHeadgroup", s_data);
                    $("#cmbDocumentName").data("kendoComboBox").value('NOC_DOC')
                    $("#cmbHeadgroup").data("kendoComboBox").value('NOC_DOC')
                    $("#cmbHeadsubgroup").data("kendoComboBox").value('FIRST')
                    $("#cmbHeadsubgroup").data("kendoComboBox").enable(false)
                    DocType = "NOC_CER";
                }
            }
            $("#cmbHeadgroup").data("kendoComboBox").enable(false);
            // DocType = $("#cmbDocumentName").data("kendoComboBox").value();
        }

        if ($("#lblFormTitle").text() == "Employee Profile Details" || $("#lblFormTitle").text() == "Employee My Profile Details") {
            $("#div_docno").hide();
            $("#div_docname").show();
            $("#cmbHeadgroup").empty()
            $("#cmbHeadsubgroup").empty()
            document_no = $("#txtPPid").val();
            $("#txtDocumentNo").val(document_no);
            filter_combobox("cmbDocumentName", group);
            filter_combobox("cmbHeadgroup", group);
            var active = $(".tab-pane.active").attr("id");
            if (active == "frmContact") {
                var s_data = fetch_attach_screen_master('UPLOAD', 'POSP_ADR_PROOF');
                filter_combobox("cmbDocumentName", s_data);
                filter_combobox("cmbHeadgroup", s_data);
                $("#cmbDocumentName").data("kendoComboBox").value('ADDR_DOC');
                $("#cmbHeadgroup").data("kendoComboBox").value('ADDR_DOC');
                var s_data = fetch_attach_screen_master('UPLOAD', 'ADDR_PROOF');
                filter_combobox("cmbHeadsubgroup", s_data);
                DocType = "POSP_ADR_PROOF";
            }
            if (active == "frmBank") {
                var s_data = fetch_attach_screen_master('UPLOAD', 'POSP_BANK_PROOF');
                filter_combobox("cmbDocumentName", s_data);
                filter_combobox("cmbHeadgroup", s_data);
                $("#cmbDocumentName").data("kendoComboBox").value('BANK_PROOF')
                $("#cmbHeadgroup").data("kendoComboBox").value('BANK_PROOF')
                var s_data = fetch_attach_screen_master('UPLOAD', 'BANK_DOC');
                filter_combobox("cmbHeadsubgroup", s_data);
                DocType = "POSP_BANK_PROOF";
            }
            if (active == "frmKYC") {
                var s_data = fetch_attach_screen_master('UPLOAD', 'PAGE_AADHAR');
                filter_combobox("cmbHeadsubgroup", s_data);
                if (TypeDoc == "upPan") {
                    var s_data = fetch_attach_screen_master('UPLOAD', 'PAN_CARD');
                    filter_combobox("cmbDocumentName", s_data);
                    filter_combobox("cmbHeadgroup", s_data);
                    $("#cmbDocumentName").data("kendoComboBox").value('PAN_DOC')
                    $("#cmbHeadgroup").data("kendoComboBox").value('PAN_DOC')
                    $("#cmbHeadsubgroup").data("kendoComboBox").value('FIRST')
                    DocType = "PAN_CARD";
                }
                else if (TypeDoc == "upGSTCert") {
                    var s_data = fetch_attach_screen_master('UPLOAD', 'GST_CER');
                    filter_combobox("cmbDocumentName", s_data);
                    filter_combobox("cmbHeadgroup", s_data);
                    $("#cmbDocumentName").data("kendoComboBox").value('GST_DOC')
                    $("#cmbHeadgroup").data("kendoComboBox").value('GST_DOC')
                    $("#cmbHeadsubgroup").data("kendoComboBox").value('FIRST')
                    DocType = "GST_CER";
                }
                else if (TypeDoc == "upAadhar") {
                    var s_data = fetch_attach_screen_master('UPLOAD', 'AADHAR_CARD');
                    filter_combobox("cmbDocumentName", s_data);
                    filter_combobox("cmbHeadgroup", s_data);
                    $("#cmbDocumentName").data("kendoComboBox").value('AADHAR_DOC')
                    $("#cmbHeadgroup").data("kendoComboBox").value('AADHAR_DOC')
                    $("#cmbHeadsubgroup").data("kendoComboBox").value('FIRST')
                    DocType = "AADHAR_CARD";
                }
                $("#cmbHeadsubgroup").data("kendoComboBox").enable(false)
                if (TypeDoc == "upAadhar") {
                    $("#cmbHeadsubgroup").data("kendoComboBox").enable(true)
                }
            }
            if (active == "frmCertification") {
                var s_data = fetch_attach_screen_master('UPLOAD', 'PAGE_AADHAR');
                filter_combobox("cmbHeadsubgroup", s_data);
                if (TypeDoc == "upPosp") {
                    var s_data = fetch_attach_screen_master('UPLOAD', 'POSP_CER');
                    filter_combobox("cmbDocumentName", s_data);
                    filter_combobox("cmbHeadgroup", s_data);

                    $("#cmbDocumentName").data("kendoComboBox").value('POSP_DOC')
                    $("#cmbHeadgroup").data("kendoComboBox").value('POSP_DOC')
                    $("#cmbHeadsubgroup").data("kendoComboBox").value('FIRST')
                    $("#cmbHeadsubgroup").data("kendoComboBox").enable(false)
                    DocType = "POSP_CER";
                }
                else if (TypeDoc == "upNoc") {
                    var s_data = fetch_attach_screen_master('UPLOAD', 'NOC_CER');
                    filter_combobox("cmbDocumentName", s_data);
                    filter_combobox("cmbHeadgroup", s_data);
                    $("#cmbDocumentName").data("kendoComboBox").value('NOC_DOC')
                    $("#cmbHeadgroup").data("kendoComboBox").value('NOC_DOC')
                    $("#cmbHeadsubgroup").data("kendoComboBox").value('FIRST')
                    $("#cmbHeadsubgroup").data("kendoComboBox").enable(false)
                    DocType = "NOC_CER";
                }
            }
            $("#cmbHeadgroup").data("kendoComboBox").enable(false);
            // DocType = $("#cmbDocumentName").data("kendoComboBox").value();
        }

        if ($("#lblFormTitle").text() == "Customer Profile Details" || $("#lblFormTitle").text() == "Customer - My Profile Details") {
            $("#div_docno").hide();
            $("#div_docname").show();
            $("#cmbHeadgroup").empty()
            $("#cmbHeadsubgroup").empty()
            document_no = $("#txtPPid").val();
            $("#txtDocumentNo").val(document_no);
            filter_combobox("cmbDocumentName", group);
            filter_combobox("cmbHeadgroup", group);
            var active = $(".tab-pane.active").attr("id");
            if (active == "frmContact") {
                var s_data = fetch_attach_screen_master('UPLOAD', 'POSP_ADR_PROOF');
                filter_combobox("cmbDocumentName", s_data);
                filter_combobox("cmbHeadgroup", s_data);
                $("#cmbDocumentName").data("kendoComboBox").value('ADDR_DOC');
                $("#cmbHeadgroup").data("kendoComboBox").value('ADDR_DOC');
                var s_data = fetch_attach_screen_master('UPLOAD', 'ADDR_PROOF');
                filter_combobox("cmbHeadsubgroup", s_data);
                DocType = "POSP_ADR_PROOF";
            }
            if (active == "frmKYC") {
                var s_data = fetch_attach_screen_master('UPLOAD', 'PAGE_AADHAR');
                filter_combobox("cmbHeadsubgroup", s_data);
                if (TypeDoc == "upPan") {
                    var s_data = fetch_attach_screen_master('UPLOAD', 'PAN_CARD');
                    filter_combobox("cmbDocumentName", s_data);
                    filter_combobox("cmbHeadgroup", s_data);
                    $("#cmbDocumentName").data("kendoComboBox").value('PAN_DOC')
                    $("#cmbHeadgroup").data("kendoComboBox").value('PAN_DOC')
                    $("#cmbHeadsubgroup").data("kendoComboBox").value('FIRST')
                    DocType = "PAN_CARD";
                }

                else if (TypeDoc == "upAadhar") {
                    var s_data = fetch_attach_screen_master('UPLOAD', 'AADHAR_CARD');
                    filter_combobox("cmbDocumentName", s_data);
                    filter_combobox("cmbHeadgroup", s_data);
                    $("#cmbDocumentName").data("kendoComboBox").value('AADHAR_DOC')
                    $("#cmbHeadgroup").data("kendoComboBox").value('AADHAR_DOC')
                    $("#cmbHeadsubgroup").data("kendoComboBox").value('FIRST')
                    DocType = "AADHAR_CARD";
                }
                $("#cmbHeadsubgroup").data("kendoComboBox").enable(false)
                if (TypeDoc == "upAadhar") {
                    $("#cmbHeadsubgroup").data("kendoComboBox").enable(true)
                }
            }
            $("#cmbHeadgroup").data("kendoComboBox").enable(false);
            // DocType = $("#cmbDocumentName").data("kendoComboBox").value();
        }

        if ($("#lblFormTitle").text() == "Health Insurance Product Form") {
            $("#div_docno").hide();
            $("#div_docname").show();
            $("#cmbHeadgroup").empty();
            $("#cmbHeadsubgroup").empty();
            document_no = $("#txtProRowId").val();
            $("#txtDocumentNo").val(document_no);
            filter_combobox("cmbDocumentName", group);
            filter_combobox("cmbHeadgroup", group);

            var active = $(".tab-pane.active").attr("id");
            if (active == "frmPolicy") {
                if (TypeDoc == "upBro") {
                    DocType = 'BROCHURE';
                    $("#cmbDocumentName").data("kendoComboBox").value('BROCHURE');
                    $("#file_attach_title").text(hdrtitle + " - Document Upload");
                    filter_combobox("cmbHeadgroup", attach_data);
                    $("#cmbHeadgroup").data("kendoComboBox").value('AD_ATTACH');
                    filter_combobox("cmbHeadsubgroup", sattach_data);
                }

                if (TypeDoc == "upPro") {
                    DocType = "PROSPECTUS";
                    $("#cmbDocumentName").data("kendoComboBox").value('PROSPECTUS');
                    $("#file_attach_title").text(hdrtitle + " - Document Upload");
                    filter_combobox("cmbHeadgroup", attach_data);
                    $("#cmbHeadgroup").data("kendoComboBox").value('AD_ATTACH');
                    filter_combobox("cmbHeadsubgroup", sattach_data);
                }
            }
            $("#cmbHeadgroup").data("kendoComboBox").enable(false);
            // DocType = $("#cmbDocumentName").data("kendoComboBox").value();
        }



        fetch_Head_DocAttach_details(DocType, $("#txtDocumentNo").val());
        $("#txtheadVersion").val("1");
        $("#txtheadseqno").val("0");
        $("#txtheadMode").val("I");
        $("#txtUploadType").val(DocType);

        // screen_lang_data("ATTACH", "tn_in");
        //grid_tooltip("gridAttach");
        //show_tooltip();
        $('[data-toggle="tab"]').tooltip();
        $("#gridAttach .k-grid-content").css("height", "160px");
    });
    docUrl = '@System.Configuration.ConfigurationManager.AppSettings["docUrl"]';

});


function fetch_attach_screen_master(screen_id, master) {
    var list = [];
    if (screen_id != "") {
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
    }
    return list
}

/*--------------------------------------------------------------------  File Attachment - Grid Details  -------------------------------------------------------------------------------------------*/

function gridAttach(Attach_data) {
    $("#gridAttach").kendoGrid({
        dataSource: {
            data: Attach_data,
        },
        //height: 178,
        selectable: true,
        scrollable: false,
        change: Head_onChange,
        columns: [
            {
                field: "seq_No",
                title: "Seq No",
                hidden: true,
            },
            {
                field: "attach_group",
                title: "Group Code",
                width: 120,
                hidden: true
            },
            {
                field: "attach_subgroup",
                title: "Sub Group Code",
                width: 120,
                hidden: true
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

/*--------------------------------------------------------------------  File Attachment - Fetch Grid Details  -------------------------------------------------------------------------------------------*/

function fetch_Head_DocAttach_details(DocType, DocNo) {
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
            generateDoc_Attach(responseJSON);
        }
        else {
            gridAttach([]);
        }
    }
    catch (err) {
        kendoAlert(err);
    }
}

function generateDoc_Attach(res) {
    try {
        if (res.data.context.Detail != null) {
            var data = changedataType(res.data.context.Detail);
            gridAttach(data);
        }
        else {
            gridAttach([]);
        }
    }
    catch (err) {
        kendoAlert(err);
    }
}

/*--------------------------------------------------------------------  File Attachment - Grid Onchange Details  -------------------------------------------------------------------------------------------*/

function Head_onChange(e) {
    var grid_cont = $("#gridAttach").data("kendoGrid");
    var selectedItem = grid_cont.dataItem(grid_cont.select());
    var grp = selectedItem.attach_group;
    var subgrp = selectedItem.attach_subgroup;
    var notes = selectedItem.attach_note;
    $("#cmbHeadgroup").data("kendoComboBox").value(grp);
    $("#cmbHeadsubgroup").data("kendoComboBox").value(subgrp);
    $("#cmbHeadgroup").data("kendoComboBox").enable(false);
    $("#cmbHeadsubgroup").data("kendoComboBox").enable(false);
    $("#txtheadnotes").val(notes);
    $("#txtheadVersion").val(selectedItem.file_version);
    $("#txtheadfilename").val(selectedItem.filename);
    $("#txtheadSize").val(selectedItem.file_size);
    $("#txtheadseqno").val(selectedItem.seq_No);
    $("#txtheadfilepath").val(selectedItem.file_path);
    $("#txtheadVersion").prop("readonly", true);
    $("#txtheadfilename").prop("readonly", true);
    $("#txtheadSize").prop("readonly", true);
    $("#head_file").prop("disabled", true);
    $("#btn_down1").prop("disabled", true);
    head_download_fileName = selectedItem.file_path;
    var dn_fil = selectedItem.file_path;
    var dn_file_split = dn_fil.split("\\");
    var file_len = dn_file_split.length - 1;
    var file = dn_file_split[file_len];
    var fname = file.split(".");
    // docUrl = "D:\\Manimozhi\\Policy-Parivaar-03-05-2021\\PolicyParivaar\\PolicyParivaar\\ws\\Documents\\";
    //docUrl = '';
    if (fname[1] == 'pdf' || fname[1] == 'jpg' || fname[1] == 'png') {
        doc_url_path = docUrl + file;
    } else {
        doc_url_path = 'https://docs.google.com/viewer?embedded=true&url=' + docUrl + file;
    }
    $("#txtheadMode").val("U");
}

/*--------------------------------------------------------------------  File Attachment - Choose file  -------------------------------------------------------------------------------------------*/

function file_attach_close() {
    $('#frm_attachment').modal('toggle');
}

var head_file_Val = "";
var head_file_Size = "";
var head_download_fileName = "";
var head_dn_file_name = "";
$("#head_file").change(function () {
    headreadURL(this);
});

function headreadURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
    }
}

function BrowseTemplateFile1() {
    try {
        $("#head_file").attr("accept", ".pdf,.xlsx,.jpg");
        $("#head_file").click();
    }
    catch (err) {
        javascript_log4j_root(arguments.callee.name, err);
    }
}

function Head_save_file() {
    try {
        document.getElementById('head_file').files[0];
        head_file_Val = document.getElementById('head_file').files[0].name;
        head_file_Size = document.getElementById('head_file').files[0].size;
        $("#txtheadfilename").val(head_file_Val);
        $("#txtheadVersion").val("1");
        var fileupload_size = Head_bytesToSize(head_file_Size);
        $("#txtheadSize").val(fileupload_size);
        if (head_file_Size > 5242880) {
            kendoAlert("File length cannot exceed 5 MB", "Warnning");
            $("#txtheadSize").val("");
            $("#txtheadfilename").val("");
        }
    }
    catch (error) {
        alert(error)
    }
}

/*--------------------------------------------------------------------  File Attachment - Save file  -------------------------------------------------------------------------------------------*/

function Head_bytesToSize(bytes) {
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

var ver_hno = 0;
function Head_fileExists() {
    ver_hno = 0;
    var file_exists = false;
    var grid_data = $("#gridAttach").data("kendoGrid").dataSource.data();
    for (var i = 0; i < grid_data.length; i++) {
        if (grid_data[i].filename == head_file_Val) {
            if (ver_hno == 0) {
                ver_hno = grid_data[i].file_version;
            }
            if (grid_data[i].file_version > ver_hno) {
                ver_hno = grid_data[i].file_version;
            }
            file_exists = true;
        }
    }
    return file_exists;
}

function Head_save_Image() {
    try {
        var xhr = new XMLHttpRequest();
        var fd = new FormData();
        fd.append("file", document.getElementById('head_file').files[0]);
        fd.append("txtDocno", $("#txtDocumentNo").val());
        fd.append("txtVersion", $("#txtheadVersion").val());
        var Save_FileName = document.getElementById('head_file').files[0].name;
        xhr.open("POST", "/FileAttachment/file_load/", true);
        xhr.send(fd);
        xhr.addEventListener("load", function (event) {
            var file_result = JSON.parse(this.responseText);
            var file_path = JSON.parse(this.responseText).path;
            $("#txtheadfilepath").val(file_path);
            if (file_result.success == true) {
                Head_updateVer_upload();
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

/*--------------------------------------------------------------------  File Attachment - New Button click  -------------------------------------------------------------------------------------------*/

function Head_btn_new() {
    $("#txtheadfilename").val("");
    $("#txtheadSize").val("");
    $("#txtheadnotes").val("");
    //$("#cmbHeadgroup").data("kendoComboBox").value("");
    //$("#cmbHeadsubgroup").data("kendoComboBox").value("");
    $("#txtheadVersion").val("1");
    $("#txtheadseqno").val("0");
    $("#txtheadMode").val("I");
    document.getElementById('head_file').value = "";
    $("#head_file").prop("disabled", false);
    $("#btn_down1").prop("disabled", false);
    //$("#cmbHeadgroup").data("kendoComboBox").enable(true);
    $("#cmbHeadsubgroup").data("kendoComboBox").enable(true);
    if (TypeDoc == "upPan" || TypeDoc == "upGSTCert" || TypeDoc == "upPosp" || TypeDoc == "upNoc") {
        $("#cmbHeadsubgroup").data("kendoComboBox").enable(false);
    }
    doc_url_path = '';
}

/*--------------------------------------------------------------------  File Attachment - Upload button click  -------------------------------------------------------------------------------------------*/

function Head_btn_upload() {
    var validatable = $("#file_attachment").kendoValidator().data("kendoValidator");
    if (validatable.validate()) {
        if ($("#txtDocumentNo").val() != "") {
            if ($("#txtheadseqno").val() == "0") {
                if ($("#txtheadfilename").val() != "") {
                    if (Head_fileExists()) {
                        var kendoWindow = $("<div />").kendoWindow
                            ({
                                title: "Confirm",
                                width: "400px",
                                height: "150px",
                                resizable: false,
                                modal: true
                            });
                        kendoWindow.data("kendoWindow").content($("#Head-fileAttach-confirmation").html()).center().open();
                        kendoWindow.find(".fileAttach-confirm,.fileAttach-cancel").click(function () {
                            if ($(this).hasClass("fileAttach-confirm")) {
                                var newver = parseInt(ver_hno) + 1;
                                $("#txtheadVersion").val(newver);
                                Head_save_Image();
                            }
                            else {
                                kendoAlert("File not upgraded", "Warning");
                            }
                            kendoWindow.data("kendoWindow").close();
                        })
                            .end()
                    }
                    else {
                        Head_save_Image();
                    }
                }
                else {
                    kendoAlert("FileName cannot be blank", "Warning");
                }
            }
            else {
                Head_updateVer_upload();
            }
        }
        else {
            kendoAlert("Document No cannot be blank", "Warning");
        }
    }
}

function Head_updateVer_upload() {
    var header_data = {};
    var detail_data = {};
    header_data.doc_type = DocType;
    header_data.doc_number = $("#txtDocumentNo").val();
    detail_data.seq_No = $("#txtheadseqno").val();
    detail_data.filename = $("#txtheadfilename").val(); //+ "_" + $("#txtDocumentNo").val();
    detail_data.file_version = $("#txtheadVersion").val();
    detail_data.attach_group = $("#cmbHeadgroup").data("kendoComboBox").value();
    detail_data.attach_subgroup = $("#cmbHeadsubgroup").data("kendoComboBox").value();
    detail_data.attach_note = $("#txtheadnotes").val();
    detail_data.file_size = $("#txtheadSize").val();
    detail_data.file_path = $("#txtheadfilepath").val();
    detail_data.mode_flag = $("#txtheadMode").val();
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
        if ($("#txtheadMode").val() == "I" || $("#txtheadMode").val() == "U") {
            kendoAlert('Doc Attachment Saved Successfully..');
        }
        else if ($("#txtheadMode").val() == "D") {
            kendoAlert('Doc Attachment Deleted Successfully..');
        }
        fetch_Head_DocAttach_details(DocType, $("#txtDocumentNo").val());
        Head_btn_new();
    }
    else {
        kendoAlert(responseJSON.error);
    }
}


/*--------------------------------------------------------------------  File Attachment - Download button click  -------------------------------------------------------------------------------------------*/


function Head_btn_download() {
    try {
        var gridattach = $("#gridAttach").data("kendoGrid");
        var selectedItem = gridattach.dataItem(gridattach.select());
        if ($("#txtheadseqno").val() != "0") {
            if ($("#txtheadfilename").val() != "") {
                if (selectedItem != null) {
                    Head_download_fun(head_download_fileName, selectedItem.filename);
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

function Head_download_fun(fileName, name) {
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
        var a = $("<a>").attr("href", fileName).attr("download", name).appendTo("body");
        a[0].click();
        a.remove();
    }
    else {
        kendoAlert("Could not find the File Path", "Warnning");
    }
}


/*--------------------------------------------------------------------  File Attachment - Remove button click  -------------------------------------------------------------------------------------------*/

function Head_btn_remove() {
    var gridattach = $("#gridAttach").data("kendoGrid");
    var selectedItem = gridattach.dataItem(gridattach.select());
    if ($("#txtheadseqno").val() != "0") {
        if ($("#txtheadfilename").val() != "") {
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
                    .content($("#Head-selectfile-confirmation").html())
                    .center().open();
                kendoWindow
                    .find(".selectfile-confirm,.selectfile-cancel")
                    .click(function () {
                        if ($(this).hasClass("selectfile-confirm")) {
                            $("#txtheadMode").val("D");
                            var remove_file = selectedItem.file_path;
                            Head_updateVer_upload();
                        }
                        else {
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

/*--------------------------------------------------------------------  File Attachment - View button click  -------------------------------------------------------------------------------------------*/

function Head_btn_view() {
    try {
        var gridattach = $("#gridAttach").data("kendoGrid");
        var selectedItem = gridattach.dataItem(gridattach.select());
        if ($("#txtheadseqno").val() != "0") {
            if ($("#txtheadfilename").val() != "") {
                if (selectedItem != null) {
                    var dn_file = selectedItem.file_path;
                    var dn_file_split = dn_file.split("\\");
                    var file_len = dn_file_split.length - 1;
                    var file_name = dn_file_split[file_len];
                    var file_path = "../ws/Documents/" + file_name;
                    window.open(file_path, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=100, bottom = 300, left=400, width=850, height=600");
                    //window.open(file_path, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=100, bottom = 300, left=400, width=850, height=600");
                }
                else {
                    kendoAlert("Please select a file", "Message");
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
