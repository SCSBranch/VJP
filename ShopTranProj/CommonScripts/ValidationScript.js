

$(function () {

   // setprofilePicture();
});

function setprofilePicture() {
    var data = {};
    if (getlocalStorage("User_Id_Value") != undefined) {
        data.user_id = getlocalStorage("User_Id_Value");//sessionStorage.getItem('User_Id_Value');
        profile = ajaxcall_param('/Login/LoadProfile', JSON.stringify(data));

        if (profile != "") {
            document.getElementById('profileImg').setAttribute('src', 'data:image/png;base64,' + profile);
            document.getElementById('profileImg1').setAttribute('src', 'data:image/png;base64,' + profile);
        }
        else {
            document.getElementById("profileImg").src = "/images/noimage.png";
            document.getElementById("profileImg1").src = "/images/noimage.png";
        }
    }

}

function isDate(currVal)
{
    if (currVal == "") {
        return true;
    }
   // var stringToValidate = "9-2-0012";
    var rgexp = /(^(((0[1-9]|1[0-9]|2[0-8])[/](0[1-9]|1[012]))|((29|30|31)[/](0[13578]|1[02]))|((29|30)[/](0[4,6,9]|11)))[/](19|[2-9][0-9])\d\d$)|(^29[/]02[/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/;
    var isValidDate = rgexp.test(currVal);
    return isValidDate;
}



function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode != 46 && charCode > 31
            && (charCode < 48 || charCode > 57))
        return false;

    return true;
}

$(document).ready(function() {         
    //attach keypress to input
    $('.number').keydown(function (event) {
        // Allow special chars + arrows 
        if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 
            || event.keyCode == 27 || event.keyCode == 13 
            || (event.keyCode == 65 && event.ctrlKey === true) 
            || (event.keyCode >= 35 && event.keyCode <= 39)){
            return;
        }else {
            // If it's not a number stop the keypress
            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                event.preventDefault(); 
            }   
        }
    });
          
});


function isValidOnlyNumbers(evt) {
    var e = event || evt; // for trans-browser compatibility
    var charCode = e.which || e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}


function isWholeNumber(e,val) {
    e = e || window.event;
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;

    // Allow non-printable keys
    if (!charCode || charCode == 8 /* Backspace */) {
        return;
    }

    var typedChar = String.fromCharCode(charCode);

    // Allow numeric characters
    if (/\d/.test(typedChar)) {
        return;
    }

    // Allow the minus sign (-) if the user enters it first
    //if (typedChar == "-" && val=="") {
    //    return;
    //}

    // In all other cases, suppress the event
    return false;
}




    function allow_only_numbers() {
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


function float_num() {
    $('.float').keypress(function (event) {
        if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });

}

function allow_numeric_decimal(evt, element) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (
        (charCode != 45 || $(element).val().indexOf('-') != -1) &&      // “-” CHECK MINUS, AND ONLY ONE.
        (charCode != 46 || $(element).val().indexOf('.') != -1) &&      // “.” CHECK DOT, AND ONLY ONE.
        (charCode < 48 || charCode > 57))
        return false;

    return true;
}


