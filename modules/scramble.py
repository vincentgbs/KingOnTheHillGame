import random
import string
from typing import Optional
from pydantic import BaseModel
import sqlite3

class scramRequest(BaseModel):
    user_id: str
    action: str
    game_id: str
    player: int
    nop: Optional[int] = None
    last_check: Optional[int] = None
    location: Optional[str] = None
    eggs: Optional[str] = None

class scramResponse(BaseModel):
    def __init__(self, dictionary):
        BaseModel.__init__(self)
        if("user_id" in dictionary.keys()):
            self.user_id = dictionary["user_id"]
        if("accepted" in dictionary.keys()):
            self.accepted = dictionary["accepted"]
        if("locations" in dictionary.keys()):
            self.locations = dictionary["locations"]
        if("eggs" in dictionary.keys()):
            self.eggs = dictionary["eggs"]
        if("splashes" in dictionary.keys()):
            self.splashes = dictionary["splashes"]
    user_id: Optional[str] = None
    accepted: Optional[bool] = None
    locations: Optional[str] = None
    eggs: Optional[str] = None

class Scramble:
    def __init__(self, debug=False, db='db.sqlite3'):
        self.debug = debug;
        self.conn = sqlite3.connect(db)
        self.cur = self.conn.cursor()

    def migrate(self):
        if (self.debug):
            print('DROPPING and CREATING `scramblegame` and `scramblemoves`;')
        self.cur.execute('DROP TABLE IF EXISTS `scramblegame`');
        self.cur.execute('DROP TABLE IF EXISTS `scramblemoves`');
        self.cur.execute('DROP TABLE IF EXISTS `scrambleeggs`');
        self.cur.execute('''CREATE TABLE `scramblegame` (
            `game_id` varchar(255),
            `user_id` varchar(255),
            `player` int(2) DEFAULT NULL,
            `nop` int(2) DEFAULT NULL,
            `started` int(2) DEFAULT NULL);''')
        self.cur.execute('''CREATE TABLE `scramblemoves` (
            `game_id` varchar(255),
            `player` int(2) DEFAULT NULL,
            `location` varchar(255),
            `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP);''')
        self.cur.execute('''CREATE TABLE `scrambleeggs` (
            `game_id` varchar(255),
            `player` int(2) DEFAULT NULL,
            `egg` varchar(255),
            `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP);''')
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
        FROM `scramblegame` WHERE `game_id`=?;''', (gid,)).fetchone();
        return ((not game is None))

    def return_post(self, post):
        self.conn.close()
        post.user_id = None # never return user_id
        return post

    def check_user_and_game(self, post):
        game = self.cur.execute('''SELECT `user_id`, `started`
        FROM `scramblegame` WHERE `game_id`=? AND `user_id`=? AND `player`=?;''',
        (post.game_id, post.user_id, post.player)).fetchone();
        response = {'valid':False, 'started':False}
        if (not game is None): # game != null
            if (game[0] == post.user_id):
                response['valid'] = True
                if (game[1] == 1):
                    response['started'] = True
        return response

    def new_game(self, post):
        if (self.debug):
            print('new_game called')
            print(post)
        post.game_id = self.create_unique_game_id()
        self.cur.execute('''INSERT INTO `scramblegame` (`game_id`, `user_id`, `player`, `nop`, `started`)
        VALUES (?, ?, ?, ?, 0);''', (post.game_id, post.user_id, post.player, post.nop))
        self.conn.commit()
        return self.return_post(post)

    def join_game(self, post):
        if (self.debug):
            print('join_game called')
            print(post)
        check = self.cur.execute('''SELECT `nop`, `player`
        FROM `scramblegame` WHERE `game_id`=? AND `user_id`=?;''',
        (post.game_id,post.user_id)).fetchone()
        post.last_check = -1; # started placeholder
        if (check is None): # no match for game_id + user_id
            game = self.cur.execute('''SELECT `nop`, COUNT(`player`)
            FROM `scramblegame` WHERE `game_id`=?;''', (post.game_id,)).fetchone()
            post.nop = game[0]
            post.player = game[1] # next_available_spot
            if (post.player < post.nop): # add to game
                self.cur.execute('''INSERT INTO `scramblegame` (`game_id`, `user_id`, `player`, `nop`, `started`)
                VALUES (?, ?, ?, ?, (SELECT `started` FROM `scramblegame` WHERE `game_id`=? LIMIT 1));''', (post.game_id, post.user_id, post.player, post.nop, post.game_id))
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
        started = game = self.cur.execute('''SELECT `started`
        FROM `scramblegame` WHERE `game_id`=?;''', (post.game_id,)).fetchone()
        if (started[0] == 1):
            post.last_check = 1; # enable controls
        return post

    def start_game(self, post):
        if (self.debug):
            print('start_game called')
            print(post)
        if(self.check_user_and_game(post)['valid']):
            game = self.cur.execute('''SELECT `nop`, COUNT(`player`)
            FROM `scramblegame` WHERE `game_id`=?;''', (post.game_id,)).fetchone()
            if(game[0] == game[1]):
                self.cur.execute('''UPDATE `scramblegame` SET `started`=1
                WHERE `game_id`=?''', (post.game_id,))
                self.conn.commit()
                return scramResponse({"accepted":"true"})
        return scramResponse({"accepted":"false"}) # else

    def send_moves(self, post):
        if (self.debug):
            print('send_moves called')
            print(post)
        check = self.check_user_and_game(post)
        if(check['valid'] and check['started']):
            self.cur.execute('''INSERT INTO `scramblemoves` (`game_id`, `player` ,`location`) VALUES (?, ?, ?)''', (post.game_id, post.player, post.location))
            post = scramResponse({"accepted":"true"})
        self.conn.commit()
        return self.return_post(post)

    def send_eggs(self, post):
        if (self.debug):
            print('send_eggs called')
            print(post)
        check = self.check_user_and_game(post)
        if(check['valid'] and check['started']):
            self.cur.execute('''INSERT INTO `scrambleeggs` (`game_id`, `player`, `egg`) VALUES (?, ?, ?)''', (post.game_id, post.player, post.eggs))
            post = scramResponse({"accepted":"true"})
        self.conn.commit()
        return self.return_post(post)

    def get_moves(self, post):
        if (self.debug):
            print('get_moves called')
            print(post)
        check = self.check_user_and_game(post)
        if(check['valid'] and check['started']):
            nop = self.cur.execute('''SELECT `nop`
            FROM `scramblegame` WHERE `game_id`=?;''', (post.game_id,)).fetchone()
            locations = []
            for i in range(0, nop[0]):
                locations.append(self.cur.execute('''SELECT `player`, `location`
                FROM `scramblemoves` WHERE `game_id`=? AND `player`=? ORDER BY `timestamp` DESC
                LIMIT 1;''', (post.game_id, i)).fetchone())
            post = scramResponse({"locations":locations})
        return self.return_post(post)

    def get_eggs(self, post):
        if (self.debug):
            print('get_eggs called')
            print(post)
        check = self.check_user_and_game(post)
        if(check['valid'] and check['started']):
            nop = self.cur.execute('''SELECT `nop`
            FROM `scramblegame` WHERE `game_id`=?;''', (post.game_id,)).fetchone()
            eggs = []
            for i in range(0, nop[0]):
                eggs.append(self.cur.execute('''SELECT `player`, `egg`
                FROM `scrambleeggs` WHERE `game_id`=? AND `player`=? ORDER BY `timestamp` DESC
                LIMIT 9;''', (post.game_id, i)).fetchone())
            post = scramResponse({"eggs":eggs})
        return self.return_post(post)
