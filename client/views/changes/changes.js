Template.changeList.changes = function() {
	var _changes = new ChangeCollection(Changes.find({}));
	return _changes.cursor();
}

Template.changeListRow.selected = function(){
	return Change(this).selected();
}

Template.changeListRow.events({
	'click .select': function (e) {
		e.preventDefault();
		Change(this).selected(true);
		if (selected())
			Router.go('detail', selected());
		else
			Router.go('items');
		e.stopImmediatePropagation();
	},
	'click .live': function (e) {
		e.preventDefault();
		Change(this).live();
		Change(this).selected(false);
		e.stopImmediatePropagation();
	}
});