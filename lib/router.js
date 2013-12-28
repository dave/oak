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
			//return item(this.params._id);
			return item(this.params._id);
		},
		before: function() {
			var item = this.data();

			if (item != null) {
				item.select();
				while (item.parent() != null) {
					item = item.parent();
					item.open(true);
				}
			}
		}
	});
});
