tournamenter
============

Robocup 2014 Administration panel for leagues

[![Build Status](https://travis-ci.org/RoboCupDev/tournamenter.svg?branch=improvements)](https://travis-ci.org/RoboCupDev/tournamenter)

Setting up a development environment
====================================

0. Install [nodejs](http://howtonode.org/how-to-install-nodejs) and [npm](http://howtonode.org/introduction-to-npm) on your machine.

1. Clone this repository by running

        $ git clone https://github.com/RoboCupDev/tournamenter.git

2. Install dependencies

        $ npm install

3. Test if everything works by running

        $ node app

   and then looking at http://127.0.0.1:1337
   
4. Optional params, used to configure tournamenter:
        
	+ Server Configuration (all are optional):
		* `--port`: Port to run tournamenter
		* `--prod`: Runs in production mode (Assets are compiled, minified and concatenated).
		* `--env.APP_NAME`: The name of your application (tournament maybe?). Should be human-readable...
		* `--env.PASSWORD`: If set, views will be public, but all management will be protected by this password. (No, no Username required).
	+ Adapter Configuration:
		* `--adapter.module`: `sails-mongo`, `sails-disk` or any other sails adapter.
		* `--adapter.url`: In case of Mongo, your adapter URL.
	+ Backup Configuration:
		* `--backup.interval`: Interval to backup, in minutes.
		* `--backup.path`: path-to-a-folder to save DB backups (Saved as JSON)
		* `--backup.prefix` Prefix of backup file names used to save.

5. Usage examples: 
	+ `node app`
	+ `node app --env.PASSWORD 12345 --env.APP_NAME "My Tournament Name"`
	+ `node app --env.PASSWORD pass1234 --port=8090 --adapter.module sails-mongo --adapter.url mongodb://localhost:27017/my_mongo_db --backup.interval 10 --backup.path /Users/me/backups/ --backup.prefix myappname_ --env.APP_NAME "Robot Tournament"`


Tests
=====

You can see if the tests pass by running

        $ npm test
