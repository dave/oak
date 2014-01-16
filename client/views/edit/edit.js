Template.edit.item = function () {
	return selected();
}

Template.attributes.attribute = function(){
	if (currentChange()) {
		return selected().attribute(this.name, currentChange()) || '';
	}
	else {
		return selected().attribute(this.name) || '';
	}
}

Template.children.listHolds = function(){
	return selected().listHolds() || '';
}

Template.children.children = function () {
	return selected() == null ? null : selected().children().cursor();
}

Template.children.type = Template.attributes.type = function () {
	return types[selected().type().name];
}

Template.childRow.hasChild = function() {
	return selected().child(this.name) != null;
}

Template.childRow.child = function() {
	return selected().child(this.name);
}

Template.listChildRow.events({
	'click a.child-link': function(e) {
		e.preventDefault();
		Item(this).select().open(true).parent().open(true);
		e.stopImmediatePropagation();
	}
});

Template.childRow.events({
	'click a.child-link': function(e) {
		e.preventDefault();
		var child = Template.childRow.child.call(this);
		if (child)
			child.select().open(true).parent().open(true);
		e.stopImmediatePropagation();
	}
});

Template.attributes.events({
	'click button[data-action="save"]': function(e) {
		e.preventDefault();

		var item = selected();

		var updates = {};
		var holder = $(e.currentTarget).closest('form');
		_.each(item.type().attributes, function(attribute, name){
			var newValue = holder.find('.form-control[data-name="' + name + '"]').val();
			//var oldValue = item.attribute(name);
			updates[name] = {name: name, value: newValue};
		});
		if (Object.keys(updates).length > 0) {
			var change = getChange();

			var version = null;
			var previous = change.lastTweak(item);
			if (!previous)
				version = item.lastVersion();

			createTweak(item, change, previous, version, updates,
				function(id) {
					//alert(id);
				}
			)

		}
		e.stopImmediatePropagation();
	}
});