
Template.edit.item = function () {
	return selected() == null ? null : selected().data();
}

Template.edit.version = function () {
	return selected() == null ? null : selected().live().data();
}

Template.version.attribute = function(v){
	return version(v).attribute(this.name) || '';
}

Template.children.children = function () {
	return selected() == null ? null : selected().children().cursor();
}
Template.children.type = Template.version.type = function () {
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
		item(this).select().open(true).parent().open(true);
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

Template.version.events({
	'click button': function(e) {
		e.preventDefault();

		var v = version(this);
		var i = v.item();

		var updates = {};
		var holder = $(e.currentTarget).closest('form');
		$.each(i.type().attributes, function(name){
			var newValue = holder.find('.form-control[data-name="'+name+'"]').val();
			var oldValue = v.attribute(name);
			if (newValue != oldValue)
				updates['attributes.' + name + '.value'] = newValue;
		});
		if (Object.keys(updates).length > 0)
			Versions.update({_id: this._id}, {$set: updates});
		e.stopImmediatePropagation();
	}
});