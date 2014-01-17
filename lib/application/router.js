Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	waitOn: function() { return Meteor.subscribe('items'); }
});

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
