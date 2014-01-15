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
 * Makes a change live
 */
ChangeObject.prototype.live = function(result) {

	//Lets get all the tweaks...
	var tweaks = new TweakCollection(Tweaks.find({change: this.id()}, {sort: {item: 1, order: 1}})).array();

	var relevent = {};
	_.each(tweaks, function(tweak){
		relevent[tweak.item($id)] = tweak;
	});

	_.each(relevent, function(tweak) {
		createVersion(tweak, result);
	});
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

/**
 * Gets the last tweak for a particular Item
 * @param item
 */
ChangeObject.prototype.lastTweak = function(item) {
	var tweaks = Tweaks.find({item: item.id()}, {sort: {order: -1}, limit: 1}).fetch();
	return tweaks.length > 0 ? Tweak(tweaks[0]) : null;
}
