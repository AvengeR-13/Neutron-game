import {AI} from "./AI.js";
import {Pawn} from "./Pawn.js";
import {Graph} from './Graph.js';

export class MonteCarloTree extends AI {

    algorithm = AI.algorithmEnums.MONTECARLOTREE
    graph = new Graph()
    c = Math.sqrt(2)
    seconds = 6

    makeMove() {
        if (this.game.isNeutronMove) {
            try {
                let bestMove = this.monteCarloTreeSearch(this.gameBoard, this.numberOfSimulations)
                this.movePawn(bestMove[1].neutron, bestMove[1].neutronMove, this.gameBoard)
                try {
                    this.movePawn(bestMove[1].pawn, bestMove[1].move, this.gameBoard)
                    return true
                } catch (e) {
                    console.log(`problem przy wykonaniu drugiego ruchu: ${e}`)
                }
            } catch (e) {
                console.log(`problem przy ruchu w makemove() ${e}`)
                console.log(this.gameBoard)
                return false
            }
        }
    }

    monteCarloTreeSearch(gameBoard){
        let movesArray = this.getAllAvailableMovesForPlayer(this.player, gameBoard)
        let root = {
            gameBoard: gameBoard,
            parent: null,
            children: [],
            possibleMoves: movesArray,
            move: null,
            currentPlayer: this.player,
            visits: 0,
            wins: 0
        }
        let startTime = Date.now();
        while((Date.now() - startTime) < (this.seconds*1000)){
            let current = this.treePolicy(root)
            let reward = this.defaultPolicy(current)
            this.backup(current, reward)
        }

        console.log(root)

        let maxVisits = -Infinity
        let bestChild = null
        root.children.forEach(child =>{
            if(child.visits > maxVisits){
                maxVisits = child.visits
                bestChild = child
            }
        })
        let winingProbability = `${bestChild.wins}/${bestChild.visits}`
        return [winingProbability, bestChild.move]
    }

    treePolicy(node){
        while(!this.isFinalState(node.gameBoard)){
            if(node.possibleMoves.length !=0){
                return this.expand(node)
            }else{
                node = this.bestChild(node)
            }
        }
        //to prevent from selecting branch with loosing option
        if(this.whoWon(node.gameBoard, node.currentPlayer) != this.player){
            node.wins = Number.MIN_SAFE_INTEGER
        }
        return node
    }

    expand(node){
        let index = this.randomIntFromInterval(0,node.possibleMoves.length-1)
        let move = node.possibleMoves[index]
        let gameBoardCopy = JSON.parse(JSON.stringify(node.gameBoard))
        let neutronCopy = JSON.parse(JSON.stringify(move.neutron))
        let pawnCopy = JSON.parse(JSON.stringify(move.pawn))
        this.movePawn(neutronCopy, move.neutronMove, gameBoardCopy)
        this.movePawn(pawnCopy, move.move, gameBoardCopy)
        let child = {
            gameBoard: gameBoardCopy,
            parent: node,
            children: [],
            possibleMoves: [],
            move: move,
            currentPlayer: (node.currentPlayer == this.player)? "White": this.player,
            visits: 0,
            wins: 0
        }
        child.possibleMoves = this.getAllAvailableMovesForPlayer(child.currentPlayer, child.gameBoard)
        node.possibleMoves.splice(index,1)
        node.children.push(child)
        return child
    }

    bestChild(node){
        let value = -Infinity
        let best = null
        node.children.forEach(child => {
            let childValue = (child.wins / child.visits) + (this.c * Math.sqrt(Math.log(node.visits)/child.visits))
            if(childValue > value){
                best = child
                value = childValue
            }
        })
        return best
    }

    defaultPolicy(node){
        let gameBoardCopy = JSON.parse(JSON.stringify(node.gameBoard))
        let possibleMovesCopy = JSON.parse(JSON.stringify(node.possibleMoves))
        let currentPlayerCopy = JSON.parse(JSON.stringify(node.currentPlayer))
        while(!this.isFinalState(node.gameBoard)){
            let randomNumber = this.randomIntFromInterval(0,node.possibleMoves.length-1)
            let currentMove = node.possibleMoves[randomNumber]
            this.movePawn(currentMove.neutron, currentMove.neutronMove, node.gameBoard)
            this.movePawn(currentMove.pawn, currentMove.move, node.gameBoard)
            node.currentPlayer = (node.currentPlayer == 'White')? 'Black': 'White'
            node.possibleMoves = this.getAllAvailableMovesForPlayer(node.currentPlayer, node.gameBoard)
        }
        let reward = (this.whoWon(node.gameBoard,node.currentPlayer) == this.player)? 1 : -1
        node.gameBoard = gameBoardCopy
        node.possibleMoves = possibleMovesCopy
        node.currentPlayer = currentPlayerCopy
        return reward
    }

    backup(node, reward){
        while(node != null){
            node.visits +=1
            node.wins += reward
            node = node.parent
        }
    }

    randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    whoWon(gameBoard, player){
        let neutronPawn = this.findPlayerPawns('Neutron', gameBoard)[0]
        let neutronMoves = this.getPawnAvailableMoves(neutronPawn, gameBoard)
        if(neutronPawn.y == 0) return 'White'
        if(neutronPawn.y == 4) return 'Black'
        if(neutronMoves.length == 0){
            return (player == 'White')? 'Black': 'White'
        }
        return null

    }

    isFinalState(gameBoard){
        let neutronPawn = this.findPlayerPawns('Neutron', gameBoard)[0]
        let neutronMoves = this.getPawnAvailableMoves(neutronPawn, gameBoard)
        return (neutronMoves.length === 0 || neutronPawn.y == 4 || neutronPawn.y == 0)? true: false
    }

    getAllAvailableMovesForPlayer(player, gameBoard){

        let movesArray = []
        let gameBoardCopy = JSON.parse(JSON.stringify(gameBoard))

        let neutronPawn = this.findPlayerPawns('Neutron', gameBoardCopy)[0]
        let neutronMoves = this.getPawnAvailableMoves(neutronPawn, gameBoardCopy)

        neutronMoves.forEach(neutronDirection =>{
            let neutronCopy = JSON.parse(JSON.stringify(neutronPawn))
            let gameBoardCopyForNeutron = JSON.parse(JSON.stringify(gameBoard))
            this.movePawn(neutronCopy, neutronDirection, gameBoardCopyForNeutron)
            let playerPawns = this.findPlayerPawns(player, gameBoardCopyForNeutron)
            let playerMovablePawns = this.findMovablePawns(playerPawns, gameBoardCopyForNeutron)
            playerMovablePawns.forEach(pawn =>{
                let pawnAvailableMoves = this.getPawnAvailableMoves(pawn, gameBoardCopyForNeutron)
                pawnAvailableMoves.forEach(pawnDirection =>{
                    movesArray.push({neutron: neutronPawn,  neutronMove: neutronDirection, pawn: pawn, move: pawnDirection})
                })
            })
        })

        return movesArray
    }


    getPawnAvailableMoves(pawn, gameBoard) {
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
