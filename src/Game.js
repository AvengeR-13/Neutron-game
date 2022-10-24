import {Pawn} from '/src/Pawn.js'

/**
 * Klasa odpowiedzialna za "Core" gry — backend
 */
export class Game {


    /**
     *Deklaracja fieldów klasy Game
     */
    gameBoard
    selectedPawn
    currentPlayer = 'White'
    isNeutronMove = false
    playedRounds = 1

    constructor(board) {
        this.gameBoard = board
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
        // console.log(this.gameBoard)
        return true
    }

    swapPlayers() {
        if (this.isNeutronMove) {
            this.isNeutronMove = false
        } else {
            this.isNeutronMove = true
            this.currentPlayer = (this.currentPlayer === "White") ? "Black" : "White"
        }
    }

    clearPlace(x,y) {
        this.gameBoard[y][x] = null;
    }

    isGameOver() {
        let neutron = this.#findNeutron()
        console.log(neutron.y)

        console.log(this.#isPawnMovable(neutron))

        if (!this.#isPawnMovable(neutron)) return {win: true, winner: this.currentPlayer}
        if (neutron.y === 0) return {win: true, winner: "White"}
        if (neutron.y === 4) return {win: true, winner: "Black"}

        return {win: false}
    }

    #findNeutron()
    {
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
        if( (pawn.x-1 >= 0) && this.gameBoard[pawn.x-1][pawn.y] == null) return true;
    }

    #isPawnMovableNE(pawn) {
        //NE direction
        if( (pawn.x-1 >= 0 && pawn.y+1 <5) && this.gameBoard[pawn.x-1][pawn.y+1] == null) return true;
    }

    #isPawnMovableE(pawn) {
        //E direction
        if( (pawn.y+1 <5) && this.gameBoard[pawn.x][pawn.y+1] == null) return true;
    }

    #isPawnMovableSE(pawn) {
        //SE direction
        if( (pawn.x+1 <5 && pawn.y+1 <=4) && this.gameBoard[pawn.x+1][pawn.y+1] == null) return true;
    }

    #isPawnMovableS(pawn) {
        //S direction
        if( (pawn.x+1 <5) && this.gameBoard[pawn.x+1][pawn.y] == null) return true;
    }

    #isPawnMovableSW(pawn) {
        //SW direction
        if( (pawn.x+1 <5 && pawn.y-1 >=0) && this.gameBoard[pawn.x+1][pawn.y-1] == null) return true;
    }

    #isPawnMovableW(pawn) {
        //W direction
        if( (pawn.y-1 >=0) && this.gameBoard[pawn.x][pawn.y-1] == null) return true;
    }

    #isPawnMovableNW(pawn) {
        //NW direction
        if( (pawn.x-1 >= 0 && pawn.y-1 >=0) && this.gameBoard[pawn.x-1][pawn.y-1] == null) return true
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

    /*#getAvailableMoves(pawn) {
        let availableMoves = [];
        if(isPawnMovableN(pawn)) availableMoves.push("N");
        if(isPawnMovableNE(pawn)) availableMoves.push("NE");
        if(isPawnMovableE(pawn)) availableMoves.push("E");
        if(isPawnMovableSE(pawn)) availableMoves.push("SE");
        if(isPawnMovableS(pawn)) availableMoves.push("S");
        if(isPawnMovableSW(pawn)) availableMoves.push("SW");
        if(isPawnMovableW(pawn)) availableMoves.push("W");
        if(isPawnMovableNW(pawn)) availableMoves.push("NW");
        return availableMoves;
    }*/
}



function findPlayerPawns(player) {
    let playerPawns=[];
    for(let i=0; i<5; ++i) {
        playerPawns = playerPawns.concat(this.gameBoard[i].filter(function(element, index, arr){
            return element != null && (element.player === this)},player))
    }

    return playerPawns;
}

function findMovablePawns(pawns) {
    return pawns.filter(function(element, index, arr){
        return isPawnMovable(element)});
}
function choosePawnToMove(pawns) {
    return pawns[Math.floor(Math.random() * pawns.length)];
}



// function getAvailableMoves(pawn) {
//     let availableMoves = [];
//     if(isPawnMovableN(pawn)) availableMoves.push("N");
//     if(isPawnMovableNE(pawn)) availableMoves.push("NE");
//     if(isPawnMovableE(pawn)) availableMoves.push("E");
//     if(isPawnMovableSE(pawn)) availableMoves.push("SE");
//     if(isPawnMovableS(pawn)) availableMoves.push("S");
//     if(isPawnMovableSW(pawn)) availableMoves.push("SW");
//     if(isPawnMovableW(pawn)) availableMoves.push("W");
//     if(isPawnMovableNW(pawn)) availableMoves.push("NW");
//     return availableMoves;
// }

function chooseMove(moves) {
    return moves[Math.floor(Math.random() * moves.length)];
}

// function isPawnMovableN(pawn) {
//     //N direction
//     if( (pawn.x-1 >= 0) && this.gameBoard[pawn.x-1][pawn.y] == null) return true;
// }
//
// function isPawnMovableNE(pawn) {
//     //NE direction
//     if( (pawn.x-1 >= 0 && pawn.y+1 <5) && this.gameBoard[pawn.x-1][pawn.y+1] == null) return true;
// }
//
// function isPawnMovableE(pawn) {
//     //E direction
//     if( (pawn.y+1 <5) && this.gameBoard[pawn.x][pawn.y+1] == null) return true;
// }
//
// function isPawnMovableSE(pawn) {
//     //SE direction
//     if( (pawn.x+1 <5 && pawn.y+1 <=4) && this.gameBoard[pawn.x+1][pawn.y+1] == null) return true;
// }
//
// function isPawnMovableS(pawn) {
//     //S direction
//     if( (pawn.x+1 <5) && this.gameBoard[pawn.x+1][pawn.y] == null) return true;
// }
//
// function isPawnMovableSW(pawn) {
//     //SW direction
//     if( (pawn.x+1 <5 && pawn.y-1 >=0) && this.gameBoard[pawn.x+1][pawn.y-1] == null) return true;
// }
//
// function isPawnMovableW(pawn) {
//     //W direction
//     if( (pawn.y-1 >=0) && this.gameBoard[pawn.x][pawn.y-1] == null) return true;
// }
//
// function isPawnMovableNW(pawn) {
//     //NW direction
//     if( (pawn.x-1 >= 0 && pawn.y-1 >=0) && this.gameBoard[pawn.x-1][pawn.y-1] == null) return true
// }
//
// function isPawnMovable(pawn) {
//     //N direction
//     if(isPawnMovableN(pawn)) return true;
//
//     //NE direction
//     if(isPawnMovableNE(pawn)) return true;
//
//     //E direction
//     if(isPawnMovableE(pawn)) return true;
//
//     //SE direction
//     if(isPawnMovableSE(pawn)) return true;
//
//     //S direction
//     if(isPawnMovableS(pawn)) return true;
//
//     //SW direction
//     if(isPawnMovableSW(pawn)) return true;
//
//     //W direction
//     if(isPawnMovableW(pawn)) return true;
//
//     //NW direction
//     if(isPawnMovableNW(pawn)) return true;
//
//     return false
// }

// movePawn(pawn, direction) {
//     this.clearPlace(pawn.x,pawn.y);
//     switch(direction) {
//         case "N":
//             while(isPawnMovableN(pawn)) {
//                 --pawn.x;
//             }
//             break;
//         case "NE":
//             while(isPawnMovableNE(pawn)) {
//                 --pawn.x;
//                 ++pawn.y;
//             }
//             break;
//         case "E":
//             while(isPawnMovableE(pawn)) {
//                 ++pawn.y;
//             }
//             break;
//         case "SE":
//             while(isPawnMovableSE(pawn)) {
//                 ++pawn.y;
//                 ++pawn.x;
//             }
//             break;
//         case "S":
//             while(isPawnMovableS(pawn)) {
//                 ++pawn.x;
//             }
//             break;
//         case "SW":
//             while(isPawnMovableSW(pawn)) {
//                 ++pawn.x;
//                 --pawn.y
//             }
//             break;
//         case "W":
//             while(isPawnMovableW(pawn)) {
//                 --pawn.y;
//             }
//             break;
//         case "NW":
//             while(isPawnMovableNW(pawn)) {
//                 --pawn.x;
//                 --pawn.y
//             }
//             break;
//     }
//     this.gameBoard[pawn.x][pawn.y] = pawn;
//
//     console.log(this.gameBoard)
// }





