
Data.prototype.id = function() {
	return this._id;
}

Data.prototype.data = function() {
	return this._get(this.id());
};

Data.prototype.null = function() {
	return this.data() == null;
}

Data.prototype.exists = function() {
	return this.data() != null;
}
