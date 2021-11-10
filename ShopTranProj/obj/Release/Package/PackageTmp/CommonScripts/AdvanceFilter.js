
function Onshow() {
    $('#advfilterModal').modal("show");

}

function closeModel() {
    $("#advfilterModal").modal("hide");
    //$("#advfilterModal").remove();
    //$('.modal-backdrop').remove();

}

$("#btn_select").click(function (event) {
    //document.getElementById("textserarch").value = "";
    //loadfilter();
});

function oncancel_filter() {
    $('#textserarch').val('');
    closeModel();
}

var gridRowID = -1;
var grid1_inc = 0;

$(document).ready(function () {

    $('#advfilterModal').on('show.bs.modal', function (e) {

        $(this).data('modal', null);
        var data_flterid = {};
        data_flterid.filterID = fltID;
        //filter_condition = "";
        var data = {};
        data.fltercond = "";

        ajaxcall_param('/AdvancedFilter/setFilter_condition', JSON.stringify(data));

        $('#advhdr').text(hdrtitle + ' - Filter By');

        $("#textserarch").val("");

        var data = ajaxcall_param("/AdvancedFilter/filterdetails", JSON.stringify(data_flterid));
        if (data != undefined) {
            data = JSON.parse(data);
            gridFilter(data);
        }
    })

    $('#advfilterModal').on('loaded.bs.modal', function (e) {
        var data_flterid = {};
        data_flterid.filterID = fltID;
        // filter_condition = "";
        var data = {};
        data.fltercond = "";

        ajaxcall_param('/AdvancedFilter/setFilter_condition', JSON.stringify(data));
        $('#advhdr').text(hdrtitle + ' - Filter By');

        $("#textserarch").val("");
        var data = ajaxcall_param("/AdvancedFilter/filterdetails", JSON.stringify(data_flterid));
        if (data != undefined) {
            data = JSON.parse(data);
            gridFilter(data);
        }

    });
});


function gridFilter(data) {
    gridRowID = -1;
    grid1_inc = 0;
    var grid = $("#gridFilter").kendoGrid({


        dataSource: {
            data: data,
        },
        columns: [{
            field: "coldesc",
            title: "Field",
            width: 100,
        },
        {
            field: "colname",
            title: "columname",
            width: 100,
            hidden: true
        },
        {
            field: "datatype",
            title: "Datatye",
            width: 100,
            hidden: true
        },
        {
            field: "mstcode",
            title: "Mastercode",
            hidden: true,

            width: 100,
        },
        {
            field: "defcondt",
            title: "Condition",
            template: '#=Adv_DropDownEditor(defcondt)#',
            width: 100,
        },

        {
            field: "defval",
            title: "Value",
            width: 100,
            template: '#=templatefields(datatype,mstcode)#',
            //change: btnsearc(data)
        }
        ],



    }).data("kendoGrid");



}



function Adv_DropDownEditor(defcondt) {
    var list = '<select id="cmblist_' + grid1_inc + '"  class="form-control"  onchange="setCondition(this)" style="width:60%; height:15px" />';
    list += (defcondt == "=") ? '<option value="=" selected>=</option>' : '<option value="=">=</option>';
    list += (defcondt == "like") ? '<option value="like" selected>like</option>' : '<option value="like">like</option>';
    list += (defcondt == ">") ? '<option value=">" selected>></option>' : '<option value=">">></option>';
    list += (defcondt == "!=") ? '<option value="!=" selected>!=</option>' : '<option value="!=">!=</option>';
    list += '</select>';

    //$("#" + "cmblist_" + grid1_inc).val(defcondt);
    grid1_inc++;
    return list;
}



function templatefields(fld_type, mstcode) {

    if (fld_type == "S") {
        gridRowID++;
        return '<input id="txtString_' + gridRowID + '" type="text" class="form-control pull-left" onchange="setValue(this)" style="width:74%; height:15px">';
    }
    else if (fld_type == "D") {
        gridRowID++;
        return '<input id="txtDate_' + gridRowID + '" type="Date" class="form-control pull-left" onchange="setValue(this)" style="width:74%; height:15px">';
    }
    else if (fld_type == "N") {
        gridRowID++;
        return '<input id="txtInt_' + gridRowID + '" type="number" onchange="setValue(this)" class="form-control pull-left" style="width:74%; height:15px">';
    }
    else if (fld_type == "Q") {
        gridRowID++;

        //var cmblist = JSON.parse(load_mastercodes(mstcode));
      //  var cmblist = fetch_screen_master(screen_id, mstcode);
        var cmblist = load_dropdown_list(screen_id, mstcode);

        var list = '<select id="cmb_' + gridRowID + '"  class="form-control"  onchange="setValue(this)" style="width:74%; height:15px" />';
        list += '<option value=""></option>';
        $.each(cmblist, function (key, value) {
            if (value != null) {
                list += '<option value=' + value.code + '>' + value.desc + '</option>';
            }
        });
        list += '</select>';
        return list;
    }
}

function load_mastercodes(mstcode) {

    var data = {};
    data.mstcode = mstcode;
    var mst_Dt = ajaxcall_param('/Home/getcode', JSON.stringify(data));
    return mst_Dt;
}

function setCondition(evt) {
    var id_val = $("#" + evt.id).val();
    var str = "";
    var data = $("#gridFilter").data("kendoGrid").dataSource.data();
    var spt = evt.id.split("_");
    var rowId = parseInt(spt[1]);

    data[rowId].defcondt = id_val;

    for (var i = 0; i < data.length; i++) {

        if (data[i].defVal != null && data[i].defVal != "") {
            if (i > 0 && str.length != 0)
                str += " and ";

            if (data[i].datatype == 'Q')
                str += data[i].coldesc + " " + data[i].defcondt + " '" + data[i].defVal + "'";

            else if (data[i].datatype == 'D') {
                // str += data[i].coldesc + " " + data[i].defcondt + " '" + data[i].defVal + "'";
                var date_value = data[i].defVal;
                var split_date = date_value.split("-");
                var Splited_Datevalue = split_date[2] + "/" + split_date[1] + "/" + split_date[0];
                str += data[i].coldesc + " " + data[i].defcondt + " '" + Splited_Datevalue + "'";
            }
            else if (data[i].datatype == 'N')
                str += data[i].coldesc + " " + data[i].defcondt + " " + data[i].defVal;

            else if (data[i].datatype == "S") {
                if (data[i].defcondt == 'like')
                    str += data[i].coldesc + " " + data[i].defcondt + " '%" + data[i].defVal + "%'";
                else
                    str += data[i].coldesc + " " + data[i].defcondt + " '" + data[i].defVal + "'";
            }
        }
    }
    document.getElementById("textserarch").value = str;

}

function setValue(evt) {
    var id_val = $("#" + evt.id).val();
    var str = "";
    var data = $("#gridFilter").data("kendoGrid").dataSource.data();
    var spt = evt.id.split("_");
    var rowId = parseInt(spt[1]);

    data[rowId].defVal = id_val;

    for (var i = 0; i < data.length; i++) {

        if (data[i].defVal != null && data[i].defVal != "") {
            if (i > 0 && str.length != 0)
                str += " and ";

            if (data[i].datatype == 'Q')
                str += data[i].coldesc + " " + data[i].defcondt + " '" + $("#" + "cmb_" + i + " option:selected").text() + "'";
            //str += data[i].coldesc + " " + data[i].defcondt + " '" + data[i].defVal + "'";

            else if (data[i].datatype == 'D') {
                //str += data[i].coldesc + " " + data[i].defcondt + " '" + data[i].defVal + "'";
                var date_value = data[i].defVal;
                var split_date = date_value.split("-");
                var Splited_Datevalue = split_date[2] + "/" + split_date[1] + "/" + split_date[0];
                str += data[i].coldesc + " " + data[i].defcondt + " '" + Splited_Datevalue + "'";
            }
            else if (data[i].datatype == 'N')
                str += data[i].coldesc + " " + data[i].defcondt + " " + data[i].defVal;

            else if (data[i].datatype == "S") {
                if (data[i].defcondt == 'like')
                    str += data[i].coldesc + " " + data[i].defcondt + " '%" + data[i].defVal + "%'";
                else
                    str += data[i].coldesc + " " + data[i].defcondt + " '" + data[i].defVal + "'";
            }
        }
    }
    document.getElementById("textserarch").value = str;

}

function onselect_filter() {
    var str = " and ";
    var data = $("#gridFilter").data("kendoGrid").dataSource.data();
    // var spt = evt.id.split("_");
    // var rowId = parseInt(spt[1]);

    // data[rowId].defVal = id_val;

    for (var i = 0; i < data.length; i++) {

        if (data[i].defVal != null && data[i].defVal != "") {

            if (i > 0 && str.length != 0 && str != " and ")
                str += " and ";

            if (data[i].datatype == 'Q')
                // str += data[i].coldesc + " " + data[i].defcondt + " '" + $("#" + "cmb_"+i +" option:selected").text() + "'";
                str += data[i].colname + " " + data[i].defcondt + " '" + data[i].defVal + "'";

            else if (data[i].datatype == 'D') {
                //str += data[i].colname + " " + data[i].defcondt + " '" + data[i].defVal + "'";
                var date_value = data[i].defVal;
                var split_date = date_value.split("-");
                var Splited_Datevalue = split_date[1] + "/" + split_date[2] + "/" + split_date[0];
                str += data[i].colname + " " + data[i].defcondt + " '" + Splited_Datevalue + "'";
            }


            else if (data[i].datatype == 'N')
                str += data[i].colname + " " + data[i].defcondt + " " + data[i].defVal;

            else if (data[i].datatype == "S") {
                if (data[i].defcondt == 'like')
                    str += data[i].colname + " " + data[i].defcondt + " '%" + data[i].defVal + "%'";
                else
                    str += data[i].colname + " " + data[i].defcondt + " '" + data[i].defVal + "'";
            }
        }
    }

    filter_condition = (str != " and ") ? str : " and 1 = 1 ";
    var data = {};
    data.fltercond = filter_condition;
    listpageloadfetch(filter_condition);
   // ajaxcall_param('/AdvancedFilter/setFilter_condition', JSON.stringify(data));
    closeModel();
    //master_list_refresh();
    

}

//$("#btn_select").click(function (evt) {

//var id_val = $("#" + evt.id).val();


//});