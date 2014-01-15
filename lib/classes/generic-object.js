
GenericObject.prototype.id = function() {
	return this._id;
}

GenericObject.prototype.data = function() {
	return this._get(this.id());
};

GenericObject.prototype.null = function() {
	return this.data() == null;
}

GenericObject.prototype.exists = function() {
	return this.data() != null;
}
