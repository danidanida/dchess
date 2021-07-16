import "./Board.css"
import { useState } from "react"
import Cell from "../Cell/Cell"
import { figures, isFigureOn, getFigure, getDeadWhiteFiguresAmount, getDeadBlackFiguresAmount } from "../../figures/Figures"
import { IFigure } from "../../figures/Figure"

const Board = () => {
    const [selectedCoordinates, setSelectedCoordinates] = useState<Coordinates>({
        i: undefined,
        j: undefined,
    })

    const [turn, setTurn] = useState<boolean>(true)
    const [checkMate, setCheckMate] = useState<boolean>(false)

    const deadWhiteFiguresAmount = getDeadWhiteFiguresAmount()
    const deadBlackFiguresAmount = getDeadBlackFiguresAmount()

    const areCoordinatesSelected = (): boolean =>
        selectedCoordinates.i !== undefined && selectedCoordinates.j !== undefined

    const getSelectedFigure = (): IFigure =>
        figures.filter((f) => f.coordinateI === selectedCoordinates.i && f.coordinateJ === selectedCoordinates.j)[0]

    const deselect = (): void => setSelectedCoordinates({ i: undefined, j: undefined })
    const stayAtPosition = (): void => setSelectedCoordinates({ i: selectedCoordinates.i, j: selectedCoordinates.j })

    const handleClick = (i: number, j: number): void => {
        const current = { i, j }
        if (!areCoordinatesSelected()) {
            if (isFigureOn(i, j)) {
                setSelectedCoordinates({ i: i, j: j })
            }
        } else {
            const selectedFigure = getSelectedFigure()
            if (turn && selectedFigure.color && selectedFigure.canMove(i, j)) {
                if (isFigureOn(i, j)) {
                    const targetFigure = getFigure(i, j)
                    !targetFigure.color ? targetFigure.die() : stayAtPosition()
                }
                selectedFigure.move(i, j)
                setTurn(false)
                deselect()
            } else if (!turn && !selectedFigure.color && selectedFigure.canMove(i, j)) {
                if (isFigureOn(i, j)) {
                    const deadFigure = getFigure(i, j)
                    if (deadFigure.type === "king") {setCheckMate(true)} 
                    else
                    {deadFigure.die()}
                }
                selectedFigure.move(i, j)
                setTurn(true)
                deselect()
            } else {
                deselect()
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
                const currentFigure = figures.filter((f) => f.coordinateI === i && f.coordinateJ === j)[0]
                const isSuggestion = selectedFigure && selectedFigure.canMove(i, j)

                rows.push(
                    <th key={(i + j).toString()}>
                        <Cell
                            figure={currentFigure}
                            selected={isSelectedCell}
                            handleClick={handleClick}
                            color={isBlack}
                            moveSuggestion={isSuggestion}
                            i={i}
                            j={j}
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
            {/*<h1 className="chessboard_title"> Chess</h1>*/}
            <h3 className="chessboard_announcement" style={turn ? { color: "white" } : { color: "black" }}>
                {!checkMate && turn ? "White turn" : "Black turn"}
                {checkMate && "Game is over"}
            </h3>
            <h3>Killed white figures {deadWhiteFiguresAmount} and killed black figures {deadBlackFiguresAmount}</h3>
            <table>
                <thead></thead>
                <tbody>{drawChessBoard()}</tbody>
            </table>
        </div>
    )
}

export default Board

interface Coordinates {
    i: number | undefined
    j: number | undefined
}
