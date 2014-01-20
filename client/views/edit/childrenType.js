
Template.childrenType.type = function () {
	return types[selected().type().name];
}

Template.childrenTypeRow.children = function() {
	return selected().children(this.name).cursor();
}

Template.childrenTypeRow.showInList = function () {
	return Item(this).showInList('type', currentChange());
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
		Session.set('addItemModalChildName', Item(this).name());
		Session.set('addItemModalFormVisible', true);
	}
});


Template.childrenTypeRowEmpty.events({
	'click button[data-action="add"]': function(e) {
		e.preventDefault();
		Session.set('addItemModalChildName', this.name);
		Session.set('addItemModalFormVisible', true);
	}
});