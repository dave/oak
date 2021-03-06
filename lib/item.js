/**
 *
 * Basic helpers for the Item class
 *
 */

addItem = function(options) {
	var id = new Meteor.Collection.ObjectID()._str;
	Items.insert({
		_id: id,
		name: options.name,
		type: options.type,
		parent: options.parent,
		created: options.created,
		mature: false,
		enabled: false,
		attributes: {_enabled: {name: '_enabled', value: false}}
	});
	return id;
}

/**
 * Helper functon for the GenericObject super class
 * @param id
 * @returns {Cursor}
 * @private
 */
ItemObject.prototype._get = function(id) {
	return Items.findOne({_id: id});
}

/**
 * Getter for immutable name property
 * @returns {string}
 */
ItemObject.prototype.name = function() {
	return this.data().name;
}

/**
 * Getter for immutable created property. Created is the id of the Change that created this item
 * @returns {string}
 */
ItemObject.prototype.created = function() {
	return this.data().created;
}

ItemObject.prototype.loaded = function() {
	return this.data().attributes != null;
}

/**
 * True if the item has been made live. False if it's still part of a temporary change.
 * @returns {string}
 */
ItemObject.prototype.mature = function() {
	return this.data().mature;
}

ItemObject.prototype.enabled = function(change) {
	if (change && change.lastTweak(this))
		return this.attribute('_enabled', change) === true;
	else
		return this.data().enabled;
}

/**
 * Getter for the attributes collection - attributes are the only mutable aspects of an Item. Meta data like the sibling order, and enabled status are namespaced with underscores: _order, _enabled etc.
 * @param name
 * @returns {*}
 */
ItemObject.prototype.attribute = function(name, change) {
	if (this.null())
		return null;
	var attributes = this.attributes(change);
	return attributes[name] == null ? null : attributes[name].value;
}

ItemObject.prototype.attributes = function(change) {
	if (this.null())
		return null;
	var attributes;
	if (change && change.lastTweak(this)) {
		attributes = change.lastTweak(this).data().changes;
	} else {
		attributes = this.data().attributes;
	}
	return attributes;
}

/**
 * Had this item been tweaked in this change?
 * @param change
 * @returns {boolean}
 */
ItemObject.prototype.dirty = function(change) {
	var item = this;

	if (item.null())
		return null;

	if (change == null)
		return false;

	var tweak = change.lastTweak(item);

	if (tweak == null)
		return false;

	return tweak.dirty();
}



ItemObject.prototype.hasDirtyChildren = function(change){
	if (!change)
		return false;

	var key = 'dirty_' + this.id() + '_' + change.id();

	var cache = Session.get(key);

	return !_.isEmpty(cache);
}

ItemObject.prototype.updateDirtyChildren = function(change, child, dirty){

	var key = 'dirty_' + this.id() + '_' + change.id();

	Session.setDefault(key, {});
	var cache = Session.get(key);

	if (dirty)
		cache[child.id()] = true;
	else
		delete cache[child.id()];

	Session.set(key, cache);
};

ItemObject.prototype.updateDirtyChildrenOnAncestors = function(change) {
	var item = this;
	var dirty = item.dirty(change);
	_.each(item.ancestors(), function(ancestor){
		ancestor.updateDirtyChildren(change, item, dirty);
	});
}

/**
 * Link to tweak that is live now for this Item.
 * @returns {TweakObject}
 */
ItemObject.prototype.tweak = function(returnPlainId) {
	if (returnPlainId === $id) {
		return this.data().tweak;
	}
	if (this._tweak == null)
		this._tweak = Tweak(this.data().tweak);
	return this._tweak;
}

/**
 * Link to version that is live now for this Item.
 * @returns {VersionObject}
 */
ItemObject.prototype.version = function(returnPlainId) {
	if (returnPlainId === $id) {
		return this.data().version;
	}
	if (this._version == null)
		this._version = Version(this.data().version);
	return this._version;
}

/**
 * Gets the last version for a this Item
 */
ItemObject.prototype.lastVersion = function() {
	var versions = Versions.find({item: this.id()}, {sort: {order: -1}, limit: 1}).fetch();
	return versions.length > 0 ? Version(versions[0]) : null;
}
