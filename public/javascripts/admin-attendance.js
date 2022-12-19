$(document).ready(function () {
	$.post("/admin-panel/attendance", {}, function (attendance) {
		for (i in attendance) {
			$("tbody").append("<tr id='element'>" + "<td>" + attendance[i].username + "</td>" + "<td>" + attendance[i].site + "</td>" + "<td>" + attendance[i].status + "</td>" + "<td>" + dateFormat(new Date(attendance[i].date)) + "</td>" + "<td>" + attendance[i].login + "</td>" + "<td>" + attendance[i].logout + "</td>" + "<td><button>View</button></td></tr>");
		}
	});
	$("#filter-form").on("submit", (e) => {
		e.preventDefault();
		console.log("filter submitted");
		var name = $("#myInput")[0].value,
			date = $("#date-filter")[0].value;
		console.log(name, date);

		$.post("/admin-panel/attendance", { name, date }, function (attendance) {
			$("tbody").empty();
			for (i in attendance) {
				$("tbody").append("<tr id='element'>" + "<td>" + attendance[i].username + "</td>" + "<td>" + attendance[i].site + "</td>" + "<td>" + attendance[i].status + "</td>" + "<td>" + dateFormat(new Date(attendance[i].date)) + "</td>" + "<td>" + attendance[i].login + "</td>" + "<td>" + attendance[i].logout + "</td>" + "<td><button>View</button></td></tr>");
			}
		});
	});
});

function dateFormat(date) {
	date = new Date(date);
	return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
}
