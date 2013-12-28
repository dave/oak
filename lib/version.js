Version.prototype._get = function(id) {
	return Versions.findOne({_id: id});
}

Version.prototype.item = function(name) {
	if (setter(name)) {
		this.data().item = name;
		return this;
	}
	return item(this.data().item);
}

Version.prototype.order = function(order) {
	if (setter(order)) {
		this.data().order = order;
		return this;
	}
	if (this.null())
		return 0;
	return this.data().order;
}

Version.prototype.attribute = function(name, value) {
	if (setter(value)) {
		this.data().attributes[name].value = value;
		return this;
	}
	if (this.null())
		return null;
	return this.data().attributes[name] == null ? null : this.data().attributes[name].value;
}
