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

Data = function(id) {
	this._id = id;
	//this._db = id == null ? null : this._get(id);
};

Item = function(id) {
	Data.call(this, id);
};
inherit(Item, Data);