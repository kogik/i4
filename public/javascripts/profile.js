function popup_toggle(id) {
	var popup = document.getElementById(id);
	if (popup.hidden) {
		// show popup
		popup.hidden = false;
	} else {
		// hide popup
		popup.hidden = true;
	}
}
