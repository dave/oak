
Template.edit.item = function () {
	return selected() == null ? null : selected().data();
}

Template.edit.version = function () {
	return selected() == null ? null : selected().live().data();
}

Template.version.attribute = function(v){
	return version(v).attribute(this.name) || '';
}

Template.version.type = function () {
	return types[selected().type().name];
}

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