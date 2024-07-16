let intervalId;

export function startTimer(callback, endCallback) {
    let timeRemaining = 60;
    intervalId = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            document.getElementById('timeRemaining').textContent = timeRemaining;
            if (callback) callback(timeRemaining);
        } else {
            clearInterval(intervalId);
            if (endCallback) endCallback();
        }
    }, 1000);
    return intervalId;
}

export function stopTimer() {
    if (intervalId) clearInterval(intervalId);
}
