inherit = function(cls, superclass) {
	function F() {}
	F.prototype = superclass.prototype;
	cls.prototype = new F;
	cls.prototype.constructor = cls;
};



Collection = function(cursor) {
	this._cursor = cursor;
};

Collection.prototype._get = function(id) {};

ItemCollection = function(cursor){
	Collection.call(this, cursor);
}
inherit(ItemCollection, Collection);

TweakCollection = function(cursor){
	Collection.call(this, cursor);
}
inherit(TweakCollection, Collection);

ChangeCollection = function(cursor){
	Collection.call(this, cursor);
}
inherit(ChangeCollection, Collection);

VersionCollection = function(cursor){
	Collection.call(this, cursor);
}
inherit(VersionCollection, Collection);





GenericObject = function(id) {
	this._id = id;
};

ItemObject = function(id) {
	GenericObject.call(this, id);
};
inherit(ItemObject, GenericObject);

ChangeObject = function(id) {
	GenericObject.call(this, id);
};
inherit(ChangeObject, GenericObject);

TweakObject = function(id) {
	GenericObject.call(this, id);
};
inherit(TweakObject, GenericObject);

VersionObject = function(id) {
	GenericObject.call(this, id);
};
inherit(VersionObject, GenericObject);