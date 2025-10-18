const HISTORY_KEY = 'multiplicationTestHistory'

export const getTestHistory = () => {
    try {
        const history = localStorage.getItem(HISTORY_KEY)
        return history ? JSON.parse(history) : []
    } catch (error) {
        console.error('Could not retrieve test history from localStorage', error)
        return []
    }
}

export const saveTestResult = (result) => {
    try {
        const history = getTestHistory()
        const newHistory = [...history, result]
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
    } catch (error) {
        console.error('Could not save test result to localStorage', error)
    }
}
