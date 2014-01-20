
Template.childrenType.type = function () {
	return types[selected().type().name];
}

Template.childrenTypeRow.haschildren = function() {
	return selected().visibleChildren(currentChange(), this.name).cursor();
}

Template.childrenTypeRow.children = function() {
	return selected().visibleChildren(currentChange(), this.name).cursor();
}

Template.childrenTypeRowFull.enabled = function() {
	return !Item(this).disabled(currentChange());
}
Template.childrenTypeRowFull.disabledClass = function() {
	return Item(this).disabled(currentChange()) ? 'item-disabled' : '';
}

Template.childrenTypeRowFull.parentChildTypes = function() {
	return Item(this).parent().type().children[Item(this).name()].types;
}

Template.childrenTypeRowFull.events({
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
	},
	'click button[data-action="add"]': function(e) {
		e.preventDefault();
		addItemOrShowModal(e, 'type', Item(this).name());
	}
});


Template.childrenTypeRowEmpty.events({
	'click button[data-action="add"]': function(e) {
		e.preventDefault();
		addItemOrShowModal(e, 'type', this.name);
	}
});