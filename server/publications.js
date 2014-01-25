Meteor.publish('itemsByParent', function(options) {
	return Items.find({parent: {$in: options.parents}});
});

Meteor.publish('itemsAll', function() {
	return Items.find({}, {fields: {_id: 1, name: 1, type: 1, parent: 1, created: 1, mature: 1, enabled: 1}});
});

Meteor.publish('itemsOne', function(id) {
	return Items.find({$or: [{_id: id}, {parent: id}]});
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
