var pathName = location.pathname.toLowerCase();

// clean the page views from the url to be able to use the base url for hyperlinking
pathName = pathName.replace("default", "");
pathName = pathName.replace("home", "");

pathName += ((pathName.substring(pathName.length - 1) != "/") ? "/" : "");
pathName = location.protocol + "//" + location.host + pathName.replace("//", "/");

$(document).on("ready", function () {
    InitializeGrid();
    PopulateEthDropdown();
});

function PopulateEthDropdown() {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: (pathName + "Home/GetEthnicities"),
        cache: false,
        success: function (data) {
            var options = $.map(data, function (e) {
                return "<option value=\"" + e.ethnicityID + "\">" + e.ethnicity + "</option>";
            }).join("");
            $("#ethnicity").html("<option value=\"\" selected=\"\">Select...</option>" + options);
        }
    })
}

function InitializeGrid() {
    var obj = { width: 1200, height: 700 };
    var qUrl = pathName + "Home/PopulateGrid";

    obj.colModel = [
        { title: "Employee ID", width: 100, dataType: "string", editable: false, hidden: true},
        { title: "Last Name", width: 200, dataType: "string", editable: false },
        { title: "First Name", width: 200, dataType: "string", editable: false },
        { title: "Ethnicity ID", width: 200, dataType: "string", editable: false, hidden: true },
        { title: "Visually Identify by Admin", width: 300, dataType: "string", editable: true }];

    obj.dataModel = {
        location: "remote",
        sorting: "local",
        paging: "local",
        dataType: "JSON",
        method: "GET",
        url: qUrl,
        sortIndx: 1,
        sortDir: "up",
        rPP: 20
    };

    var $grid = $("#pqDbGrid").pqGrid(obj);

    $grid.pqGrid("option", "topVisible", false);
    $grid.pqGrid("option", "bottomVisible", true);
    $grid.pqGrid("option", "columnBorders", true);
    $grid.pqGrid("option", "rowBorders", true);
    $grid.pqGrid("option", "oddRowsHighlight", true);
    $grid.pqGrid("option", "numberCell", false);
    $grid.pqGrid("option", "flexHeight", false);
    $grid.pqGrid("option", "flexWidth", false);
    $grid.pqGrid("option", "scrollModel", { horizontal: true, });
    $grid.pqGrid("option", "resizable", true);
    $grid.pqGrid("option", "sortable", true);
    $grid.pqGrid("option", "roundCorners", true);
    $grid.pqGrid("option", "editable", true);
    $grid.pqGrid("option", "selectionModel", { type: 'row', mode: 'single' });
    $grid.pqGrid("option", "wrap", true);
    $grid.on("pqgridcellsave", function (event, ui) { });
    $grid.pqGrid({
        cellDblClick: function (event, ui) {
            // Show editing dialog.
            $("#dlgEditProfile").dialog({
                resizable: true,
                height: 700,
                width: 700,
                modal: true,
                buttons: {
                    Update: function () {
                        var DM = $grid.pqGrid("option", "dataModel");
                        var data = DM.data;
                        var rowIndx = getRowIndx();
                        var row = data[rowIndx];

                        row[3] = $("#ethnicity > [selected]").val();
                        row[4] = $("#ethnicity > [selected]").text();

                        $grid.pqGrid("refreshRow", { rowIndx: rowIndx }).pqGrid('setSelection', { rowIndx: rowIndx });
                        //saveFromDbEditDlg();

                        $(this).dialog("close");

                    },
                    Cancel: function () {
                        $(this).dialog("close");
                    }
                },
                open: function (event, ui) {
                    var $grid = $("#pqDbGrid");
                    var rowIndx = getRowIndx();

                    if (rowIndx != null) {
                        var DM = $grid.pqGrid("option", "dataModel");
                        var data = DM.data;
                        var row = data[rowIndx];
                        $("#firstLastName").text(row[2] + " " + row[1]);
                        $("#ethnicity").val(row[3]);
                    }
                }
            });
        }
    });


}

function saveFromDbEditDlg() {
    var DM = $grid.pqGrid("option", "dataModel");
    var data = DM.data;
    var row = data[rowIndx];

    var param = "Home/ResaveDbData";
    param += "?employeeId=" + row[0]; 
    param += "&ethId=" + row[3];

    var x = $.ajax({ type: "GET", dataType: "json", url: pathName + param, cache: false });
    x.done(function (args) {
        alert(args);
    })

}

