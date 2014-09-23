var pathName = location.pathname.toLowerCase();

// clean the page views from the url to be able to use the base url for hyperlinking
pathName = pathName.replace("default", "");
pathName = pathName.replace("home", "");

pathName += ((pathName.substring(pathName.length - 1) != "/") ? "/" : "");
pathName = location.protocol + "//" + location.host + pathName.replace("//", "/");

var gridCreated = false;

$(document).on("ready", function () {

    PopulateEthDropdown();
    PopulateTitlesDropdown();
    PopulateCategoriesDropdown()

    $("#txtSearch").focus();

    /*========= Event Handlers ============*/
    $("#btnSearch").on("click", function (e) {
        if(gridCreated){
            $("#pqDbGrid").pqGrid(" ");
        }
        InitializeGrid($('#txtSearch').val());
    });

    $("#txtSearch").keypress(function (e) {
        if (e.which === 13) {
            e.preventDefault();
            if (gridCreated){
                $("#pqDbGrid").pqGrid("destroy");
            }
            InitializeGrid($("#txtSearch").val());
        }
    });

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
            $("#ethnicity").html(options);
        }
    })
}

function PopulateTitlesDropdown() {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: (pathName + "Home/GetTitles"),
        cache: false,
        success: function (data) {
            var options = $.map(data, function (e) {
                return "<option value=\"" + e.titleID + "\">" + e.title + "</option>";
            }).join("");
            $("#title").html(options);
        }
    })
}

function PopulateCategoriesDropdown() {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: (pathName + "Home/GetCategories"),
        cache: false,
        success: function (data) {
            var options = $.map(data, function (e) {
                return "<option value=\"" + e.categoryID + "\">" + e.category + "</option>";
            }).join("");
            $("#category").html(options);
        }
    })
}


function InitializeGrid(searchTerm) {
    var testStr = searchTerm.replace(/\s+/g, "")
    if (/^[a-z0-9]+$/i.test(testStr)) {
        //  var data = [];
        var a = $.ajax({
            type: "GET",
            dataType: "JSON",
            url: pathName + "Home/PopulateGrid?str=" + searchTerm,
            cache: false
            //,done: function (d) {
            //    data = d;
            //   // console.log(data);
            //    //for (var i in d) {
            //    //    data.push([i, d[i]]);
            //    //}

            //}
        });

        a.done(function (tempdata) {
            var oneRow;
            //delete tempdata["__proto__"];
            var data = $(tempdata).toArray();
            if (data.length === 0) {
                alert("No records found!")
            }
            else {
                var obj = { width: 1200, height: 700, title: "Diversity Report Editor" };
                var qUrl = pathName + "Home/PopulateGrid?str=" + searchTerm;

                obj.colModel = [
                    { dataIndx: "employeeID", title: "Employee ID", width: 100, dataType: "integer", editable: false, hidden: true },
                    { dataIndx: "lastName", title: "Last Name", width: 200, dataType: "string", editable: false },
                    { dataIndx: "firstName", title: "First Name", width: 200, dataType: "string", editable: false },
                    { dataIndx: "ethnicityID", title: "Ethnicity ID", width: 200, dataType: "integer", editable: false, hidden: true },
                    { dataIndx: "ethnicity", title: "Visually Identify by Admin", width: 200, dataType: "string", editable: false },
                    { dataIndx: "titleID", title: "Title ID", width: 150, dataType: "integer", editable: false, hidden: true },
                    { dataIndx: "title", title: "Job Title", width: 150, dataType: "string", editable: false },
                    { dataIndx: "categoryID", title: "Job Category ID", width: 150, dataType: "integer", editable: false, hidden: true },
                    { dataIndx: "category", title: "Job Category", width: 150, dataType: "string", editable: false },
                ];

                obj.dataModel = {
                    //location: "remote",
                    data: data,
                    location: "local",
                    sorting: "local",
                    paging: "local",
                    dataType: "string",
                    //method: "GET",
                    //url: qUrl,
                    //sortIndx: 1,
                    //sortDir: "up",
                    rPP: 20,
                    //getData: function (dataJSON) {
                    //debugger;
                    //var data = dataJSON.data;
                    //return { data: dataJSON.data };
                    //}
                };

                var $grid = $("#pqDbGrid").pqGrid(obj);

                $grid.pqGrid("option", "topVisible", true);
                $grid.pqGrid("option", "title", "Diversity Reports Editor");
                $grid.pqGrid("option", "bottomVisible", true);
                $grid.pqGrid("option", "columnBorders", true);
                $grid.pqGrid("option", "rowBorders", true);
                $grid.pqGrid("option", "oddRowsHighlight", true);
                $grid.pqGrid("option", "numberCell", false);
                $grid.pqGrid("option", "flexHeight", false);
                $grid.pqGrid("option", "flexWidth", false);
                $grid.pqGrid("option", "scrollModel", { horizontal: true, });
                $grid.pqGrid("option", "resizable", false);
                $grid.pqGrid("option", "sortable", true);
                $grid.pqGrid("option", "roundCorners", false);
                //$grid.pqGrid("option", "editable", true);
                $grid.pqGrid("option", "selectionModel", { type: 'row', mode: 'single' });
                $grid.pqGrid("option", "wrap", true);
                $grid.on("pqgridcellsave", function (event, ui) { });
                $grid.pqGrid({
                    cellDblClick: function (event, ui) {
                        var DM = $grid.pqGrid("option", "dataModel");
                        var data = DM.data;
                        var rIndx = getRowIndx();
                        var row = data[rIndx];
                        
                        $("#firstLastName").text(row.firstName + " " + row.lastName);
                        $("#ethnicity").val(row.ethnicityID);
                        $("#title").val(row.titleID);
                        $("#category").val(row.categoryID);

                        $("#dlgEditProfile").dialog({
                            resizable: true,
                            height: 700,
                            width: 700,
                            modal: true,
                            buttons: {
                                Update: function () {
                                    row.ethnicityID = $("#ethnicity").val();
                                    row.ethnicity = $("#ethnicity > [selected]").text();
                                    row.titleID = $("#title").val()
                                    row.title = $("#title > [selected]").text();
                                    row.categoryID = $("#category").val()
                                    row.category = $("#category > [selected]").text();

                                    $grid.pqGrid("refreshRow", { rowIndx: rIndx }).pqGrid('setSelection', { rowIndx: rIndx });
                                    //ResaveDbData();

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
                                    //$("#firstLastName").text(row[2] + " " + row[1]);
                                    //$("#ethnicity").val(row[3]);
                                }
                            }
                        });
                    }
                });
                gridCreated = true;
            }
        });
    }
}

function getRowIndx() {
    //var $grid = $("#grid_render_cells");
    var $grid = $("#pqDbGrid");
    //var obj = $grid.pqGrid("getSelection");
    //debugger;
    //  alert($grid);
    var arr = $grid.pqGrid("selection", { type: 'row', method: 'getSelection' });

    if (arr && arr.length > 0) {
        var rowIndx = arr[0].rowIndx;

        //if (rowIndx != null && colIndx == null) {
        //console.log(rowIndx);
        return rowIndx;
    }
    else {
        alert("Select a row.");
        return null;
    }
}

function hideRow(indx) {
    $("tr[pq-row-indx='" + indx + "']").hide()
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

