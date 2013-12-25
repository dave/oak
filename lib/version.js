Version.prototype._get = function(id) {
	return Versions.findOne({_id: id});
}

Version.prototype.item = function(name) {
	if (name === undefined) {
		return item(this.data().item);
	}
	this.data().item = name;
	return this;
}

Version.prototype.order = function(order) {
	if (order === undefined) {
		if (this.null())
			return 0;
		return this.data().order;
	}
	this.data().order = order;
	return this;
}

Version.prototype.attribute = function(name, value) {
	if (value === undefined) {
		if (this.null())
			return null;
		return this.data().attributes[name] == null ? null : this.data().attributes[name].value;
	}
	this.data().attributes[name].value = value;
	return this;
}
