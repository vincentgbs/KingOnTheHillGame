# KingOnTheHillGame
A simple online board game for 2-4 players. You can implement the Python-fastAPI backend to play remotely with friends or play with just the local version against a friend your own computer.

Instructions
King on the Hill is a simple game, where you try to get your king on top of a hill. Each player begins with one king and two pawns. On your turn, you must move one piece and build with the moved piece.
There are four levels: base, middle, top, cap. You want your king placed on top of the third level (top).
You may move your piece to any adjacent square (including diagonals). You may build on any adjacent square (including diagonals).
When moving, you cannot move to a space where another piece resides. You cannot move onto a cap. You cannot move up more than one level at a time. You may move down multiple levels.
When you build, you cannot build on a square where another piece resides. You cannot build on top of a cap. There is no limitation on the level you can build at: you can be on the ground and build a cap.
The king has a special ability: when moving, it can swap places with an adjacent pawn that it controls (same team).

Frontend Only sample: https://vincentgbs.github.io/KingOnTheHillGame/frontend/koth/index.html
