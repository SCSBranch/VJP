
function gettoolbar(add_option) {
    if (add_option == 'Y')
        return "<a class=' k-grid-add'  id = 'btnSave' href=''><span class='fa fa-plus' style='color:Black'></span></a>";
    else
        return "";
}

function getFields(grd_id, grd_col) {
    try {
        var fields = {};
        $.each(grd_col, function (key, value) {
            var select = value.grid_type;

            switch (select) {
                case 'GRID_TXT':
                case 'GRID_TXTAREA' :
                    fields[value.name] = { type: "string", defaultValue: "" };
                    break
                case 'GRID_COMBO_CODE':                    
                    fields[value.name] = { type: "string", defaultValue: "", hidden: true };
                    break;
                case 'GRID_COMBO':                  
                    fields[value.name] = { type: "string", defaultValue: "" };
                    break;
                case 'GRID_NUM':
                    fields[value.name] = { type: "number", defaultValue: "" };
                    break;
                case 'GRID_DATE':
                    fields[value.name] = { type: "date", defaultValue: "" };
                    break;
                case 'GRID_CHKBOX':
                    fields[value.name] = { type: "string", defaultValue: "",editable:false };
                    break;

                default:
                    break;
            }
        });
     //   fields["mode_flag"] = { type: "string", defaultValue: "I" };
        return fields;
    }
    catch (err) {
        //javascript_log4j_root(arguments.callee.name, err);
    }
}

function getColumns(grd_id, grd_col, add_option) {
    try {
        var columns = [];
        var i = 0;
        var col = {};
        var cmd;

        if (add_option == "Y")
        {
            cmd = [
            {
                name: "Delete",
                id: "Delete",
                imageClass: "fa fa-close",
                click: function (e) {                    
                    var grid = $("#" + grd_id).data("kendoGrid");
                    var dataItem = $("#" + grd_id).data("kendoGrid").dataItem($(e.target).closest("tr"));
                    DeleteWindowEvent(e, dataItem, grid);
                    e.stopImmediatePropagation()
                }
            },
            ],
             col.width= "40px",
            col.command = cmd;
            columns.push(col);
        }

        $.each(grd_col, function (key, value) {
            col = {};
            col.field = value.name;
            col.title = value.label;
            if (add_option == "N")
                col.width = "200px";

            switch (value.grid_type) {
                case 'GRID_TXT':
                case 'GRID_TXTAREA':
                    {                   
                        if (value.maxlength != 'MAX')
                            col.editor = function (container, options) { text_editor(container, options.field, value.maxlength, value.required); };
                        else
                            col.editor = function (container, options) { textarea_editor(container, options.field, value.maxlength, value.required); };
                    }
                    break;
                case 'GRID_NUM':
                    {
                    var splt = (value.maxlength).split(",");
                    if (splt.length == 1)
                        col.editor = function (container, options) { numeric_editor_dot(container, options.field, splt[0], 0); };
                    else if (splt.length >= 2)
                        col.editor = function (container, options) { numeric_editor_dot(container, options.field, splt[0], splt[1]); };
                    }
                    break;
                case 'GRID_DATE':                    
                    col.format = "{0:dd/MM/yyyy}";
                    break;
                case 'GRID_COMBO_CODE':
                    col.hidden = true;
                    break;
                case 'GRID_COMBO':
                    {                        
                            col.editor = function (container, options) {
                            var combo_type_list = '';
                                combo_type_list = load_dropdown_list('COMMON', value.mastercode);
                                var code_datafield = options.field + "_code"
                                combo_editor_man_check(container, "cmb_" + options.field, combo_type_list, options.field, options.field, code_datafield, grd_id, );
                        };
                    }
                    break;
                case 'GRID_CHKBOX':
                    {
                        col.template = '<input type="checkbox" #= '+ value.name +' == "1" ? "checked=checked" : "" # class="chkbx_' + key + '" ></input >';
                    }
                    break;

                default:
                    break;
            }
            columns.push(col);
        });
        //col = {};
        //col.field = "mode_flag";
        //col.title = "";
        //col.hidden = true;      
        //columns.push(col);
        return columns;
    }
    catch (err) {
        //javascript_log4j_root(arguments.callee.name, err);
    }
}

function text_editor(container, field, maxlen, required) {
    if (required == "required")
        $('<input required data-bind="value:' + field + '" maxlength="' + maxlen + '" data-required-msg="' + field + ' cannot be blank" style="color:black ; width:100%"  ' + '"  name="' + field + '"/>').appendTo(container);
    else
        $('<input data-bind="value:' + field + '" maxlength="' + maxlen + '" style="color:black ; width:100%"  ' + '"  name="' + field + '"/>').appendTo(container);
}

function textarea_editor(container, field, maxlen, required) {
    if (required == "required")
        $('<textarea required data-bind="value:' + field + '" maxlength="' + maxlen + '" style="color:black ; width:100%" ' + '"  name="' + field + '"/>').appendTo(container);
    else
        $('<textarea data-bind="value:' + field + '" maxlength="' + maxlen + '" style="color:black ; width:100%" ' + '"  name="' + field + '"/>').appendTo(container);
}


function numeric_editor_dot(container, field, maxlen, no_decimals) {
    var formatStr = "#";
    var dec_str = "######";
    if (no_decimals > 0)
        formatStr = formatStr + "." + dec_str.substr(0, no_decimals);
    $('<input maxlength="' + maxlen + '"  name="' + field + '"/>')
     .appendTo(container)
     .kendoNumericTextBox({
         min: 0,

         format: formatStr,
         decimals: no_decimals,
         spinners: false
     });
}

function date_editor(container, options) {
    $('<input  data-text-field="' + options.field + '" data-value-field="' + options.field + '" data-bind="value:' + options.field + '" data-format="' + options.format + '"/>')
        .appendTo(container)
        .kendoDatePicker({});
}

function removeSpaces(sKey) {
    try {
        if (sKey.indexOf(" ") > -1) {
            var spt = sKey.split(" ");
            var sptResult = "";
            $.each(spt, function (key, value) {
                sptResult += value;
            });
            return sptResult;
        } else {
            return sKey;
        }
    }
    catch (err) {
        //javascript_log4j_root(arguments.callee.name, err);
    }
}

function formatData(data) {
    try {
        var arr = [];
        $.each(data, function (key, value) {
            var obj = {};
            $.each(value, function (sKey, sValue) {
                sKey = removeSpaces(sKey);
                obj[sKey] = sValue;
            });
            arr.push(obj);
        });
        return arr;
    }
    catch (err) {
       // javascript_log4j_root(arguments.callee.name, err);
    }
}
