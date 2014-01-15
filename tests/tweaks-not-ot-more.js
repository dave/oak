var assert = require('assert');


suite('Tweaks', function() {
	test('create a version from a tweak', function(done, server, client) {

		client.eval(function() {
			var item = Item(Items.insert({name: 'corporate', type: 'folder'}));
			var change = newChange();
			createTweak(item, change, null, null, {foo: {name: 'foo', value: 'bar'}},
				function(id){
					var tweak = Tweak(id);

					var previous = tweak;
					createTweak(item, change, previous, null, {foo: {name: 'foo', value: 'bar more'}},
						function(id) {


							change.live(function(){
								var tweak = Tweak(id);
								emit('live-attribute', item.attribute('foo'));
							});
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
