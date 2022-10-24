import {Game} from "./Game.js"
import {GameBoard} from "./GameBoard.js";
import {Pawn} from "./Pawn.js";
/**
 * Klasa sztucznej inteligencji, odpowiadająca za rozgrywanie tury przez komputer
 */
export class AI {

    gameBoard
    player
    game

    constructor(gameBoard, game, player) {
        this.gameBoard = gameBoard
        this.player = player
        this.game = game

        return this
    }

    makeMove() {
        let pawn = (this.choosePawnToMove(this.findMovablePawns(this.findPlayerPawns(this.player))))
        if (this.game.isNeutronMove) {
            pawn = this.game.findNeutron()
        }
        try {
            this.movePawn(pawn,this.chooseMove(this.getAvailableMoves(pawn)))
            return true
        } catch (e) {
            return false
        }
    }

    findPlayerPawns(player) {
        let playerPawns = []
        for (let i=0; i<5; ++i) {
            playerPawns = playerPawns.concat(this.gameBoard[i].filter(function (element, index, arr) {
            return element != null && (element.player === this)}, this.player))
        }
        return playerPawns;
    }

     findMovablePawns(pawns) {
        return pawns.filter( (element, index, arr) =>  {
            return this.isPawnMovable(element)});
    }
     choosePawnToMove(pawns) {
        return pawns[Math.floor(Math.random() * pawns.length)]
    }

     getAvailableMoves(pawn) {
        let availableMoves = [];
        if(this.isPawnMovableN(pawn)) availableMoves.push("N")
        if(this.isPawnMovableNE(pawn)) availableMoves.push("NE")
        if(this.isPawnMovableE(pawn)) availableMoves.push("E")
        if(this.isPawnMovableSE(pawn)) availableMoves.push("SE")
        if(this.isPawnMovableS(pawn)) availableMoves.push("S")
        if(this.isPawnMovableSW(pawn)) availableMoves.push("SW")
        if(this.isPawnMovableW(pawn)) availableMoves.push("W")
        if(this.isPawnMovableNW(pawn)) availableMoves.push("NW")
        return availableMoves
    }

     chooseMove(moves) {
        return moves[Math.floor(Math.random() * moves.length)]
    }

     movePawn(pawn, direction) {
        this.clearPlace(pawn.x,pawn.y)
        switch(direction){
            case "N":
                while(this.isPawnMovableN(pawn)) {
                    --pawn.y
                }
                break;
            case "NE":
                while(this.isPawnMovableNE(pawn)) {
                    --pawn.y
                    ++pawn.x
                }
                break;
            case "E":
                while(this.isPawnMovableE(pawn)) {
                    ++pawn.x
                }
                break;
            case "SE":
                while(this.isPawnMovableSE(pawn)) {
                    ++pawn.x
                    ++pawn.y
                }
                break;
            case "S":
                while(this.isPawnMovableS(pawn)) {
                    ++pawn.y
                }
                break;
            case "SW":
                while(this.isPawnMovableSW(pawn)) {
                    ++pawn.y
                    --pawn.x
                }
                break;
            case "W":
                while(this.isPawnMovableW(pawn)) {
                    --pawn.x
                }
                break;
            case "NW":
                while(this.isPawnMovableNW(pawn)) {
                    --pawn.y
                    --pawn.x
                }
                break;
        }
        this.gameBoard[pawn.y][pawn.x] = pawn
    }

     clearPlace(x,y) {
        this.gameBoard[y][x] = null
    }

     isPawnMovableN(pawn) {
        //N direction
        if( (pawn.y-1 >= 0) && this.gameBoard[pawn.y-1][pawn.x] == null) return true
    }

     isPawnMovableNE(pawn) {
        //NE direction
        if( (pawn.y-1 >= 0 && pawn.x+1 <5) && this.gameBoard[pawn.y-1][pawn.x+1] == null) return true
    }

     isPawnMovableE(pawn) {
        //E direction
        if( (pawn.x+1 <5) && this.gameBoard[pawn.y][pawn.x+1] == null) return true
    }

     isPawnMovableSE(pawn) {
        //SE direction
        if( (pawn.y+1 <5 && pawn.x+1 <=4) && this.gameBoard[pawn.y+1][pawn.x+1] == null) return true
    }

     isPawnMovableS(pawn) {
        //S direction
        if( (pawn.y+1 <5) && this.gameBoard[pawn.y+1][pawn.x] == null) return true
    }

     isPawnMovableSW(pawn) {
        //SW direction
        if( (pawn.y+1 <5 && pawn.x-1 >=0) && this.gameBoard[pawn.y+1][pawn.x-1] == null) return true
    }

     isPawnMovableW(pawn) {
        //W direction
        if( (pawn.x-1 >=0) && this.gameBoard[pawn.y][pawn.x-1] == null) return true
    }

     isPawnMovableNW(pawn) {
        //NW direction
        if( (pawn.y-1 >= 0 && pawn.x-1 >=0) && this.gameBoard[pawn.y-1][pawn.x-1] == null) return true
    }

     isPawnMovable(pawn) {
        //N direction
        if(this.isPawnMovableN(pawn)) return true;

        //NE direction
        if(this.isPawnMovableNE(pawn)) return true;

        //E direction
        if(this.isPawnMovableE(pawn)) return true;

        //SE direction
        if(this.isPawnMovableSE(pawn)) return true;

        //S direction
        if(this.isPawnMovableS(pawn)) return true;

        //SW direction
        if(this.isPawnMovableSW(pawn)) return true;

        //W direction
        if(this.isPawnMovableW(pawn)) return true;

        //NW direction
        if(this.isPawnMovableNW(pawn)) return true;

        return false
    }
}
