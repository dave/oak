to run in dev mode:

mrt --settings dev.json



 {{$.javascript arguments }} // The new $cript helper
 {{$.Session.get key}}
 {{$.Session.equals key value}}
 {{getLength a}} returns length property
 {{$.Meteor.status.connected}}
 {{$.Meteor.userId}}
 {{cutString str maxLen}} cuts string appends...
 {{isSelected a b}} if a equals b then return " selected"
 {{isChecked a b}} if a equals b then return " checked"
 {{$eq a b}} if a equals b then return true
 {{$neq a b}} if not a equals b then return true
 {{$in a b c d}} if a equals one of optional values
 {{$nin a b c d}} if a equals none of optional values
 {{$lt a b}}
 {{$gt a b}}
 {{$lte a b}}
 {{$gte a b}}
 {{$and a b}}
 {{$or a b}}
 {{$not a}}
 {{$exists a}} a != undefined
 {{getText notation}} translation!!
