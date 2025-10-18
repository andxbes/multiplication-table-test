function Results({ result, onRestart, onGoToMenu }) {
    if (!result) return null

    return (
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg text-center">
            <h1 className="text-4xl font-bold mb-4">Тест завершено!</h1>
            <p className="text-2xl mb-8">
                Ваш результат: {result.score} з {result.total}
            </p>
            <button
                onClick={onRestart}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-xl mb-4 w-full"
            >
                Почати знову
            </button>
            <button
                onClick={onGoToMenu}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-xl w-full"
            >
                В головне меню
            </button>
        </div>
    )
}

export default Results
