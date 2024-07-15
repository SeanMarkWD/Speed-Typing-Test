# Typing Speed Test

Typing Speed Test is a web application that allows users to test their typing speed and accuracy. Users can type a randomly fetched piece of text within a given time frame and view their results, including words per minute (WPM) and accuracy. The app also stores users' metrics and displays their progress over time.

## Features

- Fetches random text from an external API for typing tests.
- Highlights correct, incorrect, and current words as the user types.
- Starts a 60-second timer when the user begins typing.
- Displays WPM and accuracy at the end of the test.
- Stores and displays the user's typing metrics.
- Allows the user to reset and restart the test.
- Provides visual feedback on improvement compared to previous attempts.
- Handles errors and displays appropriate messages.

## Technologies Used

- HTML
- CSS
- JavaScript

## Setup and Usage

1. **Clone the repository:**

    ```sh
    git clone [https://github.com/your-username/typing-speed-test.git](https://github.com/SeanMarkWD/Speed-Typing-Test.git)
    cd typing-speed-test
    ```

2. **Open `index.html` in your browser:**

    Simply open the `index.html` file in your favorite web browser to start using the Typing Speed Test application.

3. **Run the Typing Speed Test:**

    - Type the displayed text in the input area.
    - The timer will start automatically when you begin typing.
    - Your WPM and accuracy will be displayed at the end of the 60-second test.
    - View your previous metrics in the table below the test area.

## File Structure

- `index.html`: The main HTML file that contains the structure of the application.
- `styles.css`: The CSS file that contains the styling for the application.
- `main.js`: The main JavaScript file that initializes the application and sets up event listeners.
- `fetchText.js`: Contains the function to fetch random text from the API.
- `highlightText.js`: Contains the function to highlight text as the user types.
- `metrics.js`: Contains functions to store and display typing metrics.
- `timer.js`: Contains functions to manage the timer.

## Error Handling

- The application handles errors gracefully and displays appropriate error messages to the user if the API request fails or if there are other issues.

## Acknowledgements

- [PoetryDB](https://poetrydb.org/) for providing the API used to fetch random text.
