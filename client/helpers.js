Handlebars.registerHelper('$print', function(object) {
	return JSON.stringify(object);
});

Handlebars.registerHelper('$has', function(object) {
	return !_.isEmpty(object);
});