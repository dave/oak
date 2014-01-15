/**
 *
 * Helper functions for things to do with an Item's type
 *
 */

/**
 * Getter for the type
 * @returns {object} - jsom from the type spec for this type
 */
ItemObject.prototype.type = function() {
	return types[this.data().type];
}

/**
 *
 * Builds, assembles and cache's a list of the type hints based on this Item, and it's ancestors. Type hints are inherited from parents, allowing rich structures to be defined very easily.
 * @returns {object}
 */
ItemObject.prototype.hints = function() {
	if (this._hints === undefined) {
		var ancestors = this.ancestors();
		var item;
		var hints = {};
		while (item = ancestors.shift()) {
			var hint;
			if (item.type().children) {
				//children
				var nameOfChild = ancestors.length > 0 ? ancestors[0].name() : this.name();
				hint = item.type().children[nameOfChild].hints;
			}
			else if (item.type().list) {
				//list
				hint = item.type().list.hint;
			}
			if (hint) {
				/**
				 * Lets get the array of things this type is compatible with
				 */
				var is = (this.type().is || []).slice(0);
				/**
				 * ... and add the actual type to the start.
				 */
				is.unshift(this.type().name);
				var type;
				while (type = is.pop()) {
					if (hint[type]) {
						hints = _.extend(hints, hint[type]);
					}
				}
			}
		}
		this._hints = _.isEmpty(hints) ? {} : hints;
	}
	return this._hints;
}

ItemObject.prototype.listHolds = function() {
	return this.hints().types || this.type().list.types;
}
