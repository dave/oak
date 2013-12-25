var extend = Meteor.require('extend');
var foreach = Meteor.require('foreach');

Meteor.startup(function () {
	Items.remove({});
	Changes.remove({});
	Versions.remove({});
	if (Items.find().count() === 0) {
		var change = Changes.insert({});

		var insert = function (parent, item, version) {
			var item_id = new Meteor.Collection.ObjectID()._str;
			var version_id = new Meteor.Collection.ObjectID()._str;

			var itemDefaults = {
				_id: item_id,
				parent: parent,
				live: version_id
			};
			item = extend({}, itemDefaults, item);

			var versionDefaults = {
				_id: version_id,
				item: item_id,
				enabled: true,
				change: change,
				version: 1,
				order: 1.0,
				attributes: {}
			}
			version = extend({}, versionDefaults, version);

			var newAttributes = {};
			foreach(version.attributes, function(value, key) {
				newAttributes[key] = {name: key, value: value};
			});
			version.attributes = newAttributes;

			Items.insert(item);
			Versions.insert(version);
			return item_id;
		}

		{
			var corporate = insert(null, {type: 'folder', name: 'corporate'});
			{
				var landing = insert(corporate, {type: 'page', name: 'landing'});
				{
					var hero = insert(landing, {type: 'section_hero', name: 'hero'});
					{
						insert(hero, {type: 'image', name: 'image'}, {attributes: {url: 'https://d2c87l0yth4zbw.cloudfront.net/i/home/intro-ipad.jpg', width: 2000, height: 800}});
						insert(hero, {type: 'text', name: 'header'}, {attributes: {text: 'Soundtrack your life'}});
						insert(hero, {type: 'text', name: 'subhead'}, {attributes: {text: 'Let Spotify bring you the right music for every mood and moment.'}});
					}
				}
				var features = insert(corporate, {type: 'page', name: 'features'});
				{
					var heading = insert(features, {type: 'text', name: 'heading'}, {attributes: {text: 'Follow & share'}});
					var body = insert(features, {type: 'text', name: 'body'}, {attributes: {text: 'Music brings people together. That’s why Spotify is so social. Share music on Spotify, Facebook, Twitter, your blog and via email. You can follow other cool people too. When they find great new music, so do you.'}});
					var intro = insert(features, {type: 'section_hero', name: 'intro'});
					{
						insert(intro, {type: 'image', name: 'image'}, {attributes: {url: 'https://d2c87l0yth4zbw.cloudfront.net/i/home/intro-bike.jpg', width: 2000, height: 800}});
						insert(intro, {type: 'text', name: 'header'}, {attributes: {text: 'Build your collection'}});
						insert(intro, {type: 'text', name: 'subhead'}, {attributes: {text: 'It’s easy to build a personal collection by creating your own playlists.'}});
					}
				}
				var team = insert(corporate, {type: 'page', name: 'team'});
				{
					insert(team, {type: 'text', name: 'heading'}, {attributes: {text: 'The board of directors'}});
					var faces = insert(team, {type: 'section_tiles', name: 'faces'}, {attributes: {columns: 5}});
					{
						var tiles = insert(faces, {type: 'list', name: 'tiles'});
						{
							insert(tiles, {type: 'image', name: 'daniel'}, {order: 1.0, attributes: {url: 'https://d2c87l0yth4zbw.cloudfront.net/i/faces/daniel.jpg', width: 300, height: 400}});
							insert(tiles, {type: 'image', name: 'martin'}, {order: 2.0, attributes: {url: 'https://d2c87l0yth4zbw.cloudfront.net/i/faces/martin.jpg', width: 300, height: 400}});
							insert(tiles, {type: 'image', name: 'sean'},   {order: 3.0, attributes: {url: 'https://d2c87l0yth4zbw.cloudfront.net/i/faces/sean.jpg',   width: 300, height: 400}});
							insert(tiles, {type: 'image', name: 'kate'},   {order: 2.5, attributes: {url: 'https://d2c87l0yth4zbw.cloudfront.net/i/faces/kate.jpg',   width: 300, height: 400}});
						}

					}
				}
			}
		}
	}
});