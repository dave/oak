Version.prototype._get = function(id) {
	return Versions.findOne({_id: id});
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