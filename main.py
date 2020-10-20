from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
# from fastapi.middleware.cors import CORSMiddleware
from modules.koth import Kingonthehill, kothRequest
from modules.pkd import Pokedraft, pkdRequest

debug = True

app = FastAPI()

frontendroot = "/vagrant/KingOnTheHillGame/frontend"
app.mount("/koth", StaticFiles(directory=frontendroot+"/koth"), name="koth")
if (debug):
    app.mount("/koth-test", StaticFiles(directory=frontendroot+"/koth-test"), name="koth-test")
app.mount("/pkd", StaticFiles(directory=frontendroot+"/pkd"), name="pkd")

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
        k = Kingonthehill()
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

@app.get("/pkd-migrate")
def read_root():
    if (debug):
        p = Pokedraft()
        return p.migrate()

@app.post("/pkd-actions")
def create_game(post: pkdRequest):
    p = Pokedraft(debug)
    if (post.action == 'new_draft'):
        return p.new_draft(post)
    elif (post.action == 'join_draft'):
        return p.join_draft(post)
    elif (post.action == 'get_options'):
        return p.get_options(post);
    elif (post.action == 'start_draft'):
        return p.start_draft(post)
    elif (post.action == 'send_pick'):
        return p.send_pick(post)
    elif (post.action == 'get_picks'):
        return p.get_picks(post)
    else:
        return {"accepted":"false"}
