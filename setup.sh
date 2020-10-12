# setup and run repo
sudo apt install python 3
sudo apt install python3-pip
pip3 install fastapi
pip3 install uvicorn
pip3 install aiofiles
cd /var/www/html/KingOnTheHillGame && /home/{USER}/.local/bin/uvicorn main:app --reload --host 0.0.0.0
# apache proxy to forward port 80 to 8000
sudo apt install apache2
sudo cp /etc/apache2/site-enabled/000-default.conf /etc/apache2/site-enabled/000-default.conf.bak
sudo vi /etc/apache2/site-enabled/000-default.conf
    # ProxyPreserveHost On
    # ProxyRequests Off
    # ProxyPass / http://localhost:8000/
    # ProxyPassReverse / http://localhost:8000/
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo apachectl restart
