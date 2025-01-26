import React from 'react'
import './App.css'
import Die from './Components/Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import { useStopwatch } from 'react-timer-hook'

function App() {
  const {
    seconds,
    minutes,
    hours,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: false })

  const [dieObject, setDieObject] = React.useState(() => generateNumbers())
  const [rollCount, setRollCount] = React.useState(0)
  const [attemptCount, setAttemptCount] = React.useState(1)
  const [gameStarted, setGameStarted] = React.useState(false)
  const [gameWon, setGameWon] = React.useState(false)

  React.useEffect(() => {
    const values = dieObject.map(num => num.value)
    const allSame = new Set(values).size === 1
    const allHeld = dieObject.every(die => die.isHeld)

    if (allSame && allHeld) {
      setGameWon(true)
      pause()
    } else {
      setGameWon(false)
    }
  }, [dieObject, pause])

  function generateNumbers() {
    return new Array(10)
        .fill(0)
        .map(() => ({
          value: Math.ceil(Math.random() * 6),
          isHeld: false,
          id: nanoid()
        }))
  }

  function rollDice() {
    const newValue = generateNumbers()
    setRollCount(prevCount => prevCount + 1)

    setDieObject(
      prevState => prevState.map(
        (die, index) => die.isHeld === false ? {...die, value: newValue[index].value} : die
      )
    )
  }

  function newGame() {
    setGameWon(false)
    setDieObject(generateNumbers())
    setRollCount(0)
    setAttemptCount(prevCount => prevCount + 1)
    reset()
  }
  
  function startGame() {
    setGameStarted(true)
    start()
  }

  function hold(id) {
    setDieObject(
      prevState => prevState.map(
        die => die.id ===id ? {...die, isHeld: !die.isHeld} : die
      )
    )
  }

  const dieNumbers = dieObject.map(
    dieObject => <Die key={dieObject.id} value={dieObject.value} isHeld={dieObject.isHeld} toggle={() => hold(dieObject.id)} gameStarted={gameStarted}/>
  )

  // START OF CODE FOR RENDERING
  return (
    <main className='h-auto rounded-xl flex justify-center items-center flex-col py-8'>

      {gameWon && <Confetti width={window.innerWidth - 1} height={window.innerHeight - 1}/>}

      <div aria-live="polite" className='sr-only'>
        {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
      </div>

      <h1 className='text-3xl font-semibold mb-2'>Tenzies</h1>

      <p className='text-md text-center mx-12 mb-4 text-gray-700'>
        Roll until all dice are the same. Click each die to 
        freeze it at its current value between rolls.
      </p>

      <div className='font-semibold mb-3 text-indigo-700'>
        <h3>Elapsed Time: {hours < 10 && `0`}{hours}:{minutes < 10 && `0`}{minutes}:{seconds < 10 && `0`}{seconds}</h3>
      </div>

      <div className="grid grid-cols-5 gap-x-2 gap-y-2 mb-4">
        {dieNumbers}
      </div>

      {gameWon && <p className='text-green-600 font-bold text-lg'>
        You won!
      </p>}

      {gameStarted && <button onClick={gameWon ? newGame : rollDice} className='bg-buttonColor text-white py-2 px-6 rounded shadow-lg shadow-gray-400 font-semibold mt-4 w-36 flex justify-center items-center gap-x-2'>
        {!gameWon && <img src="./rolldice.png" className='w-6'/>}
        {gameWon ? "New Game" : "Roll"}
      </button>}
      {!gameStarted && <button onClick={startGame} className='bg-buttonColor text-white py-2 px-4 rounded shadow-lg shadow-gray-400 font-semibold mt-4 w-36 flex items-center justify-center gap-x-2'>
        <img src="./startgame.png" className='w-4'/>
        Start Game
      </button>}

      <div className='mt-6 flex-row text-center'>
        <p className='font-semibold'>Rolls: {rollCount}</p>
        <p className='font-semibold'>Attempts: {attemptCount}</p>
      </div>

    </main>
  )
}

export default App
