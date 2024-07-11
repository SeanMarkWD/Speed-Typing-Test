let timer;
let timeRemaining = 60; // Timer set for 60 seconds

function fetchRandomText() {
    fetch('https://poetrydb.org/random')
        .then(response => response.json())
        .then(data => {
            const poem = data[0];
            const text = poem.lines.join(' ');
            displayText(text);
        })
        .catch(error => console.error('Error fetching text:', error));
}

function displayText(text) {
    const textDisplayElement = document.getElementById('textDisplay');
    const words = text.split(/\s+/);
    const limitedText = words.slice(0, 250).join(' ');
    textDisplayElement.textContent = limitedText;
}

function stopTimer() {
    clearInterval(timer);
    timer = null; // Reset timer
    document.getElementById('textInput').disabled = true; // Disable typing in the textarea
}

function setupTypingTest() {
    const textInput = document.getElementById('textInput');
    const textDisplay = document.getElementById('textDisplay');
    const wpmDisplay = document.getElementById('wpmDisplay');
    const accuracyDisplay = document.getElementById('accuracyDisplay');
    let timerStarted = false;
    let correctWordsCount = 0;
    let totalWordsCount = 0;

    textInput.addEventListener('input', function () {
        const typedText = textInput.value;
        const words = textDisplay.textContent.split(/\s+/);
        let displayHTML = '';
        let typedWords = typedText.split(/\s+/);

        correctWordsCount = 0;
        totalWordsCount = typedWords.length;

        for (let i = 0; i < words.length; i++) {
            if (i < typedWords.length) {
                if (words[i] === typedWords[i]) {
                    displayHTML += `<span class="correct">${words[i]}</span> `;
                    correctWordsCount++;
                } else if (i === typedWords.length - 1) {
                    displayHTML += `<span class="current-word">${words[i]}</span> `;
                } else {
                    displayHTML += `<span class="incorrect">${words[i]}</span> `;
                }
            } else {
                displayHTML += words[i] + " ";
            }
        }

        textDisplay.innerHTML = displayHTML.trim();

        // Start the timer only once when the first character is typed
        if (!timerStarted && typedText.length > 0) {
            startTimer();
            timerStarted = true;
        }
    });

    function displayResults() {
        const timeSpentMinutes = 1; // Since the timer is 60 seconds
        const wpm = correctWordsCount / timeSpentMinutes;
        const accuracy = (correctWordsCount / totalWordsCount) * 100;

        wpmDisplay.textContent = `WPM: ${wpm.toFixed(2)}`;
        accuracyDisplay.textContent = `Accuracy: ${accuracy.toFixed(2)}%`;
    }

    function startTimer() {
        let timeRemaining = 60; // 60 seconds timer
        const intervalId = setInterval(() => {
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
    }
}

window.onload = function () {
    fetchRandomText();
    setupTypingTest();
};