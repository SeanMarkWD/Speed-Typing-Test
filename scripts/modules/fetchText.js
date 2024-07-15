export async function fetchRandomText() {
    try {
        const response = await fetch('https://poetrydb.org/random');
        const data = await response.json();
        return data[0].lines.join(' ');
    } catch (error) {
        console.error('Error fetching text:', error);
        return "Failed to fetch text.";
    }
}

export function displayText(text, containerElement) {
    const words = text.split(/\s+/);
    const limitedText = words.slice(0, 250).join(' ');
    containerElement.textContent = limitedText;
}