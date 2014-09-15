
$(document).on("ready", function () {
    InitializeGrid();




});


function InitializeGrid() {
    var colM = [
    { title: "Last Name", width: 150, dataIndx: "lastName" },
    { title: "First Name", width: 150, dataIndx: "firstName" },
    { title: "Ethnicity", width: 150, dataIndx: "ethnicity" },
    { title: "Visually Identify by Admin", width: 300, dataIndx: "viba" }
    ];
    
    var cols = ""

    var dataModel = {
        location: "remote",
        sorting: "local",
        paging: "local",
        dataType: "JSON",
        method: "GET",
        sortIndx: "contact",
        sortDir: "up",
        url: "/Home/GetColVals", //custom field in dataModel for pqGridCrud
        getData: function (dataJSON) {
            //debugger;
            var data = dataJSON.data;
            return { data: dataJSON.data };
        }
    }
    var newObj = {
        flexHeight: true,
        flexWidth: true,
        dataModel: dataModel,
        bottomVisible: true,
        colModel: colM,
        selectionModel: { mode: 'single' },
        editable: true,
        scrollModel: { horizontal: false },
        //title: "Contact Details",
        columnBorders: true
    };
    var $grid = $("#grid_crud-remote").pqGridCrud(newObj);
}