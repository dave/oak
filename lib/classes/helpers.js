var _items = {};
Item = function(ob) {

	if (ob == null)
		return null;

	var id = ob._id != null ? ob._id : ob;

	if (_items[id] == null)
		_items[id] = new ItemObject(id);

	return _items[id].exists() ? _items[id] : null;
};

var _tweaks = {};
Tweak = function(ob) {

	if (ob == null)
		return null;

	var id = ob._id != null ? ob._id : ob;

	if (_tweaks[id] == null)
		_tweaks[id] = new TweakObject(id);

	return _tweaks[id].exists() ? _tweaks[id] : null;
};

var _changes = {};
Change = function(ob) {

	if (ob == null)
		return null;

	var id = ob._id != null ? ob._id : ob;

	if (_changes[id] == null)
		_changes[id] = new ChangeObject(id);

	return _changes[id].exists() ? _changes[id] : null;
};

var _versions = {};
Version = function(ob) {

	if (ob == null)
		return null;

	var id = ob._id != null ? ob._id : ob;

	if (_versions[id] == null)
		_versions[id] = new VersionObject(id);

	return _versions[id].exists() ? _versions[id] : null;
};

var _roots;
roots = function() {
	if (_roots == null)
		_roots = new ItemCollection(Items.find({parent: null}, {sort: {group: 1}}));
	return _roots;
}

setter = function(value) {
	return value === null ||
		typeof value == 'string' ||
		typeof value == 'boolean' ||
		typeof value == 'number';
}

/**
 * Using this as a parameter to one of the object getters returns the plain _id of the object without getting it from the database. Yup - it's weird but I don't care. It's javascript baby! OK I promise I won't do it again.
 */
$id = '$id';