import React, {FC, useEffect, useRef, useState} from 'react';
import {Player} from "../models/Player";
import {Colors} from "../models/Colors";

interface TimerProps{
  currentPlayer: Player | null
  restart: () => void
  timerIsOver: (color: Colors) => void
  pause: boolean
  setPause: (status: boolean) => void
  winner: Player | null
  pawnEnd: boolean
  initialTime: number
}

const Timer: FC<TimerProps> = ({currentPlayer, restart, timerIsOver, pause, setPause, winner, pawnEnd, initialTime}) => {
  const [blackTime, setBlackTime] = useState(initialTime)
  const [whiteTime, setWhiteTime] = useState(initialTime)
  const timer = useRef<null | ReturnType<typeof setInterval>>(null)

  useEffect(() => {
    startTimer()
  }, [currentPlayer])

  useEffect(() => {
    pause ? removeTimer() : startTimer()
  }, [pause])

  useEffect(() => {
    winner ? removeTimer() : startTimer()
  }, [winner])

  useEffect(() => {
    if(whiteTime === 0) {
      timerIsOver(Colors.WHITE)
      removeTimer()
    }
    if(blackTime === 0) {
      timerIsOver(Colors.BLACK)
      removeTimer()
    }
  }, [whiteTime, blackTime])

  function removeTimer(){
    if(timer.current){
      clearInterval(timer.current)
    }
  }

  function startTimer(){
    removeTimer()
    const callback = currentPlayer?.color === Colors.WHITE ? decrementWhiteTimer : decrementBlackTimer
    timer.current = setInterval(callback, 1000)
  }

  function pauseTimer(){
    if(winner || pawnEnd) return
    if(!pause){
      removeTimer()
      setPause(true)
    } else{
      startTimer()
      setPause(false)
    }
  }

  function decrementBlackTimer(){
    setBlackTime(prev => prev - 1)
  }

  function decrementWhiteTimer(){
    setWhiteTime(prev => prev - 1)
  }

  function handleRestart(){
    setBlackTime(initialTime)
    setWhiteTime(initialTime)
    startTimer()
    restart()
  }

  return (
    <div>
      <div>
        <button onClick={handleRestart}>restart game</button>
      </div>
      <br/>
      <div>
        <button onClick={pauseTimer}>pause game</button>
      </div>
      <br/>
      <h3>pause: {`${pause}`}</h3>
      <br/>
      <h2>black - {blackTime}</h2>
      <h2>white - {whiteTime}</h2>
    </div>
  );
};

export default Timer;