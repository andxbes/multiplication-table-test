import { useState, useEffect, useRef } from 'react'

// --- Константы для настройки теста ---
const TOTAL_QUESTIONS = 10 // Загальна кількість питань у тесті
const MAX_NUMBER = 10 // Максимальне число для множення (від 1 до 10)

// --- Вспомогательная функция для генерации случайного числа ---
function getRandomNumber(max) {
    return Math.floor(Math.random() * max) + 1
}

function Game({ onTestComplete }) {
    // --- Состояние компонента (State) ---
    const [num1, setNum1] = useState(0)
    const [num2, setNum2] = useState(0)
    const [userAnswer, setUserAnswer] = useState('')
    const [score, setScore] = useState(0)
    const [questionNumber, setQuestionNumber] = useState(1)
    const [feedback, setFeedback] = useState({ message: '', color: '' })
    const inputRef = useRef(null)

    // --- Функция для генерации нового примера ---
    const generateNewProblem = () => {
        setNum1(getRandomNumber(MAX_NUMBER))
        setNum2(getRandomNumber(MAX_NUMBER))
        setUserAnswer('') // Очищуємо поле вводу
        setFeedback({ message: '', color: '' }) // Скидаємо зворотний зв'язок
    }

    // --- Запускаємо генерацію першого прикладу при завантаженні компонента ---
    useEffect(() => {
        generateNewProblem()
    }, [])

    // --- Ефект для фокусування на полі вводу ---
    useEffect(() => {
        if (inputRef.current && !feedback.message) {
            inputRef.current.focus()
        }
    }, [num1, num2, feedback.message]) // Запускається, коли генерується новий приклад

    // --- Обработчик отправки ответа ---
    const handleSubmit = (e) => {
        e.preventDefault()
        if (userAnswer === '' || feedback.message) return // Не відправляти порожню відповідь або під час показу фідбеку

        const correctAnswer = num1 * num2
        if (parseInt(userAnswer, 10) === correctAnswer) {
            setScore(score + 1)
            setFeedback({ message: 'Правильно! 🎉', color: 'text-green-500' })
        } else {
            setFeedback({
                message: `Помилка. Правильна відповідь: ${correctAnswer}`,
                color: 'text-red-500',
            })
        }

        // Пауза, щоб користувач побачив результат, перед наступним питанням
        setTimeout(() => {
            if (questionNumber < TOTAL_QUESTIONS) {
                setQuestionNumber(questionNumber + 1)
                generateNewProblem()
            } else {
                onTestComplete({ score, total: TOTAL_QUESTIONS })
            }
        }, 1500)
    }

    return (
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg text-center">
            <div className="flex justify-between items-center mb-6 text-gray-600">
                <span className="font-semibold">Питання: {questionNumber} / {TOTAL_QUESTIONS}</span>
                <span className="font-semibold">Рахунок: {score}</span>
            </div>

            <p className="text-6xl font-bold text-gray-800 mb-8">
                {num1} × {num2}
            </p>

            <form onSubmit={handleSubmit}>
                <input
                    ref={inputRef}
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full p-4 text-2xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="?"
                    autoFocus
                    disabled={feedback.message !== ''}
                />
            </form>
            {feedback.message && <p className={`mt-4 text-xl font-semibold ${feedback.color}`}>{feedback.message}</p>}
        </div>
    )
}

export default Game
