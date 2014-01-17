
Template.childrenType.type = function () {
	return types[selected().type().name];
}

Template.childrenTypeRow.child = function() {
	return selected().child(this.name);
}

Template.childrenTypeRowFull.enabled = function() {
	return !Item(this).disabled(currentChange());
}
Template.childrenTypeRowFull.disabledClass = function() {
	return Item(this).disabled(currentChange()) ? 'item-disabled' : '';
}

Template.childrenTypeRowFull.parentChildTypes = function() {
	return Item(this).parent().type().children[this.name()].types;
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
	}
});