var _items = {};
item = function(ob) {

	if (ob == null)
		return null;

	var id = ob._id != null ? ob._id : ob;

	if (_items[id] == null)
		_items[id] = new Item(id);

	return _items[id].exists() ? _items[id] : null;
};

var _versions = {};
version = function(ob) {

	if (ob == null)
		return null;

	var id = ob._id != null ? ob._id : ob;

	if (_versions[id] == null)
		_versions[id] = new Version(id);

	return _versions[id].exists() ? _versions[id] : null;
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
		return item(Session.get('selected_item'));
}

setter = function(value) {
	return value === null ||
		typeof value == 'string' ||
		typeof value == 'boolean' ||
		typeof value == 'number';
}