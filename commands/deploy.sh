cd /opt/deploy/bitstamp
git pull
sudo forever stop ./bin/www
sudo forever start -a -l /opt/deploy/bitstamp/logs/forever.log -o /opt/deploy/bitstamp/logs/application.log -e /opt/deploy/bitstamp/logs/error.log ./bin/www
