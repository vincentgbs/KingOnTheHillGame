import random
import string
from typing import Optional
from pydantic import BaseModel
import sqlite3

class kothRequest(BaseModel):
    user_id: str
    action: str
    game_id: str
    player: int
    nop: Optional[int] = None
    current: Optional[int] = None
    turn: Optional[str] = None

class kothResponse(BaseModel):
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

class Kingonthehill:
    def __init__(self, debug=False, db='db.sqlite3'):
        self.debug = debug;
        self.conn = sqlite3.connect(db)
        self.cur = self.conn.cursor()

    def migrate(self):
        if (self.debug):
            print('DROPPING and CREATING `kothgame` and `kothturns`;')
        self.cur.execute('DROP TABLE IF EXISTS `kothgame`');
        self.cur.execute('DROP TABLE IF EXISTS `kothturns`');
        self.cur.execute('''CREATE TABLE `kothgame` (
            `game_id` varchar(255),
            `user_id` varchar(255),
            `player` int(2) DEFAULT NULL,
            `nop` int(2) DEFAULT NULL);''')
        self.cur.execute('''CREATE TABLE `kothturns` (
            `game_id` varchar(255),
            `current` int(4),
            `player` int(2) DEFAULT NULL,
            `json` varchar(1023));''')
        self.conn.commit()
        self.conn.close()
        return {"Migration": "Complete"}

    def get_random_string(self, length):
        letters = string.ascii_lowercase
        result_str = ''.join(random.choice(letters) for i in range(length))
        return result_str

    def create_unique_game_id(self):
        check = self.get_random_string(9)
        while (self.find_game_id(check)):
            check = self.get_random_string(9)
        return check

    def find_game_id(self, gid):
        game = self.cur.execute('''SELECT `game_id`
        FROM `kothgame` WHERE `game_id`=?;''', (gid,)).fetchone();
        return ((not game is None))

    def return_post(self, post):
        self.conn.close()
        post.user_id = None # never return user_id
        return post

    def check_user_and_game(self, post):
        game = self.cur.execute('''SELECT `user_id`
        FROM `kothgame` WHERE `game_id`=? AND `user_id`=? AND `player`=?;''',
        (post.game_id, post.user_id, post.player)).fetchone();
        if (not game is None): # game != null
            if (game[0] == post.user_id):
                return True
        return False # else

    def new_game(self, post):
        if (self.debug):
            print('new_game called')
            print(post)
        post.game_id = self.create_unique_game_id()
        self.cur.execute('''INSERT INTO `kothgame` (`game_id`, `user_id`, `player`, `nop`)
        VALUES (?, ?, ?, ?);''', (post.game_id, post.user_id, post.player, post.nop))
        self.conn.commit()
        return self.return_post(post)

    def join_game(self, post):
        if (self.debug):
            print('join_game called')
            print(post)
        check = self.cur.execute('''SELECT `nop`, `player`
        FROM `kothgame` WHERE `game_id`=? AND `user_id`=?;''',
        (post.game_id,post.user_id)).fetchone()
        post.current = -1
        if (check is None):
            game = self.cur.execute('''SELECT `nop`, COUNT(`player`)
            FROM `kothgame` WHERE `game_id`=?;''', (post.game_id,)).fetchone()
            post.nop = game[0]
            post.player = game[1] # next_available_spot
            if (post.player < post.nop): # add to game
                self.cur.execute('''INSERT INTO `kothgame` (`game_id`, `user_id`, `player`, `nop`)
                VALUES (?, ?, ?, ?);''', (post.game_id, post.user_id, post.player, post.nop))
            else: # game is full
                post.nop = -1
                post.player = -1
        else: # rejoin game
            post.nop = check[0]
            post.player = check[1]
            post = self.rejoin_game(post);
        self.conn.commit()
        return self.return_post(post)

    def rejoin_game(self, post):
        if (self.debug):
            print('rejoin_game called')
            print(post)
        last_turn = self.cur.execute('''SELECT `current`, `json` FROM `kothturns`
        WHERE `game_id`=? AND `current`>=? ORDER BY `current` DESC;''', (post.game_id, 0)).fetchone();
        if (not last_turn is None): # game already started
            post.current = last_turn[0]
        return post

    def send_turn(self, post):
        if (self.debug):
            print('send_turn called')
            print(post)
        if (self.check_user_and_game(post)):
            last_turn = self.cur.execute('''SELECT `current`, `json` FROM `kothturns`
            WHERE `game_id`=? AND `current`>=? ORDER BY `current` DESC;''', (post.game_id, 0)).fetchone()
            if (not last_turn is None):
                nop = self.cur.execute('''SELECT `nop` FROM `kothgame`
                WHERE `game_id`=?;''', (post.game_id,)).fetchone()[0]
                if((last_turn[0]+1 != post.current) or ((last_turn[0]+1)%nop != post.player)):
                    return kothResponse({"accepted":"false"})
            self.cur.execute('''INSERT INTO `kothturns` (`game_id`, `current`, `player`, `json`)
            VALUES (?, ?, ?, ?);''', (post.game_id, post.current, post.player, post.turn))
            response = kothResponse({"accepted":"true"})
        else:
            response = post
        self.conn.commit()
        return self.return_post(response)

    def get_turn(self, post):
        if (self.debug):
            print('get_turn called')
            print(post)
        if (self.check_user_and_game(post)):
            next_turn = self.cur.execute('''SELECT `current`, `json` FROM `kothturns`
            WHERE `game_id`=? AND `current`>=? ORDER BY `current` ASC;''', (post.game_id, post.current)).fetchone();
            if (next_turn is None):
                response = kothResponse({"waiting":"true"})
            else:
                response = kothResponse({"turn":next_turn[1]})
        else: # invalid game_id + user_id + player
            response = kothResponse({"accepted":"false"})
        self.conn.commit()
        return self.return_post(response)
