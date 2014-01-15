Meteor.startup(function () {
	Future = Npm.require('fibers/future');
	ot = Meteor.require('ot');

	Items.remove({});
	Changes.remove({});
	Tweaks.remove({});
	Versions.remove({});
	if (Items.find().count() === 0) {
		var change = Change(Changes.insert({}));

		var insert = function (parent, itemData) {
			var id = new Meteor.Collection.ObjectID()._str;

			var defaults = {
				_id: id,
				parent: parent,
				attributes: {}
			};
			item = _.extend(defaults, itemData);

			console.log(JSON.stringify(item));

			/**
			 * Ugh we can't {{#each}} around an object - only an array - so we have to create an array
			 */
			var newAttributes = {};
			_.each(item.attributes, function(value, key) {
				newAttributes[key] = {name: key, value: value};
			});
			newAttributes['_enabled'] = {name: '_enabled', value: true};
			item.attributes = {_enabled: {name: '_enabled', value: false}};

			Items.insert(item);

			var item = Item(id);

			console.log(JSON.stringify(item.name()));

			createTweak(item, change, null, null, newAttributes, function(){});

			return id;
		}

		{
			var corporate = insert(null, {type: 'folder', name: 'corporate'});
			{
				var landing = insert(corporate, {type: 'page', name: 'landing'});
				{
					var hero = insert(landing, {type: 'section_hero', name: 'hero'});
					{
						var image = insert(hero, {type: 'image', name: 'image', attributes: {width: 2000, height: 800}});
						{
							insert(image, {type: 'text', name: 'url', attributes: {text: 'https://d2c87l0yth4zbw.cloudfront.net/i/home/intro-ipad.jpg'}});
						}
						insert(hero, {type: 'text', name: 'header', attributes: {text: 'Soundtrack your life'}});
						insert(hero, {type: 'text', name: 'subhead', attributes: {text: 'Let Spotify bring you the right music for every mood and moment.'}});
					}
				}
				var features = insert(corporate, {type: 'page', name: 'features'});
				{
					var heading = insert(features, {type: 'text', name: 'heading', attributes: {text: 'Follow & share'}});
					var body = insert(features, {type: 'text', name: 'body', attributes: {text: 'Music brings people together. That’s why Spotify is so social. Share music on Spotify, Facebook, Twitter, your blog and via email. You can follow other cool people too. When they find great new music, so do you.'}});
					var intro = insert(features, {type: 'section_hero', name: 'intro'});
					{
						var image = insert(intro, {type: 'image', name: 'image', attributes: {url: 'https://d2c87l0yth4zbw.cloudfront.net/i/home/intro-bike.jpg', width: 2000, height: 800}});
						{
							var url = insert(image, {type: 'manual_translation', name: 'url', attributes: {international: 'https://d2c87l0yth4zbw.cloudfront.net/i/logo-en.jpg'}});
							{
								var list = insert(url, {type: 'list', name: 'translations'});
								{
									insert(list, {type: 'manual_translation_snipet', name: 'en', attributes: {language: 'en', text: 'https://d2c87l0yth4zbw.cloudfront.net/i/logo-en.jpg'}});
									insert(list, {type: 'manual_translation_snipet', name: 'fr', attributes: {language: 'fr', text: 'https://d2c87l0yth4zbw.cloudfront.net/i/logo-fr.jpg'}});
									insert(list, {type: 'manual_translation_snipet', name: 'de', attributes: {language: 'de', text: 'https://d2c87l0yth4zbw.cloudfront.net/i/logo-de.jpg'}});
									insert(list, {type: 'manual_translation_snipet', name: 'pt', attributes: {language: 'pt', text: 'https://d2c87l0yth4zbw.cloudfront.net/i/logo-pt.jpg'}});
									insert(list, {type: 'manual_translation_snipet', name: 'pl', attributes: {language: 'pl', text: 'https://d2c87l0yth4zbw.cloudfront.net/i/logo-pl.jpg'}});
								}
							}
						}
						insert(intro, {type: 'text', name: 'header', attributes: {text: 'Build your collection'}});
						insert(intro, {type: 'text', name: 'subhead', attributes: {text: 'It’s easy to build a personal collection by creating your own playlists.'}});
					}
				}
				var team = insert(corporate, {type: 'page', name: 'team'});
				{
					insert(team, {type: 'text', name: 'heading', attributes: {text: 'The board of directors'}});
					var faces = insert(team, {type: 'section_tiles', name: 'faces', attributes: {columns: 5}});
					{
						var tiles = insert(faces, {type: 'list', name: 'tiles'});
						{
							var t1 = insert(tiles, {type: 'image', name: 'daniel', order: 1.0, attributes: {width: 300, height: 400}});
							{
								insert(t1, {type: 'text', name: 'url', attributes: {text: 'https://d2c87l0yth4zbw.cloudfront.net/i/faces/daniel.jpg'}});
							}
							var t2 = insert(tiles, {type: 'image', name: 'martin', order: 2.0, attributes: {width: 300, height: 400}});
							{
								insert(t2, {type: 'text', name: 'url', attributes: {text: 'https://d2c87l0yth4zbw.cloudfront.net/i/faces/martin.jpg'}});
							}
							var t3 = insert(tiles, {type: 'image', name: 'sean', order: 3.0, attributes: {width: 300, height: 400}});
							{
								insert(t3, {type: 'text', name: 'url', attributes: {text: 'https://d2c87l0yth4zbw.cloudfront.net/i/faces/sean.jpg'}});
							}
							var t4 = insert(tiles, {type: 'video_tile', name: 'video', order: 2.5});
							{
								insert(t4, {type: 'text', name: 'title', attributes: {text: 'This is the title'}});
								var image = insert(t4, {type: 'image', name: 'image', attributes: {width: 300, height: 400}});
								{
									insert(image, {type: 'text', name: 'url', attributes: {text: 'https://d2c87l0yth4zbw.cloudfront.net/i/faces/video.jpg'}});
								}
								var yt = insert(t4, {type: 'youtube', name: 'youtube', attributes: {native_width: 300, native_height: 400}});
								{
									insert(yt, {type: 'text', name: 'id', attributes: {text: 'UXzlmYJhdvQ'}});
								}
							}
						}
					}
				}
			}
		}

		change.live(function(){});

	}
});