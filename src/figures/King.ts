import { ChessBoard } from "./Chessboard"
import { IFigure } from "./Figure"

export class King implements IFigure {
    constructor(color: boolean, coordinateI: number, coordinateJ: number) {
        this.color = color
        this.coordinateI = coordinateI
        this.coordinateJ = coordinateJ
        this.type = "king"
        this.didMove = false
    }
    color: boolean
    coordinateI: number
    coordinateJ: number
    type: string
    didMove: boolean

    canMove(targetI: number, targetJ: number, chessboard: ChessBoard): boolean | undefined {
        const cellHasFigure = chessboard.isFigureOn(targetI, targetJ)

        if (cellHasFigure) {
            const figure = chessboard.getFigure(targetI, targetJ)
            if (figure.color === this.color) {
                return false
            }
        }

        if (this.color === chessboard.turn) { // avoids infinite loop (canMove of king calls canMove of oposite king)
            if (chessboard.checkIfCellIsUnderAttack(this.color, targetI, targetJ)) {
                return false
            }
        }

        // castling
        if (this.didMove === false) {

            const rookRight = chessboard.getFigure(this.coordinateI, this.coordinateJ + 3)
            const rookLeft = chessboard.getFigure(this.coordinateI, this.coordinateJ - 4)
            if (
                rookRight &&
                rookRight.type === "rook" &&
                !rookRight.didMove &&
                !chessboard.isFigureOn(this.coordinateI, this.coordinateJ + 1) &&
                !chessboard.isFigureOn(this.coordinateI, this.coordinateJ + 2) &&
                targetI === this.coordinateI &&
                targetJ === this.coordinateJ + 2
            ) {
                return true
            }
            if (
                rookLeft &&
                rookLeft.type === "rook" &&
                !rookLeft.didMove &&
                !chessboard.isFigureOn(this.coordinateI, this.coordinateJ - 1) &&
                !chessboard.isFigureOn(this.coordinateI, this.coordinateJ - 2) &&
                !chessboard.isFigureOn(this.coordinateI, this.coordinateJ - 3) &&
                targetI === this.coordinateI &&
                targetJ === this.coordinateJ - 2
            ) {
                return true
            }
        }
        if (this.color) {
            // white king logic
            if (
                (this.coordinateI - 1 === targetI ||
                    this.coordinateI === targetI ||
                    this.coordinateI + 1 === targetI) &&
                (this.coordinateJ === targetJ || this.coordinateJ - 1 === targetJ || this.coordinateJ + 1 === targetJ)
            ) {
                return true
            }
        } else {
            // black king logic
            if (
                (this.coordinateI + 1 === targetI ||
                    this.coordinateI === targetI ||
                    this.coordinateI - 1 === targetI) &&
                (this.coordinateJ === targetJ || this.coordinateJ + 1 === targetJ || this.coordinateJ - 1 === targetJ)
            ) {
                return true
            }
        }
    }

    move(targetI: number, targetJ: number, chessboard: ChessBoard): void {

        if(!this.didMove) {
            if(targetJ === 6) { // short castling
                const rook = chessboard.getFigure(this.coordinateI, 7)
                rook.move(this.coordinateI, 5, chessboard)
            } else if (targetJ === 2) {
                const rook = chessboard.getFigure(this.coordinateI, 0)
                rook.move(this.coordinateI, 3, chessboard)
            }
        }
        
        this.didMove = true
        this.coordinateI = targetI
        this.coordinateJ = targetJ
    }

    die() { }
}
