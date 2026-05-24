# InterviewPrep AI

AI-powered interview preparation for React Native. Paste a job description, pick a target role, and get a structured prep plan with technical questions, HR questions, DSA topics, resume tips, and project suggestions.

Built with **Expo SDK 56**, **TypeScript**, **NativeWind**, **React Navigation**, and the **Gemini API**.

## Features

- Generate interview prep plans from a job description
- Role-based targeting (e.g. Frontend, Backend, Full Stack)
- Structured results: technical, HR, DSA, resume, and project sections
- Expandable result cards with session summary
- Local session history (AsyncStorage)
- Response caching and request deduplication to reduce API usage
- Mock mode for development without API calls
- Dark, glassmorphism UI with premium animations

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (via `npx expo`)
- iOS Simulator, Android emulator, or [Expo Go](https://expo.dev/go)
- A [Google AI Studio](https://aistudio.google.com/app/apikey) API key (for live AI generation)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example env file and add your Gemini API key:

```bash
cp .env.example .env
```

Edit `.env`:

```env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

Optional:

```env
EXPO_PUBLIC_GEMINI_MODEL=gemini-2.0-flash
EXPO_PUBLIC_USE_MOCK_AI=true
```

> **Important:** Never commit `.env` or share API keys. Only `EXPO_PUBLIC_*` variables are available in the client bundle.

### 3. Start the app

```bash
npx expo start
```

Then press `i` for iOS, `a` for Android, or `w` for web.

Clear the Metro cache if env changes do not apply:

```bash
npx expo start --clear
```

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start Expo dev server |
| `npm run ios` | Start and open iOS |
| `npm run android` | Start and open Android |
| `npm run web` | Start and open web |
| `npm run lint` | Run ESLint |

## Project structure

```
App.tsx                 # App entry (navigation + theme)
src/
  screens/              # Home, History, Result
  navigation/           # React Navigation stack
  components/
    ui/                 # Design system (buttons, cards, inputs)
    result/             # Result screen components
    history/            # History list items
  hooks/                # useInterviewPrep, useSessionHistory
  services/             # Gemini API, cache, sessions, mock data
  constants/            # Theme, roles, result sections
  config/               # Environment config
  types/                # TypeScript types
  utils/                # Parsing, formatting, helpers
```

## How it works

1. **Home** — User pastes a job description and selects a target role.
2. **Generate** — `interviewService` checks mock mode, cache, then calls Gemini (with quota fallback to mock data when needed).
3. **Result** — Parsed JSON is shown in expandable sections and saved to history.
4. **History** — Past sessions are stored locally and can be reopened or deleted.

## Development tips

- **Mock AI:** Set `EXPO_PUBLIC_USE_MOCK_AI=true` in `.env` to skip Gemini calls during UI work.
- **Quota limits:** Free-tier Gemini keys may hit rate limits; the app can fall back to mock data and show a notice on the result screen.
- **Expo docs:** This project targets [Expo SDK 56](https://docs.expo.dev/versions/v56.0.0/).

## Tech stack

- React Native + Expo 56
- TypeScript
- React Navigation (native stack)
- NativeWind v4 + Tailwind CSS
- React Native Reanimated
- AsyncStorage
- Google Gemini API (REST)

## License

Private project. All rights reserved unless otherwise specified.
