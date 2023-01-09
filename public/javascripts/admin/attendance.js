$(document).ready(function () {
    $.post("/admin-panel/attendance", {}, function (attendance) {
        console.log(attendance);
        for (i in attendance) {
            var checkin = DateToHH_MM(new Date(attendance[i].checkin)),
                checkout = DateToHH_MM(new Date(attendance[i].checkout)),
                date = new Date(attendance[i].date).toUTCString().split("00")[0];
            $("tbody").append("<tr id='element'>" + "<td>" + attendance[i].username + "</td>" + "<td>" + attendance[i].site + "</td>" + "<td>" + date + "</td>" + "<td>" + checkin + "</td>" + "<td>" + checkout + "</td>" + "<td><button>View</button></td></tr>");
        }
        paginate();
    });

    $("#filter-form").on("submit", (e) => {
        e.preventDefault();
        console.log("filter submitted");
        var name = $("#myInput")[0].value.toLocaleLowerCase(),
            date = $("#date-filter")[0].value;

        $.post("/admin-panel/attendance", { name, date }, function (attendance) {
            console.log(attendance);
            $("tbody").empty();
            for (i in attendance) {
                var checkin = DateToHH_MM(new Date(attendance[i].checkin)),
                    checkout = DateToHH_MM(new Date(attendance[i].checkout)),
                    date = new Date(attendance[i].date).toUTCString().split("00")[0];
                $("tbody").append("<tr id='element'>" + "<td>" + attendance[i].username + "</td>" + "<td>" + attendance[i].site + "</td>" + "<td>" + date + "</td>" + "<td>" + checkin + "</td>" + "<td>" + checkout + "</td>" + "<td><button>View</button></td></tr>");
            }
            paginate();
        });
    });
});

function dateFormat(date) {
    date = new Date(date);
    return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
}

function paginate() {
    // Set the number of rows per page
    var rowsPerPage = 9;
    // Get the table element
    var table = $("table");
    // Split the table into multiple pages
    table.bind("paginate", function () {
        table.find("tbody tr:gt(" + (rowsPerPage - 1) + ")").hide();
    });
    table.trigger("paginate");

    // Add a pagination control
    var numPages = Math.ceil(table.find("tbody tr").length / rowsPerPage);

    var paginationControl = $('<div class="pagination-control"></div>');
    for (var i = 0; i < numPages; i++) {
        $('<span class="page-number">' + (i + 1) + "</span>")
            .bind(
                "click",
                {
                    newPage: i,
                },
                function (event) {
                    // Get the current page
                    var currentPage = $(".pagination-control .current-page").text();
                    // Update the current page
                    $(".pagination-control .current-page").removeClass("current-page");
                    $(this).addClass("current-page");
                    // Hide all rows
                    table.find("tbody tr").hide();
                    // Show the rows for the new page
                    table
                        .find("tbody tr")
                        .slice(event.data.newPage * rowsPerPage, (event.data.newPage + 1) * rowsPerPage)
                        .show();
                }
            )
            .appendTo(paginationControl)
            .addClass("clickable");
    }
    // Add the pagination control to the table
    table.after(paginationControl);
    // Set the first page as current
    $(".pagination-control .page-number:first").addClass("current-page");
    if (numPages < 2) {
        $(".pagination-control").hide();
    } else {
        $(".pagination-control").show();
    }
}
