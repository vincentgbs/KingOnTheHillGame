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
uvicorn main:app --reload --host 0.0.0.0
# uvicorn main:app --reload --host 0.0.0.0 & disown
# apache proxy for port forwarding
apt install apache2 -y
cp /etc/apache2/sites-enabled/000-default.conf /etc/apache2/sites-enabled/000-default.conf.bak
cp ./000-default.conf /etc/apache2/sites-enabled/000-default.conf
a2enmod proxy
a2enmod proxy_http
systemctl restart apache2

# local https only for development and debugging
# openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./local.key -out ./local.pem  -subj "/C=US/ST=NY/L=NYC/O=DN Now Organization/OU=IT Department/CN=192.168.33.10"
# uvicorn main:app --reload --host 0.0.0.0 --ssl-keyfile local.key --ssl-certfile local.pem
# ProxyPass / https://localhost:8000/
# ProxyPassReverse / https://localhost:8000/
