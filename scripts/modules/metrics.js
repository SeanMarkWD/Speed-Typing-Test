export function storeMetrics(wpm, accuracy) {
    let metrics = JSON.parse(localStorage.getItem('typingMetrics')) || [];
    metrics.push({ wpm, accuracy, date: new Date().toISOString() });
    localStorage.setItem('typingMetrics', JSON.stringify(metrics));
}

export function getPreviousMetrics() {
    let metrics = JSON.parse(localStorage.getItem('typingMetrics')) || [];
    return metrics.length > 0 ? metrics[metrics.length - 1] : null;
}

export function displayStoredMetrics() {
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

    const displayedMetrics = metrics.slice().reverse();

    displayedMetrics.forEach(metric => {
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