Installation
************

Linux/Mac or other UNIX based OS
================================

`nodejs` installation
---------------------

Since `tournamenter` is a NodeJS based web app you need to have `nodejs`
and `npm` installed on your machine.

For instance on Ubuntu/Debian you can run::

    $ sudo apt-get install nodejs

On Mac with `homebrew` you can install it by running::

    $ brew install node

On Raspbian (RaspberryPi's default OS) the packages currently provided in
the repositories will not work so installing node from the command line in
this way is not really an option.

However, you can follow the advice given in `this article
<http://joshondesign.com/2013/10/23/noderpi>`_ which describes the process
of downloading a pre-built version of `nodejs` and putting it into the
`PATH`.

If you follow the tutorial, make sure you put these lines into your
`/home/pi/.bash_profile` file::

    NODE_JS_HOME=/home/pi/node-v0.10.2-linux-arm-pi 
    PATH=$PATH:$NODE_JS_HOME/bin 

given that `pi` is the name of your user on RaspberryPi.

Downloading and installing tournamenter from sources
----------------------------------------------------

First of all, you need to get the latest version of the `tournamenter`
source code repository. You can do so by typing this command to the command
line:::

    $ git clone --depth 1 https://github.com/RoboCupDev/tournamenter.git

After that, you should have a `tournamenter` directory in your current
working directory. Since we already have `nodejs` and `npm` installed we
can navigate into the `tournamenter/` directory and run::

    $ npm install

Which will install the required packages for tournamenter to work
correctly. In order to see if everything works as expected you can type::

    $ npm start

Which will make the server start at http://127.0.0.1:1337 and with a bit of
luck you should see your own `tournamenter` instance there!

If you are out of luck ...
--------------------------

Although it should not it might happen that the command above will finish
with error message. If the error looks like::

    TypeError: Cannot call method 'createCollection' of undefined

then you can easily fix the situation by starting `tournamenter` by
running::

    $ node app --adapter.module "sails-disk"

which will use your hard drive to save the data you create while playing
with tournamenter. Again, you can verify that everything is working as
expected by looking at http://127.0.0.1:1337

