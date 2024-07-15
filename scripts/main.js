import { fetchRandomText, displayText } from './modules/fetchText.js';
import { highlightText } from './modules/highlightText.js';
import { storeMetrics, getPreviousMetrics, displayStoredMetrics } from './modules/metrics.js';
import { startTimer, stopTimer } from './modules/timer.js';

document.addEventListener('DOMContentLoaded', async () => {
    const textInput = document.getElementById('textInput');
    const textDisplay = document.getElementById('textDisplay');
    const wpmDisplay = document.getElementById('wpmDisplay');
    const accuracyDisplay = document.getElementById('accuracyDisplay');
    const resetButton = document.getElementById('resetButton');
    const improvementDisplay = document.getElementById('improvementDisplay');
    const metricsDisplay = document.getElementById('metricsDisplay');
    let timerStarted = false;
    let correctWordsCount = 0;
    let totalWordsCount = 0;
    let intervalId;

    textInput.addEventListener('input', function () {
        const typedText = textInput.value;
        if (!typedText.length) return;

        const result = highlightText(typedText, textDisplay.textContent, textDisplay);
        correctWordsCount = result.correctWordsCount;
        totalWordsCount = result.totalWordsCount;

        if (!timerStarted && typedText.length > 0) {
            intervalId = startTimer(
                (timeRemaining) => document.getElementById('timeRemaining').textContent = timeRemaining,
                () => {
                    displayResults();
                    alert("Time is up!");
                }
            );
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

    async function displayResults() {
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
        displayStoredMetrics(metricsDisplay);
    }

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
        stopTimer(intervalId);
        highlightText('', textDisplay.textContent, textDisplay);
    }

    function restartTest() {
        fetchRandomText().then(newText => {
            displayText(newText, textDisplay);
            resetTest();
        });
    }

    // Initial setup
    const text = await fetchRandomText();
    displayText(text, textDisplay);
    displayStoredMetrics(metricsDisplay);
});
