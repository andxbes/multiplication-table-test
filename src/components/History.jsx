import { useState, useEffect } from 'react'
import { getTestHistory } from '../utils/storage'

function History({ onBack }) {
    const [history, setHistory] = useState([])

    useEffect(() => {
        const storedHistory = getTestHistory()
        // Сортуємо за датою, від нових до старих
        storedHistory.sort((a, b) => new Date(b.date) - new Date(a.date))
        setHistory(storedHistory)
    }, [])

    return (
        <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">Історія тестів</h1>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {history.length > 0 ? (
                    history.map((item, index) => (
                        <div key={index} className="p-4 bg-slate-100 rounded-lg flex justify-between items-center">
                            <span className="font-semibold text-gray-700">
                                {new Date(item.date).toLocaleString('uk-UA')}
                            </span>
                            <span className="text-lg font-bold text-blue-600">
                                {item.score} / {item.total}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">Історія поки порожня.</p>
                )}
            </div>
            <button
                onClick={onBack}
                className="mt-8 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg w-full"
            >
                Назад
            </button>
        </div>
    )
}

export default History
