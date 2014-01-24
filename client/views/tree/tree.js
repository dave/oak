Template.tree.getRoot = function () {
	return roots().cursor();
}

Template.main.register = function () {
	//tally('active_items', Item(this).id(), true);
}

Template.main.getChildren = function () {
	return Item(this).visibleChildren(currentChange()).cursor();
}

Template.main.hasChildren = function () {
	return Item(this).visibleChildren(currentChange()).has();
}

Template.main.isOpen = function () {
	return this._id == null || Item(this).open();
}

Template.main.glyph = function () {

	if (!Item(this).visibleChildren(currentChange()).has())
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

Template.main.disabledClass = function() {
	return Item(this).disabled(currentChange()) ? 'item-disabled' : '';
}

Template.outer.rendered = function () {
	$('body').on('keydown', function (e) {

		if (document.activeElement.tagName != 'BODY') {
			return;
		}

		var keyPress = function(action) {
			e.preventDefault();
			action.call(this);
			e.stopImmediatePropagation();
		}

		if (e.keyCode == 40) {
			keyPress(function(){
				keyPressDown();
			});
		}
		else if (e.keyCode == 38) {
			keyPress(function(){
				keyPressUp();
			});
		}
		else if (e.keyCode == 39) {
			keyPress(function(){
				keyPressRight();
			});
		}
		else if (e.keyCode == 37) {
			keyPress(function(){
				keyPressLeft();
			});
		}
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
	if (next) {
		next.select();
	}
	else if (selected().visibleChildren(currentChange()).has()) {
		/**
		 * If we're at the bottom of the tree, and the current item has children
		 * then it is closed, so let's open it.
		 */
		selected().open(true);
	}
}

var keyPressRight = function() {
	if (selected().open()) {
		selected().visibleChildren(currentChange()).first().select();
	}
	else if (selected().visibleChildren(currentChange()).has()) {
		selected().open(true);
	}
}

var keyPressLeft = function() {
	if (selected().open())
		selected().open(false);
	else
		selected().parent().select();
}