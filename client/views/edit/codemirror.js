Template.codemirror.placeholder = function(){
	if (!this.item.loaded()) {
		return 'Loading...';
	}
	return '';
}
Template.codemirror.attribute = function(){
	if (!this.item.loaded()) {
		return '';
	}
	else {
		return this.item.attribute(this.name, currentChange()) || '';
	}
}

Template.codemirror.events({
	'focus textarea': function(e) {
		//var myCodeMirror = CodeMirror.fromTextArea(e.target, {theme: 'cobalt'});
	}
});

//Template.codemirror.preserve(['.CodeMirror', 'textarea']);

Template.codemirror.rendered = function() {

	console.log('rendered');

	if (!this.done){
		console.log('fromTextArea');
		CodeMirror.fromTextArea(this.find('textarea'), {mode: 'text/x-markdown'});
	}
	this.done = true;
}