Template.childrenList.type = function () {
	return types[selected().type().name];
}

Template.childrenList.listHolds = function(){
	return selected().listHolds() || '';
}

Template.childrenList.children = function () {
	return selected() == null ? null : selected().visibleChildren(currentChange()).cursor();
}

Template.childrenListRow.enabled = function() {
	return !Item(this).disabled(currentChange());
}
Template.childrenListRow.disabledClass = function() {
	return Item(this).disabled(currentChange()) ? 'item-disabled' : '';
}



Template.childrenListRow.events({
	'click a.child-link': function(e) {
		e.preventDefault();
		Item(this).select().open(true).parent().open(true);
		e.stopImmediatePropagation();
	},
	'click button[data-action="delete"]': function(e) {
		e.preventDefault();
		quickTweak(Item(this), {_enabled: false});
		e.stopImmediatePropagation();
	},
	'click button[data-action="undelete"]': function(e) {
		e.preventDefault();
		quickTweak(Item(this), {_enabled: true});
		e.stopImmediatePropagation();
	}
});

Template.childrenList.events({
	'click button[data-action="add"]': function(e) {
		e.preventDefault();
		addItemOrShowModal(e, 'list');
	}
});