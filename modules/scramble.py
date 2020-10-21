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
    moves: Optional[str] = None

class scramResponse(BaseModel):
    def __init__(self, dictionary):
        BaseModel.__init__(self)
        if("user_id" in dictionary.keys()):
            self.user_id = dictionary["user_id"]
        if("accepted" in dictionary.keys()):
            self.accepted = dictionary["accepted"]
        if("moves" in dictionary.keys()):
            self.moves = dictionary["moves"]
    user_id: Optional[str] = None
    accepted: Optional[bool] = None
    moves: Optional[str] = None

class Scramble:
    def __init__(self, debug=False, db='db.sqlite3'):
        self.debug = debug;
        self.conn = sqlite3.connect(db)
        self.cur = self.conn.cursor()
