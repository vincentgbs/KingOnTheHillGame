import random
import string
from typing import Optional
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

class Turn(BaseModel):
    user_id: str
    action: str
    game_id: str
    player: int
    current: Optional[int] = None
    turn: Optional[str] = None

class Game(BaseModel):
    user_id: str
    action: str
    game_id: Optional[str]
    player: Optional[int]
    nop: Optional[int] = None

app = FastAPI()
app.mount("/static", StaticFiles(directory="/vagrant/KingOnTheHillGame/frontend"), name="static")

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Function:
    def __init__(self, db='kingonthehill'):
        self.conn = sqlite3.connect(db)
        self.cur = self.conn.cursor()
        # self.migrate(True)

    def migrate(self, clear=False):
        if (clear):
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
            `json` varchar(1023))
            ;''')
        self.conn.commit()
        self.conn.close()

    def get_random_string(self, length):
        letters = string.ascii_lowercase
        result_str = ''.join(random.choice(letters) for i in range(length))
        return result_str

    def create_unique_game_id(self):
        check = self.get_random_string(12)
        while (self.find_game_id(check)):
            check = self.get_random_string(12)
        return check

    def find_game_id(self, game_id):
        # return self.games.find_one({"game_id": game_id})
        return False

    def start_game(self, post):
        print('start_game called')
        print(post)
        game = {"user_id": post.user_id, "nop": post.nop, "player": 0,
            "game_id": self.create_unique_game_id()}
        self.cur.execute('''INSERT INTO `games` (`game_id`, `user_id`, `player`, `nop`)
            VALUES (?, ?, ?, ?);''', (game["game_id"], game["user_id"], game["player"], game["nop"]))
        self.conn.commit()
        self.conn.close()
        return game

    def join_game(self, post):
        print('join_game called')
        print(post)
        row = self.cur.execute('''SELECT `nop`, COUNT(`player`)
        FROM `games` WHERE `game_id`=?;''', (post.game_id,)).fetchone()
        nop = row[0]
        count = row[1]
        post.nop = nop # game.number_of_players
        if (count < nop):
            post.player = count # next_available_spot
            self.cur.execute('''INSERT INTO `games` (`game_id`, `user_id`, `player`, `nop`)
                VALUES (?, ?, ?, ?);''', (post.game_id, post.user_id, count, nop))
        else:
            post.player = -1
        self.conn.commit()
        self.conn.close()
        return post

    def send_turn(self, post):
        print('send_turn called')
        print(post)
        game = self.cur.execute('''SELECT `user_id`, `nop`
        FROM `games` WHERE `game_id`=? AND `user_id`=? AND `player`=?;''',
        (post.game_id, post.user_id, post.player)).fetchone();
        if (game[0] == post.user_id):
            self.cur.execute('''INSERT INTO `turns` (`game_id`, `player`, `turn`, `json`)
            VALUES (?, ?, ?, ?);''', (post.game_id, post.player, post.current, post.turn))
            response = {"accepted": "true"}
        else:
            response = post
        self.conn.commit()
        self.conn.close()
        return response

    def get_turn(self, post):
        print('get_turn called')
        print(post)
        game = self.cur.execute('''SELECT `user_id`, `nop`
        FROM `games` WHERE `game_id`=? AND `user_id`=? AND `player`=?;''',
        (post.game_id, post.user_id, post.player)).fetchone();
        if (game[0] == post.user_id):
            turn = self.cur.execute('''SELECT `turn`, `json` FROM `turns` WHERE `game_id`=? AND `turn`>=?;''', (post.game_id, post.current)).fetchone();
            if (turn is None):
                response = {"waiting": "true"}
            else:
                response = {"turn": turn[1]}
        else: # invalid game_id + user_id + player
            response = {"invalid": "true"}
        self.conn.commit()
        self.conn.close()
        return response

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/game")
async def create_game(post: Game):
    f = Function()
    if (post.action == 'start_new_game'):
        return f.start_game(post)
    elif (post.action == 'join_game'):
        return f.join_game(post)
    else:
        return {"Invalid": "Action"}

@app.post("/turn")
async def process_turn(post: Turn):
    f = Function()
    if (post.action == 'send_turn'):
        return f.send_turn(post)
    elif (post.action == 'get_turn'):
        return f.get_turn(post)
    else:
        return {"Invalid": "Action"}
