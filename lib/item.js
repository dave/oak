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
ItemObject.prototype.attribute = function(name) {
	if (this.null())
		return null;
	return this.data().attributes[name] == null ? null : this.data().attributes[name].value;
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