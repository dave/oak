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

	var id;

	if (ob.change != null && ob.item != null) {
		var tweak = Tweaks.findOne({change: ob.change, item: ob.item});
		if (!tweak)
			return null;
		id = tweak._id;
	}
	else {
		id = ob._id != null ? ob._id : ob;
	}

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
