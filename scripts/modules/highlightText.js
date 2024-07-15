export function highlightText(inputText, originalText, containerElement) {
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