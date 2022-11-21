import {Pawn} from './Pawn.js'
import {AI} from './AI.js'
import {Minimax} from './Minimax.js'
import {Negamax} from './Negamax.js'

/**
 * Klasa odpowiedzialna za "Core" gry — backend
 */
export class Game {

    /**
     *Deklaracja fieldów klasy Game
     */
    gameBoard
    boardClass
    selectedPawn
    currentPlayer = 'White'
    isNeutronMove = false
    gameMode
    player1
    player2
    gameOver = false
    rounds = 1

    static gameModeEnums = {
        PVP: 'PvP',
        PVE: 'PvE',
        EVE: 'EvE'
    }

    static playerEnums = {
        WHITE: 'White',
        BLACK: 'Black'
    }

    constructor(board, gameMode) {
        this.boardClass = board
        this.gameBoard = board.board
        this.gameMode = gameMode

        if (this.gameMode === Game.gameModeEnums.PVE) {
            this.player1 = this.currentPlayer
            this.player2 = new Minimax(this.gameBoard, this, Game.playerEnums.BLACK)
        } else if (this.gameMode === Game.gameModeEnums.EVE) {
            this.player1 = new AI(this.gameBoard, this, Game.playerEnums.WHITE)
            this.player2 = new Negamax(this.gameBoard, this, Game.playerEnums.BLACK)
            this.currentPlayer = this.player1
            this.player1.makeMove()
            this.swapPlayers()
        } else  {
            this.player1 = this.currentPlayer
            this.player2 = Game.playerEnums.BLACK
        }

        return this
    }

    choosePawn(pawnX, pawnY)
    {
        const pawn = this.gameBoard[pawnY][pawnX]
        if (pawn instanceof Pawn) this.selectedPawn = pawn
    }

    clearPawnSelection()
    {
        this.selectedPawn = null
    }

    movePawn(fieldX, fieldY) {
        try {
            const currentPawnX = this.selectedPawn.x
            const currentPawnY = this.selectedPawn.y

            this.selectedPawn.x = fieldX
            this.selectedPawn.y = fieldY

            this.gameBoard[fieldY][fieldX] = this.selectedPawn
            this.clearPlace(currentPawnX, currentPawnY)
        } catch (e) {
            console.log('Exception: ' + e)
            return false
        }
        return true
    }

    swapPlayers() {
        if (!this.gameOver) {
            if (this.isNeutronMove) {
                this.isNeutronMove = false
            } else {
                this.isNeutronMove = true
                this.currentPlayer = (this.currentPlayer === this.player1) ? this.player2 : this.player1
                ++this.rounds
            }
            if (this.currentPlayer instanceof AI) {
                let promise = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(this.currentPlayer.makeMove())
                    }, 1000)
                }).then(() => {
                    this.boardClass.toggleRound()
                    this.boardClass.updateBoard()
                }).catch(() => {
                    console.log('Error')
                })
            }
        }
    }

    clearPlace(x,y) {
        this.gameBoard[y][x] = null;
    }

    isGameOver() {
        let neutron = this.findNeutron()

        if (!this.#isPawnMovable(neutron)) {
            this.gameOver = true
            return {win: true, winner: this.currentPlayer}
        }
        if (neutron.y === 0) {
            this.gameOver = true
            return {win: true, winner: "White"}
        }
        if (neutron.y === 4) {
            this.gameOver = true
            return {win: true, winner: "Black"}
        }

        return {win: false}
    }

    findNeutron() {
        let neutron
        this.gameBoard.forEach(row => {
            row.filter(function (element, index, arr) {
                if (element !== null && element.id === 'N') {
                    neutron = element
                }
            })
        })
        return neutron
    }

    #isPawnMovableN(pawn) {
        //N direction
        if( (pawn.y-1 >= 0) && this.gameBoard[pawn.y-1][pawn.x] == null) return true;
    }

    #isPawnMovableNE(pawn) {
        //NE direction
        if( (pawn.y-1 >= 0 && pawn.x+1 <5) && this.gameBoard[pawn.y-1][pawn.x+1] == null) return true;
    }

    #isPawnMovableE(pawn) {
        //E direction
        if( (pawn.x+1 <5) && this.gameBoard[pawn.y][pawn.x+1] == null) return true;
    }

    #isPawnMovableSE(pawn) {
        //SE direction
        if( (pawn.y+1 <5 && pawn.x+1 <=4) && this.gameBoard[pawn.y+1][pawn.x+1] == null) return true;
    }

    #isPawnMovableS(pawn) {
        //S direction
        if( (pawn.y+1 <5) && this.gameBoard[pawn.y+1][pawn.x] == null) return true;
    }

    #isPawnMovableSW(pawn) {
        //SW direction
        if( (pawn.y+1 <5 && pawn.x-1 >=0) && this.gameBoard[pawn.y+1][pawn.x-1] == null) return true;
    }

    #isPawnMovableW(pawn) {
        //W direction
        if( (pawn.x-1 >=0) && this.gameBoard[pawn.y][pawn.x-1] == null) return true;
    }

    #isPawnMovableNW(pawn) {
        //NW direction
        if( (pawn.y-1 >= 0 && pawn.x-1 >=0) && this.gameBoard[pawn.y-1][pawn.x-1] == null) return true
    }

    #isPawnMovable(pawn) {
        //N direction
        if(this.#isPawnMovableN(pawn)) return true;

        //NE direction
        if(this.#isPawnMovableNE(pawn)) return true;

        //E direction
        if(this.#isPawnMovableE(pawn)) return true;

        //SE direction
        if(this.#isPawnMovableSE(pawn)) return true;

        //S direction
        if(this.#isPawnMovableS(pawn)) return true;

        //SW direction
        if(this.#isPawnMovableSW(pawn)) return true;

        //W direction
        if(this.#isPawnMovableW(pawn)) return true;

        //NW direction
        if(this.#isPawnMovableNW(pawn)) return true;

        return false
    }
}





