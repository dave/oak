Template.logIn.events({
	'click #login': function(e, t) {
		Meteor.loginWithGoogle({},function(err){
			if (err) {
				console.log(err);
			} else {
				console.log('Done');
			}
		});
	}
});