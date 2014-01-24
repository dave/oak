
tally = function(sessionKey, keyOrKeys, state) {
	Session.setDefault(sessionKey, {});
	var tallyObject = Session.get(sessionKey);
	var changed = false;
	var keys = keyOrKeys instanceof Array ? keyOrKeys : [keyOrKeys];
	_.each(keys, function(key){
		if (state) {
			if (!tallyObject[key]) {
				changed = true;
				tallyObject[key] = true;
			}
		}
		else {
			if (tallyObject[key]) {
				changed = true;
				delete tallyObject[key];
			}
		}
	});
	if (changed) {
		Session.set(sessionKey, tallyObject);
	}
}