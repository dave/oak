Template.childrenList.type = function () {
	return types[selected().type().name];
}

Template.childrenList.listHolds = function(){
	return selected().listHolds() || '';
}

Template.childrenList.children = function () {
	return selected() == null ? null : selected().children().cursor();
}


Template.listChildRow.events({
	'click a.child-link': function(e) {
		e.preventDefault();
		Item(this).select().open(true).parent().open(true);
		e.stopImmediatePropagation();
	}
});