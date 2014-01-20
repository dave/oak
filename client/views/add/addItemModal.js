Template.addItemModalForm.item = function(){
	return selected();
}

Template.addItemModalForm.presetName = function(){
	return Session.get('addItemModalChildName');
}

Template.addItemModalForm.types = function(){
	if (selected().type().list)
		return selected().listHoldsTypes();
	else
		return selected().childHoldsTypes(Session.get('addItemModalChildName'));
}

Template.addItemModalForm.addItemModalFormVisible = function(){
	return Session.get('addItemModalFormVisible');
}

Template.addItemModal.events({
	'click button[data-action="add"]': function(e) {
		e.preventDefault();

		var form = $('#addItemModalFormTag');
		var name = selected().type().list ? form.find('#name').val() : Session.get('addItemModalChildName');

		if (selected().type().list) {
			var r = new RegExp('^[a-zA-Z_0-9]{1,15}$');
			if (!r.test(name)) {
				alert('Name must be max 15 chars, letters, numbers and underccores.')
				return;
			}
		}

		if (form.find('#type').val() == '') {
			alert('Select a type');
			return;
		}

		if (name == ''){
			alert('No name!');
			return;
		}

		var id = addItem({
			name: name.toLowerCase(),
			type: form.find('#type').val(),
			parent: selected().id(),
			created: currentChange().id()
		});

		/*
		var id = new Meteor.Collection.ObjectID()._str;
		Items.insert({
			_id: id,
			name: name.toLowerCase(),
			type: form.find('#type').val(),
			parent: selected().id(),
			attributes: {_enabled: {name: '_enabled', value: false}}
		});
		*/
		var item = Item(id);
		quickTweak(item, {_enabled: true});
		$('#addItemModal').modal('hide');
		selected().open(true);
		//Router.go('detail', {_id: item.id()});
		e.stopImmediatePropagation();
	}
});

Template.addItemModal.rendered = function() {
	$('#addItemModal').on('hidden.bs.modal', function () {
		Session.set('addItemModalFormVisible', false);
	});
}