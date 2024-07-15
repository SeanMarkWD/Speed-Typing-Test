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
    const improvementDisplay = document.getElementById('improvementDisplay'); // Add an element to show improvement
    let timerStarted = false;
    let correctWordsCount = 0;
    let totalWordsCount = 0;
    let intervalId;

    textInput.addEventListener('input', function () {
        const typedText = textInput.value;
        if (!typedText.length) return; // Ensure text input is not empty to prevent null errors

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
        improvementDisplay.textContent = ''; // Clear the improvement display
        document.getElementById('timeRemaining').textContent = '60';
        textInput.disabled = false;
        timerStarted = false;
        correctWordsCount = 0;
        totalWordsCount = 0;
        clearInterval(intervalId);
        highlightText('', textDisplay.textContent, textDisplay);
    }

    function restartTest() {
        fetchRandomText().then(newText => {
            displayText(newText, textDisplay);
            resetTest();
        });
    }

    function displayResults() {
        const timeSpentMinutes = 1; // This should be calculated based on the actual time spent
        const wpm = Math.round(correctWordsCount / timeSpentMinutes);
        const accuracy = (correctWordsCount / totalWordsCount) * 100;

        wpmDisplay.textContent = `WPM: ${wpm}`;
        accuracyDisplay.textContent = `Accuracy: ${accuracy.toFixed(1)}%`;

        // Compare with previous attempt
        const previousMetrics = getPreviousMetrics();
        let improvementMessage = '';
        if (previousMetrics) {
            const wpmImprovement = wpm > previousMetrics.wpm ? 'increased' : (wpm < previousMetrics.wpm ? 'decreased' : 'remains the same');
            const accuracyImprovement = accuracy > previousMetrics.accuracy ? 'increased' : (accuracy < previousMetrics.accuracy ? 'decreased' : 'remains the same');

            improvementMessage = `WPM has ${wpmImprovement}`;
            if (wpmImprovement !== 'remains the same') {
                improvementMessage += ` from ${previousMetrics.wpm} to ${wpm}`;
            }

            improvementMessage += `. Accuracy ${accuracyImprovement}`;
            if (accuracyImprovement !== 'remains the same') {
                improvementMessage += ` from ${previousMetrics.accuracy.toFixed(1)}% to ${accuracy.toFixed(1)}%`;
            } else {
                improvementMessage += ` at ${accuracy.toFixed(1)}%`;
            }
        } else {
            improvementMessage = 'This is your first attempt. Keep going!';
        }
        improvementDisplay.textContent = improvementMessage;

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
        metrics.push({ wpm, accuracy, date: new Date().toISOString() });
        localStorage.setItem('typingMetrics', JSON.stringify(metrics));
    }

    function getPreviousMetrics() {
        let metrics = JSON.parse(localStorage.getItem('typingMetrics')) || [];
        return metrics.length > 0 ? metrics[metrics.length - 1] : null;
    }

    function displayStoredMetrics() {
        let metrics = JSON.parse(localStorage.getItem('typingMetrics')) || [];

        // Create the table and its header
        let tableHTML = `
        <h3>Previous Metrics</h3>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>WPM</th>
                    <th>Accuracy</th>
                </tr>
            </thead>
            <tbody>
    `;

        // Populate the table rows with metrics data
        metrics.forEach(metric => {
            const metricDate = new Date(metric.date);
            const formattedDate = metricDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
            const formattedTime = metricDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            tableHTML += `
            <tr>
                <td>${formattedDate}</td>
                <td>${formattedTime}</td>
                <td>${metric.wpm}</td>
                <td>${metric.accuracy.toFixed(1)}%</td>
            </tr>
        `;
        });

        // Close the table tags
        tableHTML += `
            </tbody>
        </table>
    `;

        // Set the innerHTML of the metricsDisplay element to the table
        metricsDisplay.innerHTML = tableHTML;
    }

    displayStoredMetrics();
}

window.onload = function () {
    fetchRandomText().then(text => {
        displayText(text, document.getElementById('textDisplay'));
    });
    setupTypingTest();
};
