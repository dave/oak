Tweaks = new Meteor.Collection("tweaks");

Meteor.methods({
	tweak: function(data) {
		var user = Meteor.user();

		if (!user)
			throw new Meteor.Error(401, "You need to log in");

		Tweaks.upsert({item: data.itemId, change: data.changeId}, {$setOnInsert: {previous: data.previousId}, $push: data.updates});

		return 'bar';
	}
});