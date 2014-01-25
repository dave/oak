Template.breadcrumbs.item =
Template.edit.item = function () {
	return selected();
}

Template.attributes.placeholder = function(){
	if (!selected().loaded()) {
		return 'Loading...';
	}
	return '';
}
Template.attributes.attribute = function(){
	if (!selected().loaded()) {
		return '';
	}
	else if (currentChange()) {
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

Template.edit.loaded = function() {
	return selected().data().attributes != null;
}

Template.attributes.events({
	'submit form': function(e) {
		e.preventDefault();
		var item = selected();
		var updates = {};
		var form = $(e.target);
		_.each(item.type().attributes, function(attribute, name){
			var oldValue = item.attribute(name, currentChange());
			var newValue = form.find('.form-control[data-name="' + name + '"]').val();
			if (newValue != oldValue)
				updates[name] = newValue;
		});
		if (Object.keys(updates).length > 0) {
			quickTweak(item, updates);
		}
		e.stopImmediatePropagation();
	}
});