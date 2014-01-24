Router.configure({
	layoutTemplate: 'layout',
	//loadingTemplate: 'loading',
	//waitOn: function() { return Meteor.subscribe('items', {parents: activeItemIdsArray()}); }
	waitOn: function() { return Meteor.subscribe('items'); }
});

activeItemIdsArray = function(){
	var openItems = Session.get('active_items') || {};
	var arr = Object.keys(openItems);
	arr.push(null);
	return arr;
}

Router.map(function() {
	this.route('changes', {
		path: '/changes'
	});
	this.route('items', {
		path: '/'
	});
	this.route('detail', {
		path: '/item/:_id',
		data: function() {
			var item = Item(this.params._id);
			return item ? item.data() : null;
		},
		before: function() {

			var item = Item(this.data());
			if (!item)
				return;

			Session.set('selected_item', item.id());
			Session.set('selected_ancestors', item.ancestorIds());

			if (itemSelectedGlobal)
				return;

			do {
				item.open(true);
				item = item.parent();
			}
			while (item);

		}
	});

});

