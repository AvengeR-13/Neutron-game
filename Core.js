import {AI} from '/src/AI.js'
import {Pawn} from '/src/Pawn.js'
import {Game} from '/src/Game.js'
import {Minimax} from '/src/Minimax.js'
import {Negamax} from './src/Negamax.js'
import {GameBoard} from '/src/GameBoard.js'

/**
 * Funkcja uruchamiająca grę
 */
const startGame = (event) => {
    let gameMode = event.target.id
    document.querySelectorAll('button').forEach(button => {
        button.removeEventListener('click', startGame)
    })
    document.querySelector('#menu').classList.add('hidden')

    new GameBoard(gameMode);
};

window.onload = () => {
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', startGame)
    })
}
