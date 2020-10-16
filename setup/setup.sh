#!/bin/bash
#
if [ "$EUID" -ne 0 ]
  then echo 'Please run as root'
  exit
fi
# sudo chmod 700 setup.sh
# sudo ./setup.sh

# ubuntu-20.04 base image
# uvicorn running on port 8000 (default)
apt install python3 -y
apt install python3-pip -y
pip3 install fastapi # framework
pip3 install uvicorn # server
pip3 install aiofiles # static files library
uvicorn main:app --reload --host 0.0.0.0 & disown
# apache proxy for port forwarding
apt install apache2 -y
cp /etc/apache2/sites-enabled/000-default.conf /etc/apache2/sites-enabled/000-default.conf.bak
cp ./000-default.conf /etc/apache2/sites-enabled/000-default.conf
a2enmod proxy
a2enmod proxy_http
systemctl restart apache2
