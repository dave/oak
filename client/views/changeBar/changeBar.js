
Template.changeBar.change = function () {
	return currentChange();
}

Template.changeBar.events({
	'click .cancel': function (e) {
		e.preventDefault();
		currentChange().selected(false);
		e.stopImmediatePropagation();
	}
});