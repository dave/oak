
Template.edit.item = function () {
	return selected() == null ? null : selected();
}

Template.attributes.attribute = function(){
	return selected().attribute(this.name) || '';
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

//Template.attribute.preserve({
//	'input[id]': function (node) { return node.id; }
//});

Template.attributes.events({
	'click button': function(e) {
		e.preventDefault();

		var item = Item(this);

		var updates = {};
		var holder = $(e.currentTarget).closest('form');
		$.each(item.type().attributes, function(name){
			var newValue = holder.find('.form-control[data-name="' + name + '"]').val();
			var oldValue = item.attribute(name);
			if (newValue != oldValue)
				updates['attributes.' + name + '.value'] = newValue;
		});
		if (Object.keys(updates).length > 0)
			Items.update({_id: this._id}, {$set: updates});
		e.stopImmediatePropagation();
	}
});