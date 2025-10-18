import { useState } from 'react'
import './App.css'
import Game from './components/Game'
import Results from './components/Results'
import History from './components/History'
import { saveTestResult } from './utils/storage'

function App() {
  const [view, setView] = useState('menu') // 'menu', 'game', 'results', 'history'
  const [lastResult, setLastResult] = useState(null)

  const handleTestComplete = (result) => {
    const resultWithDate = { ...result, date: new Date().toISOString() }
    saveTestResult(resultWithDate)
    setLastResult(resultWithDate)
    setView('results')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      {view === 'menu' && (
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-8">Тест з таблиці множення</h1>
          <div className="flex gap-4 items-center justify-center">
            <button
              onClick={() => setView('game')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-2xl  w-64"
            >
              Почати тест
            </button>
            <button
              onClick={() => setView('history')}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-2xl w-64"
            >
              Історія
            </button>
          </div>
        </div>
      )}

      {view === 'game' && <Game onTestComplete={handleTestComplete} />}

      {view === 'results' && (
        <Results
          result={lastResult}
          onRestart={() => setView('game')}
          onGoToMenu={() => setView('menu')}
        />
      )}

      {view === 'history' && <History onBack={() => setView('menu')} />}
    </div>
  )
}

export default App
