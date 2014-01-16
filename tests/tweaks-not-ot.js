var assert = require('assert');

/**
 * So changesets is broken and ot.js is time consuming. For now, lets just record the whole attrbiture set on each save.
 */


suite('Tweaks', function() {
	test('create a tweak', function(done, server, client) {

		server.eval(function() {
			Tweaks.find().observe({
				added: addedNewTweak
			});
			function addedNewTweak(tweak) {
				emit('tweak', tweak);
			}
		});
		server.once('tweak', function(tweak) {
			assert.equal(tweak.changes.foo.value, 'bar');
		});

		client.eval(function() {
			var item = Item(Items.insert({name: 'corporate', type: 'folder'}));
			var change = newChange();
			createTweak(item, change, null, null, {foo: {name: 'foo', value: 'bar'}},
				function(id){
					var tweak = Tweak(id);
					emit('tweak', tweak.attributes());
				}
			);
		});

		client.once('tweak', function(attributes) {
			assert.equal(attributes.foo.value, 'bar');
			done();
		});


	});
});
