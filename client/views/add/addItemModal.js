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
		addItemModalSubmitAction(e);
	},
	'keydown #addItemModalFormTag': function(e) {
		if(e.keyCode == 13){
			addItemModalSubmitAction(e);
		}
	}
});

var addItemModalSubmitAction = function(e) {
	e.preventDefault();

	var form = $('#addItemModalFormTag');
	var name = selected().type().list ? form.find('#name').val().toLowerCase() : Session.get('addItemModalChildName');

	if (selected().type().list) {
		var r = new RegExp('^[a-z_0-9]{1,15}$');
		if (!r.test(name)) {
			alert('Name must be max 15 chars, letters, numbers and underccores.');
			return;
		}
	}

	var types = Template.addItemModalForm.types();
	var type;

	if (types.length == 1) {
		type = types[0].name;
	} else {
		type = form.find('#type').val();
		if (type == '') {
			alert('Select a type');
			return;
		}
	}

	addItemModalAddItem(
		name,
		type,
		selected().id(),
		getChange().id()
	);
	$('#addItemModal').modal('hide');
	e.stopImmediatePropagation();
}

Template.addItemModal.rendered = function() {
	$('#addItemModal').on('hidden.bs.modal', function () {
		Session.set('addItemModalFormVisible', false);
	});
}

addItemOrShowModal = function(e, source, name) {
	if (source === 'type') {
		var availableTypes = selected().childHoldsTypes(name);
		if (availableTypes.length == 1) {
			/**
			 * There's only one option, so we just add it directly
			 */
			addItemModalAddItem(
				name,
				availableTypes[0].name,
				selected().id(),
				getChange().id()
			);
			e.stopImmediatePropagation();
			return;
		}
		Session.set('addItemModalChildName', name);
	}
	Session.set('addItemModalFormVisible', true);
}

var addItemModalAddItem = function(name, type, parent, created) {
	var id = addItem({
		name: name,
		type: type,
		parent: parent,
		created: created
	});
	var item = Item(id);
	quickTweak(item, {_enabled: true});
	selected().open(true);
}