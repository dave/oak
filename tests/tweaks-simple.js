var assert = require('assert');

/*
suite('Tweaks', function() {
	test('create a couple of tweaks and make sure the OT reconstruction works', function(done, server, client) {

		server.eval(function() {
			Tweaks.find().observe({
				added: addedNewTweak
			});
			function addedNewTweak(tweak) {
				emit('tweak', tweak);
			}
		});
		server.once('tweak', function(tweak) {
			assert.equal(tweak.changes.foo, '+0:0:bar:0');
		});

		client.eval(function() {
			var item = Item(Items.insert({name: 'corporate', type: 'folder'}));
			var change = newChange();
			createTweak(item, change, null, null, {foo: 'bar'},
				function(id){
					var tweak = Tweak(id);
					emit('tweak', tweak.attributes());

					var previous = tweak;
					createTweak(item, change, previous, null, {foo: 'bar more'},
						function(id) {
							var tweak = Tweak(id);
							emit('tweak2', tweak.attributes());
						}
					)

				}
			);
		});

		client.once('tweak', function(attributes) {
			assert.equal(attributes.foo, 'bar');
		});

		client.once('tweak2', function(attributes) {
			assert.equal(attributes.foo, 'bar more');
			done();
		});

	});
});
*/