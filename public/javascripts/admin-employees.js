// Search among users
const searchInput = document.querySelector("#search-input");
const cards = document.querySelectorAll(".cardd");
searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    for (let card of cards) {
        const title = card.querySelector(".card-title").textContent.toLowerCase();
        const description = card.querySelector(".card-description").textContent.toLowerCase();

        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    }
});

// Avatar preview
const fileInput = document.getElementById("avatar");
const preview = document.getElementById("avatar-preview");
fileInput.addEventListener("change", () => {
    const reader = new FileReader();
    reader.onload = () => {
        preview.src = reader.result;
    };
    reader.readAsDataURL(fileInput.files[0]);
});
document.getElementById("avatar-button").addEventListener("click", function (e) {
    e.preventDefault();
    fileInput.click();
});

// Chart
$.post("/admin-panel/users-stats", function (stats) {
    if (stats.status != "success") {
        $("#users-stast").hide();
        console.log(stats.error);
        return;
    }
    $("#users-stast").show();
    $("#user-count").text(stats.count);

    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ["Role", "Amount"],
            ["Admins", stats.admins],
            ["Employees", stats.employees],
            ["Self-emplyed", stats.self_employed],
            ["Others", self.others],
        ]);

        var options = {
            pieHole: 0.8,
            legend: "none",
            pieSliceText: "none",
            animation: {
                duration: 1000,
                easing: "in",
                startup: true,
            },
            slices: {
                0: { color: "#0094AD" },
                1: { color: "#00BC9D" },
                2: { color: "#81DF7F" },
                3: { color: "#F9F871" },
                4: { color: "#F1F1E6" },
            },
        };

        var chart = new google.visualization.PieChart(document.getElementById("donutchart"));
        chart.draw(data, options);
    }
});
