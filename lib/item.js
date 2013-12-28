Item.prototype._get = function(id) {
	return Items.findOne({_id: id});
}

Item.prototype.type = function(name) {
	if (name === undefined) {
		return types[this.data().type];
	}
	this.data().type = name;
	return this;
}

Item.prototype.live = function(id) {
	if (id === undefined) {
		if (this._live == null)
			this._live = version(this.data().live);
		return this._live;
	}
	this.data().live = id;
	this._live = version(this.data().live);
	return this;
}

Item.prototype.parent = function(id) {
	if (id === undefined) {
		if (this._parent == null)
			this._parent = item(this.data().parent);
		return this._parent;
	}
	this.data().parent = id;
	this._parent = item(this.data().parent);
	return this;
}

Item.prototype.root = function() {
	return this.data().parent == null;
}

Item.prototype.open = function(state) {

	if (state === undefined) {
		return Session.get('open_' + this.id()) === true && this.children().has();
	}
	if (state === 'toggle')
		Session.set('open_' + this.id(), !this.open());
	else
		Session.set('open_' + this.id(), state);
	return this;
}

Item.prototype.selected = function() {
	return Session.equals("selected_item", this.id());
}

Item.prototype.select = function() {
	Session.set('selected_item', this.id());
	return this;
	//if (treeNavTimer)
	//	clearTimeout(treeNavTimer);
	//treeNavTimer = setTimeout(function() {
	//	Router.go('items', {_id: item._id});
	//}, 250)
}

Item.prototype.children = function() {
	if (this._children == null)
		this._children = new ItemCollection(Items.find({parent: this.id()}));
	return this._children;
}

Item.prototype.child = function(name) {
	return item(Items.findOne({parent: this.id(), name: name}));
}

Item.prototype.siblings = function() {
	if (this._siblings == null) {
		this._siblings = new ItemCollection(Items.find({parent: this.data().parent}));
	}
	return this._siblings;
}

Item.prototype.next = function(direction) {

	direction = direction === null ? 1 : direction;
	var index = this.siblings().index(this);
	var atEnd = index == this.siblings().length() - 1;
	var atStart = index == 0;

	if (atStart && direction == -1)
		return null; //at start of list and going backwards
	else if (atEnd && direction == 1)
		return null; //at end of list and going forwards
	else
		return this.siblings().at(index + direction);

}

Item.prototype.tree = function(direction) {

	direction = direction === undefined ? 1 : direction;

	if (direction == 1 && this.open()) {
		/**
		 * going down and this node is open - return the first child.
		 */
		return this.children().first();
	}

	var next = this.next(direction);
	if (next) {
		if (direction == -1 && next.open()) {
			/**
			 * we're going up, and the previous sibling is open - we
			 * recursively select the last child
			 */
			var last = next.children().last();
			while (last.open()) {
				last = last.children().last();
			}
			return last;
		}
		/**
		 * We have a next sibling - let's just return that.
		 */
		return next;
	}

	/**
	 * If we get here, we don't have a sibling in the required direction, so
	 * we're at the start or end of the siblings
	 */
	if (direction == -1) {
		/**
		 * We're at the top of the siblings, going up - let's select the parent.
		 * If we don't have a parent we have a root node, so we return null.
		 */
		return this.parent();
	}
	else {
		/**
		 * We're at the bottom of the siblings, going down - to get the next
		 * node we have to recursively select parents until we find one that
		 * has a next sibling.
		 */
		var current = this.parent();
		var parentsNextSibling = null;
		while(current != null && parentsNextSibling == null) {
			parentsNextSibling = current.next(direction);
			current = current.parent();
		}
		return parentsNextSibling;
	}
}


