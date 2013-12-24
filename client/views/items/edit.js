Template.edit.item = function () {
	return selected() == null ? null : selected().data();
}
Template.edit.version = function () {
	return selected() == null ? null : selected().live().data();
}

//Template.attribute.preserve({
//	'input[id]': function (node) { return node.id; }
//});
Template.version.events({
	'click button': function(e) {
		e.preventDefault();
		var updates = {};
		var self = this;
		var holder = $(e.currentTarget).closest('form');
		$.each(this.attributes, function(i){
			var attribute = self.attributes[i];
			var newValue = holder.find('.form-control[data-name="'+attribute.name+'"]').val();
			var oldValue = attribute.value;
			if (newValue != oldValue)
				updates['attributes.' + i + '.value'] = newValue;
		});
		if (Object.keys(updates).length > 0)
			Versions.update({_id: this._id}, {$set: updates});
		e.stopImmediatePropagation();
	}
});