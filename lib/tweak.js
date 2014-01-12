/**
 * THE LAW!!!
 *
 * Each time you hit save (and there's changes), we create a Tweak for that item.
 * So you have multiple Tweaks for mulitple Items in each Change.
 * When you make a Change live, a single Version object is created for each Item that has changes.
 *
 * So:
 *
 * *** Tweaks are immutable. This is lovely for meteor and OT
 * *** Version is a nice simple list of changes for each Item.
 *
 * Tweak.
 * _id
 * item
 * parent - each tweak follows another, unless the item is being created, in which case it would be null.
 * change - there are lots of tweaks per change
 * order - this is the order in the change, but also globally through the full version (can be derived by following parent, but this is faster to order by)
 * changes - json changesets for attributes
 *
 * Version.
 * _id
 * item
 * change - just one Version per change. Once comitted, Histories can't be rolled back.
 * tweak - the final Tweak that got rolled up into this Version
 * changes - json changesets for attributes (combination of all the rolled up tweaks)
 *
 * As soon as you start EDITING the attributes of an item, we change the UI to the specific tweak - and stop updating as further tweaks stream from the server. When we save, we know which tweak we were editing from.
 *
 */

TweakObject.prototype._get = function(id) {
	return Tweaks.findOne({_id: id});
}

createTweak = function(item, change, previous, version, attributes, result) {
	var changes = {};
	var previousAttributes = previous ? previous.attributes() : {};

	_.each(attributes, function(value, name){
		if (previousAttributes[name] == null)
			previousAttributes[name] = '';
		changes[name] = changesets.text.constructChangeset(previousAttributes[name], value).pack();
	});

	var data = {
		id: new Meteor.Collection.ObjectID()._str,
		item: item.id(),
		change: change.id(),
		previous: previous ? previous.id() : null,
		version: version ? version.id() : null,
		changes: changes
	};

	Meteor.call(
		'tweak',
		data,
		function(error, id) {
			if (error) {
				throw error;
			}
			else {
				result(id);
			}
		}
	);
};

Meteor.methods({
	tweak: function(data) {
		//var user = Meteor.user();
		//if (!user)
		//	throw new Meteor.Error(401, "You need to log in");

		var order = 0;
		if (data.previous) {
			var prev = Tweaks.findOne({_id: data.previous});
			order = prev.order;
		}

		//var order = data.previous ? Tweaks.findOne({_id: data.previous}).order + 1 : 0;

		var response = Tweaks.upsert(
			{previous: data.previous, change: data.change},
			{$setOnInsert: {
				item: data.item,
				changes: data.changes,
				version: data.version,
				order: order}
			}
		);

		return response.insertedId;
	}
});

/**
 * Calculate a full set of attributes by adding all OT changes together.
 */
TweakObject.prototype.attributes = function() {

	var attributes = {};
	if (this.version($id))
		attributes = this.version().attributes();
	else if (this.previous($id)) {
		attributes = this.previous().attributes();
	}


	_.each(this.changes(), function(packed, name) {
		var change = changesets.text.unpack(packed);
		if (attributes[name] == null)
			attributes[name] = '';
		attributes[name] = change.apply(attributes[name]);
	});
	return attributes;
}

TweakObject.prototype.previous = function(returnPlainId) {
	if (returnPlainId === $id) {
		return this.data().previous;
	}
	if (this._previous == null)
		this._previous = Tweak(this.data().previous);
	return this._previous;
}

TweakObject.prototype.version = function(returnPlainId) {
	if (returnPlainId === $id) {
		return this.data().version;
	}
	if (this._version == null)
		this._version = Version(this.data().version);
	return this._version;
}

TweakObject.prototype.item = function(returnPlainId) {
	if (returnPlainId === $id) {
		return this.data().item;
	}
	if (this._item == null)
		this._item = Item(this.data().item);
	return this._item;
}

TweakObject.prototype.change = function(returnPlainId) {
	if (returnPlainId === $id) {
		return this.data().change;
	}
	if (this._change == null)
		this._change = Change(this.data().change);
	return this._change;
}

TweakObject.prototype.order = function() {
	return this.data().order;
}

TweakObject.prototype.changes = function() {
	return this.data().changes;
}