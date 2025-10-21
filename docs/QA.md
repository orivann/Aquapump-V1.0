# Quality Assurance (QA) Testing

This document outlines the manual testing steps to verify the fixes and improvements made to the application.

## 1. UI Verification

### 1.1. Chatbot Text Color
- **Objective:** Verify that the chatbot text is visible in both light and dark modes.
- **Steps:**
  1. Open the application.
  2. Toggle between light and dark modes.
  3. Open the chatbot.
  4. Send a message.
- **Expected Result:** The user's message text should be clearly visible against the primary color background in both themes.

### 1.2. Keyboard Behavior
- **Objective:** Verify that the keyboard does not obscure the chat input on mobile devices.
- **Steps:**
  1. Open the application on a mobile device (iOS or Android).
  2. Open the chatbot.
  3. Tap on the chat input field.
- **Expected Result:** The keyboard should appear and the chat input should be pushed up, remaining visible above the keyboard.

### 1.3. Theme Responsiveness
- **Objective:** Verify that the main screen's background color adapts to theme changes.
- **Steps:**
  1. Open the application.
  2. Toggle between light and dark modes.
- **Expected Result:** The background color of the main screen should change according to the selected theme.

## 2. API Error Handling

### 2.1. Missing API Key
- **Objective:** Verify that a user-friendly error message is displayed when the chatbot API key is missing.
- **Steps:**
  1. Temporarily remove or rename the `EXPO_PUBLIC_AI_CHAT_KEY` environment variable.
  2. Restart the application.
  3. Open the chatbot and send a message.
- **Expected Result:** The chatbot should display a message indicating that it is not configured and that the API key is missing.

### 2.2. Server Error
- **Objective:** Verify that a user-friendly error message is displayed when the chatbot API returns a server error.
- **Steps:**
  1. Modify the `toolkitUrl` in `components/Chatbot.tsx` to an invalid endpoint.
  2. Restart the application.
  3. Open the chatbot and send a message.
- **Expected Result:** The chatbot should display a message indicating that the server is currently unavailable.

## 3. Local Development

### 3.1. Start the Application
- **Objective:** Verify that the application can be started locally without errors.
- **Steps:**
  1. Run `bun install` to install dependencies.
  2. Run `bun run start-web` to start the web server.
- **Expected Result:** The application should start without any errors and be accessible in a web browser.