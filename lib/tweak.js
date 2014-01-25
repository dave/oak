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

quickTweak = function(item, changes, done) {

	var change = getChange();
	var version = null;
	var previous = change.lastTweak(item);
	if (!previous)
		version = item.lastVersion();

	var previousAttributes = previous ? previous.attributes() : version ? version.attributes() : item.attributes();

	var updates = {};

	_.each(previousAttributes, function(attribute, name) {
		updates[name] = {name: name, value: attribute.value};
	});

	//_.each(item.type().attributes, function(attribute, name){

	//	var oldValue = previousAttributes[name] ? previousAttributes[name].value : null;
	//	var newValue = changes[name];

	//	updates[name] = {name: name, value: (newValue != null ? newValue : oldValue)};

	//});

	_.each(changes, function(value, name){
		updates[name] = {name: name, value: value};
	});

	createTweak(item, change, previous, version, updates,
		function(id) {
			if (done)
				done(id);
		}
	);

	//item.updateDirtyChildrenOnAncestors(change);
}

createTweak = function(item, change, previous, version, attributes, result) {

	/**
	 * We've disabled OT, so we'll just store the full attribute set in changes

	var changes = {};
	var previousAttributes = previous ? previous.attributes() : version ? version.attributes() : {};

	_.each(attributes, function(value, name){
		if (previousAttributes[name] == null)
			previousAttributes[name] = '';
		changes[name] = changesets.text.constructChangeset(previousAttributes[name], value).pack();
	});

	 */
	var changes = attributes;

	/*
	 * Calculate if this change makes the item dirty...
	 */
	var dirty = false;
	if (change.id() == item.created()) {
		dirty = true;
	}
	else {
		_.each(changes, function(attribute, name){
			var oldValue = item.attribute(name);
			var newValue = attribute.value;
			if (oldValue != newValue) {
				dirty = true;
			}
		});
	}

	var data = {
		item: item.id(),
		change: change.id(),
		order: previous ? previous.order() + 1 : 0,
		previous: previous ? previous.id() : null,
		version: version ? version.id() : null,
		changes: changes,
		dirty: dirty
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

		var upsertQ;
		var q = {
			item: data.item,
			change: data.change,
			order: data.order
		};
		if (data.previous == null) {
			upsertQ = q;
		} else {
			upsertQ = {
				$or: [
					q,
					{previous: data.previous}
				]
			}
		}

		var response = Tweaks.upsert(
			upsertQ,
			{
				$setOnInsert: {
					item: data.item,
					change: data.change,
					order: data.order,
					previous: data.previous,
					version: data.version,
					changes: data.changes,
					dirty: data.dirty
				}
			}
		);

		return response.insertedId;
	}
});

/**
 * Calculate a full set of attributes by adding all OT changes together.
 */
TweakObject.prototype.attributes = function() {
	/**
	 * We've disabled OT, so we store the full attributes on ecah tweak.

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

	 */

	return this.changes();
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

TweakObject.prototype.dirty = function() {
	return this.data().dirty;
}