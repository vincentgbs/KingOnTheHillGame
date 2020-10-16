from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
# from fastapi.middleware.cors import CORSMiddleware
from modules.koth import Kingonthehill, Request, Response

debug = False

app = FastAPI()

kothroot = "/vagrant/KingOnTheHillGame/frontend"
app.mount("/koth", StaticFiles(directory=kothroot+"/koth"), name="koth")
if (debug):
    app.mount("/koth-test", StaticFiles(directory=kothroot+"/koth-test"), name="koth-test")

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
    k = Kingonthehill()
    return k.migrate()

@app.post("/koth-actions")
def create_game(post: Request):
    k = Kingonthehill(debug)
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
