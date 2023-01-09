// day picker slider
var today = new Date().toISOString().split("T")[0];

var yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
yesterday = yesterday.toISOString().split("T")[0];

var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow = tomorrow.toISOString().split("T")[0];

var day_slider = new rSlider({
    target: "#day-slider",
    values: [yesterday, today, tomorrow],
    set: [today],
    tooltip: false,
    range: false,
    onChange: (val) => {
        highlight.css({ left: 0 });
        highlight.css({ width: 0 });
        startLabel.text("");
        endLabel.text("");
        startTime = null;
        endTime = null;
        $.post("/user/attendance/preview", { date: val }, (data) => {
            var now = new Date();
            var hours = now.getHours() + 1 < 10 ? "0" + (now.getHours() + 1) : now.getHours() + 1;
            var minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
            var now_string = hours + ":" + minutes;
            if (!data) {
                checkinButton.prop("disabled", false);
                checkoutButton.prop("disabled", true);
                updateTimeline(now_string, now_string);
                return;
            }
            if (data.checkout) {
                // attendance done for the day
                start = new Date(data.checkin);
                startTime = start.getUTCHours() + 1 + ":" + start.getUTCMinutes();
                end = new Date(data.checkout);
                endTime = end.getUTCHours() + 1 + ":" + end.getUTCMinutes();
                checkinButton.prop("disabled", true);
                checkoutButton.prop("disabled", true);
                updateTimeline(startTime, endTime);
            } else if (data.checkin) {
                // require checkout
                start = new Date(data.checkin);
                startTime = start.getUTCHours() + 1 + ":" + start.getUTCMinutes();
                checkinButton.prop("disabled", true);
                checkoutButton.prop("disabled", false);
                updateTimeline(startTime, now_string);
            }
        });
    },
});

// time picker slider
var time_slider = new rSlider({
    target: "#time-slider",
    values: [-30, -20, -10, 0, 10, 20, 30],
    set: [0],
    tooltip: false,
    range: false,
    onChange: (val) => {
        if (endTime == null && startTime == null) {
            // select start time
            console.log(val);
            var now = new Date();
            now = addMinutes(now, val);
            var hours = now.getHours() + 1 < 10 ? "0" + (now.getHours() + 1) : now.getHours() + 1;
            var minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
            var final = hours + ":" + minutes;
            console.log(final);
            updateTimeline(final, final);
        }
        if (startTime && endTime == null) {
            console.log(val);
            var now = new Date();
            now = addMinutes(now, val);
            var hours = now.getHours() + 1 < 10 ? "0" + (now.getHours() + 1) : now.getHours() + 1;
            var minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
            var final = hours + ":" + minutes;
            console.log(final);
            updateTimeline(startTime, final);
        }
    },
});
//
//
//
//
// timeline
var td_width = $("#td").outerWidth(),
    highlight = $("#timeHighlight"),
    startLabel = $("#startLabel"),
    endLabel = $("#endLabel"),
    dayPicker = $("#day-slider"),
    checkinButton = $("#checkin"),
    checkoutButton = $("#checkout"),
    startTime = null,
    endTime = null;

function updateTimeline(start, end) {
    start = timeStringToFloat(start);
    end = timeStringToFloat(end);
    // console.log(start, end);
    var temp_end;
    var temp_start;
    if (start >= 22 && start <= 25) {
        temp_start = (start - 24).toFixed(2);
        // console.log("24heh start => ", start, temp_start);
        highlight.css({ left: temp_start * td_width });
        startLabel.text(timeFloatToString(start - 2));
    } else {
        highlight.css({ left: map(start, 0, 12, 2, 14) * td_width });
        startLabel.text(timeFloatToString(start));
    }
    if (end >= 22 && end <= 25) {
        temp_end = (end - 24).toFixed(2);
        // console.log("24heh end => ", end, temp_end);
        highlight.css({ width: temp_end * td_width - temp_start * td_width });
        endLabel.text(timeFloatToString(end - 2));
    } else {
        var start_offset = temp_start ? temp_start * td_width : map(start, 0, 12, 2, 14) * td_width;
        highlight.css({ width: map(end, 0, 12, 2, 14) * td_width - start_offset });
        endLabel.text(timeFloatToString(end));
    }
}

// checkin & checkout attendance buttons handler

$("#checkin").click(() => {
    console.log("checkin");
    var checkin = new Date(day_slider.getValue() + "T" + $("#endLabel").text() + ":00").valueOf();
    $.post("/user/attendance/checkin", { date: day_slider.getValue(), time: checkin }, () => {
        location.reload();
    });
});

$("#checkout").click(() => {
    console.log("checkout");
    var checkout = new Date(day_slider.getValue() + "T" + $("#endLabel").text() + ":00").valueOf();
    $.post("/user/attendance/checkout", { date: day_slider.getValue(), time: checkout }, () => {
        location.reload();
    });
});

// formating functions

function timeFloatToString(minutes) {
    var sign = minutes < 0 ? "-" : "";
    var min = Math.floor(Math.abs(minutes));
    var sec = Math.floor((Math.abs(minutes) * 60) % 60);
    return sign + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
}

function timeStringToFloat(time) {
    var hoursMinutes = time.split(/[.:]/);
    var hours = parseInt(hoursMinutes[0], 10);
    var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return parseFloat(hours + minutes / 60).toFixed(2);
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

function map(value, low1, high1, low2, high2) {
    return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}
