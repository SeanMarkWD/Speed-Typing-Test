async function fetchRandomText() {
    try {
        const response = await fetch('https://poetrydb.org/random');
        const data = await response.json();
        return data[0].lines.join(' ');
    } catch (error) {
        console.error('Error fetching text:', error);
        return "Failed to fetch text.";
    }
}

function displayText(text, containerElement) {
    const words = text.split(/\s+/);
    const limitedText = words.slice(0, 250).join(' ');
    containerElement.textContent = limitedText;
}

function highlightText(inputText, originalText, containerElement) {
    const words = originalText.split(/\s+/);
    let displayHTML = '';
    let typedWords = inputText.split(/\s+/);

    for (let i = 0; i < words.length; i++) {
        if (i < typedWords.length) {
            if (words[i] === typedWords[i]) {
                displayHTML += `<span class="correct">${words[i]}</span> `;
            } else if (i === typedWords.length - 1) {
                displayHTML += `<span class="current-word">${words[i]}</span> `;
            } else {
                displayHTML += `<span class="incorrect">${words[i]}</span> `;
            }
        } else {
            displayHTML += words[i] + " ";
        }
    }

    containerElement.innerHTML = displayHTML.trim();
}

function setupTypingTest() {
    const textInput = document.getElementById('textInput');
    const textDisplay = document.getElementById('textDisplay');
    const wpmDisplay = document.getElementById('wpmDisplay');
    const accuracyDisplay = document.getElementById('accuracyDisplay');
    const resetButton = document.getElementById('resetButton');
    let timerStarted = false;
    let correctWordsCount = 0;
    let totalWordsCount = 0;
    let intervalId;

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

        if (!timerStarted && typedText.length > 0) {
            startTimer();
            timerStarted = true;
        }
    });

    resetButton.addEventListener('click', function () {
        resetTest();
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            restartTest();
        } else if (event.key === 'Escape') {
            resetTest();
        }
    });

    function resetTest() {
        fetchRandomText().then(newText => {
            displayText(newText, textDisplay);
            textInput.value = '';
            wpmDisplay.textContent = 'WPM: ';
            accuracyDisplay.textContent = 'Accuracy: ';
            document.getElementById('timeRemaining').textContent = '60';
            textInput.disabled = false;
            timerStarted = false;
            correctWordsCount = 0;
            totalWordsCount = 0;
            clearInterval(intervalId);
        });
    }

    function displayResults() {
        const timeSpentMinutes = 1;
        const wpm = correctWordsCount / timeSpentMinutes;
        const accuracy = (correctWordsCount / totalWordsCount) * 100;

        wpmDisplay.textContent = `WPM: ${wpm.toFixed(2)}`;
        accuracyDisplay.textContent = `Accuracy: ${accuracy.toFixed(2)}%`;
    }

    function startTimer() {
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
    }
}

window.onload = function () {
    fetchRandomText().then(text => {
        displayText(text, document.getElementById('textDisplay'));
    });
    setupTypingTest();
};