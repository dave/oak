
Collection.prototype.cursor = function() {
	this._cursor.rewind();
	return this._cursor;
}

Collection.prototype.fetch = function() {
	if (this._fetch == null)
		this._fetch = this.cursor().fetch();
	return this._fetch;
}

Collection.prototype.array = function() {
	if (this._array == null) {
		this._array = [];
		var self = this;
		$.each(this.fetch(), function(key, value) {
			self._array.push(self._get(value._id))
		});
	}
	return this._array;
}

Collection.prototype.has = function() {
	return this.length() > 0;
}

Collection.prototype.length = function() {
	return this._cursor.count();
}

Collection.prototype.first = function() {
	if (this.length() == 0)
		return null;
	return this.array()[0];
}

Collection.prototype.last = function() {
	if (this.length() == 0)
		return null;
	return this.array()[this.length() - 1];
}

Collection.prototype.at = function(index) {
	if (index < 0 || index > this.length() - 1)
		return null;
	return this.array()[index];
}

Collection.prototype.index = function(item) {
	for(var i = 0; i < this.length(); i++) {
		if (this.at(i)._id === item._id)
			return i;
	}
	return null;
}

ItemCollection.prototype._get = function(id) {
	return item(id);
}

VersionCollection.prototype._get = function(id) {
	return version(id);
}
