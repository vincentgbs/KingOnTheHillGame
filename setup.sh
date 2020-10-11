sudo apt install python 3
sudo apt install python3-pip
pip3 install fastapi
pip3 install uvicorn
pip3 install aiofiles
cd /vagrant/KingOnTheHillGame && uvicorn main:app --reload --host 0.0.0.0
