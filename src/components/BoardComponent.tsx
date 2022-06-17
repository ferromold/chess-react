import React, {FC, useEffect, useState} from 'react';
import {Board} from "../models/Board";
import CellComponent from "./CellComponent";
import {Cell} from "../models/Cell";
import {Player} from "../models/Player";
import {Colors} from "../models/Colors";
import PieceSelection from "./PieceSelection";
import {Figure} from "../models/figures/Figure";

interface BoardProps{
  board: Board
  setBoard: (board: Board) => void
  currentPlayer: Player | null
  swapPlayer: () => void
  pause: boolean
  setCanBack: (status: boolean) => void
  winner: Player | null
  pawnEnd: boolean
  handlePawnEnd: (status: boolean) => void
  handleResetMove: () => void
  handleMoved: (boardCurrent: Board) => void
}

const BoardComponent: FC<BoardProps> = ({board, setBoard, currentPlayer, swapPlayer, handleResetMove, pause, setCanBack, winner, pawnEnd, handleMoved, handlePawnEnd}) => {

  const [selectedCell, setSelectedCell] = useState<Cell | null>(null)

  function click(cell: Cell){
    if(pause || winner) return
    if(selectedCell && selectedCell !== cell && selectedCell.figure?.canMove(cell)){
      const lastBoard = board.getDeepCopyBoard()
      const isCheck = selectedCell.moveFigure(cell)
      if(isCheck){
        setBoard(lastBoard)
        return;
      }
      handleMoved(lastBoard)
      if(cell.isPawnEnd()){
        handlePawnEnd(true)
        setSelectedCell(cell)
        return;
      }
      setSelectedCell(null)
      swapPlayer()
    }else {
      if(cell.figure?.color === currentPlayer?.color) {
        setSelectedCell(cell)
      }
    }
  }

  function pawnNewFigure(figure: Figure){
    if(selectedCell){
      selectedCell.setFigure(figure)
    }
    setSelectedCell(null)
    handlePawnEnd(false)
    swapPlayer()
  }

  useEffect(() => {
    highlightCells()
  }, [selectedCell])

  function highlightCells(){
    board.highlightCells(selectedCell)
    updateBoard()
  }

  function updateBoard(){
    const newBoard = board.getCopyBoard()
    setBoard(newBoard)
  }

  return (
    <div>
      <h3>{currentPlayer?.color}</h3>
      {pawnEnd && <PieceSelection
          color={selectedCell?.figure?.color as Colors}
          setSelectedFigure={pawnNewFigure}
          figures={selectedCell?.figure?.color === Colors.WHITE ? board.figuresPawn.white : board.figuresPawn.black}
      />}
      <div className={'board'}>
        {board.cells.map((row, index) =>
          <React.Fragment key={index}>
            {row.map(cell =>
              <CellComponent
                key={cell.id}
                cell={cell}
                selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y}
                click={click}
              />
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};



export default BoardComponent;