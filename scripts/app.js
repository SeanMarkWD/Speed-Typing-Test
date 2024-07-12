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
    let correctWordsCount = 0;
    let totalWordsCount = typedWords.length;

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

    containerElement.innerHTML = displayHTML.trim();
    return { correctWordsCount, totalWordsCount };
}

function setupTypingTest() {
    const textInput = document.getElementById('textInput');
    const textDisplay = document.getElementById('textDisplay');
    const wpmDisplay = document.getElementById('wpmDisplay');
    const accuracyDisplay = document.getElementById('accuracyDisplay');
    const resetButton = document.getElementById('resetButton');
    const metricsDisplay = document.getElementById('metricsDisplay');
    let timerStarted = false;
    let correctWordsCount = 0;
    let totalWordsCount = 0;
    let intervalId;

    textInput.addEventListener('input', function () {
        const typedText = textInput.value;
        const result = highlightText(typedText, textDisplay.textContent, textDisplay);
        correctWordsCount = result.correctWordsCount;
        totalWordsCount = result.totalWordsCount;

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
        textInput.value = '';
        wpmDisplay.textContent = 'WPM: ';
        accuracyDisplay.textContent = 'Accuracy: ';
        document.getElementById('timeRemaining').textContent = '60';
        textInput.disabled = false;
        timerStarted = false;
        correctWordsCount = 0;
        totalWordsCount = 0;
        clearInterval(intervalId);
        highlightText('', textDisplay.textContent, textDisplay); // Clear highlighting
    }

    function restartTest() {
        fetchRandomText().then(newText => {
            displayText(newText, textDisplay);
            resetTest();
        });
    }

    function displayResults() {
        const timeSpentMinutes = 1;
        const wpm = correctWordsCount / timeSpentMinutes;
        const accuracy = (correctWordsCount / totalWordsCount) * 100;

        wpmDisplay.textContent = `WPM: ${wpm.toFixed(2)}`;
        accuracyDisplay.textContent = `Accuracy: ${accuracy.toFixed(2)}%`;

        // Store the metrics in local storage
        storeMetrics(wpm, accuracy);
        displayStoredMetrics();
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


    function storeMetrics(wpm, accuracy) {
        let metrics = JSON.parse(localStorage.getItem('typingMetrics')) || [];
        metrics.push({ wpm, accuracy, date: new Date().toLocaleString() });
        localStorage.setItem('typingMetrics', JSON.stringify(metrics));
    }

    function displayStoredMetrics() {
        let metrics = JSON.parse(localStorage.getItem('typingMetrics')) || [];
        metricsDisplay.innerHTML = '<h3>Previous Metrics</h3>';
        metrics.forEach(metric => {
            metricsDisplay.innerHTML += `<p>${metric.date} - WPM: ${metric.wpm.toFixed(2)}, Accuracy: ${metric.accuracy.toFixed(2)}%</p>`;
        });
    }

    // Display stored metrics on load
    displayStoredMetrics();
}

window.onload = function () {
    fetchRandomText().then(text => {
        displayText(text, document.getElementById('textDisplay'));
    });
    setupTypingTest();
};