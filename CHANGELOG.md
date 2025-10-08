# Changelog

All notable changes to this project will be documented in this file.

## [1.0.1] - 2025-10-08

### Fixed
- **UI:** Corrected a bug where user message text in the chatbot was not visible in light mode due to a hardcoded white color. The text now uses a theme-aware color, ensuring visibility in both light and dark modes.
- **UI:** Resolved an issue where the keyboard would not raise correctly on mobile devices, obscuring the chat input. The `KeyboardAvoidingView` has been properly configured for both iOS and Android.
- **UI:** Fixed a hardcoded background color on the main screen that did not adapt to theme changes. The background now uses the correct theme-aware color.
- **API:** Improved error handling in the chatbot to provide clearer feedback to the user when the API key is missing or when the server is unavailable.
- **Build:** Corrected a typo in the `Dockerfile` that prevented the `bun.lock` file from being copied correctly.
- **Build:** Updated `package.json` scripts to use `expo start` directly, resolving an issue where the `bunx` command was not found.

### Changed
- **Dependencies:** Updated `react-native-reanimated` to version `3.17.5` and `zustand` to version `5.0.3` to resolve dependency conflicts.

### Added
- **Documentation:** Created this `CHANGELOG.md` to track changes to the application.
- **Documentation:** Created `QA.md` with manual testing steps to verify the fixes.
- **Documentation:** Updated `README.md` with clearer instructions for running the application locally and with Docker.