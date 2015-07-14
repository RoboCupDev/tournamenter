# start from centos -- we all know why
FROM centos:centos7

# install nodejs
RUN yum install -y http://dl.fedoraproject.org/pub/epel/7/x86_64/e/epel-release-7-2.noarch.rpm
RUN yum install -y nodejs npm

# let's install mongodb
RUN yum -y update; yum clean all
RUN yum -y install epel-release; yum clean all
RUN yum -y install mongodb-server; yum clean all
RUN mkdir -p /data/db

# Let's have the mongodb available from the outside, shall we
EXPOSE 27017
CMD ["/usr/bin/mongod"]

# Bundle app source
COPY . ./
# Install app dependencies
RUN cd ./; npm install

# let's use the PORT we've been using up to now
EXPOSE  1337

# and start the app
CMD ["/usr/bin/node", "app.js"]
