export async function fetchRandomText() {
    try {
        const response = await fetch('https://poetrydb.org/random');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data[0].lines.join(' ');
    } catch (error) {
        console.error('Error fetching text:', error);
        return "Failed to fetch text. Please try again later.";
    }
}

export function displayText(text, containerElement) {
    const words = text.split(/\s+/);
    const limitedText = words.slice(0, 250).join(' ');
    containerElement.textContent = limitedText;
}