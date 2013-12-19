Template.tree.getRoot = function () {
	return childrenOf(null, true);
}

Template.main.getChildren = function () {
	return childrenOf(this, true);
}

Template.main.hasChildren = function () {
	return hasChildren(this);
}

Template.main.isOpen = function () {
	return this._id == null || isOpen(this);
}

Template.main.isItem = function () {
	return this._id != null;
}

Template.main.glyph = function () {

	if (!hasChildren(this))
		return 'glyphicon-unchecked';

	if (isOpen(this))
		return 'glyphicon-collapse-down';

	return 'glyphicon-expand';

}

Template.main.events({
	'click': function (e) {
		e.preventDefault();
		setSelectedItem(this);
		setOpen(this, !isOpen(this));
		e.stopImmediatePropagation();
	}
});

Template.main.selected = function () {
	return Session.equals("selected_item", this._id) ? "selected" : '';
};

Template.main.order = function () {
	var version = getLiveVersion(this);
	if (version == null)
		return 0;
	else
		return version.order;
}

Template.outer.rendered = function () {
	$('body').on('keydown', function (e) {

		if (document.activeElement.tagName != 'BODY')
			return;

		var current = getSelectedItem();
		if (e.keyCode == 40)
			keyPressDown(current);
		else if (e.keyCode == 38)
			keyPressUp(current);
		else if (e.keyCode == 39)
			keyPressRight(current);
		else if (e.keyCode == 37)
			keyPressLeft(current);

		e.stopImmediatePropagation();
	});
}

var keyPressUp = function(current) {
	var prev = nextTreeNode(current, -1);
	if (prev != null)
		setSelectedItem(prev);
}

var keyPressDown = function(current) {
	var next = nextTreeNode(current, 1);
	if (next != null)
		setSelectedItem(next);
	else if (hasChildren(current)) {
		/**
		 * If we're at the bottom of the tree, and the current item has children
		 * then it is closed, so let's open it.
		 */
		setOpen(current, true);
	}
}

var keyPressRight = function(current) {
	if (isOpen(current))
		setSelectedItem(getFirst(childrenOf(current)));
	else if (hasChildren(current))
		setOpen(current, true);
}

var keyPressLeft = function(current) {
	if (isOpen(current))
		setOpen(current, false);
	else
		setSelectedItem(getParent(current));
}