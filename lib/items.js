getLiveVersion = function(item) {
	if (item == null)
		return null;
	else
		return Versions.findOne({_id: item.live});
}
getSelectedItem = function() {
	return getItem(Session.get('selected_item'));
}
//treeNavTimer = null;
setSelectedItem = function(item) {
	if (item != null && item._id != null) {
		Session.set('selected_item', item._id);
		//if (treeNavTimer)
		//	clearTimeout(treeNavTimer);
		//treeNavTimer = setTimeout(function() {
		//	Router.go('items', {_id: item._id});
		//}, 250)
	}
}
getItem = function(id) {
	if (id == null)
		return null;
	else
		return Items.findOne({_id: id});
}
getParent = function(item) {
	return getItem(item.parent);
}
isOpen = function(item) {
	return Session.get('open_' + item._id) && hasChildren(item);
}
setOpen = function(item, state) {
	Session.set('open_' + item._id, state);
}
hasChildren = function(item) {
	return childrenOf(item).length > 0;
}
childrenOf = function(item, returnCursor) {
	if (returnCursor)
		return Items.find({parent: item == null ? null : item._id}, {sort: {group: 1}});
	else
		return childrenOf(item, true).fetch();
}
getLast = function(items) {
	return items[items.length - 1];
}
getFirst = function(items) {
	return items[0];
}
siblingsOf = function(item) {
	return Items.find({parent: item.parent}, {sort: {group: 1}}).fetch();
}
getRootNodes = function() {
	return Items.find({parent: null}, {sort: {group: 1}}).fetch();
}
findIndex = function(items, item) {
	for(var i = 0; i < items.length; i++) {
		if (equals(items[i], item))
			return i;
	}
	return null;
}
equals = function(item1, item2) {
	return item1._id == item2._id;
}
nextSibling = function(item, direction) {
	var siblings = siblingsOf(item);
	var index = findIndex(siblings, item);
	if (index == 0 && direction == -1)
		return null; //at start of list and going backwards
	else if (index == siblings.length - 1 && direction == 1)
		return null; //at end of list and going forwards
	else if (direction == 1)
		return siblings[index + 1];
	else
		return siblings[index - 1];
}
nextTreeNode = function(item, direction) {

	if (item == null) {
		/**
		 * Nothing is selected. Let's select the first root node
		 */
		return getFirst(getRootNodes());
	}

	if (direction == 1 && isOpen(item)) {
		/**
		 * going down and this node is open - return the first child.
		 */
		return getFirst(childrenOf(item));
	}

	var next = nextSibling(item, direction);
	if (next) {
		if (direction == -1 && isOpen(next)) {
			/**
			 * we're going up, and the previous sibling is open - we
			 * recursively select the last child
			 */
			var lastClosedChild = getLast(childrenOf(next));
			while (isOpen(lastClosedChild)) {
				lastClosedChild = getLast(childrenOf(lastClosedChild));
			}
			return lastClosedChild;
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
		if (item.parent != null)
			return getItem(item.parent);
		else
			return null;
	}
	else {
		/**
		 * We're at the bottom of the siblings, going down - to get the next
		 * node we have to recursively select parents until we find one that
		 * has a next sibling.
		 */
		var current = getItem(item.parent);
		var parentsNextSibling = null;
		while(current != null && parentsNextSibling == null) {
			parentsNextSibling = nextSibling(current, 1);
			current = getItem(current.parent);
		}
		return parentsNextSibling;
	}
}