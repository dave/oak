Handlebars.registerHelper('$print', function(object) {
	return JSON.stringify(object);
});

Handlebars.registerHelper('$has', function(object) {
	return !_.isEmpty(object);
});

Handlebars.registerHelper('$many', function(object) {
	return object.length > 1;
});

Handlebars.registerHelper('$cursor', function(object) {
	return object.count() > 0;
});