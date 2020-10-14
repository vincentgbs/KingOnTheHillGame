import random
import string
from typing import Optional
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

class Game(BaseModel):
    user_id: str
    action: str
    game_id: str
    player: int
    nop: Optional[int] = None
    current: Optional[int] = None
    turn: Optional[str] = None

class Response(BaseModel):
    def __init__(self, dictionary):
        BaseModel.__init__(self)
        if("user_id" in dictionary.keys()):
            self.user_id = dictionary["user_id"]
        if("accepted" in dictionary.keys()):
            self.accepted = dictionary["accepted"]
        if("waiting" in dictionary.keys()):
            self.waiting = dictionary["waiting"]
        if("turn" in dictionary.keys()):
            self.turn = dictionary["turn"]
    user_id: Optional[str] = None
    accepted: Optional[bool] = None
    waiting: Optional[bool] = None
    turn: Optional[str] = None

app = FastAPI()
app.mount("/koth-frontend", StaticFiles(directory="/vagrant/KingOnTheHillGame/frontend"), name="static")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

class Kingonthehill:
    def __init__(self, debug=False, db='db.sqlite3'):
        self.debug = debug;
        self.conn = sqlite3.connect(db)
        self.cur = self.conn.cursor()

    def migrate(self):
        if (self.debug):
            print('DROPPING and CREATING `games` and `turns`;')
        self.cur.execute('DROP TABLE IF EXISTS `games`');
        self.cur.execute('DROP TABLE IF EXISTS `turns`');
        self.cur.execute('''CREATE TABLE `games` (
            `game_id` varchar(255),
            `user_id` varchar(255),
            `player` int(2) DEFAULT NULL,
            `nop` int(2) DEFAULT NULL);''')
        self.cur.execute('''CREATE TABLE `turns` (
            `game_id` varchar(255),
            `player` int(2),
            `turn` int(4),
            `json` varchar(1023));''')
        self.conn.commit()
        self.conn.close()
        return {"DB Migration": "Complete"}

    def get_random_string(self, length):
        letters = string.ascii_lowercase
        result_str = ''.join(random.choice(letters) for i in range(length))
        return result_str

    def create_unique_game_id(self):
        check = self.get_random_string(12)
        while (self.find_game_id(check)):
            check = self.get_random_string(12)
        return check

    def find_game_id(self, gid):
        game = self.cur.execute('''SELECT `game_id`
        FROM `games` WHERE `game_id`=?;''', (gid,)).fetchone();
        return ((not game is None))

    def new_game(self, post):
        if (self.debug):
            print('new_game called')
            print(post)
        post.game_id = self.create_unique_game_id()
        self.cur.execute('''INSERT INTO `games` (`game_id`, `user_id`, `player`, `nop`)
        VALUES (?, ?, ?, ?);''', (post.game_id, post.user_id, post.player, post.nop))
        self.conn.commit()
        return self.return_post(post)

    def return_post(self, post):
        self.conn.close()
        post.user_id = None # never return user_id
        return post

    def join_game(self, post):
        if (self.debug):
            print('join_game called')
            print(post)
        check = self.cur.execute('''SELECT `nop`, `player`
        FROM `games` WHERE `game_id`=? AND `user_id`=?;''',
        (post.game_id,post.user_id)).fetchone()
        if (check is None):
            check = self.cur.execute('''SELECT `nop`, COUNT(`player`)
            FROM `games` WHERE `game_id`=?;''', (post.game_id,)).fetchone()
            post.nop = check[0]
            post.player = check[1] # next_available_spot
            if (post.player < post.nop): # add to game
                self.cur.execute('''INSERT INTO `games` (`game_id`, `user_id`, `player`, `nop`)
                VALUES (?, ?, ?, ?);''', (post.game_id, post.user_id, post.player, post.nop))
            else: # game is already full
                post.nop = -1
                post.player = -1
        else:
            post.nop = check[0]
            post.player = check[1]
            post = self.rejoin_game(post);
        self.conn.commit()
        return self.return_post(post)

    def rejoin_game(self, post):
        if (self.debug):
            print('rejoin_game called')
            print(post)
        return post

    def check_user_and_game(self, post):
        game = self.cur.execute('''SELECT `user_id`
        FROM `games` WHERE `game_id`=? AND `user_id`=? AND `player`=?;''',
        (post.game_id, post.user_id, post.player)).fetchone();
        if (not game is None): # game != null
            if (game[0] == post.user_id):
                return True
        return False # else

    def send_turn(self, post):
        if (self.debug):
            print('send_turn called')
            print(post)
        if (self.check_user_and_game(post)):
            self.cur.execute('''INSERT INTO `turns` (`game_id`, `player`, `turn`, `json`)
            VALUES (?, ?, ?, ?);''', (post.game_id, post.player, post.current, post.turn))
            response = Response({"accepted":"true"})
        else:
            response = post
        self.conn.commit()
        return self.return_post(response)

    def get_turn(self, post):
        if (self.debug):
            print('get_turn called')
            print(post)
        if (self.check_user_and_game(post)):
            turn = self.cur.execute('''SELECT `turn`, `json` FROM `turns` WHERE `game_id`=? AND `turn`>=?;''', (post.game_id, post.current)).fetchone();
            if (turn is None):
                response = Response({"waiting":"true"})
            else:
                response = Response({"turn":turn[1]})
        else: # invalid game_id + user_id + player
            response = Response({"accepted":"false"})
        self.conn.commit()
        return self.return_post(response)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/migrate")
def read_root():
    k = Kingonthehill()
    return k.migrate()

@app.post("/koth")
def create_game(post: Game):
    k = Kingonthehill(True)
    if (post.action == 'new_game'):
        return k.new_game(post)
    elif (post.action == 'join_game'):
        return k.join_game(post)
    elif (post.action == 'rejoin_game'):
        return k.rejoin_game(post)
    elif (post.action == 'send_turn'):
        return k.send_turn(post)
    elif (post.action == 'get_turn'):
        return k.get_turn(post)
    else:
        return {"accepted":"false"}
