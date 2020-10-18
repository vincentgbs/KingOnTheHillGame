import random
import string
from typing import Optional
from pydantic import BaseModel
import sqlite3

class Request(BaseModel):
    user_id: str
    action: str
    game_id: str
    player: int
    nop: Optional[int] = None
    pick: Optional[str] = None

class Pokedraft:
    def __init__(self, debug=False, db='db.sqlite3'):
        self.debug = debug;
        self.conn = sqlite3.connect(db)
        self.cur = self.conn.cursor()

    def migrate(self):
        if (self.debug):
            print('DROPPING and CREATING `draft` and `picks`;')
        self.cur.execute('DROP TABLE IF EXISTS `pokemon`');
        self.cur.execute('DROP TABLE IF EXISTS `draft`');
        self.cur.execute('DROP TABLE IF EXISTS `picks`');
        self.cur.execute('''CREATE TABLE `pokemon` (
            `pokemon_number` int(11),
            `pokemon` varchar(255),
            `type1` varchar(31) DEFAULT NULL,
            `type2` varchar(31) DEFAULT NULL,
            `attack` int(11) DEFAULT NULL,
            `defence` int(11) DEFAULT NULL,
            `stamina` int(11) DEFAULT NULL);''')
        self.cur.execute('''CREATE TABLE `draft` (
            `draft_id` varchar(255),
            `user_id` varchar(255),
            `player` int(2)
            `nop` int(2) DEFAULT NULL);''')
        self.cur.execute('''CREATE TABLE `picks` (
            `draft_id` varchar(255),
            `player` int(2),
            `pokemon_number` int(11),
            `pokemon` var(255) DEFAULT NULL;''')
        self.conn.commit()
        self.conn.close()
        return {"Migration": "Complete"}

    def get_random_string(self, length):
        letters = string.ascii_lowercase
        result_str = ''.join(random.choice(letters) for i in range(length))
        return result_str

    def create_unique_draft_id(self):
        check = self.get_random_string(9)
        while (self.find_draft_id(check)):
            check = self.get_random_string(9)
        return check

    def find_draft_id(self, gid):
        game = self.cur.execute('''SELECT `game_id`
        FROM `games` WHERE `game_id`=?;''', (gid,)).fetchone();
        return ((not game is None))

    def return_post(self, post):
        self.conn.close()
        post.user_id = None # never return user_id
        return post

    def new_draft(self, post):
        if (self.debug):
            print('new_draft called')
            print(post)
        post.game_id = self.create_unique_draft_id()
        self.cur.execute('''INSERT INTO `draft` (`draft_id`, `user_id`, `player`, `nop`)
        VALUES (?, ?, ?, ?);''', (post.draft_id, post.user_id, post.player, post.nop))
        self.conn.commit()
        return self.return_post(post)

    def join_draft(self, post):
        if (self.debug):
            print('join_draft called')
            print(post)
        check = self.cur.execute('''SELECT `nop`, `player`
        FROM `draft` WHERE `draft_id`=? AND `user_id`=?;''',
        (post.draft_id,post.user_id)).fetchone()
        if (check is None):
            game = self.cur.execute('''SELECT `nop`, COUNT(`player`)
            FROM `games` WHERE `game_id`=?;''', (post.draft_id,)).fetchone()
            post.nop = game[0]
            post.player = game[1] # next_available_spot
            if (post.player < post.nop): # add to draft
                self.cur.execute('''INSERT INTO `draft` (`draft_id`, `user_id`, `player`, `nop`)
                VALUES (?, ?, ?, ?);''', (post.draft_id, post.user_id, post.player, post.nop))
            else: # draft is full
                post.nop = -1
                post.player = -1
        else: # rejoin game
            post.nop = check[0]
            post.player = check[1]
        self.conn.commit()
        return self.return_post(post)

    def get_options(self, post):
        False

    def send_pick(self, post):
        False

    def get_picks(self, post):
        False
