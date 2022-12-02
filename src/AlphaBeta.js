import {Negamax} from './Negamax.js';
import {Pawn} from './Pawn.js';

export class AlphaBeta extends Negamax{

    makeMove() {
        if (this.game.isNeutronMove) {
            try {
                let bestMove = this.alphaBetaMax(this.gameBoard, 2, 1, null, -Infinity, Infinity)
                console.log(bestMove)
                this.movePawn(bestMove[1].neutron, bestMove[1].neutronMove, this.gameBoard)
                let promise = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(this.movePawn(bestMove[1].pawn, bestMove[1].move, this.gameBoard))
                    }, 500)
                }).then(() => {
                }).catch(() => {
                    console.log('problem przy wykonaniu drugiego ruchu')
                })
                return true
            } catch (e) {
                console.log("problem przy ruchu w makemove()" + e + this.gameBoard)
                console.log("===========")
                return false
            }
        } 
    }

    alphaBetaMax(gameBoard, depth, sign, beginningMove, alpha, beta) {
        let movesArray = []
        let score = [-Infinity]
        let gameBoardCopy = JSON.parse(JSON.stringify(gameBoard))
        let neutronPawn = this.findPlayerPawns('Neutron', gameBoardCopy)[0]
        let neutronMoves = this.getAvailableMoves(neutronPawn, gameBoardCopy)
        let gameBoardValue = this.evaluate(gameBoardCopy)
        if (gameBoardValue >= 4000 || gameBoardValue <= -4000 ) {
            return [sign*gameBoardValue, beginningMove, "terminal node", depth]
        } else if (depth === 0) {
            return [sign*gameBoardValue, beginningMove, "", depth]
        }
        if (neutronMoves.length === 0) {
            return [sign*Infinity, beginningMove, "no moves for neutron", depth]
        }
        neutronMoves.forEach(neutronDirection =>{
            let neutronCopy = JSON.parse(JSON.stringify(neutronPawn))
            let gameBoardCopyForNeutron = JSON.parse(JSON.stringify(gameBoard))
            this.movePawn(neutronCopy, neutronDirection, gameBoardCopyForNeutron)
            let playerPawns = (sign <0 )? this.findPlayerPawns('White', gameBoardCopyForNeutron) : this.findPlayerPawns(this.player, gameBoardCopyForNeutron)
            let playerMovablePawns = this.findMovablePawns(playerPawns, gameBoardCopyForNeutron)
            playerMovablePawns.forEach(pawn =>{
                let pawnAvailableMoves = this.getAvailableMoves(pawn, gameBoardCopyForNeutron)
                pawnAvailableMoves.forEach(pawnDirection =>{
                    movesArray.push({neutron: neutronPawn,  neutronMove: neutronDirection, pawn: pawn, move: pawnDirection})
                })
            })
        })
        movesArray = movesArray.reverse()
        for(let i = 0; i < movesArray.length; ++i){
            let gameBoardCopyForMove = JSON.parse(JSON.stringify(gameBoardCopy))
            let neutronCopy = JSON.parse(JSON.stringify(neutronPawn))
            let pawnCopy = JSON.parse(JSON.stringify(movesArray[i].pawn))
            this.movePawn(neutronCopy, movesArray[i].neutronMove, gameBoardCopyForMove)
            this.movePawn(pawnCopy, movesArray[i].move, gameBoardCopyForMove)
            let alphaBetaResult = this.alphaBetaMax(
                gameBoardCopyForMove,
                depth - 1,
                -sign,
                (depth === 2) ? {neutron: neutronPawn,  neutronMove: movesArray[i].neutronMove, pawn: movesArray[i].pawn, move: movesArray[i].move}: beginningMove,
                -beta,
                -alpha
            )
            alphaBetaResult[0] *= -1
            score = (Math.max(score[0],alphaBetaResult[0]) == alphaBetaResult[0])? alphaBetaResult: score
            alpha = Math.max(alpha, score[0])
            if(alpha >= beta){
                console.log("obciecie")
                break
            }
        }
        
        return score
    }
}
