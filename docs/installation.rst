.. _installation:

Installation
************

Linux/Mac or other UNIX based OS
================================

`nodejs` installation
---------------------

Since `tournamenter` is a NodeJS based web app you need to have `nodejs`
and `npm` installed on your machine.

For instance on Ubuntu/Debian you can run

    $ sudo apt-get install nodejs

On Mac with `homebrew` you can install it by running 

    $ brew install node


Downloading and installing tournamenter from sources
----------------------------------------------------

First of all, you need to get the latest version of the `tournamenter`
source code repository. You can do so by typing this command to the command
line:

    $ git clone --depth 1 https://github.com/RoboCupDev/tournamenter.git

After that, you should have a `tournamenter` directory in your current
working directory. Since we already have `nodejs` and `npm` installed we
can navigate into the `tournamenter/` directory and run

    $ npm install

Which will install the required packages for tournamenter to work
correctly. In order to see if everything works as expected you can type

    $ npm start

Which will make the server start at http://127.0.0.1:1337 and with a bit of
luck you should see your own `tournamenter` instance there!

