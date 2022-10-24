import {Pawn} from '/src/Pawn.js'
import {Game} from '/src/Game.js'

/**
 * Klasa odpowiedzialna za wszystkie operacje wykonywane na froncie
 */
export class GameBoard {

    /**
     *  Deklaracja fieldów klasy GameBoard
     */
    game
    board = [
        [
            new Pawn("W1","White",0,0),
            new Pawn("W2","White",1,0),
            new Pawn("W3","White",2,0),
            new Pawn("W4","White",3,0),
            new Pawn("W5","White",4,0)
        ],
        [null,null,null,null,null],
        [null,null,new Pawn("N","Neutron",2,2),null,null],
        [null,null,null,null,null],
        [
            new Pawn("B1","Black",0,4),
            new Pawn("B2","Black",1,4),
            new Pawn("B3","Black",2,4),
            new Pawn("B4","Black",3,4),
            new Pawn("B5","Black",4,4)
        ]
    ]
    /**
     * Konstruktor tworzy planszę, przypisuje grafiki pionkom i tworzy instancje klasy Game (czyli backendu gry)
     */
    constructor() {
        this.#createBoard()
        this.#createPawns()

        this.game = new Game(this.board)
    }

    /**
     * Przesunięcie pionka (od strony backend-owej)
     *
     * @param event
     */
    #movePawn = event => {
        const field = event.target
        if (document.getElementById(field.id).style.backgroundColor !== 'lightgreen') return
        const posY = parseInt(field.id.substring(1,2))
        const posX = parseInt(field.id.substring(3,4))

        let pawn = this.game.selectedPawn
        let previousField = document.getElementById(`f${pawn.y}0${pawn.x}`)

        if (this.game.movePawn(posX,posY)) {
            this.#clearMoveSelection()
            this.#clearField(previousField)
            this.#setNewPawnLocation(field, pawn)
            this.#toggleRound()
        }
    };

    /**
     * Ustawienie graficznej reprezentacji możliwych ruchów do wykonania
     *
     * @param field
     */
    #setFieldReactive(field) {
        field.style.backgroundColor = 'lightgreen'
        field.style.cursor = 'pointer'
        field.addEventListener('click',this.#movePawn)
    }

    /**
     * Przełączanie tury
     */
    #toggleRound() {
        this.#isWinningConditionMatched()

        this.game.swapPlayers()
        document.querySelector('#turn').innerText = `${this.game.currentPlayer}'s turn`

        this.game.isNeutronMove
            ? document.querySelector('#isNeutron').innerText = 'NEUTRON MOVE!'
            : document.querySelector('#isNeutron').innerText = ''
    }

    #isWinningConditionMatched()
    {
        const result = this.game.isGameOver()
        if (result.win) Swal.fire({
            title: 'Game Over!',
            html: `<b>Winner: ${result.winner}</b>`,
            confirmButtonText: '<b>Restart</b>'
        }).then((result) => {
            if (result.isConfirmed) {
                location.reload()
            }
        })
    }

    /**
     * Usunięcie pionka ze wcześniejszej pozycji po ruchu (frontend)
     * @param field - pole, z którego ma zostać usunięty pionek
     */
    #clearField(field) {
        if (field.innerText.length !== 0) {
            field.innerHTML = ''
            field.style.cursor = 'default'
            field.removeEventListener('click', this.#showPossibleMovement)
        }
    }


    /**
     * Przypisanie pionka do nowego pola na planszy (frontend)
     * @param field - pole, do którego ma zostać przypisany pionek
     * @param pawn - pionek, który ma zostać przypisany
     */
    #setNewPawnLocation(field, pawn) {
        if (field.innerText.length === 0) {
            field.innerHTML = `${pawn.player} <img class='pawn-img pawn' src="/images/${Pawn.getPawnImage(pawn.player)}" alt="">`
            field.style.cursor = 'pointer'
            field.addEventListener('click', this.#showPossibleMovement)
        }
    }

    /**
     * Usuwanie graficznego wskazania możliwości ruchu pionka
     */
    #clearMoveSelection() {
        document.querySelectorAll('.field').forEach(field => {
            if (field.style.backgroundColor === 'lightgreen') {
                field.style.backgroundColor = 'white'
                field.removeEventListener('click', this.#movePawn)
                field.style.cursor = 'default'
            } else if (field.style.backgroundColor === 'lightblue') {
                field.style.backgroundColor = 'white'
            }
        })
        this.game.clearPawnSelection()
    }

    /**
     * Przypisanie grafiki pionkom
     */
    #createPawns() {
        document.querySelectorAll('.field').forEach(field => {
            if (field.innerText.length !== 0) {
                field.innerHTML = `${field.innerText} <img class='pawn-img pawn' src="/images/${Pawn.getPawnImage(field.innerText)}" alt="">`
                field.style.cursor = 'pointer'
            }
        })
    }

    /**
     *  Proceduralne tworzenie planszy na froncie
     */
    #createBoard() {
        let boardElement = document.getElementById('gameBoard')
        let rowCount = 0
        this.board.forEach(row => {
            let boardRow = document.createElement('ul')
            boardRow.classList.add('board-row')
            boardRow.setAttribute('id', `row${rowCount}`)
            let fieldCount = 0

            row.forEach(field => {
                let boardField = document.createElement('li')
                boardField.classList.add('field')
                boardField.setAttribute('id',`f${rowCount}0${fieldCount}`)

                if (field instanceof Pawn) {
                    boardField.innerText = field.player
                    boardField.addEventListener('click', this.#showPossibleMovement, false)
                }
                boardRow.appendChild(boardField)
                fieldCount ++
            })
            boardElement.appendChild(boardRow)
            rowCount ++
        })
    }

    /**
     * Wyświetlenie możliwych ruchów dla wybranego pionka na planszy
     *
     * @param event
     */
    #showPossibleMovement = event => {
        let field = event.target
        if (field.tagName === 'IMG') field = event.target.parentElement
        const currentFieldID = field.id
        const pawnAffiliation = field.innerText

        this.#clearMoveSelection()

        if (this.game.isNeutronMove) {
            if (pawnAffiliation !== 'Neutron') return
        } else if (this.game.currentPlayer !== pawnAffiliation) return


        field.style.backgroundColor = 'lightblue'

        let pawnY = parseInt(currentFieldID.substring(1,2))
        let pawnX = parseInt(currentFieldID.substring(3,4))
        this.game.choosePawn(pawnX,pawnY)

        // Wyświetla możliwy ruch w górę planszy
        for (let i = pawnY-1; i >= 0; i--) {
            let previousField = document.getElementById(`f${i+1}0${pawnX}`)
            let field = document.getElementById(`f${i}0${pawnX}`)
            if (field.innerText.length !== 0) {
                if (previousField !== document.getElementById(`f${pawnY}0${pawnX}`)) {
                    this.#setFieldReactive(previousField)
                    break
                }
                break
            } else if (i === 0 && field.innerText.length === 0) {
                this.#setFieldReactive(field)
            }
        }
        // Wyświetla możliwy ruch w dół planszy
        for (let i = pawnY+1; i <= 4; i++) {
            let previousField = document.getElementById(`f${i-1}0${pawnX}`)
            let field = document.getElementById(`f${i}0${pawnX}`)
            if (field.innerText.length !== 0) {
                if (previousField !== document.getElementById(`f${pawnY}0${pawnX}`)) {
                    this.#setFieldReactive(previousField)
                    break
                }
                break
            } else if (i === 4 && field.innerText.length === 0) {
                this.#setFieldReactive(field)
            }
        }
        // Wyświetla możliwy ruch w prawą stronę
        for (let i = pawnX+1; i <= 4; i++) {
            let previousField = document.getElementById(`f${pawnY}0${i-1}`)
            let field = document.getElementById(`f${pawnY}0${i}`)
            if (field.innerText.length !== 0) {
                if (previousField !== document.getElementById(`f${pawnY}0${pawnX}`)) {
                    this.#setFieldReactive(previousField)
                    break
                }
                break
            } else if (i === 4 && field.innerText.length === 0) {
                this.#setFieldReactive(field)
            }
        }
        // Wyświetla możliwy ruch w lewą stronę
        for (let i = pawnX-1; i >= 0; i--) {
            let previousField = document.getElementById(`f${pawnY}0${i+1}`)
            let field = document.getElementById(`f${pawnY}0${i}`)
            if (field.innerText.length !== 0) {
                if (previousField !== document.getElementById(`f${pawnY}0${pawnX}`)) {
                    this.#setFieldReactive(previousField)
                    break
                }
                break
            } else if (i === 0 && field.innerText.length === 0) {
                this.#setFieldReactive(field)
            }
        }
        // Wyświetla możliwy ruch po prawej przekątnej w górę
        let x = pawnX
        let y = pawnY
        while (x < 4 && y > 0) {
            x ++
            y --
            let previousField = document.getElementById(`f${y+1}0${x-1}`)
            let field = document.getElementById(`f${y}0${x}`)
            if (field.innerText.length !== 0) {
                if (previousField !== document.getElementById(`f${pawnY}0${pawnX}`)) {
                    this.#setFieldReactive(previousField)
                    break
                }
                break
            } else if ((x === 4 || y === 0) && field.innerText.length === 0) {
                this.#setFieldReactive(field)
            }
        }
        // Wyświetla możliwy ruch po lewej przekątnej w górę
        x = pawnX
        y = pawnY
        while (x > 0 && y > 0) {
            x --
            y --
            let previousField = document.getElementById(`f${y+1}0${x+1}`)
            let field = document.getElementById(`f${y}0${x}`)
            if (field.innerText.length !== 0) {
                if (previousField !== document.getElementById(`f${pawnY}0${pawnX}`)) {
                    this.#setFieldReactive(previousField)
                    break
                }
                break
            } else if ((x === 0 || y === 0) && field.innerText.length === 0) {
                this.#setFieldReactive(field)
            }
        }
        // Wyświetla możliwy ruch po prawej przekątnej w dół
        x = pawnX
        y = pawnY
        while (x < 4 && y < 4) {
            x ++
            y ++
            let previousField = document.getElementById(`f${y-1}0${x-1}`)
            let field = document.getElementById(`f${y}0${x}`)
            if (field.innerText.length !== 0) {
                if (previousField !== document.getElementById(`f${pawnY}0${pawnX}`)) {
                    this.#setFieldReactive(previousField)
                    break
                }
                break
            } else if ((x === 4 || y === 4) && field.innerText.length === 0) {
                this.#setFieldReactive(field)
            }
        }
        // Wyświetla możliwy ruch po lewej przekątnej w dół
        x = pawnX
        y = pawnY
        while (x > 0 && y < 4) {
            x --
            y ++
            let previousField = document.getElementById(`f${y-1}0${x+1}`)
            let field = document.getElementById(`f${y}0${x}`)
            if (field.innerText.length !== 0) {
                if (previousField !== document.getElementById(`f${pawnY}0${pawnX}`)) {
                    this.#setFieldReactive(previousField)
                    break
                }
                break
            } else if ((x === 0 || y === 4) && field.innerText.length === 0) {
                this.#setFieldReactive(field)
            }
        }
    }
}
