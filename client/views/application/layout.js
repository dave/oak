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

Template.header.selected = function(){
	return selected();
}

Template.logIn.events({
	'click #login': function(e, t) {
		Meteor.loginWithGoogle({},function(err){
			if (err) {
				throw err;
			}
		});
	}
});

Template.header.events({
	'click a[data-action="reset"]': function(){
		Meteor.call(
			'reset',
			null,
			function(error, id) {
				if (error) {
					throw error;
				}
				else {
					Router.go('items');
				}
			}
		);
	}
});