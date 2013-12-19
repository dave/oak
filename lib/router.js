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
			return Items.findOne(this.params._id);
		},
		before: function() {
			var item = this.getData();
			Session.set('selected_item', item._id);
			while (item.parent != null) {
				item = getParent(item);
				setOpen(item, true);
			}
		}
	});
});
