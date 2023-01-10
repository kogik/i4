function DateToHH_MM(date) {
    if (!(date instanceof Date)) {
        return;
    }

    var hours = date.getUTCHours() + 1 < 10 ? "0" + (date.getUTCHours() + 1) : date.getUTCHours() + 1,
        minutes = date.getUTCMinutes() < 10 ? "0" + date.getUTCMinutes() : date.getUTCMinutes();

    hours = parseInt(hours) > 23 ? parseInt(hours) - 24 : parseInt(hours);

    return hours + ":" + minutes;
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}
