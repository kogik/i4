var popup = document.getElementById("popup");

function popup_toggle() {
	if (popup.hidden) {
		// show popup
		popup.hidden = false;
	} else {
		// hide popup
		popup.hidden = true;
	}
}
