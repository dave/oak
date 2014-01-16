var assert = require('assert');

/*
suite('Tweaks', function() {
	test('create a couple of tweaks and make sure the OT reconstruction works', function(done, server, client) {

		server.eval(function() {
			Versions.find().observe({
				added: addedNewVersion
			});
			function addedNewVersion(version) {
				emit('version', version);
			}
		});
		server.once('version', function(version) {
			assert.equal(version.attributes.foo, 'bar more');
		});

		client.eval(function() {
			var item = Item(Items.insert({name: 'corporate', type: 'folder'}));
			var change = newChange();
			createTweak(item, change, null, null, {foo: 'bar'},
				function(id){
					var tweak = Tweak(id);

					var previous = tweak;
					createTweak(item, change, previous, null, {foo: 'bar more'},
						function(id) {
							var tweak = Tweak(id);

							change.live();

							emit('live-attribute', item.attribute('foo'))
						}
					)

				}
			);
		});

		client.once('live-attribute', function(value) {
			assert.equal(value, 'bar more');
			done();
		});


	});
});
	*/