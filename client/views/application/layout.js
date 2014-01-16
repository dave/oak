Template.header.helpers({
	active: function() {
		var args = Array.prototype.slice.call(arguments, 0);
		args.pop();
		var active = _.any(args, function(name) {
			return Router.current().template === name;
		});
		return active && 'active';
	}
});

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