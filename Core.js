import {AI} from '/src/AI.js'
import {Pawn} from '/src/Pawn.js'
import {Game} from '/src/Game.js'
import {Minimax} from '/src/Minimax.js'
import {Negamax} from '/src/Negamax.js'
import {AlphaBeta} from '/src/AlphaBeta.js'
import {Graph} from '/src/Graph.js';
import {MonteCarlo} from '/src/MonteCarlo.js'
import {MonteCarloTree} from '/src/MonteCarloTree.js'
import {GameBoard} from '/src/GameBoard.js'

/**
 * Funkcja uruchamiająca grę
 */
const startGame = (event) => {
    let gameMode = event.target.id
    let algorithm = document.querySelector('#algorithm-select').value

    document.querySelectorAll('button').forEach(button => {
        button.removeEventListener('click', startGame)
    })
    document.querySelector('#menu').classList.add('hidden')
    if (gameMode !== 'PvP') {
        document.querySelector('#algorithm').innerText += ` ${algorithm}`.toUpperCase()
        document.querySelector('#algorithm').classList.remove('hidden')
        document.querySelector('#graph').classList.remove('hidden')
    }

    new GameBoard(gameMode, algorithm);
};

window.onload = () => {
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', startGame)
    })
}
