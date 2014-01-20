/**
 *
 * Helper functions for navigating and displaying the tree
 *
 */

/**
 * Gets the selected Item
 * @returns {ItemObject}
 */
selected = function() {
	if (Session.get('selected_item') === undefined)
		return null;
	else
		return Item(Session.get('selected_item'));
}

/**
 * Getter for this item's parent
 * @returns {ItemObject}
 */
ItemObject.prototype.parent = function(id) {
	if (this._parent == null)
		this._parent = Item(this.data().parent);
	return this._parent;
}

/**
 * Is this item one of the root nodes?
 * @returns {boolean}
 */
ItemObject.prototype.root = function() {
	return this.data().parent == null;
}

/**
 * Get an array of this items ancestors [root, [...], parent]
 * @returns {Array}
 */
ItemObject.prototype.ancestors = function() {
	var ancestors = [];
	var item = this;
	while (item = item.parent()) {
		ancestors.unshift(item);
	}
	return ancestors;
}

/**
 * Get an array of this items ancestors ids [root, [...], parent]
 * @returns {Array}
 */
ItemObject.prototype.ancestorIds = function() {
	var ancestors = [];
	var item = this;
	while (item = item.parent()) {
		ancestors.unshift(item.id());
	}
	return ancestors;
}

/**
 * Is this item open in the tree browser interface? If a boolean is passed, we open of close the Item.
 * @returns {boolean|ItemObject}
 */
ItemObject.prototype.open = function(state) {
	if (setter(state)) {
		Session.set('open_' + this.id(), state);
		return this;
	}
	return Session.get('open_' + this.id()) === true && this.visibleChildren(currentChange()).has();
}

/**
 * Toggle the open/closed state
 * @returns {ItemObject}
 */
ItemObject.prototype.toggle = function() {
	Session.set('open_' + this.id(), !this.open());
	return this;
}

/**
 * Is this item selected in the tree interface?
 * @returns {boolean}
 */
ItemObject.prototype.selected = function() {
	return Session.equals("selected_item", this.id());
}

/**
 * Call this method to select the item in the tree interface.
 * @returns {ItemObject}
 */
ItemObject.prototype.select = function() {
	itemSelectedGlobal = true;
	Session.set('selected_item', this.id());
	Session.set('selected_ancestors', this.ancestorIds());

	if (treeNavTimer)
		clearTimeout(treeNavTimer);

	var item = this;

	treeNavTimer = setTimeout(function() {
		Router.go('detail', {_id: item.id()});
	}, 250);

	return this;
}
itemSelectedGlobal = false;
var treeNavTimer;

/**
 * Rerurns a collection of the children
 * @returns {ItemCollection}
 */
ItemObject.prototype.children = function(name) {
	if (typeof name == 'string') {
		return new ItemCollection(Items.find({parent: this.id(), name: name}));
	}
	else {
		return new ItemCollection(Items.find({parent: this.id()}));
	}
}

/**
 * Rerurns a collection of the children that are currently visible
 * @returns {ItemCollection}
 */
ItemObject.prototype.visibleChildren = function(change, name) {

	var query = {parent: this.id()};

	if (change != null) {
		query['$or'] = [{'attributes._enabled.value': true}, {created: change.id()}];
	}
	else {
		query['attributes._enabled.value'] = true;
	}

	if (typeof name == 'string')
		query['name'] = name;

	return new ItemCollection(Items.find(query));

}

/**
 * Rerurns a child Item by name
 * @returns {ItemObject}
 */
//ItemObject.prototype.child = function(name) {
//	return Item(Items.findOne({parent: this.id(), name: name}));
//}

/**
 * Returns an collection of the sibilngs
 * @returns {ItemCollection}
 */
ItemObject.prototype.siblings = function() {
	if (this._siblings == null) {
		this._siblings = new ItemCollection(Items.find({parent: this.data().parent}));
	}
	return this._siblings;
}

/**
 * Get the next sibling in either direction.
 * @param direction - 1 = down, -1 = up
 * @returns {ItemObject}
 */
ItemObject.prototype.next = function(direction) {

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

/**
 * Get the next item in the tree view, based on the open/closed state of each item.
 * @param direction - 1 = down, -1 = up
 * @returns {ItemObject}
 */
ItemObject.prototype.tree = function(direction) {

	direction = direction === undefined ? 1 : direction;

	if (direction == 1 && this.open()) {
		/**
		 * going down and this node is open - return the first child.
		 */
		return this.visibleChildren(currentChange()).first();
	}

	var next = this.next(direction);
	if (next) {
		if (direction == -1 && next.open()) {
			/**
			 * we're going up, and the previous sibling is open - we
			 * recursively select the last child
			 */
			var last = next.visibleChildren(currentChange()).last();
			while (last.open()) {
				last = last.visibleChildren(currentChange()).last();
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
