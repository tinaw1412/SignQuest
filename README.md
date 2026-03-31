# SignQuest

## Quick overview

- Platform: React Native (Expo)
- Language: TypeScript
- Entry: `App.tsx`
- Main scripts: defined in `package.json` (see **Run** section)

## Prerequisites

Make sure you have the following installed on your machine:

- Node.js (LTS recommended) and npm or yarn
- Expo CLI (optional, but useful): `npm install -g expo-cli` or use `npx expo` commands
- For iOS simulator: Xcode (macOS only)
- For Android emulator: Android Studio with an emulator configured

If you prefer not to install Expo globally, the commands in this README use `npm run` and `npx` where helpful.

## Install

From the project root (`SignQuest/`), install dependencies:

```bash
# using npm
npm install

# or using yarn
# yarn
```

## Run (development)

Start the Expo development server (Metro) with the script defined in `package.json`:

```bash
npm run start
# or
# yarn start
```

Then open the app:

- Scan the QR code with Expo Go on your physical device (iOS / Android).
- Run on an Android emulator or connected device:

```bash
npm run android
```

- Run on iOS simulator (macOS + Xcode):

```bash
npm run ios
```

- Run in a web browser (web build):

```bash
npm run web
```

Notes:
- `npm run start` runs `expo start` (see `package.json`).
- If you don't have Expo CLI installed globally, `npx expo start` will also work.

## Project structure (high level)

```
SignQuest/
├─ App.tsx           # App entry (React Native + Expo)
├─ index.ts          # Expo entry wrapper
├─ app.json          # Expo configuration
├─ package.json      # scripts and deps
├─ tsconfig.json     # TypeScript config
├─ assets/           # app icons and images
└─ mockups/          # UI mockups and screenshots
```

## TypeScript

The project contains TypeScript configuration (`tsconfig.json`) and uses `typescript` and `@types/react` as devDependencies. Files are `.tsx`/`.ts` where appropriate.

## Adding assets / mockups

Place image assets in `assets/`. Mockups are present in the top-level `mockups/` folder — keep them for reference when implementing UI.

## Building / Publishing

This repo uses the Expo managed workflow. See Expo's documentation for build and publish options:

- To create production builds or to upload to the App Store / Play Store, follow the official docs: https://docs.expo.dev/

A couple of useful commands (using the Expo CLI):

```bash
# Publish JS bundle for OTA updates
npx expo publish

# Build a standalone app (managed workflow)
# (Follow Expo docs for required config and credentials)
npx expo build:android
npx expo build:ios
```

Note: Expo's build tooling and the exact commands vary between SDK versions and between the classic `expo build` and the newer EAS Build system. Refer to Expo docs for the recommended flow for SDK 54.

## Troubleshooting

- Metro bundler fails to start: try clearing cache

```bash
npx expo start --clear
```

- If types or compilation errors appear, run `npm install` again and ensure your Node version is compatible with the project's devDependencies.