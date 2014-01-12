/**
 *
 * Basic helpers for the Version class
 *
 */

/**
 * Helper functon for the GenericObject super class
 * @param id
 * @returns {Cursor}
 * @private
 */
VersionObject.prototype._get = function(id) {
	return Versions.findOne({_id: id});
}
