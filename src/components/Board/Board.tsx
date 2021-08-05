import "./Board.css"
import { useState } from "react"
import { ChessBoard } from "../../figures/Chessboard"
import Cell from "../Cell/Cell"
import { IFigure } from "../../figures/Figure"

const Board = () => {
    const [chessboard, setChessboard] = useState<ChessBoard>(() => new ChessBoard())
    const [selectedCoordinates, setSelectedCoordinates] = useState<Coordinates>({
        i: undefined,
        j: undefined,
    })
    const [isPromotionMode, setPromotionMode] = useState<boolean>(false)
    const [isKingUnderAttack, setIsKingUnderAttack] = useState<isKingUnderAttack>({ mode: false, color: false })
    const [checkMate, setCheckMate] = useState<boolean>(false)

    function handleStartNewGameClick() {
        setChessboard(() => new ChessBoard())
    }

    const areCoordinatesSelected = (): boolean =>
        selectedCoordinates.i !== undefined && selectedCoordinates.j !== undefined

    const getSelectedFigure = (): IFigure =>
        chessboard.getFigure(selectedCoordinates.i ?? -3, selectedCoordinates.j ?? -3)

    const deselect = (): void => setSelectedCoordinates({ i: undefined, j: undefined })
    const stayAtPosition = (): void => setSelectedCoordinates({ i: selectedCoordinates.i, j: selectedCoordinates.j })

    const handleSelectChange = (event: any) => {
        setPromotionMode(false)
        chessboard.promoteFigure(event.currentTarget.value)
    }

    const toggleTurn = () => {
        if (chessboard.turn === true) {
            return (chessboard.turn = false)
        } else return (chessboard.turn = true)
    }

    const handleCellClick = (i: number, j: number): void => {
        if (isPromotionMode) {
            return
        }
        if (checkMate) {
            return
        }
        const current = { i, j }
        if (!areCoordinatesSelected()) {
            // if nothingis chosen
            const selectedFigure = chessboard.getFigure(i, j)
            if (selectedFigure && selectedFigure.color === chessboard.turn) {
                setSelectedCoordinates({ i: i, j: j })
            }
        } else {
            // if smth is chosen
            const selectedFigure = getSelectedFigure()

            if (selectedFigure && selectedFigure.canMove(i, j, chessboard)) {
                if (chessboard.isFigureOn(i, j)) {
                    const targetFigure = chessboard.getFigure(i, j)
                    if (targetFigure.color !== selectedFigure.color) {
                        targetFigure.die()
                    } else stayAtPosition()
                }
                selectedFigure.move(i, j, chessboard)
                if (chessboard.checkIfKingUnderAttack(!chessboard.turn)) {
                    setIsKingUnderAttack({ mode: true, color: !chessboard.turn })
                } else setIsKingUnderAttack({ mode: false, color: false })
                if (chessboard.checkIfKingUnderCheckMate(chessboard.turn)) {
                    alert("check mate")
                    setCheckMate(true)
                }
                toggleTurn()
                deselect()
            } else {
                deselect()
            }

            if (selectedFigure.type === "pawn" && selectedFigure.promotion) {
                setPromotionMode(true)
            }
        }
        if (selectedCoordinates.i === current.i && selectedCoordinates.j === current.j) {
            deselect()
        }
    }

    const drawChessBoard = () => {
        let chessBoard = []

        const selectedFigure = getSelectedFigure()

        for (let i = 0; i < 8; i++) {
            let rows = []
            for (let j = 0; j < 8; j++) {
                const isBlack = (i + j) % 2 === 0
                const isSelectedCell = i === selectedCoordinates.i && j === selectedCoordinates.j
                const currentFigure = chessboard.figures.filter((f) => f.coordinateI === i && f.coordinateJ === j)[0]
                const isSuggestion = selectedFigure && selectedFigure.canMove(i, j, chessboard)
                const highlight =
                    isKingUnderAttack.mode &&
                    currentFigure &&
                    currentFigure.type === "king" &&
                    currentFigure.color === isKingUnderAttack.color
                rows.push(
                    <th key={(i + j).toString()}>
                        <Cell
                            figure={currentFigure}
                            selected={isSelectedCell}
                            handleClick={handleCellClick}
                            color={isBlack}
                            moveSuggestion={isSuggestion}
                            i={i}
                            j={j}
                            highlighted={highlight}
                        />
                    </th>
                )
            }
            chessBoard.push(<tr key={i.toString()}>{rows}</tr>)
        }
        return chessBoard
    }
    return (
        <div className="chessboard">
            {isPromotionMode && (
                <div>
                    <select className="chess_promotion" onChange={handleSelectChange}>
                        <option selected>Choose a figure</option>
                        <option value="queen">Queen</option>
                        <option value="bishop">Bishop</option>
                        <option value="rook">Rook</option>
                        <option value="knight">Knight</option>
                    </select>
                </div>
            )}
            <table>
                <thead></thead>
                <tbody>{drawChessBoard()}</tbody>
            </table>
            <button className="chess_reset_game_btn" onClick={handleStartNewGameClick}>
                New Game
            </button>
        </div>
    )
}

export default Board

interface isKingUnderAttack {
    mode: boolean
    color: boolean
}

interface Coordinates {
    i: number | undefined
    j: number | undefined
}