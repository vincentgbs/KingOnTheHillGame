import random
import string
from typing import Optional
from pydantic import BaseModel
import sqlite3

class pkdRequest(BaseModel):
    user_id: str
    action: str
    draft_id: str
    player: int
    nop: Optional[int] = None
    bosses: Optional[str] = None
    pick: Optional[str] = None

class pkdResponse(BaseModel):
    def __init__(self, dictionary):
        BaseModel.__init__(self)
        if("user_id" in dictionary.keys()):
            self.user_id = dictionary["user_id"]
        if("player" in dictionary.keys()):
            self.player = dictionary["player"]
        if("bosses" in dictionary.keys()):
            self.bosses = dictionary["bosses"]
        if("options" in dictionary.keys()):
            self.options = dictionary["options"]
        if("accepted" in dictionary.keys()):
            self.accepted = dictionary["accepted"]
    user_id: Optional[str] = None
    player: Optional[int] = None
    bosses: Optional[str] = None
    options: Optional[str] = None
    accepted: Optional[str] = None

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
            `category` varchar(31) DEFAULT NULL,
            `attack` int(11) DEFAULT NULL,
            `defence` int(11) DEFAULT NULL,
            `stamina` int(11) DEFAULT NULL);''')
        self.cur.execute('''CREATE TABLE `draft` (
            `draft_id` varchar(255),
            `user_id` varchar(255),
            `bosses` varchar(999),
            `player` int(2),
            `started` int(1) DEFAULT 0,
            `nop` int(2) DEFAULT NULL);''')
        self.cur.execute('''CREATE TABLE `picks` (
            `draft_id` varchar(255),
            `player` int(2),
            `pokemon_number` int(11),
            `pokemon` varchar(255) DEFAULT NULL);''')
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
        draft = self.cur.execute('''SELECT `draft_id`
        FROM `draft` WHERE `draft_id`=?;''', (gid,)).fetchone();
        return ((not draft is None))

    def return_post(self, post):
        if (self.debug):
            print('return_post called')
            print(post)
        self.conn.close()
        post.user_id = None # never return user_id
        return post

    def new_draft(self, post):
        if (self.debug):
            print('new_draft called')
            print(post)
        post.draft_id = self.create_unique_draft_id()
        self.cur.execute('''INSERT INTO `draft` (`draft_id`, `user_id`, `bosses`, `player`, `nop`)
        VALUES (?, ?, ?, ?, ?);''', (post.draft_id, post.user_id, post.bosses, post.player, post.nop))
        self.conn.commit()
        return self.return_post(post)

    def join_draft(self, post):
        if (self.debug):
            print('join_draft called')
            print(post)
        check = self.cur.execute('''SELECT `nop`, `player`, `bosses`
        FROM `draft` WHERE `draft_id`=? AND `user_id`=?;''',
        (post.draft_id,post.user_id)).fetchone()
        if (check is None):
            game = self.cur.execute('''SELECT `nop`, COUNT(`player`), `bosses`
            FROM `draft` WHERE `draft_id`=?;''', (post.draft_id,)).fetchone()
            post.nop = game[0]
            post.player = game[1] # next_available_spot
            post.bosses = game[2]
            if (post.player < post.nop): # add to draft
                self.cur.execute('''INSERT INTO `draft` (`draft_id`, `user_id`, `bosses`, `player`, `nop`)
                VALUES (?, ?, ?, ?, ?);''', (post.draft_id, post.user_id, post.bosses, post.player, post.nop))
            else: # draft is full
                post.nop = -1
                post.player = -1
        else: # rejoin game
            if (self.debug):
                print('rejoin_draft')
            post.nop = check[0]
            post.player = check[1]
            post.bosses = check[2]
        self.conn.commit()
        return self.return_post(post)

    def check_user_and_draft(self, post):
        draft = self.cur.execute('''SELECT `user_id`
        FROM `draft` WHERE `draft_id`=? AND `user_id`=? AND `player`=?;''',
        (post.draft_id, post.user_id, post.player)).fetchone();
        if (not draft is None): # draft != null
            if (draft[0] == post.user_id):
                return True
        return False # else

    def start_draft(self, post):
        if (self.debug):
            print('start_draft called')
            print(post)
        if (self.check_user_and_draft(post)):
            game = self.cur.execute('''SELECT `nop`, COUNT(`player`)
            FROM `draft` WHERE `draft_id`=?;''', (post.draft_id,)).fetchone()
            if (game[0] == game[1]):
                self.cur.execute('''UPDATE `draft` SET `started`=1 WHERE `draft_id`=?;''',
                (post.draft_id))
                response = Response({"accepted":"true"})
            else:
                response = Response({"accepted":"false"})
        else:
            response = post
        self.conn.commit()
        return self.return_post(response)

    def get_options(self):
        if (self.debug):
            print('get_options called')
        options = self.cur.execute('''SELECT * FROM `pokemon`;''').fetchall()
        for option in options:
            print(option)

    def send_pick(self, post):
        False

    def get_picks(self, post):
        False
