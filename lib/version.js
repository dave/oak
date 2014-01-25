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

VersionObject.prototype.attributes = function() {
	return this.data().attributes;
}

createVersion = function(tweak, result) {

	var item = tweak.item();
	var change = tweak.change();
	var attributes = tweak.attributes();

	var data = {
		item: item.id(),
		change: change.id(),
		attributes: attributes
	};

	Meteor.call(
		'version',
		data,
		function(error, id) {
			if (error) {
				throw error;
			}
			else {
				Items.update(
					{
						_id: item.id()
					},
					{
						$set:
						{
							mature: true,
							enabled: attributes._enabled.value,
							attributes: attributes,
							version: id,
							change: change.id()
						}
					}
				);
				result(id);
			}
		}
	);
};

Meteor.methods({
	version: function(data) {

		//var user = Meteor.user();
		//if (!user)
		//	throw new Meteor.Error(401, "You need to log in");

		/**
		 * Lets find the previous version of this item, and increment the order
		 */
		var previous = Versions.find({item: data.item}, {sort: {order: -1}, limit: 1}).fetch();
		var previousId = previous.length > 0 ? previous[0]._id : null;
		var order = previous.length > 0  ? previous[0].order + 1 : 0;

		var upsertQ;
		var q = {
			/**
			 * A version for this item in this change
			 */
			item: data.item,
			change: data.change
		};
		if (previousId == null) {
			upsertQ = q;
		} else {
			upsertQ = {
				/**
				 * We abort the insert if either of these returns a version
				 */
				$or: [
					q,
					{
						/**
						 * Any version that points to the same previous one
						 */
						previous: previousId
					}
				]
			};
		}

		var response = Versions.upsert(
			upsertQ,
			{
				/**
				 * We only insert this data if nothing is found above.
				 */
				$setOnInsert: {
					item: data.item,
					change: data.change,
					previous: previousId,
					attributes: data.attributes,
					//changes: data.changes,
					order: order
				}
			}
		);

		return response.insertedId;
	}
});