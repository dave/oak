Meteor.publish('items', function() {
	return Items.find();
});

Meteor.publish('changes', function() {
	return Changes.find();
});
