export function startTimer(callback, endCallback) {
    let timeRemaining = 60;
    intervalId = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            document.getElementById('timeRemaining').textContent = timeRemaining;
        } else {
            clearInterval(intervalId);
            textInput.disabled = true;
            displayResults();
            alert("Time is up!");
        }
    }, 1000);
    return intervalId;
}

export function stopTimer(intervalId) {
    clearInterval(intervalId);
}