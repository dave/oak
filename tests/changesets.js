var assert = require('assert');

/**
 * Couldn't get changesets working :(
 */

/*
suite('changesets', function() {
	test('check that changesets can be joined together', function(done, server, client) {

		client.eval(function() {

			val1 = "foo";
			val2 = "foo bar";
			val3 = "foo bar laa";

			var c1 = changesets.constructChangeset(val1, val2);
			var c2 = changesets.constructChangeset(val2, val3);

			console.log('merging...');
			var c = c2.substract(c1);//.merge(c1);
			console.log('done...');
			//_.each(c1, function(op){c.push(op)});
			//_.each(c2, function(op){c1.push(op)});

			console.log(JSON.stringify(c1));

			emit('go', c1.apply('foo'));
		});

		client.once('go', function(value) {
			assert.equal(value, 'foo bar laa');
			done();
		});


	});
});
*/