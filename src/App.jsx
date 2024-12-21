import React from 'react'
import './App.css'
import Die from './Components/Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'


function App() {

  const [dieObject, setDieObject] = React.useState(() => generateNumbers())

  let gameWon = false

  const values = dieObject.map(num => num.value);
  const allSame = new Set(values).size === 1;
  const allHeld = dieObject.every(die => die.isHeld);
    
  if (allSame && allHeld) {
      gameWon = true
  }

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

    setDieObject(
      prevState => prevState.map(
        (die, index) => die.isHeld === false ? {...die, value: newValue[index].value} : die
      )
    )
  }

  function newGame() {
    gameWon = false
    setDieObject(generateNumbers())
  }

  function hold(id) {
    setDieObject(
      prevState => prevState.map(
        die => die.id ===id ? {...die, isHeld: !die.isHeld} : die
      )
    )
  }

  const dieNumbers = dieObject.map(
    dieObject => <Die key={dieObject.id} value={dieObject.value} isHeld={dieObject.isHeld} toggle={() => hold(dieObject.id)}/>
  )

  // START OF CODE FOR RENDERING
  return (
    <main className='h-full rounded-xl flex justify-center items-center flex-col'>

      {gameWon && <Confetti width={window.innerWidth - 1} height={window.innerHeight - 1}/>}

      <div aria-live="polite" className='sr-only'>
        {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
      </div>

      <h1 className='text-3xl font-semibold'>Tenzies</h1>

      <p className='text-md text-center mx-12 mb-4 text-gray-700'>
        Roll until all dice are the same. Click each die to 
        freeze it at its current value between rolls.
      </p>

      <div className="grid grid-cols-5 gap-x-2 gap-y-2">
        {dieNumbers}
      </div>

      <button onClick={gameWon ? newGame : rollDice} className='bg-buttonColor text-white py-2 px-10 rounded shadow-lg shadow-gray-400 font-semibold mt-10'>
        {gameWon ? "New Game" : "Roll"}
      </button>

    </main>
  )
}

export default App
