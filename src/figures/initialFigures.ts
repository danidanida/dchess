import { Pawn } from "./Pawn"
import { King } from "./King"
import { Queen } from "./Queen"
import { Bishop } from "./Bishop"
import { Rook } from "./Rook"
import { Knight } from "./Knight"


const initialFigures = [
    new Pawn(true, 6, 0),
    new Pawn(true, 6, 1),
    new Pawn(true, 6, 2),
    new Pawn(true, 6, 3),
    new Pawn(true, 6, 4),
    new Pawn(true, 6, 5),
    new Pawn(true, 6, 6),
    new Pawn(true, 6, 7),

    new Pawn(false, 1, 0),
    new Pawn(false, 1, 1),
    new Pawn(false, 1, 2),
    new Pawn(false, 1, 3),
    new Pawn(false, 1, 4),
    new Pawn(false, 1, 5),
    new Pawn(false, 1, 6),
    new Pawn(false, 1, 7),

    new Knight(false, 0, 1),
    new Knight(false, 0, 6),

    new Knight(true, 7, 1),
    new Knight(true, 7, 6),

    new Rook(true, 7, 0),
    new Rook(true, 7, 7),

    new Rook(false, 0, 0),
    new Rook(false, 0, 7),

    new Queen(true, 7, 3),
    new Queen(false, 0, 3),

    new King(true, 7, 4),
    new King(false, 0, 4),

    new Bishop(true, 7, 2),
    new Bishop(true, 7, 5),

    new Bishop(false, 0, 2),
    new Bishop(false, 0, 5),
]

export default function getInitialFigures () {
    return initialFigures
} 