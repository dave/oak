Template.edit.item = function () {
	return getSelectedItem();
}
Template.edit.version = function () {
	return getLiveVersion(getSelectedItem());
}
//Template.attribute.preserve({
//	'input[id]': function (node) { return node.id; }
//});
Template.version.events({
	'click button': function() {

		var updates = {};
		var self = this;
		$.each(this.attributes, function(i){
			var attribute = self.attributes[i];
			var newValue = $('#attributesEditControls #edit_' + self._id + '_' + attribute.name).val();
			var oldValue = attribute.value;
			if (newValue != oldValue)
				updates['attributes.' + i + '.value'] = newValue;
		});
		Versions.update({_id: this._id}, {$set: updates});

	}
});