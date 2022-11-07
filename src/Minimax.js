import {AI} from './AI.js';
import {Pawn} from './Pawn.js';

export class Minimax extends AI {

    makeMove() {
        let bestMove = this.minimax(this.gameBoard, 1, true, null, null, this.game.isNeutronMove)
        console.log(bestMove)
        try {
            this.movePawn(bestMove[2].pawn, bestMove[2].move, this.gameBoard)
            return true
        } catch (e) {
            return false
        }
    }

    evaluate(gameBoard) {
        let score = 0
        let Neutron = this.findPlayerPawns('Neutron', gameBoard)

        console.log(Neutron)


        if (Neutron[0].y === 4) {
            score += 6000
        } else {
            for (let i = 0; i < 5; i++) {
                if (gameBoard[0][i] === null ) {
                    score-= 20
                }
                if (gameBoard[4][i] === null) {
                    score += 10
                }
            }
        }
        if (Neutron[0].y === 0) {
            score -= 5000
        } else {
            for (let i = 0; i < 5; i++) {
                if (gameBoard[0][i] === null ) {
                    score-= 20
                }
                if (gameBoard[4][i] === null) {
                    score += 10
                }
            }
        }

        return score
    }

    minimax(gameBoard, depth, isMaximizing, currentMove, beginningMove, isNeutronMove) {
        let isNeutron
        let playerPawns
        let testArray = []
        let scoreArray = []
        let availableMoves = []
        let gameBoardCopy = JSON.parse(JSON.stringify(gameBoard))
        if (this.evaluate(gameBoardCopy) >= 900) {
            return [this.evaluate(gameBoardCopy), currentMove, beginningMove, "winning", depth]
        } else if (depth === 0) {
            return [this.evaluate(gameBoardCopy), currentMove, beginningMove]
        }
        if (isMaximizing) {
            if (isNeutronMove) {
                playerPawns = this.findPlayerPawns('Neutron', gameBoardCopy)
            } else {
                playerPawns = this.findPlayerPawns(this.player, gameBoardCopy)
            }
            isNeutron = !isNeutronMove
            let movablePawns = this.findMovablePawns(playerPawns, gameBoardCopy)
            if (isNeutronMove && movablePawns.length === 0) {
                return [-2000, currentMove, beginningMove]
            }
            movablePawns.forEach(movablePawn => {
                availableMoves.push({pawn: movablePawn, moves: this.getAvailableMoves(movablePawn, gameBoardCopy)})
            })
            availableMoves.forEach(element => {
                const pawn = JSON.parse(JSON.stringify(element.pawn))
                element.moves.forEach(move => {
                    let gameBoardCopyCopy = JSON.parse(JSON.stringify(gameBoardCopy));
                    this.movePawn(element.pawn, move, gameBoardCopyCopy)
                    testArray.push(
                        this.minimax(
                            gameBoardCopyCopy,
                            depth - 1,
                            isNeutronMove,
                            {pawn: pawn, move: move},
                            (depth === 1) ? {pawn: pawn, move: move}: beginningMove,
                            isNeutron
                        )
                    );
                })
            });
            testArray.forEach(element => {
                scoreArray.push(element[0]);
            });
            return testArray[scoreArray.indexOf(Math.max(...scoreArray))];
        } else {
            if (isNeutronMove) {
                playerPawns = this.findPlayerPawns('Neutron', gameBoardCopy)
            } else {
                playerPawns = this.findPlayerPawns('White', gameBoardCopy)
            }
            isNeutron = !isNeutronMove
            let movablePawns = this.findMovablePawns(playerPawns, gameBoardCopy)
            let availableMoves = []
            if (isNeutronMove && movablePawns.length === 0) {
                return [2000, currentMove, beginningMove]
            }
            movablePawns.forEach(movablePawn => {
                availableMoves.push({pawn: movablePawn, moves: this.getAvailableMoves(movablePawn, gameBoardCopy)})
            })
            availableMoves.forEach(element => {
                const pawn = JSON.parse(JSON.stringify(element.pawn))
                element.moves.forEach(move => {
                    let gameBoardCopyCopy = JSON.parse(JSON.stringify(gameBoardCopy));
                    this.movePawn(element.pawn, move, gameBoardCopyCopy)
                    testArray.push(
                        this.minimax(
                            gameBoardCopyCopy,
                            depth - 1,
                            !isNeutronMove,
                            {pawn: pawn, move: move},
                            (depth === 1) ? {pawn: pawn, move: move}: beginningMove,
                            isNeutron
                        )
                    );
                })
            });
            testArray.forEach(element => {
                scoreArray.push(element[0]);
            });
            return testArray[scoreArray.indexOf(Math.min(...scoreArray))];
        }
    }

    getAvailableMoves(pawn, gameBoard) {
        let availableMoves = [];
        if(this.isPawnMovableN(pawn, gameBoard)) availableMoves.push("N")
        if(this.isPawnMovableNE(pawn, gameBoard)) availableMoves.push("NE")
        if(this.isPawnMovableE(pawn, gameBoard)) availableMoves.push("E")
        if(this.isPawnMovableSE(pawn, gameBoard)) availableMoves.push("SE")
        if(this.isPawnMovableS(pawn, gameBoard)) availableMoves.push("S")
        if(this.isPawnMovableSW(pawn, gameBoard)) availableMoves.push("SW")
        if(this.isPawnMovableW(pawn, gameBoard)) availableMoves.push("W")
        if(this.isPawnMovableNW(pawn, gameBoard)) availableMoves.push("NW")
        return availableMoves
    }

    findMovablePawns(pawns, gameBoard) {
        return pawns.filter( (element, index, arr) =>  {
            return this.isPawnMovable(element, gameBoard)});
    }

    findPlayerPawns(player, gameBoard) {
        let playerPawns = []
        for (let i=0; i<5; ++i) {
            playerPawns = playerPawns.concat(gameBoard[i].filter(function (element, index, arr) {
                return element != null && (element.player === this)}, player))
        }
        return playerPawns;
    }

    clearPlace(x,y, gameBoard) {
        gameBoard[y][x] = null
    }

    movePawn(pawn, direction, gameBoard) {
        this.clearPlace(pawn.x,pawn.y, gameBoard)
        switch(direction){
            case "N":
                while(this.isPawnMovableN(pawn, gameBoard)) {
                    --pawn.y
                }
                break;
            case "NE":
                while(this.isPawnMovableNE(pawn, gameBoard)) {
                    --pawn.y
                    ++pawn.x
                }
                break;
            case "E":
                while(this.isPawnMovableE(pawn, gameBoard)) {
                    ++pawn.x
                }
                break;
            case "SE":
                while(this.isPawnMovableSE(pawn, gameBoard)) {
                    ++pawn.x
                    ++pawn.y
                }
                break;
            case "S":
                while(this.isPawnMovableS(pawn, gameBoard)) {
                    ++pawn.y
                }
                break;
            case "SW":
                while(this.isPawnMovableSW(pawn, gameBoard)) {
                    ++pawn.y
                    --pawn.x
                }
                break;
            case "W":
                while(this.isPawnMovableW(pawn, gameBoard)) {
                    --pawn.x
                }
                break;
            case "NW":
                while(this.isPawnMovableNW(pawn, gameBoard)) {
                    --pawn.y
                    --pawn.x
                }
                break;
        }
        gameBoard[pawn.y][pawn.x] = new Pawn(pawn.id, pawn.player, pawn.x, pawn.y)
    }

    isPawnMovableN(pawn, gameBoard) {
        //N direction
        if( (pawn.y-1 >= 0) && gameBoard[pawn.y-1][pawn.x] == null) return true
    }

    isPawnMovableNE(pawn, gameBoard) {
        //NE direction
        if( (pawn.y-1 >= 0 && pawn.x+1 <5) && gameBoard[pawn.y-1][pawn.x+1] == null) return true
    }

    isPawnMovableE(pawn, gameBoard) {
        //E direction
        if( (pawn.x+1 <5) && gameBoard[pawn.y][pawn.x+1] == null) return true
    }

    isPawnMovableSE(pawn, gameBoard) {
        //SE direction
        if( (pawn.y+1 <5 && pawn.x+1 <=4) && gameBoard[pawn.y+1][pawn.x+1] == null) return true
    }

    isPawnMovableS(pawn, gameBoard) {
        //S direction
        if( (pawn.y+1 <5) && gameBoard[pawn.y+1][pawn.x] == null) return true
    }

    isPawnMovableSW(pawn, gameBoard) {
        //SW direction
        if( (pawn.y+1 <5 && pawn.x-1 >=0) && gameBoard[pawn.y+1][pawn.x-1] == null) return true
    }

    isPawnMovableW(pawn, gameBoard) {
        //W direction
        if( (pawn.x-1 >=0) && gameBoard[pawn.y][pawn.x-1] == null) return true
    }

    isPawnMovableNW(pawn, gameBoard) {
        //NW direction
        if( (pawn.y-1 >= 0 && pawn.x-1 >=0) && gameBoard[pawn.y-1][pawn.x-1] == null) return true
    }

    isPawnMovable(pawn, gameBoard) {
        //N direction
        if(this.isPawnMovableN(pawn, gameBoard)) return true;

        //NE direction
        if(this.isPawnMovableNE(pawn, gameBoard)) return true;

        //E direction
        if(this.isPawnMovableE(pawn, gameBoard)) return true;

        //SE direction
        if(this.isPawnMovableSE(pawn, gameBoard)) return true;

        //S direction
        if(this.isPawnMovableS(pawn, gameBoard)) return true;

        //SW direction
        if(this.isPawnMovableSW(pawn, gameBoard)) return true;

        //W direction
        if(this.isPawnMovableW(pawn, gameBoard)) return true;

        //NW direction
        if(this.isPawnMovableNW(pawn, gameBoard)) return true;

        return false
    }
}
