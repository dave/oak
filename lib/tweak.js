TweakObject.prototype._get = function(id) {
	return Tweaks.findOne({_id: id});
}

TweakObject.prototype.previous = function(id) {
	if (setter(id)) {
		this.data().previous = id;
		this._previous = null;
		return this;
	}
	if (this._previous == null)
		this._previous = Change(this.data().previous);
	return this._previous;
}

TweakObject.prototype.item = function(id) {
	if (setter(id)) {
		this.data().item = id;
		this._item = null;
		return this;
	}
	if (this._item == null)
		this._item = Item(this.data().item);
	return this._item;
}

TweakObject.prototype.change = function(id) {
	if (setter(id)) {
		this.data().change = id;
		this._change = null;
		return this;
	}
	if (this._change == null)
		this._change = Change(this.data().change);
	return this._change;
}