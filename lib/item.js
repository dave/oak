/**
 *
 * Basic helpers for the Item class
 *
 */

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
 * Getter for the attributes collection - attributes are the only mutable aspects of an Item. Meta data like the sibling order, and enabled status are namespaced with underscores: _order, _enabled etc.
 * @param name
 * @returns {*}
 */
ItemObject.prototype.attribute = function(name, change) {
	if (this.null())
		return null;
	var attributes;
	if (change && change.lastTweak(this)) {
		attributes = change.lastTweak(this).data().changes;
	} else {
		attributes = this.data().attributes;
	}
	return attributes[name] == null ? null : attributes[name].value;
}

/**
 * Had this item been tweaked in this change?
 * @param change
 * @returns {boolean}
 */
ItemObject.prototype.dirty = function(change) {
	if (this.null())
		return null;

	if (change == null)
		return false;

	var tweak = change.lastTweak(this);

	return tweak != null;
}

ItemObject.prototype.hasDirtyChildren = function(change){
	return change && this._dirtyChildren && this._dirtyChildren[change.id()] && !_.isEmpty(this._dirtyChildren[change.id()]);
}

ItemObject.prototype.updateDirtyChildren = function(change, item, state){

	if (this._dirtyChildren == null)
		this._dirtyChildren = {};

	if (this._dirtyChildren[change.id()] == null)
		this._dirtyChildren[change.id()] = {};

	var cache = this._dirtyChildren[change.id()];

	if (state)
		cache[item.id()] = true;
	else
		delete cache[item.id()];
};

ItemObject.prototype.updateDirtyChildrenOnAncestors = function(change) {
	var that = this;
	var dirty = this.dirty(change);
	_.each(this.ancestors(), function(ancestor){
		ancestor.updateDirtyChildren(change, that, dirty);
	})
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
