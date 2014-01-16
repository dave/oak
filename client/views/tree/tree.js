Template.tree.getRoot = function () {
	return roots().cursor();
}

Template.main.getChildren = function () {
	return Item(this).children().cursor();
}

Template.main.hasChildren = function () {
	return Item(this).children().has();
}

Template.main.isOpen = function () {
	return this._id == null || Item(this).open();
}

Template.main.isItem = function () {
	return this._id != null;
}

Template.main.glyph = function () {

	if (!Item(this).children().has())
		return 'glyphicon-unchecked';

	if (Item(this).open())
		return 'glyphicon-collapse-down';

	return 'glyphicon-expand';

}

Template.main.events({
	'click .item-icon': function (e) {
		e.preventDefault();
		Item(this).select().toggle();
		e.stopImmediatePropagation();
	},
	'click .item-label': function (e) {
		e.preventDefault();
		Item(this).select().open(true);
		e.stopImmediatePropagation();
	}
});

Template.main.selected = function () {
	return Item(this).selected() ? "selected" : '';
};

Template.main.dirty = function () {
	return Item(this).dirty(currentChange());
};

Template.main.hasDirtyChildren = function () {
	return Item(this).hasDirtyChildren(currentChange());
};

Template.main.order = function () {
	return Item(this) == null ? '0' : Item(this).attribute('_order');
}

Template.outer.rendered = function () {
	$('body').on('keydown', function (e) {

		if (document.activeElement.tagName != 'BODY')
			return;

		e.preventDefault();

		if (e.keyCode == 40)
			keyPressDown();
		else if (e.keyCode == 38)
			keyPressUp();
		else if (e.keyCode == 39)
			keyPressRight();
		else if (e.keyCode == 37)
			keyPressLeft();

		e.stopImmediatePropagation();
	});
}

var keyPressUp = function() {
	if (!selected())
		return;

	var next = selected().tree(-1);
	if (next)
		next.select();

}

var keyPressDown = function() {
	if (!selected()) {
		roots().at(0).select();
		return;
	}
	var next = selected().tree(1);
	if (next)
		next.select();
	else if (selected().children().has()) {
		/**
		 * If we're at the bottom of the tree, and the current item has children
		 * then it is closed, so let's open it.
		 */
		selected().open(true);
	}
}

var keyPressRight = function() {
	if (selected().open())
		selected().children().first().select();
	else if (selected().children().has())
		selected().open(true);
}

var keyPressLeft = function() {
	if (selected().open())
		selected().open(false);
	else
		selected().parent().select();
}