

ChangeObject.prototype._get = function(id) {
	return Changes.findOne({_id: id});
}

currentChange = function() {
	if (Session.get('current_change') === undefined)
		return null;
	else
		return Change(Session.get('current_change'));
}

newChange = function() {
	var id = new Meteor.Collection.ObjectID()._str;
	Changes.insert({_id: id});
	return Change(id);
}

getChange = function() {
	return currentChange() || newChange().current(true);
}

ChangeObject.prototype.current = function(state) {
	if (setter(state)) {
		if (state === 'toggle')
			Session.set('current_change', this.current() ? undefined : this.id());
		else
			Session.set('current_change', state ? this.id() : null);
		return this;
	}
	return Session.equals('current_change', this.id());
}