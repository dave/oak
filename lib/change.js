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

	Changes.update({_id: this.id()}, {$set:{live: true}});

}

/**
 * Gets the currently selected change
 * @returns {ChangeObject}
 */
currentChange = function() {
	if (Session.get('selected_change') === undefined)
		return null;
	else
		return Change(Session.get('selected_change'));
}

/**
 * Creates a new change
 * @returns {ChangeObject}
 */
newChange = function() {
	var id = new Meteor.Collection.ObjectID()._str;
	Changes.insert({_id: id, live: false});
	return Change(id);
}

/**
 * Gets the current change, or if no change is selected, we create a new one.
 * @returns {ChangeObject}
 */
getChange = function() {
	return currentChange() || newChange().selected(true);
}

/**
 * Changes the selected change. If a boolean is proveded, we change the state.
 * @param state - optional boolean
 * @returns {boolean|ChangeObject}
 */
ChangeObject.prototype.selected = function(state) {
	var that = this;
	if (setter(state)) {
		Session.set('selected_change', state ? this.id() : null);
		if (state){
			_.each(this.firstTweaks().array(), function(tweak){
				tweak.item().updateDirtyChildrenOnAncestors(that);
			});
		}
		return this;
	}
	return Session.equals('selected_change', this.id());
}

ChangeObject.prototype.firstTweaks = function() {
	if (this._firstTweaks == null)
		this._firstTweaks = new TweakCollection(Tweaks.find({change: this.id(), order: 0}));
	return this._firstTweaks;
}

/**
 * Toggles the selected state of the change
 * @returns {ChangeObject}
 */
ChangeObject.prototype.toggle = function() {
	this.selected(!this.selected());
	return this;
}

/**
 * Gets the last tweak for a particular Item
 * @param item
 */
ChangeObject.prototype.lastTweak = function(item) {
	var tweaks = Tweaks.find({item: item.id(), change: this.id()}, {sort: {order: -1}, limit: 1}).fetch();
	return tweaks.length > 0 ? Tweak(tweaks[0]) : null;
}
