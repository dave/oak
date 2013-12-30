Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	waitOn: function() { return Meteor.subscribe('items'); }
});

Router.map(function() {
	this.route('items', {path: '/'});
	this.route('items', {
		path: '/item/:_id',
		data: function() {
			var i = Item(this.params._id);
			return i ? i.data() : null;
		},
		before: function() {

			if (itemSelectedGlobal)
				return;

			var i = Item(this.data());
			if (!i)
				return;

			Session.set('selected_item', i.id());
			do {
				i.open(true);
				i = i.parent();
			}
			while (i);

		}
	});
});
