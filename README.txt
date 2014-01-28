
==================================
Installation
----------------------------------
Install Meteor:
$ curl https://install.meteor.com | /bin/sh

To run in dev mode - http://localhost:3000/
$ meteor --settings dev.json
==================================


==============================
Installing other helpful stuff
------------------------------
Nodejs:
http://nodejs.org/download/

Meteorite package archive:
$ npm install -g meteorite

Brew:
$ ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"

Laika testing framework:
$ brew update
$ brew install mongodb
$ brew install phantomjs
$ sudo npm install -g laika
==============================


===================================
To run tests
-----------------------------------
First start mongodb for testing framework:
$ mongod --smallfiles --noprealloc --nojournal

Then run tests:
$ laika
===================================


===========================
Helpers
---------------------------
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
===========================