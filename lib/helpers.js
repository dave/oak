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

var _roots;
roots = function() {
	if (_roots == null)
		_roots = new ItemCollection(Items.find({parent: null}, {sort: {group: 1}}));
	return _roots;
}

selected = function() {
	if (Session.get('selected_item') === undefined)
		return null;
	else
		return Item(Session.get('selected_item'));
}

setter = function(value) {
	return value === null ||
		typeof value == 'string' ||
		typeof value == 'boolean' ||
		typeof value == 'number';
}