Template.breadcrumbs.item =
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

Template.breadcrumbs.ancestors = function(){
	return selected().ancestors();
}

Template.children.type = Template.attributes.type = function () {
	return types[selected().type().name];
}

Template.attributes.events({
	'click button[data-action="save"]': function(e) {
		e.preventDefault();
		var item = selected();
		var updates = {};
		var holder = $(e.currentTarget).closest('form');
		_.each(item.type().attributes, function(attribute, name){
			var oldValue = item.attribute(name, currentChange());
			var newValue = holder.find('.form-control[data-name="' + name + '"]').val();
			if (newValue != oldValue)
				updates[name] = newValue;
		});
		if (Object.keys(updates).length > 0) {
			quickTweak(item, updates);
		}
		e.stopImmediatePropagation();
	}
});