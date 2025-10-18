import { useState, useEffect, useRef } from 'react'

// --- Константы для настройки теста ---
const TOTAL_QUESTIONS = 10 // Загальна кількість питань у тесті
const MAX_NUMBER = 10      // Максимальне число для множення (від 1 до 10)
const TIME_LIMIT = 40      // Час на відповідь у секундах

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
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
    const inputRef = useRef(null)

    // --- Функция для генерации нового примера ---
    const generateNewProblem = () => {
        setNum1(getRandomNumber(MAX_NUMBER))
        setNum2(getRandomNumber(MAX_NUMBER))
        setUserAnswer('') // Очищуємо поле вводу
        setFeedback({ message: '', color: '' }) // Скидаємо зворотний зв'язок
        setTimeLeft(TIME_LIMIT) // Скидаємо таймер
    }

    // --- Запускаємо генерацію першого прикладу при завантаженні компонента ---
    useEffect(() => {
        generateNewProblem()
    }, [])

    // --- Ефект для таймера ---
    useEffect(() => {
        // Не запускати таймер, якщо є повідомлення або гра завершена
        if (feedback.message) return

        // Якщо час вийшов, обробляємо це як неправильну відповідь
        if (timeLeft === 0) {
            setFeedback({
                message: `Час вийшов! Правильна відповідь: ${num1 * num2}`,
                color: 'text-orange-500',
            })
            // Використовуємо setTimeout для переходу до наступного питання
            setTimeout(() => {
                if (questionNumber < TOTAL_QUESTIONS) {
                    setQuestionNumber(questionNumber + 1)
                    generateNewProblem()
                } else {
                    onTestComplete({ score: score, total: TOTAL_QUESTIONS })
                }
            }, 1500)
            return
        }

        // Запускаємо інтервал, який щосекунди зменшує час
        const timerId = setInterval(() => {
            setTimeLeft(timeLeft - 1)
        }, 1000)

        // Очищуємо інтервал при зміні стану або розмонтуванні компонента
        return () => clearInterval(timerId)
    }, [timeLeft, feedback.message])

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

        const isCorrect = parseInt(userAnswer, 10) === num1 * num2

        const correctAnswer = num1 * num2
        if (isCorrect) {
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
                const finalScore = isCorrect ? score + 1 : score
                onTestComplete({ score: finalScore, total: TOTAL_QUESTIONS })
            }
        }, 1500)
    }

    return (
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg text-center relative">
            {/* Таймер */}
            <div className="absolute top-4 right-4 text-lg font-bold text-red-500">
                Час: {timeLeft}
            </div>

            <div className="flex justify-between items-center mb-6 text-gray-600 pt-4">
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
