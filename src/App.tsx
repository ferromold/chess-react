import React, {useEffect, useState} from 'react';
import './App.css';
import BoardComponent from "./components/BoardComponent";
import {Board} from "./models/Board";
import {Player} from "./models/Player";
import {Colors} from "./models/Colors";
import LostFigures from "./components/LostFigures";
import Timer from "./components/Timer";
import {FigureNames} from "./models/figures/Figure";

function App() {
  const [board, setBoard] = useState(new Board())
  const [whitePlayer, setWhitePlayer] = useState(new Player(Colors.WHITE))
  const [blackPlayer, setBlackPlayer] = useState(new Player(Colors.BLACK))
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [winner, setWinner] = useState<Player | null>(null)
  const [pause, setPause] = useState(false)
  const [pawnEnd, setPawnEnd] = useState<boolean>(false)
  const [lastBoard, setLastBoard] = useState(new Board())
  const [canBack, setCanBack] = useState<boolean>(true)
  const [initialTime, setInitialTime] = useState(100)

  useEffect(() => {
    restart()
    setCurrentPlayer(whitePlayer)
  }, [])

  function restart(){
    const newBoard = new Board()
    newBoard.init()
    setBoard(newBoard)
    setCurrentPlayer(whitePlayer)
    setWinner(null)
    setPause(false)
    setPawnEnd(false)
    setCanBack(false)
  }

  function handleMoved(boardCurrent: Board){
    setLastBoard(boardCurrent)
    setCanBack(true)
  }

  function handleResetMove(){
    setBoard(lastBoard)
    swapPlayer()
    setCanBack(false)
    setWinner(null)
  }

  function isCheckMate(player: Player): boolean{
    const color = player?.color
    return board.isCheckMateOnBoard(color)

  }

  function swapPlayer(){
    const player = currentPlayer?.color === Colors.WHITE ? blackPlayer :  whitePlayer
    setCurrentPlayer(player)
    if(isCheckMate(player)){
      setWinner(player?.color === Colors.WHITE ? blackPlayer :  whitePlayer)
    }
  }

  function timerIsOver(color: Colors){
    setWinner(color === Colors.WHITE ? blackPlayer :  whitePlayer)
  }

  function handlePawnEnd(status: boolean){
    setPause(status)
    setPawnEnd(status)
    setCanBack(!status)
  }

  return (
    <div className="app">
      <Timer
        pawnEnd={pawnEnd}
        currentPlayer={currentPlayer}
        restart={restart}
        timerIsOver={timerIsOver}
        winner={winner}
        pause={pause}
        setPause={setPause}
        initialTime={initialTime}
      />
      <div>
        {winner ? <h3>winner: {winner.color}</h3> : <h2>play!</h2>}
        <br/>
        <BoardComponent
          handleResetMove={handleResetMove}
          handleMoved={handleMoved}
          handlePawnEnd={handlePawnEnd}
          pawnEnd={pawnEnd}
          pause={pause}
          setCanBack={setCanBack}
          winner={winner}
          board={board}
          setBoard={setBoard}
          currentPlayer={currentPlayer}
          swapPlayer={swapPlayer}
        />
        <br/>
        <button disabled={pause || !canBack} onClick={() => handleResetMove()}>back one turn</button>
      </div>
      <div>
        <LostFigures
          title={'black figures'}
          figures={board.lostBlackFigures}
        />
        <LostFigures
          title={'white figures'}
          figures={board.lostWhiteFigures}
        />
      </div>
    </div>
  );
}

export default App;
