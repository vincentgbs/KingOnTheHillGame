from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
# from fastapi.middleware.cors import CORSMiddleware
from modules.koth import Kingonthehill, kothRequest
# from modules.scramble import Scramble, scramRequest

debug = True

app = FastAPI()

frontendroot = "/vagrant/KingOnTheHillGame/frontend"
app.mount("/koth", StaticFiles(directory=frontendroot+"/koth"), name="koth")
if (debug):
    app.mount("/koth-test", StaticFiles(directory=frontendroot+"/koth-test"), name="koth-test")
app.mount("/scramble", StaticFiles(directory=frontendroot+"/scramble"), name="scramble")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/koth-migrate")
def read_root():
    if (debug):
        k = Kingonthehill(debug)
        return k.migrate()

@app.post("/koth-actions")
def create_game(post: kothRequest):
    k = Kingonthehill(debug)
    if (post.action == 'new_game'):
        return k.new_game(post)
    elif (post.action == 'join_game'):
        return k.join_game(post)
    elif (post.action == 'send_turn'):
        return k.send_turn(post)
    elif (post.action == 'get_turn'):
        return k.get_turn(post)
    else:
        return {"accepted":"false"}

@app.get("/scramble-migrate")
def read_root():
    if (debug):
        s = Scramble(debug)
        return s.migrate()

@app.post("/scramble-actions")
def create_game(post: scramRequest):
    s = Scramble(debug)
    if (post.action == 'new_game'):
        return s.new_game(post)
    elif (post.action == 'join_game'):
        return s.join_game(post)
    elif (post.action == 'start_game'):
        return s.start_game(post)
    elif (post.action == 'send_moves'):
        return s.send_moves(post)
    elif (post.action == 'get_moves'):
        return s.get_moves(post)
    else:
        return {"accepted":"false"}
