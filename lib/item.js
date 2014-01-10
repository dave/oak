
selected = function() {
	if (Session.get('selected_item') === undefined)
		return null;
	else
		return Item(Session.get('selected_item'));
}

ItemObject.prototype._get = function(id) {
	return Items.findOne({_id: id});
}

ItemObject.prototype.name = function(name) {
	if (setter(name)) {
		this.data().name = name;
		return this;
	}
	return this.data().name;
}

ItemObject.prototype.type = function(name) {
	if (setter(name)) {
		this.data().type = name;
		return this;
	}
	return types[this.data().type];
}

ItemObject.prototype.order = function(order) {
	if (setter(order)) {
		this.data().order = order;
		return this;
	}
	if (this.null())
		return 0;
	return this.data().order;
}

ItemObject.prototype.attribute = function(name, value) {
	if (setter(value)) {
		this.data().attributes[name].value = value;
		return this;
	}
	if (this.null())
		return null;
	return this.data().attributes[name] == null ? null : this.data().attributes[name].value;
}

ItemObject.prototype.parent = function(id) {
	if (setter(id)) {
		this.data().parent = id;
		this._parent = null;
		return this;
	}
	if (this._parent == null)
		this._parent = Item(this.data().parent);
	return this._parent;
}

ItemObject.prototype.tweakId = function(id) {
	if (setter(id)) {
		return this.tweak(id);
	}
	return this.data().tweak;
}
ItemObject.prototype.tweak = function(id) {
	if (setter(id)) {
		this.data().tweak = id;
		this._tweak = null;
		return this;
	}
	if (this._tweak == null)
		this._tweak = Tweak(this.data().tweak);
	return this._tweak;
}

ItemObject.prototype.root = function() {
	return this.data().parent == null;
}

ItemObject.prototype.ancestors = function() {
	var ancestors = [];
	var item = this;
	while (item = item.parent()) {
		ancestors.unshift(item);
	}
	return ancestors;
}

ItemObject.prototype.hints = function() {
	if (this._hints === undefined) {
		var ancestors = this.ancestors();
		var item;
		var hints = {};
		while (item = ancestors.shift()) {
			var hint;
			if (item.type().children) {
				//children
				var nameOfChild = ancestors.length > 0 ? ancestors[0].name() : this.name();
				hint = item.type().children[nameOfChild].hints;
			}
			else if (item.type().list) {
				//list
				hint = item.type().list.hint;
			}
			if (hint) {
				/**
				 * Lets get the array of things this type is compatible with
				 */
				var is = (this.type().is || []).slice(0);
				/**
				 * ... and add the actual type to the start.
				 */
				is.unshift(this.type().name);
				var type;
				while (type = is.pop()) {
					if (hint[type]) {
						$.extend(true, hints, hint[type]);
					}
				}
			}
		}
		this._hints = $.isEmptyObject(hints) ? null : hints;
	}
	return this._hints;
}

ItemObject.prototype.open = function(state) {
	if (setter(state)) {
		if (state === 'toggle')
			Session.set('open_' + this.id(), !this.open());
		else
			Session.set('open_' + this.id(), state);
		return this;
	}
	return Session.get('open_' + this.id()) === true && this.children().has();
}

ItemObject.prototype.selected = function() {
	return Session.equals("selected_item", this.id());
}

itemSelectedGlobal = false;
var treeNavTimer;
ItemObject.prototype.select = function() {
	itemSelectedGlobal = true;
	Session.set('selected_item', this.id());

	if (treeNavTimer)
		clearTimeout(treeNavTimer);

	var item = this;

	treeNavTimer = setTimeout(function() {
		Router.go('items', {_id: item.id()});
	}, 250);

	return this;
}

ItemObject.prototype.children = function() {
	if (this._children == null)
		this._children = new ItemCollection(Items.find({parent: this.id()}));
	return this._children;
}

ItemObject.prototype.child = function(name) {
	return Item(Items.findOne({parent: this.id(), name: name}));
}

ItemObject.prototype.siblings = function() {
	if (this._siblings == null) {
		this._siblings = new ItemCollection(Items.find({parent: this.data().parent}));
	}
	return this._siblings;
}

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

ItemObject.prototype.tree = function(direction) {

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


