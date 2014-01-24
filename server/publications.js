Meteor.publish('itemsByParent', function(options) {
	return Items.find({parent: {$in: options.parents}});
});

Meteor.publish('items', function() {
	return Items.find();
});

Meteor.publish('changes', function() {
	return Changes.find();
});

Meteor.publish('versions', function() {
	return Versions.find();
});

Meteor.publish('tweaks', function() {
	return Tweaks.find();
});
