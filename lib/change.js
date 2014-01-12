/**
 *
 * Basic helpers for the Change class
 *
 */

/**
 * Helper functon for the GenericObject super class
 * @param id
 * @returns {Cursor}
 * @private
 */
ChangeObject.prototype._get = function(id) {
	return Changes.findOne({_id: id});
}

/**
 * Gets the currently selected change
 * @returns {ChangeObject}
 */
currentChange = function() {
	if (Session.get('current_change') === undefined)
		return null;
	else
		return Change(Session.get('current_change'));
}

/**
 * Creates a new change
 * @returns {ChangeObject}
 */
newChange = function() {
	var id = new Meteor.Collection.ObjectID()._str;
	Changes.insert({_id: id});
	return Change(id);
}

/**
 * Gets the current change, or if no change is selected, we create a new one.
 * @returns {ChangeObject}
 */
getChange = function() {
	return currentChange() || newChange().current(true);
}

/**
 * Changes the selected change. If a boolean is proveded, we change the state.
 * @param state - optional boolean
 * @returns {boolean|ChangeObject}
 */
ChangeObject.prototype.current = function(state) {
	if (setter(state)) {
		Session.set('current_change', state ? this.id() : null);
		return this;
	}
	return Session.equals('current_change', this.id());
}

/**
 * Toggles the selected state of the change
 * @returns {ChangeObject}
 */
ChangeObject.prototype.toggle = function() {
	Session.set('current_change', this.current() ? undefined : this.id());
	return this;
}

/*
ChangeObject.prototype.tweak = function(item) {
	var tweak = Tweaks.findOne({change: this.id(), item: item});
	if (tweak != null)
		return Tweak(tweak);

	var id = new Meteor.Collection.ObjectID()._str;
	Tweaks.insert({_id: id, change: this.id(), item: item});
	return Tweak(id);
}*/