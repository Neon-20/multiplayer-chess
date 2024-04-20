//global class to manage game logic.
//handle the current set of games, and managing a current set of games

import { WebSocket } from "ws";
import { INIT_GAME } from "./message";
import { Game } from "./game";

export class GameManager {
    private games: Game[];
    private pendingUser:WebSocket | null;
    private users:WebSocket[];

    constructor(){
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket: WebSocket){
    this.users.push(socket)
    //everytime the user is coming, messages should be captured in handlers.
    this.addHandler(socket)
    }

    removeUser(socket: WebSocket){
        this.users = this.users.filter(user => user !== socket)
        //Stop the users if user left the game.
    }

    private addHandler(socket:WebSocket){
        socket.on('message',(data) => {
            const message = JSON.parse(data.toString());
            if(message.type === INIT_GAME){
                if(this.pendingUser){
                    const game = new Game(this.pendingUser,socket);
                    //pushing the game to the games array
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else{
                    this.pendingUser = socket;
                    //wait for the next guy, right
                }
            }
        })
    }
}

